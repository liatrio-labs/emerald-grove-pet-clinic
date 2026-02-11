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

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.DisabledInNativeImage;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.validation.Errors;
import org.springframework.validation.MapBindingResult;

import java.time.LocalDate;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Test class for {@link VisitValidator}
 *
 * @author Emerald Grove Development Team
 */
@ExtendWith(MockitoExtension.class)
@DisabledInNativeImage
public class VisitValidatorTests {

	private VisitValidator visitValidator;

	private Visit visit;

	private Errors errors;

	@BeforeEach
	void setUp() {
		visitValidator = new VisitValidator();
		visit = new Visit();
		errors = new MapBindingResult(new HashMap<>(), "visit");
	}

	@Nested
	@DisplayName("supports() method tests")
	class SupportsTests {

		@Test
		@DisplayName("should return true for Visit class")
		void shouldReturnTrueForVisitClass() {
			assertTrue(visitValidator.supports(Visit.class));
		}

		@Test
		@DisplayName("should return false for non-Visit class")
		void shouldReturnFalseForNonVisitClass() {
			assertFalse(visitValidator.supports(Pet.class));
			assertFalse(visitValidator.supports(Owner.class));
			assertFalse(visitValidator.supports(String.class));
		}

	}

	@Nested
	@DisplayName("validate() method tests")
	class ValidateTests {

		@Test
		@DisplayName("should pass validation for visit with today's date")
		void shouldPassValidationForTodaysDate() {
			visit.setDate(LocalDate.now());
			visit.setDescription("Annual checkup");

			visitValidator.validate(visit, errors);

			assertFalse(errors.hasErrors());
		}

		@Test
		@DisplayName("should pass validation for visit with future date")
		void shouldPassValidationForFutureDate() {
			visit.setDate(LocalDate.now().plusDays(7));
			visit.setDescription("Follow-up appointment");

			visitValidator.validate(visit, errors);

			assertFalse(errors.hasErrors());
		}

		@Test
		@DisplayName("should fail validation for visit with past date")
		void shouldFailValidationForPastDate() {
			visit.setDate(LocalDate.now().minusDays(1));
			visit.setDescription("Past appointment");

			visitValidator.validate(visit, errors);

			assertTrue(errors.hasFieldErrors("date"));
			assertTrue(errors.getFieldError("date").getCode().equals("visit.date.past"));
		}

		@Test
		@DisplayName("should handle null date gracefully without NPE")
		void shouldHandleNullDateGracefully() {
			visit.setDate(null);
			visit.setDescription("Appointment with null date");

			// Should not throw NullPointerException
			visitValidator.validate(visit, errors);

			// Null handling is delegated to @NotNull validation if present
			// Validator should not fail with NPE
			assertFalse(errors.hasFieldErrors("date"));
		}

	}

}
