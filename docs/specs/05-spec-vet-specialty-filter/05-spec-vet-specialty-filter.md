# 05-spec-vet-specialty-filter

## Introduction/Overview

This specification defines the implementation of a specialty filter for the Veterinarian Directory page. The feature enables users to filter the list of veterinarians by their medical specialty (e.g., radiology, surgery, dentistry) or view vets with no specialty. The filter uses query parameters to support shareable URLs, allowing users to bookmark or share filtered views of the vet directory.

## Goals

- Enable users to quickly locate veterinarians with specific specialties
- Provide a shareable, bookmarkable URL format for filtered vet directory views
- Maintain consistency with existing search and filter patterns in the application
- Support both specialty-specific filtering and viewing vets with no assigned specialty
- Ensure the filter works seamlessly with existing pagination functionality

## User Stories

**As a pet owner**, I want to filter veterinarians by specialty so that I can find a vet with expertise relevant to my pet's needs (e.g., dentistry for teeth cleaning, surgery for an operation).

**As a clinic administrator**, I want to share filtered links to specific vet specialties so that I can quickly direct staff or clients to relevant veterinarian information.

**As a pet owner**, I want to view general practitioners (vets with no specialty) so that I can find a vet for routine checkups and general care.

**As a user**, I want the filter to persist across pagination so that I can browse multiple pages of filtered results without losing my selection.

## Demoable Units of Work

### Unit 1: Specialty Filter UI and Query Parameter Support

**Purpose:** Add a specialty filter dropdown to the Vet Directory page that updates the URL with query parameters and filters the displayed results.

**Functional Requirements:**
- The system shall display a filter form card above the veterinarian table containing a specialty dropdown
- The system shall populate the specialty dropdown with options: "All Specialties", "None" (for vets with zero specialties), and all existing specialty names sorted alphabetically
- The system shall update the URL with a `specialty` query parameter when a user selects a filter option (e.g., `/vets.html?specialty=dentistry`)
- The system shall filter the veterinarian list to show only vets matching the selected specialty
- The system shall display all veterinarians when "All Specialties" is selected or when no specialty parameter is present
- The system shall display only veterinarians with zero specialties when "None" is selected
- The system shall reset pagination to page 1 when a new filter is applied
- The system shall maintain the selected filter across pagination navigation
- The system shall pre-select the dropdown value based on the `specialty` query parameter on page load
- The system shall display the message "No veterinarians found with the selected specialty" when filter results are empty

**Proof Artifacts:**
- Screenshot: `specialty-filter-dropdown.png` demonstrates filter control with all specialty options visible
- Screenshot: `filtered-results-dentistry.png` demonstrates filtered list showing only vets with "dentistry" specialty
- Screenshot: `filtered-url-query-param.png` demonstrates browser URL bar showing `/vets.html?page=1&specialty=radiology`
- Screenshot: `empty-filter-results.png` demonstrates empty state message when no vets match the filter

### Unit 2: Backend Repository and Controller Implementation

**Purpose:** Implement repository query methods and controller logic to support specialty-based filtering with pagination.

**Functional Requirements:**
- The system shall provide a `VetRepository.findBySpecialtyName()` method that returns paginated vets filtered by specialty name
- The system shall provide a `VetRepository.findBySpecialtiesIsEmpty()` method that returns paginated vets with zero specialties
- The system shall provide a `VetRepository.findDistinctSpecialtyNames()` method that returns all unique specialty names for populating the filter dropdown
- The system shall accept an optional `specialty` query parameter in the `VetController.showVetList()` method
- The system shall route to the appropriate repository method based on the specialty parameter value ("all", "none", or specific specialty name)
- The system shall add the list of available specialties to the model for rendering the dropdown
- The system shall add the current filter value to the model for maintaining dropdown state

**Proof Artifacts:**
- Test: `VetRepositoryTests.testFindBySpecialtyName()` demonstrates repository correctly filters by specialty
- Test: `VetRepositoryTests.testFindBySpecialtiesIsEmpty()` demonstrates repository correctly finds vets with no specialty
- Test: `VetControllerTests.testShowVetListWithSpecialtyFilter()` demonstrates controller handles specialty parameter
- Test: `VetControllerTests.testShowVetListWithAllSpecialties()` demonstrates controller shows all vets when filter is "all"

### Unit 3: End-to-End Filter Functionality

**Purpose:** Validate complete filter functionality including user interactions, URL updates, and data accuracy through automated E2E tests.

