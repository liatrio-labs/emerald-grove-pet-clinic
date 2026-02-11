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
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Controller for displaying upcoming visits across all pets and owners. Provides a
 * read-only view of scheduled visits within a configurable time window.
 */
@Controller
class UpcomingVisitsController {

	private static final int DEFAULT_DAYS = 7;

	private static final int MIN_DAYS = 1;

	private static final int MAX_DAYS = 90;

	private final VisitRepository visitRepository;

	UpcomingVisitsController(VisitRepository visitRepository) {
		this.visitRepository = visitRepository;
	}

	@GetMapping("/visits/upcoming")
	public String showUpcomingVisits(@RequestParam(defaultValue = "7") int days, Model model) {
		days = validateDays(days);

		LocalDate startDate = LocalDate.now();
		LocalDate endDate = startDate.plusDays(days);

		List<UpcomingVisitDTO> visits = visitRepository.findUpcomingVisits(startDate, endDate);

		model.addAttribute("visits", visits);
		model.addAttribute("days", days);
		model.addAttribute("startDate", startDate);
		model.addAttribute("endDate", endDate);

		return "visits/upcomingVisits";
	}

	private int validateDays(int days) {
		if (days < MIN_DAYS) {
			return DEFAULT_DAYS;
		}
		if (days > MAX_DAYS) {
			return MAX_DAYS;
		}
		return days;
	}

}
