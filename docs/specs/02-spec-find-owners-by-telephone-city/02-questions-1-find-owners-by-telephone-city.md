# 02 Questions Round 1 - Find Owners by Telephone and City

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Search Field Behavior

How should the new telephone and city fields work together with the existing lastName field?

- [x] (A) All fields are optional - users can search by any combination (lastName only, city only, telephone only, or any combination)
- [ ] (B) At least one field must be filled - users cannot submit an empty form
- [ ] (C) lastName remains required, telephone and city are optional filters that narrow results
- [ ] (D) Other (describe)

**Context:** Currently, lastName can be empty (returns all owners). Should this behavior change?

## 2. Telephone Search Matching

How should the telephone search match against the database?

- [ ] (A) Exact match only - must match all 10 digits exactly
- [ ] (B) Partial match - search for telephone numbers containing the entered digits (e.g., "608" finds "6085551023")
- [x] (C) Starts with - search for telephone numbers starting with the entered digits
- [x] (D) Flexible input - allow users to enter with or without formatting (e.g., "(608) 555-1023" or "6085551023")
- [ ] (E) Other (describe)

**Context:** Telephone is stored as 10 digits (no formatting). Current validation requires exactly 10 digits for creation/editing.

## 3. City Search Matching

How should the city search match against the database?

- [ ] (A) Exact match (case-insensitive) - "Madison" matches only "Madison"
- [x] (B) Starts with (case-insensitive) - "Mad" matches "Madison"
- [ ] (C) Contains (case-insensitive) - "adis" matches "Madison"
- [ ] (D) Other (describe)

**Context:** Current lastName search uses "starts with" matching.

## 4. Search Combination Logic

When multiple fields are filled, how should they be combined?

- [x] (A) AND logic - results must match ALL filled fields (e.g., lastName="Franklin" AND city="Madison")
- [ ] (B) OR logic - results match ANY filled field (e.g., lastName="Franklin" OR city="Madison")
- [ ] (C) Other (describe)

**Context:** AND logic is typically more useful for narrowing search results.

## 5. Validation Requirements

What validation should be applied to the new search fields?

- [ ] (A) No validation - accept any input for search (validation only applies to create/edit)
- [ ] (B) Telephone validation - if telephone is entered, must be 10 digits
- [x] (C) Telephone validation - if telephone is entered, must be at least 3 digits (for partial search)
- [x] (D) City validation - minimum 2 characters if entered
- [ ] (E) Other (describe)

**Context:** Current behavior shows validation errors inline on the form. Search is more forgiving than create/edit.

## 6. Empty Results Handling

What should happen when no owners match the search criteria?

- [ ] (A) Keep current behavior - show error message on form: "not found"
- [ ] (B) Show friendlier message specifying which fields were searched
- [x] (C) Show empty results list with message like "No owners found matching: lastName='Franklin', city='Madison'"
- [ ] (D) Other (describe)

**Context:** Currently, "not found" error appears on the lastName field.

## 7. Single Result Behavior

What should happen when exactly one owner matches?

- [x] (A) Keep current behavior - automatically redirect to owner details page
- [ ] (B) Show results list with one owner (no auto-redirect)
- [ ] (C) Other (describe)

**Context:** Current behavior auto-redirects to owner details if exactly one match is found.

## 8. Form Layout and Design

How should the new fields be laid out on the search form?

- [ ] (A) Stack all fields vertically (lastName, then telephone, then city)
- [x] (B) Put telephone and city on the same row (side by side) below lastName
- [ ] (C) Put all three fields on one row (if space permits)
- [ ] (D) Other (describe)

**Context:** Current form has lastName field with label on left, input on right. Should maintain Liatrio branding styles.

## 9. Internationalization

Should the new field labels be internationalized?

- [ ] (A) Yes - add message keys for "Telephone" and "City" in all language files
- [ ] (B) Yes, but only for English initially
- [x] (C) No - hardcode English labels
- [ ] (D) Other (describe)

**Context:** Project supports multiple languages (EN, ES, DE, FA, KO, PT, RU, TR). Current form uses `#{lastName}` for i18n.

## 10. Proof Artifacts

What proof artifacts will demonstrate this feature works?

- [ ] (A) Screenshots of the search form with new fields
- [ ] (B) Screenshots of search results for different field combinations
- [ ] (C) Playwright E2E test results showing successful searches
- [ ] (D) JUnit test results showing repository queries work correctly
- [x] (E) All of the above
- [ ] (F) Other (describe)

**Context:** Spec requires clear proof that each functional requirement is met.

---

## Additional Questions or Clarifications

Please add any additional context, constraints, or requirements below:

[Your notes here]
