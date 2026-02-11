# 05 Questions Round 1 - Vet Specialty Filter

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Filter Control Placement

Where should the specialty filter control be positioned on the Vet Directory page?

- [x] (A) Above the table in a form card (similar to "Find Owners" search interface pattern)
- [ ] (B) Inline with the table header row
- [ ] (C) As a sidebar next to the table
- [ ] (D) Other (describe)

**Decision:** Following UI_GUIDELINES.md Section 6 "Search Interfaces", use a form card above the table for consistency with existing search patterns.

## 2. "None" Specialty Handling

How should the filter handle veterinarians with no specialties?

- [x] (A) Include a "None" option in the dropdown that shows vets with zero specialties
- [ ] (B) Show vets with no specialties when "All" is selected but not in specialty-specific filters
- [ ] (C) Always exclude vets with no specialties from filtered results
- [ ] (D) Other (describe)

**Decision:** Include "None" as a filterable option to enable users to find general practitioners.

## 3. Filter State Persistence

Should the filter selection persist across page navigation?

- [x] (A) Yes, using query parameters (e.g., `/vets.html?page=1&specialty=dentistry`) for shareable URLs
- [ ] (B) Yes, using browser session storage
- [ ] (C) No, reset to "All" on each page load
- [ ] (D) Other (describe)

**Decision:** Query parameter approach enables shareable URLs (per GitHub issue requirement) and follows existing pagination pattern.

## 4. Pagination Interaction

How should filtering interact with pagination?

- [x] (A) Reset to page 1 when a filter is applied; maintain filter across page navigation
- [ ] (B) Maintain current page when applying filter if possible
- [ ] (C) Show all filtered results on one page (disable pagination when filtering)
- [ ] (D) Other (describe)

**Decision:** Reset to page 1 provides predictable behavior; maintain filter across pages via query param `specialty`.

## 5. Empty Results Handling

What should be displayed when no vets match the selected specialty?

- [x] (A) Empty table with a message: "No veterinarians found with the selected specialty"
- [ ] (B) Hide the table and show a centered message card
- [ ] (C) Automatically reset to "All" with a notification
- [ ] (D) Other (describe)

**Decision:** Show empty table with clear message for consistency with existing empty state patterns.

## 6. Proof Artifacts

Which proof artifacts should be generated to demonstrate the feature works?

- [x] (A) Screenshot: Filter dropdown showing all available specialties
- [x] (B) Screenshot: Filtered results showing only vets with selected specialty
- [x] (C) Screenshot: URL with query parameter demonstrating shareable link
- [x] (D) Playwright E2E test: Applies filter and verifies correct results
- [x] (E) Playwright E2E test: Verifies "All" option shows all vets
- [x] (F) Playwright E2E test: Verifies query parameter support

**Decision:** Comprehensive proof including visual artifacts and automated tests per GitHub issue requirements.

---

## Additional Context

Based on the extensive documentation review, I can proceed with the following informed decisions:

**UI/UX:**
- Use Bootstrap 5 dropdown/select control per UI_GUIDELINES.md
- Follow `.liatrio-form-card` pattern for filter container
- Maintain consistent styling with existing forms
- Include ARIA labels and keyboard navigation per ACCESSIBILITY.md

**Backend:**
- Add `findBySpecialtyName` method to `VetRepository` following Spring Data JPA naming conventions
- Add `specialty` parameter to `VetController.showVetList()` with `@RequestParam(required = false)`
- Populate model with list of available specialties for dropdown
- Handle pagination with filtered results

**Testing:**
- Follow TESTING.md TDD requirements (90% coverage)
- Create comprehensive E2E tests with Playwright
- Include unit tests for controller and repository methods
- Test edge cases (empty results, "None" specialty, "All" option)

Unless you have specific preferences that differ from these decisions, I'm ready to proceed with specification generation.
