# 03 Questions Round 1 - Vet Specialty Filter

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Filter UI/UX Approach

Where and how should the specialty filter be displayed on the Vet Directory page?

- [x] (A) Dropdown/select above the table - Users select one specialty at a time from a dropdown menu
- [ ] (B) Radio buttons above the table - Users click radio options for All/Radiology/Surgery/Dentistry
- [ ] (C) Checkboxes above the table - Users can select multiple specialties simultaneously
- [ ] (D) Tabs/Pills - Each specialty is a clickable tab that filters the list
- [ ] (E) Other (describe)

## 2. "All" and "None" Handling

How should the filter handle "All specialties" and vets with "No specialty"?

- [x] (A) "All" shows all vets (default), no special handling for vets without specialties
- [ ] (B) "All" shows all vets, plus a separate "None" option to show only vets without specialties
- [ ] (C) Default shows only vets WITH specialties, "All" option shows everyone including those without
- [ ] (D) Other (describe)

## 3. Multi-Specialty Vets

If a vet has multiple specialties (e.g., both surgery AND dentistry), how should filtering work?

- [ ] (A) Single-select only - Shows vet if they have the selected specialty (even if they have others too)
- [ ] (B) Multi-select with OR logic - Shows vet if they match ANY selected specialty
- [x] (C) Multi-select with AND logic - Shows vet only if they have ALL selected specialties
- [ ] (D) Other (describe)

## 4. Pagination + Filtering

How should pagination interact with the specialty filter?

- [x] (A) Filter applies across all pages - pagination shows filtered results
- [ ] (B) Filter applies per page only - each page shows all vets, filtered client-side
- [ ] (C) Disable pagination when filter is active - show all filtered results on one page
- [ ] (D) Other (describe)

## 5. URL/Query Parameters

What query parameter format should be used for shareable filtered URLs?

- [ ] (A) `?specialty=surgery` - Single specialty parameter
- [ ] (B) `?specialty=surgery,dentistry` - Comma-separated for multiple
- [ ] (C) `?specialties[]=surgery&specialties[]=dentistry` - Array format
- [x] (D) `?filter=specialty:surgery` - Structured filter format
- [ ] (E) Other (describe)

## 6. Filter State Persistence

Should the filter selection persist when navigating away and back?

- [ ] (A) No persistence - always reset to "All" on page load
- [ ] (B) Persist via URL only - filter state in query params
- [x] (C) Persist in session - remember filter choice across navigation
- [ ] (D) Other (describe)

## 7. Empty Results

What should display if the filter results in no matching vets?

- [x] (A) Empty table with message "No veterinarians found for [specialty]"
- [ ] (B) Show all vets with a warning "No vets with [specialty], showing all"
- [ ] (C) Disable/hide filter option if no vets have that specialty
- [ ] (D) Other (describe)

## 8. Visual Feedback

How should users know which filter is currently active?

- [ ] (A) Highlighted/selected state on filter control
- [x] (B) Text above table: "Showing vets with specialty: Surgery"
- [ ] (C) Badge/chip showing active filter with clear (×) button
- [ ] (D) All of the above
- [ ] (E) Other (describe)

## 9. Testing Priorities

Which aspects are most critical to test?

- [ ] (A) Filter functionality - correct vets shown/hidden
- [ ] (B) URL parameter handling - shareable links work
- [ ] (C) Pagination + filter interaction
- [x] (D) All of the above
- [ ] (E) Other (describe)
