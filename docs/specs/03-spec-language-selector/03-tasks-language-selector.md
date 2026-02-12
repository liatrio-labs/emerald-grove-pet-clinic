# 03-tasks-language-selector.md

## Tasks

### [x] 1.0 Internationalization Setup - Add Language Selector Message Keys

Add message keys for language selector UI text to all 8 language message.properties files, ensuring proper UTF-8 encoding for non-Latin characters. This provides the testable foundation for the UI component implementation.

#### 1.0 Proof Artifact(s)

- JUnit Test: `MessageKeysTests.java` verifies all 8 message.properties files contain required language selector keys demonstrates i18n completeness
- Code Review: All 8 messages_*.properties files include new language.* keys with native names demonstrates message key completeness
- UTF-8 Validation: Persian (فارسی), Korean (한국어), and Russian (Русский) characters properly encoded demonstrates proper UTF-8 handling

#### 1.0 Tasks

- [x] Write failing test `MessageKeysTests.java` defining required language selector keys
- [x] Add language selector keys to `messages.properties` (base English)
- [x] Add language selector keys to `messages_de.properties` (German)
- [x] Add language selector keys to `messages_es.properties` (Spanish)
- [x] Add language selector keys to `messages_fa.properties` (Persian)
- [x] Add language selector keys to `messages_ko.properties` (Korean)
- [x] Add language selector keys to `messages_pt.properties` (Portuguese)
- [x] Add language selector keys to `messages_ru.properties` (Russian)
- [x] Add language selector keys to `messages_tr.properties` (Turkish)
- [x] Verify UTF-8 encoding for non-Latin characters
- [x] Update proof artifacts document

### [~] 2.0 Language Selector UI Component - Add Bootstrap Dropdown to Navbar

Implement the visual language selector dropdown component in the navbar using Bootstrap 5, displaying all 8 supported languages with native names and proper styling following Liatrio branding guidelines.

#### 2.0 Proof Artifact(s)

- Screenshot: Browser at `/` (home page) shows language selector in navbar with "🌐 EN" button demonstrates selector visibility and positioning
- Screenshot: Language selector dropdown expanded showing all 8 languages with native names demonstrates dropdown content and current language highlighting
- Screenshot: Mobile viewport shows language selector in collapsed navbar menu demonstrates responsive behavior
- Browser DevTools: Inspect element showing proper Bootstrap 5 dropdown markup and ARIA attributes demonstrates accessible markup structure

#### 2.0 Tasks

- [x] RED: Write failing template test verifying language selector is present in navbar
- [x] RED: Write test verifying dropdown contains all 8 language options with native names
- [x] RED: Write test verifying current language is highlighted with active class
- [x] GREEN: Add language selector dropdown markup to layout.html navbar
- [x] GREEN: Implement Thymeleaf logic to determine current locale
- [x] GREEN: Add all 8 language options with native names from message keys
- [x] GREEN: Add active class highlighting for current language
- [x] REFACTOR: Ensure proper Bootstrap 5 dropdown classes and structure
- [x] REFACTOR: Add proper ARIA attributes for accessibility
- [~] Manual verification: Test in browser at multiple viewport sizes (requires running app)
- [x] Create proof artifacts with screenshots

### [ ] 3.0 Language Switching Functionality - Implement URL Parameter and Session Persistence

Implement the JavaScript and backend integration to handle language switching via URL parameters, utilizing existing LocaleChangeInterceptor infrastructure to persist language selection across page navigation.

#### 3.0 Proof Artifact(s)

- Screenshot: Browser at `/` showing English content, after selecting "Español", page shows Spanish content with URL `/?lang=es` demonstrates language switching
- Screenshot: Browser at `/owners/find` with Spanish language selected, navigation to `/vets.html` maintains Spanish language demonstrates language persistence
- Screenshot: Browser Developer Tools Network tab showing request to `/?lang=es` with 200 response demonstrates proper URL parameter handling
- Playwright Test: E2E test in `language-selector.spec.ts` verifying language switching and persistence across navigation demonstrates functional integration

#### 3.0 Tasks

TBD

### [ ] 4.0 Accessibility Implementation - WCAG 2.1 AA Compliance

Enhance the language selector with comprehensive ARIA attributes, keyboard navigation support, and screen reader compatibility to meet WCAG 2.1 Level AA accessibility standards.

#### 4.0 Proof Artifact(s)

- Playwright Test: E2E accessibility test using axe-core scans navbar with language selector, verifies 0 critical accessibility violations demonstrates automated accessibility compliance
- Playwright Test: E2E test simulates keyboard navigation (Tab, Enter, Arrow keys) to language selector, selects language demonstrates keyboard accessibility
- Screenshot: Browser with accessibility inspector showing proper ARIA tree structure for language selector demonstrates proper ARIA implementation
- Browser DevTools: Accessibility panel showing focus order and ARIA labels demonstrates accessible navigation

#### 4.0 Tasks

TBD

### [ ] 5.0 Responsive Design - Mobile and Tablet Support

Ensure the language selector integrates seamlessly with the responsive navbar collapse behavior across all device sizes, maintaining touch-friendly targets and proper positioning.

#### 5.0 Proof Artifact(s)

- Screenshot: Desktop viewport (1200px+) shows language selector at far right of navbar demonstrates desktop layout
- Screenshot: Mobile viewport (375px) shows language selector in collapsed menu at bottom demonstrates mobile layout
- Screenshot: Tablet viewport (768px) shows appropriate responsive behavior demonstrates tablet layout
- Playwright Test: E2E test runs on multiple viewport sizes (375px, 768px, 1200px), verifies language selector is accessible and functional demonstrates responsive functionality

#### 5.0 Tasks

TBD

### [ ] 6.0 End-to-End Language Selector Testing - Comprehensive Test Suite

Create comprehensive Playwright E2E tests validating the complete language switching workflow across all 8 languages, multiple pages, and various scenarios including accessibility and responsive behavior.

#### 6.0 Proof Artifact(s)

- Playwright Test Report: HTML report showing all language selector tests passing demonstrates E2E test coverage
- Screenshot Directory: `e2e-tests/test-results/artifacts/language-selector/` containing screenshots of UI in all 8 languages demonstrates visual proof of functionality
- Playwright Test: Test file `e2e-tests/tests/features/language-selector.spec.ts` with comprehensive test coverage demonstrates automated test implementation
- CI/CD: GitHub Actions workflow runs language selector tests automatically demonstrates continuous testing integration

#### 6.0 Tasks

TBD
