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

import java.time.LocalDate;
import java.util.Locale;
import java.util.Set;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Bean Validation coverage for {@link Pet}, following the same direct-validator approach
 * as {@link org.springframework.samples.petclinic.model.ValidatorTests}.
 */
class PetTests {

	private Validator createValidator() {
		LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
		localValidatorFactoryBean.afterPropertiesSet();
		return localValidatorFactoryBean;
	}

	private Pet validPet() {
		Pet pet = new Pet();
		pet.setName("Buddy");
		pet.setBirthDate(LocalDate.of(2015, 2, 12));
		return pet;
	}

	@Test
	void shouldNotValidateWhenBirthDateIsNull() {
		LocaleContextHolder.setLocale(Locale.ENGLISH);
		Pet pet = validPet();
		pet.setBirthDate(null);

		Set<ConstraintViolation<Pet>> constraintViolations = createValidator().validate(pet);

		assertThat(constraintViolations).hasSize(1);
		ConstraintViolation<Pet> violation = constraintViolations.iterator().next();
		assertThat(violation.getPropertyPath()).hasToString("birthDate");
		// The "{required}" template is resolved against messages.properties by Spring's
		// validator adapter at request time, not by a bare Validator - see
		// PetControllerTests for that end-to-end resolution.
		assertThat(violation.getMessageTemplate()).isEqualTo("{required}");
	}

	@Test
	void shouldNotValidateWhenBirthDateIsInTheFuture() {
		LocaleContextHolder.setLocale(Locale.ENGLISH);
		Pet pet = validPet();
		pet.setBirthDate(LocalDate.now().plusMonths(1));

		Set<ConstraintViolation<Pet>> constraintViolations = createValidator().validate(pet);

		assertThat(constraintViolations).hasSize(1);
		ConstraintViolation<Pet> violation = constraintViolations.iterator().next();
		assertThat(violation.getPropertyPath()).hasToString("birthDate");
		assertThat(violation.getMessageTemplate()).isEqualTo("{birthDate.invalid}");
	}

	@Test
	void shouldValidateWhenBirthDateIsToday() {
		Pet pet = validPet();
		pet.setBirthDate(LocalDate.now());

		Set<ConstraintViolation<Pet>> constraintViolations = createValidator().validate(pet);

		assertThat(constraintViolations).isEmpty();
	}

}
