# 03-spec-language-selector.md

## Introduction/Overview

The Emerald Grove Veterinary Clinic application currently supports 8 languages through Spring's internationalization (i18n) framework, with messages.properties files already in place for English (EN), Spanish (ES), German (DE), Persian (FA), Korean (KO), Portuguese (PT), Russian (RU), and Turkish (TR). However, users must manually append `?lang=xx` to URLs to change the language, which is not user-friendly or discoverable. This feature adds a visible language selector dropdown in the application header, enabling users to easily switch languages through an intuitive UI component that persists their selection across navigation.

## Goals

- Provide a user-friendly, visible language selector in the application header
- Support all 8 existing languages with native language names for better usability
- Persist the selected language across page navigation using session storage (already configured)
- Integrate seamlessly with the existing LocaleResolver and LocaleChangeInterceptor infrastructure
- Maintain responsive design that works on mobile, tablet, and desktop devices
- Ensure full accessibility compliance (WCAG 2.1 AA) with keyboard navigation and screen reader support
- Follow Liatrio branding and UI guidelines for consistent visual design

## User Stories

**As a Spanish-speaking clinic staff member**, I want to select "Español" from a dropdown menu in the header, so that I can use the application in my preferred language without manually editing URLs.

**As a multilingual clinic administrator**, I want my language preference to persist as I navigate through different pages, so that I don't have to re-select my language on every page.

**As a clinic staff member using a mobile device**, I want to access the language selector from the collapsed mobile menu, so that I can change languages on smaller screens.

**As a clinic staff member using keyboard navigation**, I want to navigate to and use the language selector with keyboard alone (Tab, Enter, Arrow keys), so that I can switch languages without requiring a mouse.

**As a clinic staff member using a screen reader**, I want the language selector to announce available languages and my current selection, so that I can effectively change languages using assistive technology.

## Demoable Units of Work

### Unit 1: Language Selector UI Component

**Purpose:** Add a Bootstrap 5 dropdown language selector to the navbar that displays all 8 supported languages with their native names, positioned at the far right of the navigation menu.

**Functional Requirements:**
- The system shall display a language selector dropdown in the navbar, positioned at the far right of the navigation items
- The system shall show the current language as the dropdown button label using:
  - A globe icon (Font Awesome `fa-globe`) followed by the two-letter language code (e.g., "EN")
  - Example: "🌐 EN" for English
- The system shall display all 8 languages in the dropdown menu using their native names:
  - English (EN)
  - Español (ES)
  - Deutsch (DE)
  - فارسی (FA)
  - 한국어 (KO)
  - Português (PT)
  - Русский (RU)
  - Türkçe (TR)
- The system shall highlight the currently selected language in the dropdown (using `.active` class)
- The system shall use Bootstrap 5 dropdown component classes for consistent styling and behavior
- The system shall apply Liatrio branding styles to match the existing navbar design
- Each language option shall include:
  - The native language name (primary display)
  - The two-letter language code in parentheses for clarity, e.g., "English (EN)"
- The dropdown button shall use `aria-label` for accessibility (e.g., "Select language")
- The language selector shall be visible on all pages that use the standard layout

**Proof Artifacts:**
- Screenshot: Browser at `/` (home page) shows language selector in navbar with "🌐 EN" button demonstrates selector visibility and positioning
- Screenshot: Language selector dropdown expanded showing all 8 languages with native names demonstrates dropdown content and current language highlighting
- Screenshot: Mobile viewport shows language selector in collapsed navbar menu demonstrates responsive behavior
- Browser DevTools: Inspect element showing proper Bootstrap 5 dropdown markup and ARIA attributes demonstrates accessible markup structure

### Unit 2: Language Switching Functionality

**Purpose:** Implement the backend and frontend logic to handle language switching when a user selects a language from the dropdown, utilizing the existing LocaleChangeInterceptor infrastructure.

