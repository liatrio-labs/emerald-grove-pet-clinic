/*
 * Copyright 2012-2024 the original author or authors.
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

import java.time.LocalDate;
import java.util.HashMap;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.DisabledInNativeImage;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.validation.Errors;
import org.springframework.validation.MapBindingResult;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test class for {@link PetValidator}
 *
 * @author Wick Dynex
 */
@ExtendWith(MockitoExtension.class)
@DisabledInNativeImage
public class PetValidatorTests {

	private PetValidator petValidator;

	private Pet pet;

	private PetType petType;

	private Errors errors;

	private static final String petName = "Buddy";

	private static final String petTypeName = "Dog";

	private static final LocalDate petBirthDate = LocalDate.of(1990, 1, 1);

	@BeforeEach
	void setUp() {
		this.petValidator = new PetValidator();
		this.pet = new Pet();
		this.petType = new PetType();
		this.errors = new MapBindingResult(new HashMap<>(), "pet");
	}

	@Test
	void testValidate() {
		this.petType.setName(petTypeName);
		this.pet.setName(petName);
		this.pet.setType(this.petType);
		this.pet.setBirthDate(petBirthDate);

		this.petValidator.validate(this.pet, this.errors);

		assertThat(this.errors.hasErrors()).isFalse();
	}

	@Nested
	class ValidateHasErrors {

		@Test
		void testValidateWithInvalidPetName() {
			PetValidatorTests.this.petType.setName(petTypeName);
			PetValidatorTests.this.pet.setName("");
			PetValidatorTests.this.pet.setType(PetValidatorTests.this.petType);
			PetValidatorTests.this.pet.setBirthDate(petBirthDate);

			PetValidatorTests.this.petValidator.validate(PetValidatorTests.this.pet, PetValidatorTests.this.errors);

			assertThat(PetValidatorTests.this.errors.hasFieldErrors("name")).isTrue();
		}

		@Test
		void testValidateWithInvalidPetType() {
			PetValidatorTests.this.pet.setName(petName);
			PetValidatorTests.this.pet.setType(null);
			PetValidatorTests.this.pet.setBirthDate(petBirthDate);

			PetValidatorTests.this.petValidator.validate(PetValidatorTests.this.pet, PetValidatorTests.this.errors);

			assertThat(PetValidatorTests.this.errors.hasFieldErrors("type")).isTrue();
		}

		@Test
		void testValidateWithInvalidBirthDate() {
			PetValidatorTests.this.petType.setName(petTypeName);
			PetValidatorTests.this.pet.setName(petName);
			PetValidatorTests.this.pet.setType(PetValidatorTests.this.petType);
			PetValidatorTests.this.pet.setBirthDate(null);

			PetValidatorTests.this.petValidator.validate(PetValidatorTests.this.pet, PetValidatorTests.this.errors);

			assertThat(PetValidatorTests.this.errors.hasFieldErrors("birthDate")).isTrue();
		}

	}

}
