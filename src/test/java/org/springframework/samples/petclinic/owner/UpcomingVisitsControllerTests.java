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

import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.DisabledInNativeImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.aot.DisabledInAotMode;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Test class for {@link UpcomingVisitsController}.
 */
@WebMvcTest(UpcomingVisitsController.class)
@DisabledInNativeImage
@DisabledInAotMode
class UpcomingVisitsControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private VisitRepository visitRepository;

	private UpcomingVisitDTO createMockVisit(LocalDate date, String ownerName, String petName, String description) {
		return new UpcomingVisitDTO() {
			@Override
			public LocalDate getVisitDate() {
				return date;
			}

			@Override
			public String getOwnerName() {
				return ownerName;
			}

			@Override
			public String getPetName() {
				return petName;
			}

			@Override
			public String getDescription() {
				return description;
			}
		};
	}

	@BeforeEach
	void setup() {
		List<UpcomingVisitDTO> mockVisits = List.of(
				createMockVisit(LocalDate.now().plusDays(1), "George Franklin", "Leo", "annual checkup"),
				createMockVisit(LocalDate.now().plusDays(3), "Betty Davis", "Basil", "vaccination"));

		given(this.visitRepository.findUpcomingVisits(any(LocalDate.class), any(LocalDate.class)))
			.willReturn(mockVisits);
	}

	@Test
	void testShowUpcomingVisitsDefaultDays() throws Exception {
		mockMvc.perform(get("/visits/upcoming"))
			.andExpect(status().isOk())
			.andExpect(view().name("visits/upcomingVisits"))
			.andExpect(model().attributeExists("visits"))
			.andExpect(model().attribute("days", is(7)));
	}

	@Test
	void testShowUpcomingVisitsWithCustomDays() throws Exception {
		mockMvc.perform(get("/visits/upcoming").param("days", "14"))
			.andExpect(status().isOk())
			.andExpect(view().name("visits/upcomingVisits"))
			.andExpect(model().attribute("days", is(14)));
	}

	@Test
	void testShowUpcomingVisitsWithThreeDays() throws Exception {
		mockMvc.perform(get("/visits/upcoming").param("days", "3"))
			.andExpect(status().isOk())
			.andExpect(model().attribute("days", is(3)));
	}

	@Test
	void testModelContainsVisits() throws Exception {
		mockMvc.perform(get("/visits/upcoming"))
			.andExpect(status().isOk())
			.andExpect(model().attribute("visits", hasSize(2)))
			.andExpect(model().attribute("visits", not(empty())));
	}

	@Test
	void testModelContainsDateAttributes() throws Exception {
		mockMvc.perform(get("/visits/upcoming"))
			.andExpect(status().isOk())
			.andExpect(model().attributeExists("startDate"))
			.andExpect(model().attributeExists("endDate"));
	}

	@Test
	void testEmptyVisitsList() throws Exception {
		given(this.visitRepository.findUpcomingVisits(any(LocalDate.class), any(LocalDate.class)))
			.willReturn(List.of());

		mockMvc.perform(get("/visits/upcoming"))
			.andExpect(status().isOk())
			.andExpect(model().attribute("visits", empty()));
	}

	@Test
	void testInvalidDaysZeroDefaultsToSeven() throws Exception {
		mockMvc.perform(get("/visits/upcoming").param("days", "0"))
			.andExpect(status().isOk())
			.andExpect(model().attribute("days", is(7)));
	}

	@Test
	void testInvalidDaysNegativeDefaultsToSeven() throws Exception {
		mockMvc.perform(get("/visits/upcoming").param("days", "-1"))
			.andExpect(status().isOk())
			.andExpect(model().attribute("days", is(7)));
	}

	@Test
	void testInvalidDaysExceedsMaxClampsToNinety() throws Exception {
		mockMvc.perform(get("/visits/upcoming").param("days", "91"))
			.andExpect(status().isOk())
			.andExpect(model().attribute("days", is(90)));
	}

	@Test
	void testDaysAtBoundaryOne() throws Exception {
		mockMvc.perform(get("/visits/upcoming").param("days", "1"))
			.andExpect(status().isOk())
			.andExpect(model().attribute("days", is(1)));
	}

	@Test
	void testDaysAtBoundaryNinety() throws Exception {
		mockMvc.perform(get("/visits/upcoming").param("days", "90"))
			.andExpect(status().isOk())
			.andExpect(model().attribute("days", is(90)));
	}

	@Test
	void testThirtyDaysFilter() throws Exception {
		mockMvc.perform(get("/visits/upcoming").param("days", "30"))
			.andExpect(status().isOk())
			.andExpect(model().attribute("days", is(30)));
	}

}
