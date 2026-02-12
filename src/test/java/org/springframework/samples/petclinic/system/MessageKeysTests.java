package org.springframework.samples.petclinic.system;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies that all 8 message.properties files contain required language selector keys
 * and that UTF-8 encoding is correct for non-Latin characters.
 */
class MessageKeysTests {

	private static final String MESSAGES_DIR = "src/main/resources/messages";

	private static final List<String> REQUIRED_LANGUAGE_KEYS = List.of("language.selector.label", "language.en",
			"language.es", "language.de", "language.fa", "language.ko", "language.pt", "language.ru", "language.tr");

	private static final List<String> ALL_LOCALE_FILES = List.of("messages.properties", "messages_de.properties",
			"messages_es.properties", "messages_fa.properties", "messages_ko.properties", "messages_pt.properties",
			"messages_ru.properties", "messages_tr.properties");

	private static Properties baseProps;

	@BeforeAll
	static void loadBaseProperties() throws IOException {
		baseProps = loadPropertiesUtf8(Paths.get(MESSAGES_DIR, "messages.properties"));
	}

	@Test
	void basePropertiesContainsAllLanguageSelectorKeys() {
		for (String key : REQUIRED_LANGUAGE_KEYS) {
			assertThat(baseProps.getProperty(key)).as("Base messages.properties should contain key '%s'", key)
				.isNotNull()
				.isNotBlank();
		}
	}

	@ParameterizedTest
	@ValueSource(strings = { "messages_de.properties", "messages_es.properties", "messages_fa.properties",
			"messages_ko.properties", "messages_pt.properties", "messages_ru.properties", "messages_tr.properties" })
	void localeFileContainsAllLanguageSelectorKeys(String filename) throws IOException {
		Properties props = loadPropertiesUtf8(Paths.get(MESSAGES_DIR, filename));
		for (String key : REQUIRED_LANGUAGE_KEYS) {
			assertThat(props.getProperty(key))
				.as("File '%s' should contain key '%s'", filename, key)
				.isNotNull()
				.isNotBlank();
		}
	}

	@Test
	void languageNamesAreNativeAndConsistentAcrossLocales() throws IOException {
		// Native language names should be consistent across all locale files
		// because they always display in their own script
		String expectedPersian = "\u0641\u0627\u0631\u0633\u06CC"; // فارسی
		String expectedKorean = "\uD55C\uAD6D\uC5B4"; // 한국어
		String expectedRussian = "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"; // Русский

		for (String filename : ALL_LOCALE_FILES) {
			Properties props = loadPropertiesUtf8(Paths.get(MESSAGES_DIR, filename));
			assertThat(props.getProperty("language.fa"))
				.as("Persian name in '%s' should be in native script", filename)
				.isEqualTo(expectedPersian);
			assertThat(props.getProperty("language.ko"))
				.as("Korean name in '%s' should be in native script", filename)
				.isEqualTo(expectedKorean);
			assertThat(props.getProperty("language.ru"))
				.as("Russian name in '%s' should be in native script", filename)
				.isEqualTo(expectedRussian);
		}
	}

	@Test
	void selectorLabelKeyHasCorrectDefaultValue() {
		assertThat(baseProps.getProperty("language.selector.label")).isEqualTo("Select language");
	}

	@Test
	void englishLanguageKeyHasCorrectValue() {
		assertThat(baseProps.getProperty("language.en")).isEqualTo("English");
	}

	@Test
	void spanishLanguageKeyHasCorrectValue() {
		assertThat(baseProps.getProperty("language.es")).isEqualTo("Espa\u00F1ol");
	}

	@Test
	void germanLanguageKeyHasCorrectValue() {
		assertThat(baseProps.getProperty("language.de")).isEqualTo("Deutsch");
	}

	@Test
	void portugueseLanguageKeyHasCorrectValue() {
		assertThat(baseProps.getProperty("language.pt")).isEqualTo("Portugu\u00EAs");
	}

	@Test
	void turkishLanguageKeyHasCorrectValue() {
		assertThat(baseProps.getProperty("language.tr")).isEqualTo("T\u00FCrk\u00E7e");
	}

	private static Properties loadPropertiesUtf8(Path path) throws IOException {
		Properties props = new Properties();
		try (var reader = new InputStreamReader(Files.newInputStream(path), StandardCharsets.UTF_8)) {
			props.load(reader);
		}
		return props;
	}

}
