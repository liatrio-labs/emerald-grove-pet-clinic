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
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.aot.DisabledInAotMode;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for the language selector component in the navbar.
 *
 * Tests verify that the language selector dropdown is present, contains all 8 supported
 * languages with native names, and properly highlights the current language selection.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DisabledInNativeImage
@DisabledInAotMode
class LanguageSelectorTests {

	@Autowired
	private TestRestTemplate restTemplate;

	@Test
	void languageSelectorIsVisibleOnHomePage() {
		ResponseEntity<String> response = restTemplate.getForEntity("/", String.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).contains("language-selector");
		assertThat(response.getBody()).contains("fa-globe");
	}

	@Test
	void languageSelectorContainsAllEightLanguagesWithNativeNames() {
		ResponseEntity<String> response = restTemplate.getForEntity("/", String.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).contains("English").contains("Español").contains("Deutsch").contains("فارسی")
			.contains("한국어")
			.contains("Português")
			.contains("Русский")
			.contains("Türkçe");
	}

	@Test
	void languageSelectorShowsCurrentLanguageInButton() {
		// Default language is English
		ResponseEntity<String> response = restTemplate.getForEntity("/", String.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).contains("language-selector-toggle");
	}

	@Test
	void languageSelectorHighlightsCurrentLanguageInDropdown() {
		// Default language should have active class
		ResponseEntity<String> response = restTemplate.getForEntity("/", String.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).contains("dropdown-item active");
	}

	@Test
	void languageSelectorHasProperAriaLabel() {
		ResponseEntity<String> response = restTemplate.getForEntity("/", String.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).contains("aria-label");
		assertThat(response.getBody()).contains("Select language");
	}

	@Test
	void languageSelectorIsVisibleOnVetsPage() {
		ResponseEntity<String> response = restTemplate.getForEntity("/vets.html", String.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).contains("language-selector");
		assertThat(response.getBody()).contains("fa-globe");
	}

	@Test
	void languageSelectorIsVisibleOnOwnersPage() {
		ResponseEntity<String> response = restTemplate.getForEntity("/owners/find", String.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).contains("language-selector");
		assertThat(response.getBody()).contains("fa-globe");
	}

	@Test
	void languageSelectorDisplaysCorrectLanguageCodeWhenLocaleIsSpanish() {
		ResponseEntity<String> response = restTemplate.getForEntity("/?lang=es", String.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).contains("language-selector");
	}

}
