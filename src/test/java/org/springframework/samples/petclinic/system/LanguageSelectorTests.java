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

package org.springframework.samples.petclinic.system;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.DisabledInNativeImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.aot.DisabledInAotMode;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for Language Selector component in the header
 *
 * Tests verify that the language selector dropdown is present in the navbar and contains
 * links for English, Spanish, and German languages.
 *
 * @author Claude Code
 */
@WebMvcTest(WelcomeController.class)
@DisabledInNativeImage
@DisabledInAotMode
class LanguageSelectorTests {

	@Autowired
	private MockMvc mockMvc;

	/**
	 * Test that the language selector dropdown exists in the navbar
	 */
	@Test
	void testLanguageSelectorIsPresent() throws Exception {
		mockMvc.perform(get("/"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("language-selector")));
	}

	/**
	 * Test that the dropdown button displays the current language code
	 */
	@Test
	void testLanguageSelectorShowsCurrentLanguage() throws Exception {
		mockMvc.perform(get("/")).andExpect(status().isOk()).andExpect(content().string(containsString("EN")));
	}

	/**
	 * Test that the dropdown menu contains all three language options
	 */
	@Test
	void testLanguageSelectorContainsAllLanguages() throws Exception {
		mockMvc.perform(get("/"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("English")))
			.andExpect(content().string(containsString("Español")))
			.andExpect(content().string(containsString("Deutsch")));
	}

	/**
	 * Test that each language link has the correct href with lang parameter
	 */
	@Test
	void testLanguageLinksHaveCorrectHref() throws Exception {
		mockMvc.perform(get("/"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("?lang=en")))
			.andExpect(content().string(containsString("?lang=es")))
			.andExpect(content().string(containsString("?lang=de")));
	}

}