**Functional Requirements:**
- The system shall provide E2E tests that navigate to the Vet Directory and verify the filter dropdown is present
- The system shall provide E2E tests that select a specific specialty and verify only matching vets are displayed
- The system shall provide E2E tests that verify the URL updates with the correct query parameter when a filter is applied
- The system shall provide E2E tests that verify the filter persists across page navigation
- The system shall provide E2E tests that verify selecting "All Specialties" displays all veterinarians
- The system shall provide E2E tests that verify selecting "None" displays only vets with zero specialties
- The system shall provide E2E tests that verify empty results display appropriate messaging
- The system shall provide E2E tests that verify filter works correctly with shareable URLs (direct navigation to filtered URL)

**Proof Artifacts:**
- Test: `e2e-tests/tests/vet-specialty-filter.test.ts` demonstrates complete filter workflow
- Test: `e2e-tests/tests/vet-specialty-filter.test.ts` demonstrates query parameter functionality
- Test: `e2e-tests/tests/vet-specialty-filter.test.ts` demonstrates pagination with filter persistence
- Playwright HTML Report: `test-results/html-report/index.html` demonstrates all E2E tests passing

## Non-Goals (Out of Scope)

1. **Multi-specialty filtering**: This spec does NOT include the ability to filter by multiple specialties simultaneously (e.g., showing vets who have either radiology OR surgery). Filtering applies to a single specialty at a time.

2. **Vet availability or scheduling**: This spec does NOT include displaying vet availability, appointment slots, or scheduling functionality.

3. **Search by vet name**: This spec does NOT include a text search field to filter vets by name. The filter is specialty-based only.

4. **Sorting functionality**: This spec does NOT include sorting vets by name, specialty count, or other attributes beyond the existing display order.

5. **Specialty management**: This spec does NOT include the ability to add, edit, or delete specialties. The filter works with existing specialties in the database.

6. **Filter persistence across sessions**: This spec does NOT include saving filter preferences in cookies or local storage. Filter state is maintained only via URL query parameters during the current session.

## Design Considerations

### UI/UX Requirements

**Filter Control Placement:**
- Position the filter form card above the veterinarian table, following the pattern established in "Find Owners" search interface (UI_GUIDELINES.md Section 6)
- Use `.liatrio-form-card` wrapper with consistent spacing and styling

**Filter Control Design:**
- Use Bootstrap 5 `<select>` dropdown for specialty selection
- Include label "Filter by Specialty" with `for` attribute for accessibility
- Use `.form-control` class for consistent input styling
- Include help text: "Select a specialty to filter the list, or choose 'All Specialties' to view all veterinarians"

**Dropdown Options:**
- First option: "All Specialties" (value: empty string or "all")
- Second option: "None" (value: "none")
- Remaining options: Specialty names in alphabetical order (values: specialty names in lowercase)

**Empty State Display:**
- Show table structure with empty tbody
- Display centered message below table: "No veterinarians found with the selected specialty"
- Use `.liatrio-muted` class for message styling

**Pagination Integration:**
- Pagination links must include `specialty` query parameter when a filter is active
- Example: `/vets.html?page=2&specialty=dentistry`

**Visual Indicators:**
- No special visual indicators required beyond the selected dropdown value
- The dropdown state itself communicates the active filter

### Accessibility Requirements

Following ACCESSIBILITY.md guidelines:

**ARIA Attributes:**
- Filter dropdown: `<select id="specialty" name="specialty" aria-label="Filter veterinarians by specialty">`
- Help text: `<small id="specialty-help" aria-describedby="specialty-help">...</small>`
- Empty results message: `<div role="status" aria-live="polite">No veterinarians found...</div>`

**Keyboard Navigation:**
- Dropdown must be fully keyboard accessible (native `<select>` provides this)
- Tab order: Filter dropdown → Table content → Pagination controls
- Enter/Space on dropdown opens options
- Arrow keys navigate options

**Screen Reader Support:**
- Label text clearly describes filter purpose
- Help text provides context via `aria-describedby`
- Empty results announced via `aria-live="polite"`

**Color Contrast:**
- All text meets WCAG 2.1 AA contrast requirements (4.5:1 minimum)
- Form control borders meet 3:1 contrast ratio

## Repository Standards

### Coding Standards

Following CLAUDE.md and ARCHITECTURE.md guidelines:

**Spring Data JPA Query Methods:**
- Use Spring Data JPA naming conventions for query derivation
- Repository methods follow pattern: `findBy[Property][Condition]`
- Example: `findBySpecialtyName(String specialtyName, Pageable pageable)`

**Controller Method Patterns:**
- Use `@RequestParam` with `required = false` for optional parameters
- Use `defaultValue` for query parameters when appropriate
- Follow existing pagination pattern in `VetController`

**Test Organization:**
- Unit tests: `VetRepositoryTests.java`, `VetControllerTests.java`
- E2E tests: `e2e-tests/tests/vet-specialty-filter.test.ts`
- Follow Arrange-Act-Assert pattern
- Maintain 90%+ code coverage

