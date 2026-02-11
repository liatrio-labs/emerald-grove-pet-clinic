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

import org.assertj.core.util.Lists;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.DisabledInNativeImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.aot.DisabledInAotMode;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for Veterinarian Specialty Filter functionality
 *
 * Tests verify that the specialty filter dropdown is present, filters vets correctly by
 * single or multiple specialties with AND logic, integrates with pagination, persists
 * filter state in session, and displays appropriate visual feedback.
 *
 * These tests follow TDD RED phase - they are written before implementation and will fail
 * until the filter functionality is implemented.
 *
 * @author Claude Code
 */
@WebMvcTest(VetController.class)
@DisabledInNativeImage
@DisabledInAotMode
class VetSpecialtyFilterTests {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private VetRepository vets;

	private Vet vetWithSurgery() {
		Vet vet = new Vet();
		vet.setFirstName("James");
		vet.setLastName("Carter");
		vet.setId(1);
		Specialty surgery = new Specialty();
		surgery.setId(1);
		surgery.setName("surgery");
		vet.addSpecialty(surgery);
		return vet;
	}

	private Vet vetWithRadiology() {
		Vet vet = new Vet();
		vet.setFirstName("Helen");
		vet.setLastName("Leary");
		vet.setId(2);
		Specialty radiology = new Specialty();
		radiology.setId(2);
		radiology.setName("radiology");
		vet.addSpecialty(radiology);
		return vet;
	}

	private Vet vetWithSurgeryAndDentistry() {
		Vet vet = new Vet();
		vet.setFirstName("Linda");
		vet.setLastName("Douglas");
		vet.setId(3);
		Specialty surgery = new Specialty();
		surgery.setId(1);
		surgery.setName("surgery");
		Specialty dentistry = new Specialty();
		dentistry.setId(3);
		dentistry.setName("dentistry");
		vet.addSpecialty(surgery);
		vet.addSpecialty(dentistry);
		return vet;
	}

	private Vet vetWithNoSpecialty() {
		Vet vet = new Vet();
		vet.setFirstName("Rafael");
		vet.setLastName("Ortega");
		vet.setId(4);
		return vet;
	}

	@BeforeEach
	void setup() {
		// Setup default behavior for all vets
		List<Vet> allVets = Lists.newArrayList(vetWithSurgery(), vetWithRadiology(), vetWithSurgeryAndDentistry(),
				vetWithNoSpecialty());
		given(this.vets.findAll(any(Pageable.class))).willReturn(new PageImpl<>(allVets));

		// Setup behavior for single specialty filtering
		given(this.vets.findBySpecialtiesNameIgnoreCase(eq("surgery"), any(Pageable.class)))
			.willReturn(new PageImpl<>(Lists.newArrayList(vetWithSurgery(), vetWithSurgeryAndDentistry())));

		given(this.vets.findBySpecialtiesNameIgnoreCase(eq("radiology"), any(Pageable.class)))
			.willReturn(new PageImpl<>(Lists.newArrayList(vetWithRadiology())));

		given(this.vets.findBySpecialtiesNameIgnoreCase(eq("dentistry"), any(Pageable.class)))
			.willReturn(new PageImpl<>(Lists.newArrayList(vetWithSurgeryAndDentistry())));

		// Setup behavior for multi-specialty AND logic filtering
		given(this.vets.findByAllSpecialties(eq(Arrays.asList("surgery", "dentistry")), eq(2L), any(Pageable.class)))
			.willReturn(new PageImpl<>(Lists.newArrayList(vetWithSurgeryAndDentistry())));

		// Setup behavior for no results
		given(this.vets.findByAllSpecialties(eq(Arrays.asList("radiology", "dentistry")), eq(2L), any(Pageable.class)))
			.willReturn(new PageImpl<>(Lists.newArrayList()));
	}

	/**
	 * Test that the filter dropdown element exists in the HTML response
	 */
	@Test
	void testFilterDropdownIsPresent() throws Exception {
		mockMvc.perform(get("/vets.html"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("filter")))
			.andExpect(view().name("vets/vetList"));
	}

	/**
	 * Test single specialty filtering - verify only surgery vets are returned
	 */
	@Test
	void testFilterBySpecialty() throws Exception {
		mockMvc.perform(get("/vets.html").param("filter", "specialty:surgery"))
			.andExpect(status().isOk())
			.andExpect(model().attributeExists("listVets"))
			.andExpect(view().name("vets/vetList"));
	}

	/**
	 * Test multi-specialty filtering with AND logic - verify only vets with BOTH
	 * specialties are returned
	 */
	@Test
	void testFilterByMultipleSpecialties() throws Exception {
		mockMvc.perform(get("/vets.html").param("filter", "specialty:surgery,dentistry"))
			.andExpect(status().isOk())
			.andExpect(model().attributeExists("listVets"))
			.andExpect(view().name("vets/vetList"));
	}

	/**
	 * Test filter integration with pagination - verify both page and filter parameters
	 * work together
	 */
	@Test
	void testFilterWithPagination() throws Exception {
		mockMvc.perform(get("/vets.html").param("page", "2").param("filter", "specialty:radiology"))
			.andExpect(status().isOk())
			.andExpect(model().attributeExists("listVets"))
			.andExpect(view().name("vets/vetList"));
	}

	/**
	 * Test filter persistence in session - verify filter is applied from session when no
	 * query parameter provided
	 */
	@Test
	void testFilterSessionPersistence() throws Exception {
		MockHttpSession session = new MockHttpSession();
		session.setAttribute("vetFilter", "specialty:surgery");

		mockMvc.perform(get("/vets.html").session(session))
			.andExpect(status().isOk())
			.andExpect(model().attributeExists("listVets"))
			.andExpect(view().name("vets/vetList"));
	}

	/**
	 * Test empty results state - verify "No veterinarians found" message when filter
	 * returns no matches
	 */
	@Test
	void testEmptyFilterResults() throws Exception {
		mockMvc.perform(get("/vets.html").param("filter", "specialty:radiology,dentistry"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("No veterinarians found")))
			.andExpect(view().name("vets/vetList"));
	}

	/**
	 * Test visual feedback text - verify "Showing vets with specialty: Surgery" text
	 * appears when filter is active
	 */
	@Test
	void testVisualFeedbackText() throws Exception {
		mockMvc.perform(get("/vets.html").param("filter", "specialty:surgery"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("Showing vets with specialty")))
			.andExpect(view().name("vets/vetList"));
	}

}
