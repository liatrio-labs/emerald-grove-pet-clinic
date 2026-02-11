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
import org.springframework.http.MediaType;
import org.springframework.test.context.aot.DisabledInAotMode;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the {@link VetController}
 */

@WebMvcTest(VetController.class)
@DisabledInNativeImage
@DisabledInAotMode
class VetControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private VetRepository vets;

	private Vet james() {
		Vet james = new Vet();
		james.setFirstName("James");
		james.setLastName("Carter");
		james.setId(1);
		return james;
	}

	private Vet helen() {
		Vet helen = new Vet();
		helen.setFirstName("Helen");
		helen.setLastName("Leary");
		helen.setId(2);
		Specialty radiology = new Specialty();
		radiology.setId(1);
		radiology.setName("radiology");
		helen.addSpecialty(radiology);
		return helen;
	}

	private Vet linda() {
		Vet linda = new Vet();
		linda.setFirstName("Linda");
		linda.setLastName("Douglas");
		linda.setId(3);
		Specialty surgery = new Specialty();
		surgery.setId(2);
		surgery.setName("surgery");
		linda.addSpecialty(surgery);
		Specialty dentistry = new Specialty();
		dentistry.setId(3);
		dentistry.setName("dentistry");
		linda.addSpecialty(dentistry);
		return linda;
	}

	@BeforeEach
	void setup() {
		given(this.vets.findAll()).willReturn(Lists.newArrayList(james(), helen()));
		given(this.vets.findAll(any(Pageable.class)))
			.willReturn(new PageImpl<Vet>(Lists.newArrayList(james(), helen())));
		given(this.vets.findDistinctSpecialtyNames())
			.willReturn(Lists.newArrayList("dentistry", "radiology", "surgery"));
		given(this.vets.findBySpecialtiesName(eq("radiology"), any(Pageable.class)))
			.willReturn(new PageImpl<Vet>(Lists.newArrayList(helen())));
		given(this.vets.findBySpecialtiesName(eq("surgery"), any(Pageable.class)))
			.willReturn(new PageImpl<Vet>(Lists.newArrayList(linda())));
		given(this.vets.findBySpecialtiesName(eq("dentistry"), any(Pageable.class)))
			.willReturn(new PageImpl<Vet>(Lists.newArrayList(linda())));
		given(this.vets.findBySpecialtiesName(eq("nonexistent"), any(Pageable.class)))
			.willReturn(new PageImpl<Vet>(Lists.newArrayList()));
		given(this.vets.findBySpecialtiesIsEmpty(any(Pageable.class)))
			.willReturn(new PageImpl<Vet>(Lists.newArrayList(james())));
	}

	@Test
	void testShowVetListHtml() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/vets.html?page=1"))
			.andExpect(status().isOk())
			.andExpect(model().attributeExists("listVets"))
			.andExpect(model().attributeExists("availableSpecialties"))
			.andExpect(model().attributeExists("specialtyFilter"))
			.andExpect(view().name("vets/vetList"));
	}

	@Test
	void testShowVetListWithSpecialtyFilter() throws Exception {
		mockMvc.perform(get("/vets.html").param("page", "1").param("specialty", "radiology"))
			.andExpect(status().isOk())
			.andExpect(model().attributeExists("listVets"))
			.andExpect(model().attribute("listVets", hasSize(1)))
			.andExpect(model().attribute("specialtyFilter", is("radiology")))
			.andExpect(model().attribute("availableSpecialties", hasItem("radiology")))
			.andExpect(view().name("vets/vetList"));
	}

	@Test
	void testShowVetListWithAllSpecialties() throws Exception {
		mockMvc.perform(get("/vets.html").param("page", "1").param("specialty", "all"))
			.andExpect(status().isOk())
			.andExpect(model().attributeExists("listVets"))
			.andExpect(model().attribute("listVets", hasSize(2)))
			.andExpect(model().attribute("specialtyFilter", is("all")))
			.andExpect(view().name("vets/vetList"));
	}

	@Test
	void testShowVetListWithEmptySpecialty() throws Exception {
		mockMvc.perform(get("/vets.html").param("page", "1").param("specialty", ""))
			.andExpect(status().isOk())
			.andExpect(model().attributeExists("listVets"))
			.andExpect(model().attribute("listVets", hasSize(2)))
			.andExpect(view().name("vets/vetList"));
	}

	@Test
	void testShowVetListWithNoSpecialty() throws Exception {
		mockMvc.perform(get("/vets.html").param("page", "1").param("specialty", "none"))
			.andExpect(status().isOk())
			.andExpect(model().attributeExists("listVets"))
			.andExpect(model().attribute("listVets", hasSize(1)))
			.andExpect(model().attribute("specialtyFilter", is("none")))
			.andExpect(view().name("vets/vetList"));
	}

	@Test
	void testSpecialtyFilterWithPagination() throws Exception {
		mockMvc.perform(get("/vets.html").param("page", "1").param("specialty", "surgery"))
			.andExpect(status().isOk())
			.andExpect(model().attribute("specialtyFilter", is("surgery")))
			.andExpect(model().attributeExists("currentPage"))
			.andExpect(model().attributeExists("totalPages"))
			.andExpect(view().name("vets/vetList"));
	}

	@Test
	void testShowVetListWithNoSpecialtyParam() throws Exception {
		mockMvc.perform(get("/vets.html").param("page", "1"))
			.andExpect(status().isOk())
			.andExpect(model().attributeExists("listVets"))
			.andExpect(model().attribute("listVets", hasSize(2)))
			.andExpect(model().attribute("specialtyFilter", is("all")))
			.andExpect(view().name("vets/vetList"));
	}

	@Test
	void testShowResourcesVetList() throws Exception {
		ResultActions actions = mockMvc.perform(get("/vets").accept(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk());
		actions.andExpect(content().contentType(MediaType.APPLICATION_JSON))
			.andExpect(jsonPath("$.vetList[0].id").value(1));
	}

}
