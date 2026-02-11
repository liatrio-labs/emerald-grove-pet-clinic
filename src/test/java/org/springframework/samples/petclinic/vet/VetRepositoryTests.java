/*
 * Copyright 2012-2025 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.springframework.samples.petclinic.vet;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase.Replace;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

/**
 * Repository tests for {@link VetRepository} specialty filtering methods.
 * These tests validate the data access layer for filtering vets by specialty.
 *
 * Uses the default H2 in-memory database with seed data from data.sql:
 * - Vet 1: James Carter - no specialties
 * - Vet 2: Helen Leary - radiology
 * - Vet 3: Linda Douglas - surgery, dentistry
 * - Vet 4: Rafael Ortega - surgery
 * - Vet 5: Henry Stevens - radiology
 * - Vet 6: Sharon Jenkins - no specialties
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class VetRepositoryTests {

	@Autowired
	private VetRepository vets;

	@Test
	void testFindBySpecialtiesName() {
		// Arrange
		Pageable pageable = PageRequest.of(0, 10);

		// Act - filter by "radiology" specialty
		Page<Vet> radiologyVets = this.vets.findBySpecialtiesName("radiology", pageable);

		// Assert - Helen Leary and Henry Stevens have radiology
		assertThat(radiologyVets.getContent()).hasSize(2);
		assertThat(radiologyVets.getContent())
			.extracting(Vet::getLastName)
			.containsExactlyInAnyOrder("Leary", "Stevens");
	}

	@Test
	void testFindBySpecialtiesNameSurgery() {
		// Arrange
		Pageable pageable = PageRequest.of(0, 10);

		// Act - filter by "surgery" specialty
		Page<Vet> surgeryVets = this.vets.findBySpecialtiesName("surgery", pageable);

		// Assert - Linda Douglas and Rafael Ortega have surgery
		assertThat(surgeryVets.getContent()).hasSize(2);
		assertThat(surgeryVets.getContent())
			.extracting(Vet::getLastName)
			.containsExactlyInAnyOrder("Douglas", "Ortega");
	}

	@Test
	void testFindBySpecialtiesNameDentistry() {
		// Arrange
		Pageable pageable = PageRequest.of(0, 10);

		// Act - filter by "dentistry" specialty
		Page<Vet> dentistryVets = this.vets.findBySpecialtiesName("dentistry", pageable);

		// Assert - Only Linda Douglas has dentistry
		assertThat(dentistryVets.getContent()).hasSize(1);
		assertThat(dentistryVets.getContent().get(0).getLastName()).isEqualTo("Douglas");
	}

	@Test
	void testFindBySpecialtiesNameNonExistent() {
		// Arrange
		Pageable pageable = PageRequest.of(0, 10);

		// Act - filter by a specialty that does not exist
		Page<Vet> result = this.vets.findBySpecialtiesName("cardiology", pageable);

		// Assert - no vets found
		assertThat(result.getContent()).isEmpty();
		assertThat(result.getTotalElements()).isZero();
	}

	@Test
	void testFindBySpecialtiesNameWithPagination() {
		// Arrange - use page size of 1 to test pagination
		Pageable firstPage = PageRequest.of(0, 1);
		Pageable secondPage = PageRequest.of(1, 1);

		// Act - filter by "radiology" with small pages
		Page<Vet> page1 = this.vets.findBySpecialtiesName("radiology", firstPage);
		Page<Vet> page2 = this.vets.findBySpecialtiesName("radiology", secondPage);

		// Assert - 2 total results split across 2 pages
		assertThat(page1.getContent()).hasSize(1);
		assertThat(page1.getTotalElements()).isEqualTo(2);
		assertThat(page1.getTotalPages()).isEqualTo(2);
		assertThat(page2.getContent()).hasSize(1);
	}

	@Test
	void testFindBySpecialtiesIsEmpty() {
		// Arrange
		Pageable pageable = PageRequest.of(0, 10);

		// Act - find vets with no specialties
		Page<Vet> noSpecialtyVets = this.vets.findBySpecialtiesIsEmpty(pageable);

		// Assert - James Carter and Sharon Jenkins have no specialties
		assertThat(noSpecialtyVets.getContent()).hasSize(2);
		assertThat(noSpecialtyVets.getContent())
			.extracting(Vet::getLastName)
			.containsExactlyInAnyOrder("Carter", "Jenkins");
	}

	@Test
	void testFindBySpecialtiesIsEmptyWithPagination() {
		// Arrange - use page size of 1 to test pagination
		Pageable firstPage = PageRequest.of(0, 1);

		// Act
		Page<Vet> page1 = this.vets.findBySpecialtiesIsEmpty(firstPage);

		// Assert
		assertThat(page1.getContent()).hasSize(1);
		assertThat(page1.getTotalElements()).isEqualTo(2);
		assertThat(page1.getTotalPages()).isEqualTo(2);
	}

	@Test
	void testFindDistinctSpecialtyNames() {
		// Act
		List<String> specialtyNames = this.vets.findDistinctSpecialtyNames();

		// Assert - should return alphabetically sorted distinct names
		assertThat(specialtyNames).hasSize(3);
		assertThat(specialtyNames).containsExactly("dentistry", "radiology", "surgery");
	}

}
