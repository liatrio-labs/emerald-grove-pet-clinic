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

import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.time.LocalDate;

/**
 * <code>Validator</code> for <code>Visit</code> forms.
 * <p>
 * Validates that visit dates are not in the past. Visits can only be scheduled for today
 * or future dates.
 * </p>
 *
 * @author Emerald Grove Development Team
 */
public class VisitValidator implements Validator {

	private static final String DATE_FIELD = "date";

	private static final String PAST_DATE_ERROR = "visit.date.past";

	private static final String PAST_DATE_MESSAGE = "Visit date cannot be in the past";

	@Override
	public void validate(Object obj, Errors errors) {
		Visit visit = (Visit) obj;
		LocalDate visitDate = visit.getDate();

		// Handle null dates gracefully - delegate to @NotNull validation if present
		if (visitDate == null) {
			return;
		}

		// Validate that the date is not before today
		if (visitDate.isBefore(LocalDate.now())) {
			errors.rejectValue(DATE_FIELD, PAST_DATE_ERROR, PAST_DATE_MESSAGE);
		}
	}

	/**
	 * This Validator validates *just* Visit instances
	 */
	@Override
	public boolean supports(Class<?> clazz) {
		return Visit.class.isAssignableFrom(clazz);
	}

}
