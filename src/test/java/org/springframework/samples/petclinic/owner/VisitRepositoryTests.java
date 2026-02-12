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

package org.springframework.samples.petclinic.owner;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase.Replace;

/**
 * Tests for {@link VisitRepository}.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class VisitRepositoryTests {

	@Autowired
	private VisitRepository visitRepository;

	@Autowired
	private OwnerRepository ownerRepository;

	@Test
	void shouldFindUpcomingVisitsWithinDateRange() {
		// Arrange - insert a future visit
		LocalDate futureDate = LocalDate.now().plusDays(3);
		insertVisitForPet(7, futureDate, "upcoming checkup");

		// Act
		List<UpcomingVisitDTO> visits = visitRepository.findUpcomingVisits(LocalDate.now(),
				LocalDate.now().plusDays(7));

		// Assert
		assertThat(visits).isNotEmpty();
		assertThat(visits).anyMatch(v -> "upcoming checkup".equals(v.getDescription()));
	}

	@Test
	void shouldReturnEmptyListWhenNoVisitsInRange() {
		// Arrange - sample data visits are all in 2013, use a far-future range
		LocalDate futureStart = LocalDate.now().plusDays(100);
		LocalDate futureEnd = LocalDate.now().plusDays(107);

		// Act
		List<UpcomingVisitDTO> visits = visitRepository.findUpcomingVisits(futureStart, futureEnd);

		// Assert
		assertThat(visits).isEmpty();
	}

	@Test
	void shouldReturnVisitsOrderedByDateAscending() {
		// Arrange
		LocalDate date1 = LocalDate.now().plusDays(5);
		LocalDate date2 = LocalDate.now().plusDays(2);
		LocalDate date3 = LocalDate.now().plusDays(8);

		insertVisitForPet(7, date1, "visit day 5");
		insertVisitForPet(8, date2, "visit day 2");
		insertVisitForPet(7, date3, "visit day 8");

		// Act
		List<UpcomingVisitDTO> visits = visitRepository.findUpcomingVisits(LocalDate.now(),
				LocalDate.now().plusDays(10));

		// Assert
		assertThat(visits).hasSizeGreaterThanOrEqualTo(3);
		for (int i = 0; i < visits.size() - 1; i++) {
			assertThat(visits.get(i).getVisitDate()).isBeforeOrEqualTo(visits.get(i + 1).getVisitDate());
		}
	}

	@Test
	void shouldExcludeVisitsOutsideDateRange() {
		// Arrange
		LocalDate insideRange = LocalDate.now().plusDays(3);
		LocalDate outsideRange = LocalDate.now().plusDays(20);

		insertVisitForPet(7, insideRange, "inside range visit");
		insertVisitForPet(8, outsideRange, "outside range visit");

		// Act
		List<UpcomingVisitDTO> visits = visitRepository.findUpcomingVisits(LocalDate.now(),
				LocalDate.now().plusDays(7));

		// Assert
		assertThat(visits).anyMatch(v -> "inside range visit".equals(v.getDescription()));
		assertThat(visits).noneMatch(v -> "outside range visit".equals(v.getDescription()));
	}

	@Test
	void shouldIncludeOwnerAndPetNames() {
		// Arrange - Pet 7 (Samantha) belongs to Owner 6 (Jean Coleman)
		LocalDate futureDate = LocalDate.now().plusDays(2);
		insertVisitForPet(7, futureDate, "name check visit");

		// Act
		List<UpcomingVisitDTO> visits = visitRepository.findUpcomingVisits(LocalDate.now(),
				LocalDate.now().plusDays(7));

		// Assert
		Optional<UpcomingVisitDTO> visit = visits.stream()
			.filter(v -> "name check visit".equals(v.getDescription()))
			.findFirst();
		assertThat(visit).isPresent();
		assertThat(visit.get().getOwnerName()).isNotBlank();
		assertThat(visit.get().getPetName()).isNotBlank();
	}

	private void insertVisitForPet(int petId, LocalDate date, String description) {
		// Pet 7 belongs to Owner 6 (Jean Coleman -> Samantha)
		// Pet 8 belongs to Owner 6 (Jean Coleman -> Max)
		Owner owner = ownerRepository.findById(6).orElseThrow();
		Pet pet = owner.getPet(petId);
		Visit visit = new Visit();
		visit.setDate(date);
		visit.setDescription(description);
		pet.addVisit(visit);
		ownerRepository.save(owner);
	}

}