**Naming Conventions:**
- Controller parameter: `specialty` (lowercase, singular)
- Repository methods: `findBySpecialtyName`, `findBySpecialtiesIsEmpty`
- Model attributes: `specialtyFilter`, `availableSpecialties`

### Architecture Patterns

**Layered Architecture:**
- View Layer: `vetList.html` (Thymeleaf template)
- Controller Layer: `VetController.showVetList()` method enhancement
- Repository Layer: `VetRepository` interface extensions
- Data Layer: Existing JPA entities (`Vet`, `Specialty`)

**Query Parameter Handling:**
- Follow existing `page` parameter pattern
- Use optional parameters with sensible defaults
- Maintain backwards compatibility (no specialty param = show all)

## Technical Considerations

### Implementation Approach

**Repository Layer:**
- Add custom query methods to `VetRepository` interface
- Spring Data JPA will auto-implement queries based on method names
- Handle pagination consistently with existing `findAll(Pageable)` method

**Controller Layer:**
- Modify `VetController.showVetList()` to accept `specialty` parameter
- Conditional logic to route to appropriate repository method
- Populate model with specialty list for dropdown
- Maintain existing pagination logic

**View Layer:**
- Add filter form card above existing table in `vetList.html`
- Use Thymeleaf `th:selected` to maintain dropdown state based on model attribute
- Update pagination links to include specialty parameter using `th:href` with parameter interpolation

### Spring Data JPA Query Methods

Example repository method signatures (Spring Data JPA auto-implements):

```java
// Find vets by specialty name with pagination
Page<Vet> findBySpecialtiesName(String specialtyName, Pageable pageable);

// Find vets with no specialties with pagination
Page<Vet> findBySpecialtiesIsEmpty(Pageable pageable);

// Find all distinct specialty names for dropdown
@Query("SELECT DISTINCT s.name FROM Specialty s ORDER BY s.name")
List<String> findDistinctSpecialtyNames();
```

### Pagination Considerations

- Reset to page 1 when filter changes (prevents "page 5 of 2 pages" scenarios)
- Include `specialty` parameter in all pagination links
- Handle edge cases: filter results in fewer pages than current page

### Cache Considerations

The `VetRepository.findAll()` methods are annotated with `@Cacheable("vets")`. New filtered query methods should also consider caching:
- Add `@Cacheable("vets")` to new repository methods
- Cache key should include specialty parameter for proper cache segmentation
- Consider cache eviction strategy if specialty data changes

### Database Query Performance

- Existing many-to-many relationship between `Vet` and `Specialty` uses `EAGER` fetching
- Queries will use JOIN to filter by specialty name
- Index on `specialties.name` recommended for performance (if not already present)
- Pagination limits result set size, maintaining good performance

## Security Considerations

**Input Validation:**
- Validate `specialty` query parameter to prevent injection attacks
- Use parameterized queries (Spring Data JPA provides this by default)
- Sanitize specialty parameter before using in queries

**SQL Injection Prevention:**
- Spring Data JPA query methods use parameterized queries automatically
- No raw SQL concatenation in implementation
- Repository method parameters are safely bound

**URL Parameter Security:**
- Specialty parameter is read-only (no data modification)
- No sensitive information exposed in URL
- Query parameter values are displayed in dropdown (no hidden state)

**Proof Artifact Security:**
- Screenshots should not contain real client/patient data
- Use test database with sample data for proof artifacts
- E2E tests run against test environment, not production

**No specific security considerations identified** beyond standard input validation and parameterized queries already provided by Spring Data JPA.

## Success Metrics

1. **Functional Completeness**: All acceptance criteria from GitHub issue #4 are met and verified through proof artifacts

2. **Test Coverage**: Minimum 90% code coverage for new and modified code (repository methods, controller logic)

3. **E2E Test Success**: All Playwright E2E tests pass, covering filter functionality, query parameters, pagination integration, and empty states

4. **Accessibility Compliance**: Filter control passes WCAG 2.1 Level AA automated accessibility scans (axe-core) with zero critical violations

5. **Performance**: Filter response time remains under 200ms for database queries with paginated results (measured via Spring Boot Actuator metrics)

6. **Browser Compatibility**: Filter functionality works correctly in Chrome, Firefox, Safari, and Edge (verified through Playwright cross-browser testing)

## Open Questions

No open questions at this time. All decisions have been made based on:
- GitHub issue #4 requirements
- Existing application patterns and conventions
- UI_GUIDELINES.md search interface patterns
- ACCESSIBILITY.md WCAG 2.1 AA requirements
- ARCHITECTURE.md repository and controller patterns
- TESTING.md TDD and E2E testing requirements