**Functional Requirements:**
- The system shall append the `?lang=xx` parameter to the current URL when a user selects a language from the dropdown
- The system shall preserve all existing URL parameters and paths when adding the language parameter
- The system shall update the session locale using the existing SessionLocaleResolver
- The system shall reload the current page with the new language applied
- The system shall update the dropdown button label to reflect the newly selected language code
- The system shall persist the language selection across page navigation (via session storage)
- The system shall default to English (EN) if no language is selected or stored in the session
- The system shall handle all 8 supported languages: EN, ES, DE, FA, KO, PT, RU, TR
- The system shall not require any modifications to the existing WebConfiguration class
- The language change shall work seamlessly with all existing internationalized content (navigation labels, form labels, error messages, etc.)

**Proof Artifacts:**
- Screenshot: Browser at `/` showing English content, after selecting "Español", page shows Spanish content with URL `/?lang=es` demonstrates language switching
- Screenshot: Browser at `/owners/find` with Spanish language selected, navigation to `/vets.html` maintains Spanish language demonstrates language persistence
- Screenshot: Browser Developer Tools Network tab showing request to `/?lang=es` with 200 response demonstrates proper URL parameter handling
- JUnit Test: New test class `LanguageSelectorTests` or added to existing controller tests, verifying that language parameter is correctly added to URLs demonstrates backend integration

### Unit 3: Accessibility Implementation

**Purpose:** Ensure the language selector meets WCAG 2.1 Level AA accessibility standards with proper ARIA attributes, keyboard navigation, and screen reader support.

**Functional Requirements:**
- The system shall provide proper ARIA labels and roles for all language selector elements:
  - Dropdown button shall have `aria-label="Select language"`
  - Dropdown menu shall have `role="menu"`
  - Language options shall have `role="menuitem"`
  - Current language shall have `aria-current="true"`
- The system shall support full keyboard navigation:
  - Tab key to focus on dropdown button
  - Enter or Space to open/close dropdown
  - Arrow keys (Up/Down) to navigate between language options
  - Enter to select a language
  - Escape to close dropdown without selection
- The system shall maintain visible focus indicators on all focusable elements
- The system shall announce language changes to screen readers using `aria-live` regions or page reload
- The system shall ensure color contrast meets WCAG AA standards (4.5:1 for text)
- The system shall support RTL (right-to-left) text direction for Persian (FA) language name
- The system shall not rely on color alone to indicate the selected language (uses checkmark icon and `.active` class)
- The system shall include `lang` attributes on the HTML element matching the selected locale

**Proof Artifacts:**
- Playwright Test: E2E accessibility test using axe-core scans navbar with language selector, verifies no critical accessibility violations demonstrates automated accessibility compliance
- Playwright Test: E2E test simulates keyboard navigation (Tab, Enter, Arrow keys) to language selector, selects language demonstrates keyboard accessibility
- Screenshot: Browser with VoiceOver or NVDA running, demonstrating screen reader announcing language options demonstrates screen reader support
- Browser DevTools: Accessibility panel showing proper ARIA tree structure for language selector demonstrates proper ARIA implementation

### Unit 4: Responsive Design and Mobile Support

**Purpose:** Ensure the language selector works seamlessly across all device sizes, integrating with the existing responsive navbar collapse behavior.

**Functional Requirements:**
- The system shall display the language selector in the desktop navbar at the far right of navigation items (above 992px viewport width)
- The system shall include the language selector in the collapsed mobile menu (below 992px viewport width)
- The system shall position the language selector at the bottom of the collapsed mobile menu list
- The system shall maintain touch-friendly target sizes on mobile (minimum 44x44px as per WCAG)
- The system shall ensure dropdown menus don't overflow viewport boundaries on small screens
- The system shall use the same Bootstrap 5 collapse behavior as existing navigation items
- The system shall apply responsive padding and spacing using existing Liatrio spacing system
- The system shall maintain readability of native language names on small screens
- The system shall ensure the globe icon and language code are visible on all screen sizes

**Proof Artifacts:**
- Screenshot: Desktop viewport (1200px+) shows language selector at far right of navbar demonstrates desktop layout
- Screenshot: Mobile viewport (375px) shows language selector in collapsed menu at bottom demonstrates mobile layout
- Screenshot: Tablet viewport (768px) shows appropriate responsive behavior demonstrates tablet layout
- Playwright Test: E2E test runs on multiple viewport sizes, verifies language selector is accessible and functional demonstrates responsive functionality

### Unit 5: Internationalization of Language Selector

