# 02-tasks-language-selector.md

## Relevant Files

### Files to Modify

- `src/main/resources/messages/messages.properties` - Add language name message keys for the selector
- `src/main/resources/messages/messages_en.properties` - Add English language names (English, Spanish, German)
- `src/main/resources/messages/messages_es.properties` - Add Spanish language names (Inglés, Español, Alemán)
- `src/main/resources/messages/messages_de.properties` - Add German language names (Englisch, Spanisch, Deutsch)
- `src/main/resources/templates/fragments/layout.html` - Add language selector Bootstrap dropdown component to navbar

### Files to Create

- `src/test/java/org/springframework/samples/petclinic/system/LanguageSelectorTests.java` - Unit tests for language selector component rendering
- `e2e-tests/tests/language-selector.spec.ts` - Playwright E2E tests for language switching and persistence

### Notes

- Follow strict TDD methodology: RED (write failing test) → GREEN (implement) → REFACTOR (improve)
- Use JUnit 5 with @WebMvcTest for controller/view tests, MockMvc for web layer testing
- Use Playwright test patterns from existing E2E tests in `e2e-tests/tests/` directory
- Run tests with `./mvnw test` (for unit tests) and `cd e2e-tests && npm test` (for E2E tests)
- Thymeleaf conventions: Use `th:*` attributes, `#{}` for i18n messages, `@{}` for URLs
- Message key naming: Use camelCase (e.g., `language.english`, `language.spanish`, `language.german`)
- Bootstrap 5 dropdown components should match existing navbar styling
- Follow conventional commits format for git commits

## Tasks

### [x] 1.0 Setup: Add Language Name Message Keys

#### 1.0 Proof Artifact(s)

- Diff: Message files (`messages.properties`, `messages_en.properties`, `messages_es.properties`, `messages_de.properties`) showing new language name keys demonstrates setup completion
- Build: Application builds successfully demonstrates no syntax errors in message files
- CLI: `./mvnw spring-boot:run` starts application without errors demonstrates configuration is valid

#### 1.0 Tasks

- [x] 1.1 Add language name keys to `messages.properties`: `language.english=English`, `language.spanish=Spanish`, `language.german=German`, `language.selector.label=Language`
- [x] 1.2 Add English language names to `messages_en.properties`: `language.english=English`, `language.spanish=Spanish`, `language.german=German`, `language.selector.label=Language`
- [x] 1.3 Add Spanish language names to `messages_es.properties`: `language.english=Inglés`, `language.spanish=Español`, `language.german=Alemán`, `language.selector.label=Idioma`
- [x] 1.4 Add German language names to `messages_de.properties`: `language.english=Englisch`, `language.spanish=Spanisch`, `language.german=Deutsch`, `language.selector.label=Sprache`
- [x] 1.5 Run `./mvnw clean compile` to verify no syntax errors in message files
- [x] 1.6 Run `./mvnw spring-boot:run` and verify application starts without errors
- [x] 1.7 Capture git diff showing the added message keys

### [x] 2.0 RED: Write Failing Tests for Language Selector Component

#### 2.0 Proof Artifact(s)

- Test: `LanguageSelectorTests.java` fails with expected error demonstrates tests are written correctly
- CLI: `./mvnw test -Dtest=LanguageSelectorTests` output showing test failures demonstrates RED phase completion
- Coverage: JaCoCo report showing new test methods demonstrates test infrastructure is ready

#### 2.0 Tasks

