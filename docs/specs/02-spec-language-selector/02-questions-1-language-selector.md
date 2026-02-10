# 02 Questions Round 1 - Language Selector

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Language Selector Placement and Style

Where should the language selector appear in the header, and what UI pattern should it follow?

- [ ] (A) Dropdown menu on the far right of the navbar (next to existing nav items)
- [ ] (B) Language flag icons/buttons inline in the navbar
- [ ] (C) Dropdown within a user/settings menu (if one exists or should be created)
- [ ] (D) Simple text links (EN | ES | DE) in the navbar
- [ ] (E) Other (describe)

**Additional context:**

## 2. Initial Language Support

Which languages should be included in the initial implementation?

- [ ] (A) English (EN), Spanish (ES), German (DE) only as stated in issue
- [ ] (B) Include all existing language files (EN, ES, DE, FA, KO, PT, RU, TR)
- [ ] (C) English (EN), Spanish (ES), German (DE) + one or two more
- [ ] (D) Other (describe)

**Additional context:**

## 3. Visual Language Indicator

How should the selected language be indicated to the user?

- [ ] (A) Show current language code (e.g., "EN") in the selector/button
- [ ] (B) Show full language name (e.g., "English") in the selector/button
- [ ] (C) Show flag icon representing the current language
- [ ] (D) Show language code + flag icon
- [ ] (E) No indicator needed, just the dropdown
- [ ] (F) Other (describe)

**Additional context:**

## 4. Language Names Display

In what language should the language options be displayed within the selector?

- [ ] (A) Display each language in its own language (English, Español, Deutsch)
- [ ] (B) Display all languages in the current selected language
- [ ] (C) Display language codes only (EN, ES, DE)
- [ ] (D) Other (describe)

**Additional context:**

## 5. Mobile Responsiveness

How should the language selector behave on mobile devices?

- [ ] (A) Collapse into the hamburger menu with other nav items
- [ ] (B) Remain visible as a small icon/button even when menu is collapsed
- [ ] (C) Show at the top/bottom of the collapsed menu when opened
- [ ] (D) Other (describe)

**Additional context:**

## 6. URL Behavior After Language Change

What should happen to the URL when a user changes the language?

- [ ] (A) Append/update `?lang=xx` parameter and reload the current page
- [ ] (B) Append/update `?lang=xx` parameter without reload (if possible)
- [ ] (C) Store in session only, no URL parameter visible
- [ ] (D) Other (describe)

**Additional context:**

## 7. Proof Artifacts

What proof artifacts would best demonstrate this feature is working?

- [ ] (A) Screenshots of the same page (e.g., home page) in 2-3 different languages
- [ ] (B) Playwright E2E test output showing language switching and text validation
- [ ] (C) Video/GIF showing language switching in action
- [ ] (D) All of the above
- [ ] (E) Other (describe)

**Additional context:**

## 8. Edge Cases and Validation

Are there any edge cases or specific behaviors we should explicitly handle?

- [ ] (A) User attempts to select already-selected language (no action needed)
- [ ] (B) User switches language on a form page (form data preservation)
- [ ] (C) Invalid language parameter in URL (fallback to default)
- [ ] (D) All of the above
- [ ] (E) Other (describe)

**Additional context:**

## 9. Accessibility Requirements

What accessibility considerations are important for this feature?

- [ ] (A) Keyboard navigation support for the language selector
- [ ] (B) ARIA labels and screen reader support
- [ ] (C) Sufficient color contrast for all language options
- [ ] (D) All of the above
- [ ] (E) Other (describe)

**Additional context:**

## 10. Success Criteria

How will we know this feature is successful?

- [ ] (A) Language selector is visible and functional on all pages
- [ ] (B) Switching languages updates all visible UI text immediately
- [ ] (C) Selected language persists across page navigation
- [ ] (D) E2E tests pass validating language switching
- [ ] (E) All of the above
- [ ] (F) Other (describe)

**Additional context:**