**Purpose:** Add necessary message keys to all 8 language message.properties files to support the language selector UI text, ensuring the selector itself is fully internationalized.

**Functional Requirements:**
- The system shall add the following message keys to all 8 message.properties files:
  - `language.selector.label=Select language` - ARIA label for dropdown button
  - `language.en=English` - Display name for English
  - `language.es=Español` - Display name for Spanish
  - `language.de=Deutsch` - Display name for German
  - `language.fa=فارسی` - Display name for Persian
  - `language.ko=한국어` - Display name for Korean
  - `language.pt=Português` - Display name for Portuguese
  - `language.ru=Русский` - Display name for Russian
  - `language.tr=Türkçe` - Display name for Turkish
- The system shall use UTF-8 encoding for all message.properties files to properly display non-Latin characters
- The system shall provide native language names consistently across all locales (native names don't translate)
- The system shall use Thymeleaf expressions `#{language.xx}` to display language names in templates

**Proof Artifacts:**
- Code Review: All 8 messages_*.properties files include new language.* keys with native names demonstrates i18n completeness
- Screenshot: Language selector dropdown showing correctly encoded Persian (فارسی), Korean (한국어), and Russian (Русский) characters demonstrates proper UTF-8 handling
- JUnit Test: Test that loads each message.properties file and verifies all language keys are present demonstrates i18n configuration correctness

### Unit 6: End-to-End Language Selector Testing

**Purpose:** Create comprehensive Playwright E2E tests that validate the complete language switching workflow across multiple pages and scenarios.

**Functional Requirements:**
- The system shall include Playwright tests that:
  - Verify language selector is visible on all major pages (home, find owners, owner details, vets)
  - Test switching to all 8 languages and verify UI text changes correctly
  - Confirm language persistence across navigation (e.g., select Spanish, navigate to different pages, verify Spanish remains)
  - Validate URL parameters include correct `?lang=xx` after selection
  - Test mobile responsive behavior with collapsed menu
  - Verify accessibility with keyboard navigation
  - Test that language selector dropdown displays all 8 options with native names
  - Validate that currently selected language is highlighted in dropdown
- The system shall generate screenshots for each language as proof artifacts
- The system shall run tests in multiple viewport sizes (desktop, tablet, mobile)
- The system shall include accessibility assertions using axe-core integration

**Proof Artifacts:**
- Playwright Test Report: HTML report showing all language selector tests passing demonstrates E2E test coverage
- Screenshot Directory: `e2e-tests/test-results/artifacts/language-selector/` containing screenshots of UI in all 8 languages demonstrates visual proof of functionality
- Playwright Test: Test file `e2e-tests/tests/features/language-selector.spec.ts` demonstrates automated test implementation
- CI/CD: GitHub Actions workflow runs language selector tests automatically demonstrates continuous testing

## Non-Goals (Out of Scope)

1. **Language Detection**: Automatic language detection based on browser settings or IP geolocation is out of scope. Users must manually select their preferred language.

2. **User Profile Language Preferences**: Storing language preferences in a user profile database or associating language with authentication is out of scope. This feature uses session-based storage only.

3. **Per-Page Language Selection**: Users cannot select different languages for different parts of the application. Language selection is global for the entire session.

4. **Additional Language Support**: This feature only covers the 8 existing languages already supported with message.properties files. Adding new languages (e.g., French, Italian) is out of scope.

5. **Translation Management UI**: This feature does not include an admin interface for managing translations or editing message.properties content.

6. **Content Translation**: The feature only handles UI labels and messages defined in message.properties. It does not translate user-generated content (e.g., owner names, visit descriptions).

7. **Language-Specific Formatting**: While the language selector changes UI text, advanced locale-specific formatting (date formats, number formats, currency) beyond what Spring already provides is out of scope.

8. **Language Selector in Footer**: The language selector is only placed in the header navbar, not in the footer or other locations.

9. **Recently Used Languages**: The dropdown does not track or prioritize recently used languages.

10. **Language Preview**: Users cannot preview what the page would look like in another language before switching; they must commit to the language change.

## Design Considerations

### Visual Design

The language selector will follow Liatrio branding guidelines and integrate seamlessly with the existing navbar:

**Desktop Layout (>992px):**
```
[Logo] [Home] [Find Owners] [Vets] [Error] ────── [🌐 EN ▼]
```

**Mobile Layout (<992px):**
```
[☰ Menu]
  [Home]
  [Find Owners]
  [Vets]
  [Error]
  [🌐 EN ▼]  <-- Language selector at bottom of collapsed menu
```

**Dropdown Appearance:**
- Globe icon (`fa-globe`) followed by current language code (e.g., "EN")
- Dropdown menu aligned right
- Checkmark icon (`.fa-check`) next to currently selected language
- Native language names in their respective scripts
- Hover and focus states matching navbar link styles

**Color Scheme:**
- Button text: `#ffffff` (white)
- Button background: Transparent, matches navbar
- Hover background: `#6db33f` (Liatrio green)
- Active language: `#24AE1D` (Liatrio primary green) with checkmark
- Border: `#333333` (subtle border for dropdown)

### Technical Architecture

**Frontend (Thymeleaf Template):**
- Add language selector to `fragments/layout.html` in the navbar
- Use Bootstrap 5 dropdown component classes
- Use Thymeleaf expressions to get current locale: `${#locale.language}`
- Generate language links using Thymeleaf URL building: `@{${#request.requestURI}(lang=${code})}`

**Backend (Spring MVC):**
- No changes required to `WebConfiguration.java` - existing infrastructure handles locale switching
- Existing `LocaleResolver` (SessionLocaleResolver) persists language selection
- Existing `LocaleChangeInterceptor` intercepts `?lang=xx` parameter

**Internationalization:**
- Add language selector message keys to all 8 message.properties files
- Use UTF-8 encoding for proper character display
- Native language names stored in each locale's message file

**Example Implementation Structure:**
```html
<!-- In fragments/layout.html -->
<li class="nav-item dropdown language-selector">
  <a class="nav-link dropdown-toggle" href="#" role="button"
     data-bs-toggle="dropdown" aria-expanded="false"
     aria-label="#{language.selector.label}">
    <span class="fa fa-globe" aria-hidden="true"></span>
    <span th:text="${#locale.language.toUpperCase()}">EN</span>
  </a>
  <ul class="dropdown-menu dropdown-menu-end">
    <li><a class="dropdown-item" th:href="@{${#request.requestURI}(lang='en')}"
           th:classappend="${#locale.language == 'en'} ? 'active' : ''">
      <span class="fa fa-check" aria-hidden="true"
            th:if="${#locale.language == 'en'}"></span>
      <span th:text="#{language.en}">English</span> (EN)
    </a></li>
    <!-- Repeat for all 8 languages -->
  </ul>
</li>
```

## Repository Standards

Implementation must follow the established patterns identified in the codebase:

- **Thymeleaf Templates**: Use fragment pattern in `fragments/layout.html` following existing navigation item structure
- **Bootstrap 5 Components**: Use standard Bootstrap 5 dropdown classes (`.dropdown`, `.dropdown-toggle`, `.dropdown-menu`, `.dropdown-item`)
- **Liatrio Styling**: Follow UI guidelines in `docs/UI_GUIDELINES.md` for colors, spacing, and typography
- **Internationalization**: Add keys to all message.properties files using UTF-8 encoding
- **Font Awesome Icons**: Use `fa-globe` for language selector button, `fa-check` for active language
- **Responsive Design**: Follow Bootstrap 5 breakpoints and existing navbar collapse behavior
- **Accessibility**: Implement ARIA attributes as documented in `docs/ACCESSIBILITY.md`
- **Testing Conventions**:
  - Unit tests for any new controller methods (if needed)
  - Playwright E2E tests in `e2e-tests/tests/features/language-selector.spec.ts`
  - Accessibility tests using axe-core in `e2e-tests/tests/a11y/`
  - Follow Arrange-Act-Assert pattern with descriptive test names
- **TDD Methodology**: Implement using strict Red-Green-Refactor cycle as documented in CLAUDE.md and TESTING.md
- **Code Coverage**: Achieve >90% line coverage for any new code, 100% branch coverage for critical logic

## Technical Considerations

**Thymeleaf Expression Language:**
- Use `${#locale}` to access current locale
- Use `${#locale.language}` to get language code (e.g., "en", "es")
- Use `${#request.requestURI}` to get current page URL for link generation
- Use `#{message.key}` for internationalized text

**URL Parameter Handling:**
- Existing `LocaleChangeInterceptor` intercepts `?lang=xx` parameter automatically
- Language parameter must be appended to current URL, preserving existing parameters
- Use Thymeleaf URL building syntax: `@{${#request.requestURI}(lang='es')}`
- Spring will automatically merge language parameter with existing query parameters

**Bootstrap 5 Dropdown Behavior:**
- Dropdown automatically closes when clicking outside
- Keyboard navigation (Arrow keys, Enter, Escape) works by default
- Mobile touch events handled automatically
- Use `dropdown-menu-end` class to align dropdown to right side

**Character Encoding:**
- All message.properties files must use UTF-8 encoding
- Maven/Gradle build must specify UTF-8 encoding for resources
- Thymeleaf automatically handles character encoding in templates
- Special attention needed for Persian (RTL text), Korean, Russian character sets

**Session Management:**
- Existing SessionLocaleResolver stores locale in HTTP session
- Language persists across page navigation within same session
- Session timeout will reset language to default (English)
- No database or cookie storage required

**Browser Compatibility:**
- Bootstrap 5 supports modern browsers (Chrome, Firefox, Safari, Edge)
- Font Awesome 4.x icon compatibility with existing implementation
- UTF-8 character rendering depends on browser font support
- Fallback fonts for non-Latin scripts should be tested

**Performance Considerations:**
- Language switching requires page reload (standard Spring MVC behavior)
- No JavaScript frameworks required (pure Bootstrap 5 + vanilla JS)
- Message.properties files loaded once at application startup
- Minimal impact on page load time (dropdown HTML included in layout)

**Dependencies:**
- No new external dependencies required
- Uses existing Spring MVC, Thymeleaf, Bootstrap 5, Font Awesome 4.x
- Character encoding already configured in application.properties

## Security Considerations

**Input Validation:**
- Language code parameter (`?lang=xx`) is validated by Spring's LocaleChangeInterceptor
- Only valid locale codes are accepted (must match available message.properties files)
- Invalid language codes default to English without error
- No user input is directly rendered in templates (only predefined language codes and names)

**XSS Prevention:**
- All text rendered using Thymeleaf `th:text` (automatically escaped)
- Native language names are static strings from message.properties (not user input)
- ARIA labels and attributes use Thymeleaf expressions (automatically escaped)
- No use of `th:utext` (unescaped text) in language selector

**Session Security:**
- Language preference stored in HTTP session (existing SessionLocaleResolver)
- Session follows standard Spring Security session management
- No sensitive data stored in language preference
- Session timeout handled by Spring default configuration

**Information Disclosure:**
- Language selector does not reveal user location or preferences to other users
- No logging of language selection required (privacy consideration)
- Language parameter visible in URL is not sensitive information

**CSRF Protection:**
- Language switching uses GET requests with URL parameters (no CSRF token required)
- Follows existing Spring MVC CSRF configuration
- No form submission or POST requests involved

**Proof Artifact Security:**
- Screenshots and proof artifacts should not contain sensitive data
- Test data should use non-production, synthetic information
- Ensure no personal information visible in language selector screenshots

## Success Metrics

1. **Functionality**: Language selector visible on all pages using standard layout, switching between all 8 languages successfully updates UI text
2. **Persistence**: Language selection persists across page navigation within session, verified by E2E tests
3. **Accessibility**: Achieves 0 critical or serious accessibility violations in axe-core scans, full keyboard navigation support verified
4. **Responsive Design**: Language selector functions correctly on mobile, tablet, and desktop viewports (375px, 768px, 1200px+)
5. **Test Coverage**: >90% code coverage for any new code, all Playwright E2E tests passing
6. **Browser Compatibility**: Language selector works in Chrome, Firefox, Safari, Edge (latest versions)
7. **User Experience**: Average time to switch languages < 3 seconds (click dropdown, select language, page reload)
8. **Internationalization Completeness**: All 8 language message keys present in all 8 message.properties files, UTF-8 characters render correctly

## Open Questions

No open questions at this time. All design decisions have been made based on existing documentation, codebase analysis, and best practices for internationalization and accessibility.