- [x] 2.1 Create `src/test/java/org/springframework/samples/petclinic/system/LanguageSelectorTests.java` test class
- [x] 2.2 Set up test class with `@WebMvcTest` annotation and MockMvc configuration (use `WelcomeController` as the controller to test since it renders layout.html)
- [x] 2.3 Write test `testLanguageSelectorIsPresent()` - verify language selector dropdown exists in the navbar using MockMvc and CSS selectors
- [x] 2.4 Write test `testLanguageSelectorShowsCurrentLanguage()` - verify dropdown button displays current language code (EN, ES, or DE)
- [x] 2.5 Write test `testLanguageSelectorContainsAllLanguages()` - verify dropdown menu contains links for English, Spanish, and German
- [x] 2.6 Write test `testLanguageLinksHaveCorrectHref()` - verify each language link has correct `?lang=xx` parameter in href attribute
- [x] 2.7 Run `./mvnw test -Dtest=LanguageSelectorTests` and verify all tests fail (component doesn't exist yet)
- [x] 2.8 Run `./mvnw test jacoco:report` to generate coverage report showing new test methods

### [x] 3.0 GREEN: Implement Language Selector in Header

#### 3.0 Proof Artifact(s)

- Screenshot: Home page showing language selector dropdown in header demonstrates component visibility
- Screenshot: Dropdown menu expanded showing "English", "Español", "Deutsch" options demonstrates language options are displayed
- Screenshot: Home page displayed in Spanish (after clicking Español) demonstrates language switching works
- Screenshot: Home page displayed in German (after clicking Deutsch) demonstrates all languages work
- Test: `LanguageSelectorTests.java` passes demonstrates GREEN phase completion
- CLI: `./mvnw test` all tests pass demonstrates no regressions

#### 3.0 Tasks

- [x] 3.1 Open `src/main/resources/templates/fragments/layout.html` for editing
- [x] 3.2 Add language selector dropdown after the existing navigation items (after line 67, before closing `</ul>` tag on line 68)
- [x] 3.3 Create Bootstrap 5 dropdown with button showing current language code using `th:text="${#locale.language.toUpperCase()}"`
- [x] 3.4 Add dropdown menu with three items: English, Spanish (Español), German (Deutsch) using `th:text="#{language.english}"` etc.
- [x] 3.5 Set each dropdown item href to current URL with `?lang=xx` parameter using `th:href="@{''(lang='en')}"` pattern
- [x] 3.6 Add appropriate ARIA labels and accessibility attributes to dropdown button and menu
- [x] 3.7 Ensure dropdown styling matches existing navbar items (use same nav-item, nav-link classes)
- [x] 3.8 Run `./mvnw test -Dtest=LanguageSelectorTests` and verify all tests now pass
- [x] 3.9 Run `./mvnw spring-boot:run` to start application and manually test language selector
- [x] 3.10 Capture screenshot of home page in English showing language selector
- [x] 3.11 Capture screenshot of dropdown menu expanded
- [x] 3.12 Click "Español" and capture screenshot of home page in Spanish
- [x] 3.13 Click "Deutsch" and capture screenshot of home page in German
- [x] 3.14 Run full test suite `./mvnw test` to ensure no regressions

### [x] 4.0 RED: Write Failing E2E Tests for Language Persistence

#### 4.0 Proof Artifact(s)

- Test: `language-selector.spec.ts` fails with expected error demonstrates E2E tests are written correctly
- CLI: `cd e2e-tests && npm test -- language-selector.spec.ts` output showing test failures demonstrates RED phase completion
- Diff: New E2E test file in `e2e-tests/tests/` demonstrates test infrastructure expansion

#### 4.0 Tasks

- [x] 4.1 Create `e2e-tests/tests/language-selector.spec.ts` following existing Playwright test patterns
- [x] 4.2 Import necessary Playwright test utilities and set up test suite with `test.describe('Language Selector', ...)`
- [x] 4.3 Write test "should display language selector on home page" - verify selector is visible
- [x] 4.4 Write test "should change page language when clicking Spanish" - click Español, verify page title/content changes to Spanish
- [x] 4.5 Write test "should persist language when navigating to Find Owners" - stay in Spanish, navigate to /owners/find, verify still in Spanish
- [x] 4.6 Write test "should persist language when navigating to Veterinarians" - navigate to /vets.html, verify still in Spanish
- [x] 4.7 Write test "should switch to German and persist across pages" - switch to Deutsch, navigate between pages, verify German text
- [x] 4.8 Write test "should display language names in their native language" - verify dropdown shows "English", "Español", "Deutsch"
- [x] 4.9 Run `cd e2e-tests && npm test -- language-selector.spec.ts` and verify tests run (may pass or fail depending on implementation state)

### [ ] 5.0 GREEN: Verify and Validate Language Persistence

#### 5.0 Proof Artifact(s)

- Test: `language-selector.spec.ts` passes demonstrates language persists across navigation
- Video/Screenshot: Playwright test artifacts showing language persistence across home → find owners → veterinarians demonstrates end-to-end functionality
- CLI: `cd e2e-tests && npm test -- language-selector.spec.ts` output showing all tests pass demonstrates GREEN phase completion
- Test Report: Playwright HTML report demonstrates comprehensive E2E validation

#### 5.0 Tasks

- [ ] 5.1 Run `./mvnw spring-boot:run` to ensure application is running for E2E tests
- [ ] 5.2 Run `cd e2e-tests && npm test -- language-selector.spec.ts` and verify all E2E tests pass
- [ ] 5.3 Review Playwright test artifacts in `e2e-tests/test-results/` for screenshots/videos of language switching
- [ ] 5.4 Manually test language persistence: select Spanish → navigate home → find owners → vets → verify Spanish persists
- [ ] 5.5 Test edge case: navigate to `/?lang=invalid` and verify fallback to English (default locale)
- [ ] 5.6 Test edge case: navigate to `/?lang=de` directly and verify German loads
- [ ] 5.7 Run `cd e2e-tests && npm run report` to open Playwright HTML report
- [ ] 5.8 Review HTML report for test coverage and any warnings or issues

### [ ] 6.0 REFACTOR: Polish, Documentation, and Final Validation

#### 6.0 Proof Artifact(s)

- Screenshot: Mobile view of language selector in collapsed navbar demonstrates responsive design
- Screenshot: Keyboard navigation highlighting language selector demonstrates accessibility
- Coverage: JaCoCo report showing >90% coverage for language selector component demonstrates quality gate met
- Documentation: Updated CHANGELOG or feature documentation demonstrates implementation is documented
- Git: Clean commit history following conventional commits demonstrates professional workflow

#### 6.0 Tasks

- [ ] 6.1 Test mobile responsiveness: resize browser to mobile width and verify language selector is in hamburger menu
- [ ] 6.2 Capture screenshot of mobile view showing collapsed navbar with language selector
- [ ] 6.3 Test keyboard navigation: use Tab key to navigate to language selector, press Enter to open, verify dropdown is keyboard accessible
- [ ] 6.4 Capture screenshot or describe keyboard focus states on language selector
- [ ] 6.5 Review code in `layout.html` for clarity and simplicity - refactor if needed
- [ ] 6.6 Ensure proper indentation and formatting in modified files
- [ ] 6.7 Run `./mvnw test jacoco:report` to generate final coverage report
- [ ] 6.8 Review `target/site/jacoco/index.html` and verify >90% coverage for language selector component
- [ ] 6.9 Run full test suite (unit + E2E): `./mvnw test && cd e2e-tests && npm test`
- [ ] 6.10 Review git commit history and ensure commits follow conventional format (feat:, test:, refactor:, etc.)
- [ ] 6.11 Consider adding entry to CHANGELOG.md or project documentation about new language selector feature
- [ ] 6.12 Perform final manual smoke test of all three languages across all main pages
