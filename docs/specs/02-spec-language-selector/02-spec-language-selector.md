# 02-spec-language-selector.md

## Introduction/Overview

Add a language selector component to the global header that allows users to switch the application UI language between English, Spanish, and German. The feature leverages the existing i18n infrastructure (SessionLocaleResolver and LocaleChangeInterceptor) to provide persistent language selection across user sessions without requiring additional backend changes.

## Goals

- Provide a visible and accessible language selector in the global header on all pages
- Enable users to switch between English (EN), Spanish (ES), and German (DE) languages
- Persist the selected language across page navigation within the same session
- Ensure the language selector integrates seamlessly with existing UI design (Bootstrap 5 + Liatrio branding)
- Validate functionality through comprehensive unit and E2E tests following strict TDD methodology

## User Stories

**As a Spanish-speaking pet owner**, I want to view the application in Spanish so that I can easily understand and navigate the veterinary clinic interface in my preferred language.

**As a multilingual clinic staff member**, I want to quickly switch between languages so that I can assist clients who speak different languages without leaving the application.

**As a German user accessing the application**, I want my language preference to persist as I navigate through different pages so that I don't have to repeatedly select my language.

## Demoable Units of Work

### Unit 1: Language Selector Component in Header

**Purpose:** Add a functional language selector dropdown to the global navigation header that allows users to switch between EN, ES, and DE languages.

**Functional Requirements:**
- The system shall display a language selector dropdown in the global header navbar visible on all pages
- The system shall show the currently selected language code (EN, ES, or DE) as the dropdown button text
- The system shall list all three language options (English, Español, Deutsch) in the dropdown menu, each displayed in its own language
- The user shall be able to click any language option to switch the application language
- The system shall append or update the `?lang=xx` parameter to the current URL when a language is selected
- The system shall reload the page with the new language parameter to display translated content
- The system shall use Bootstrap 5 dropdown components consistent with existing navbar styling
- The system shall maintain the language selector's visibility and functionality on mobile devices within the collapsed navbar menu

**Proof Artifacts:**
- Screenshot: Home page displayed in English demonstrates default language
- Screenshot: Home page displayed in Spanish demonstrates language switching
- Screenshot: Home page displayed in German demonstrates language switching
- Unit test: `LanguageSelectorTests.java` passes demonstrates language selector component renders correctly
- Web test: Controller test verifies language parameter is handled correctly

### Unit 2: Language Persistence Across Navigation

**Purpose:** Ensure the selected language persists throughout the user's session as they navigate between different pages of the application.

**Functional Requirements:**
- The system shall store the selected language in the user's session using the existing SessionLocaleResolver
- The system shall maintain the selected language when the user navigates to any page in the application
- The system shall display all pages in the selected language without requiring the `?lang=xx` parameter on subsequent page visits
- The system shall preserve the language selection until the session expires or the user explicitly changes it
- The system shall fall back to English if no language is set or if an invalid language code is provided

**Proof Artifacts:**
- E2E test: Playwright test demonstrates language selection persists across navigation from home → find owners → veterinarians
- E2E test: Playwright test validates that translated text appears correctly on multiple pages
- Test output: Test report shows language persistence validation passes

## Non-Goals (Out of Scope)

1. **Additional languages beyond EN/ES/DE**: Only English, Spanish, and German will be included in the initial implementation. Other language files (FA, KO, PT, RU, TR) will remain in the codebase but won't be added to the selector.
2. **Browser locale detection**: The application will not automatically detect and set language based on browser settings. Users must explicitly select their language.
3. **User profile language preferences**: Language selection will only persist in the session, not in any user profile or database. No user account or authentication integration is required.
4. **Translation updates or new message keys**: This feature only adds the UI selector; it does not modify or add to the existing message translation files except for language name keys.
5. **Admin configuration for available languages**: The list of available languages (EN/ES/DE) will be hardcoded in the template; no admin interface for managing languages is included.

## Design Considerations

The language selector should integrate seamlessly with the existing Liatrio-branded header design:

- Use Bootstrap 5 dropdown component matching the existing navbar style
- Position the language selector on the right side of the navbar, after the existing navigation items (Home, Find Owners, Veterinarians, Error)
- Display the current language code (EN, ES, DE) as the dropdown button text
- Show language options in their native language in the dropdown menu (English, Español, Deutsch)
- Use the same font (DM Sans) and color scheme as the existing navbar
- Ensure the dropdown is keyboard accessible and mobile responsive
- The component should collapse into the hamburger menu on mobile devices along with other nav items

## Repository Standards

Implementation must follow these established patterns from the repository:

- **Strict TDD methodology**: Write failing tests first (RED), implement minimal code (GREEN), then refactor
- **Test organization**: Use JUnit 5 with @WebMvcTest for controller tests, MockMvc for web layer testing
- **E2E testing**: Add Playwright tests in `e2e-tests/tests/` directory following existing patterns
- **Thymeleaf conventions**: Use `th:*` attributes, `#{}` for i18n message keys, `@{}` for URLs
- **Message key naming**: Use camelCase for new message keys (e.g., `language.english`, `language.spanish`)
- **Code style**: Follow Spring Boot conventions, use meaningful names, keep methods focused
- **File organization**: Maintain existing package structure, group related test classes with production code

## Technical Considerations

**Existing Infrastructure to Leverage:**
- `WebConfiguration.java` already configures SessionLocaleResolver and LocaleChangeInterceptor
- `?lang=xx` URL parameter handling is already functional
- Message files for EN, ES, DE already exist with translations

**Implementation Approach:**
- Modify `src/main/resources/templates/fragments/layout.html` to add language selector dropdown
- Add new message keys for language names (e.g., `language.english=English`, `language.spanish=Español`, `language.german=Deutsch`) to all message files
- Use Thymeleaf's `#locale` object to determine and display the currently selected language
- Language switching will use standard anchor tags with `?lang=xx` query parameters
- No Java code changes required; purely template and message file modifications

**Browser Compatibility:**
- Bootstrap 5 dropdown components are supported in all modern browsers
- No special polyfills or JavaScript required beyond Bootstrap's bundled JS

## Security Considerations

**No specific security concerns identified** for this feature. However:

- The language parameter (`?lang=xx`) should only accept valid language codes (en, es, de); the existing LocaleChangeInterceptor handles this
- No sensitive data is exposed through language selection
- No authentication or authorization is required for language switching
- Screenshots used as proof artifacts should not contain any test data that includes real personal information

## Success Metrics

1. **Visibility**: Language selector is present and visible in the header on 100% of application pages
2. **Functionality**: Users can successfully switch between all three languages (EN/ES/DE) with UI text updating immediately
3. **Persistence**: Selected language persists across at least 3 different page navigations in the same session
4. **Test coverage**: Achieve >90% code coverage for language selector component with both unit and E2E tests passing
5. **Accessibility**: Language selector is keyboard navigable and screen reader compatible (validated through manual testing or accessibility scan)

## Open Questions

No open questions at this time. All requirements are clear based on the issue description and existing codebase infrastructure.
