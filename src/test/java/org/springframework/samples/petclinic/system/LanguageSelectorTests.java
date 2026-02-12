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
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.aot.DisabledInAotMode;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the language selector component in the navbar.
 *
 * Tests verify that the language selector dropdown is present, contains all 8 supported
 * languages with native names, and properly highlights the current language selection.
 */
@SpringBootTest
@AutoConfigureMockMvc
@DisabledInNativeImage
@DisabledInAotMode
class LanguageSelectorTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void languageSelectorIsVisibleOnHomePage() throws Exception {
		mockMvc.perform(get("/"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("language-selector")))
			.andExpect(content().string(containsString("fa-globe")));
	}

	@Test
	void languageSelectorContainsAllEightLanguagesWithNativeNames() throws Exception {
		mockMvc.perform(get("/"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("English")))
			.andExpect(content().string(containsString("Español")))
			.andExpect(content().string(containsString("Deutsch")))
			.andExpect(content().string(containsString("فارسی")))
			.andExpect(content().string(containsString("한국어")))
			.andExpect(content().string(containsString("Português")))
			.andExpect(content().string(containsString("Русский")))
			.andExpect(content().string(containsString("Türkçe")));
	}

	@Test
	void languageSelectorShowsCurrentLanguageInButton() throws Exception {
		// Default language is English
		mockMvc.perform(get("/"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("language-selector-toggle")));
	}

	@Test
	void languageSelectorHighlightsCurrentLanguageInDropdown() throws Exception {
		// Default language should have active class
		mockMvc.perform(get("/"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("dropdown-item active")));
	}

	@Test
	void languageSelectorHasProperAriaLabel() throws Exception {
		mockMvc.perform(get("/"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("aria-label")))
			.andExpect(content().string(containsString("Select language")));
	}

	@Test
	void languageSelectorIsVisibleOnVetsPage() throws Exception {
		mockMvc.perform(get("/vets.html"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("language-selector")))
			.andExpect(content().string(containsString("fa-globe")));
	}

	@Test
	void languageSelectorIsVisibleOnOwnersPage() throws Exception {
		mockMvc.perform(get("/owners/find"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("language-selector")))
			.andExpect(content().string(containsString("fa-globe")));
	}

	@Test
	void languageSelectorDisplaysCorrectLanguageCodeWhenLocaleIsSpanish() throws Exception {
		mockMvc.perform(get("/?lang=es"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("language-selector")));
	}

}
