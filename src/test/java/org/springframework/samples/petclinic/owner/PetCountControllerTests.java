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

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.DisabledInNativeImage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.aot.DisabledInAotMode;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Test class for the {@link PetCountController}
 */
@WebMvcTest(PetCountController.class)
@DisabledInNativeImage
@DisabledInAotMode
class PetCountControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private PetRepository pets;

	@Test
	void shouldReturnTheNumberOfPetsAsJson() throws Exception {
		given(this.pets.count()).willReturn(13L);

		this.mockMvc.perform(get("/pets/count"))
			.andExpect(status().isOk())
			.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
			.andExpect(jsonPath("$.count").value(13));
	}

	@Test
	void shouldReturnZeroWhenNoPetsExist() throws Exception {
		given(this.pets.count()).willReturn(0L);

		this.mockMvc.perform(get("/pets/count")).andExpect(status().isOk()).andExpect(jsonPath("$.count").value(0));
	}

}
