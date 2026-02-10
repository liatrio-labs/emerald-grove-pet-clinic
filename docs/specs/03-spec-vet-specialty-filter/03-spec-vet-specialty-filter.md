# 03-spec-vet-specialty-filter.md

## Introduction/Overview

Add a specialty filter component to the Veterinarian Directory page that allows users to filter the list of veterinarians by their medical specialties (radiology, surgery, dentistry). The feature will use a dropdown selector above the vet table, support multi-specialty filtering with AND logic, integrate with the existing pagination system, and persist filter selections in the user session.

## Goals

- Provide a dropdown filter above the veterinarian table for selecting specialties
- Enable users to filter vets by one or multiple specialties using AND logic
- Integrate filtering seamlessly with the existing pagination system
- Persist the selected filter state across page navigation within the same session
- Display clear visual feedback showing which filters are currently active
- Maintain shareable URLs with structured query parameters for filtered views

## User Stories

**As a pet owner looking for specialized care**, I want to filter veterinarians by their specialty (e.g., surgery, dentistry) so that I can quickly find vets who can address my pet's specific medical needs.

**As a clinic staff member assisting clients**, I want to filter the vet directory by multiple specialties simultaneously so that I can find vets who have all the required qualifications for complex cases.

**As a user navigating the vet directory**, I want my filter selection to persist as I move between pages so that I don't have to repeatedly reselect my filters while browsing through the paginated list.

## Demoable Units of Work

### Unit 1: Dropdown Filter UI Component

**Purpose:** Add a functional specialty filter dropdown to the Veterinarian Directory page that allows users to select one or more specialties and filter the displayed vet list accordingly.

**Functional Requirements:**
- The system shall display a dropdown/select filter component above the veterinarian table on the `/vets.html` page
- The system shall populate the dropdown with options: "All", "Radiology", "Surgery", and "Dentistry"
- The system shall set "All" as the default selected option, showing all veterinarians when no specific filter is applied
- The user shall be able to select one or multiple specialties from the dropdown
- The system shall update the URL with a structured query parameter in the format `?filter=specialty:surgery` when a specialty is selected
- The system shall reload the page with filtered results when a specialty selection is made
- The system shall display text above the table (e.g., "Showing vets with specialty: Surgery") indicating which filter is currently active
- The system shall maintain the dropdown component's functionality on mobile devices within the responsive layout

**Proof Artifacts:**
- Screenshot: Vet directory page with dropdown filter showing "All", "Radiology", "Surgery", "Dentistry" options demonstrates filter UI exists
- Screenshot: Vet directory page with URL `?filter=specialty:surgery` showing only surgery vets demonstrates filtering works
- Screenshot: Page showing "Showing vets with specialty: Surgery" text above table demonstrates visual feedback
- Test: `VetSpecialtyFilterTests.java` unit tests pass demonstrates filter component renders correctly

### Unit 2: Multi-Specialty AND Logic Filtering

**Purpose:** Implement the filtering logic that displays only veterinarians who have ALL selected specialties when multiple specialties are chosen.

**Functional Requirements:**
- The system shall allow users to select multiple specialties simultaneously from the dropdown
- The system shall apply AND logic when multiple specialties are selected (vet must have ALL selected specialties to appear in results)
- The system shall update the query parameter to reflect multiple selections (e.g., `?filter=specialty:surgery,dentistry`)
- The system shall display an empty table with the message "No veterinarians found for [specialty list]" when no vets match all selected specialties
- The system shall correctly identify vets with multiple specialties and show them only when they match all filter criteria

**Proof Artifacts:**
- Screenshot: Vet directory filtered by "Surgery" showing only vets with surgery specialty demonstrates single-specialty filtering
- Screenshot: Vet directory filtered by "Surgery,Dentistry" showing only vets with BOTH specialties demonstrates AND logic
- Screenshot: Empty table with "No veterinarians found for Surgery, Dentistry" message demonstrates empty state handling
- Test: `VetSpecialtyFilterTests.java` tests pass for multi-specialty AND logic demonstrates correct filtering behavior

### Unit 3: Pagination Integration with Filtering

**Purpose:** Ensure the specialty filter works seamlessly with the existing pagination system, applying filters across all pages and maintaining correct page counts.

**Functional Requirements:**
- The system shall apply the selected specialty filter across all pages of the paginated vet list
- The system shall recalculate pagination controls (page numbers, next/previous links) based on filtered results
- The system shall maintain both `?page=N` and `?filter=specialty:X` parameters in URLs when navigating between pages
- The system shall reset to page 1 when a new filter is applied
- The system shall display the correct number of results per page (5 vets) for filtered results
- The system shall disable or hide pagination controls when filtered results fit on a single page

**Proof Artifacts:**
- Screenshot: Filtered vet list with multiple pages showing page controls demonstrates pagination works with filters
- Screenshot: URL showing `?page=2&filter=specialty:surgery` demonstrates combined parameters
- Test: `VetSpecialtyFilterTests.java` pagination tests pass demonstrates pagination integration
- CLI: `./mvnw test -Dtest=VetSpecialtyFilterTests` output showing all pagination tests pass demonstrates pagination logic is correct

### Unit 4: Session Persistence and Shareable URLs

**Purpose:** Persist the user's filter selection in their session so it's remembered across page navigation, while also supporting shareable filtered URLs.

**Functional Requirements:**
- The system shall store the selected specialty filter in the user's HTTP session
- The system shall remember the filter selection when the user navigates to other pages (e.g., home, find owners) and returns to the vet directory
- The system shall restore the filter from session storage when the user navigates back to `/vets.html` without query parameters
- The system shall respect query parameters over session state when both are present
- The system shall allow users to share filtered URLs (e.g., `?filter=specialty:surgery`) that work correctly when opened in a new session

**Proof Artifacts:**
- E2E test: `vet-specialty-filter.spec.ts` test "should persist filter when navigating away and back" passes demonstrates session persistence
- E2E test: Test showing shared URL `?filter=specialty:surgery` loads correctly in new browser session demonstrates shareable URLs
- Test: Playwright HTML report showing all session persistence tests pass demonstrates comprehensive validation
- CLI: `cd e2e-tests && npm test -- vet-specialty-filter.spec.ts` output showing all tests pass demonstrates end-to-end functionality

## Non-Goals (Out of Scope)

1. **Search by vet name or other attributes**: This feature only filters by specialty. Search functionality for vet names or other criteria is not included.
2. **Real-time/AJAX filtering**: The filter will use full page reloads with query parameters. Live filtering without page refresh is out of scope.
3. **User preference storage in database**: Filter preferences persist in session only, not in any user profile or database table.
4. **Adding or modifying specialties**: This feature displays and filters existing specialties only. Admin functionality to add/edit/remove specialties is not included.
5. **OR logic filtering**: Only AND logic (vet must have ALL selected specialties) is supported. OR logic (vet has ANY selected specialty) is not included.
6. **Filtering on other vet attributes**: Only specialty filtering is in scope. Filtering by years of experience, availability, or other vet attributes is excluded.

## Design Considerations

The specialty filter should integrate seamlessly with the existing Liatrio-branded veterinarian directory design:

- Use a Bootstrap 5 `<select>` element with `multiple` attribute positioned above the vet table
- Match the existing Liatrio design system colors and typography (DM Sans font)
- Place the filter control in a prominent location above the table, aligned with the page title
- Display the "Showing vets with specialty: [X]" text as a subtitle or info banner above the table
- Ensure the dropdown is mobile-responsive and accessible on smaller screens
- Use semantic HTML and appropriate ARIA labels for accessibility
- The filter dropdown should have sufficient width to display specialty names clearly
- Empty state message should use the same table structure but show a centered message in place of vet rows

## Repository Standards

Implementation must follow these established patterns from the repository:

- **Git Workflow**: NEVER commit directly to main branch. Always create a feature branch (e.g., `feature/vet-specialty-filter`), commit changes to the feature branch, and create a Pull Request for review before merging
- **Strict TDD methodology**: Write failing tests first (RED), implement minimal code (GREEN), then refactor
- **Test organization**: Use JUnit 5 with @WebMvcTest for controller tests, MockMvc for web layer testing
- **E2E testing**: Add Playwright tests in `e2e-tests/tests/` directory following existing patterns from `language-selector.spec.ts`
- **Thymeleaf conventions**: Use `th:*` attributes, `#{}` for i18n message keys, `@{}` for URLs with query parameters
- **Spring MVC patterns**: Follow existing controller patterns in `VetController.java` with `@RequestParam` for query parameters
- **Message key naming**: Use camelCase for new message keys (e.g., `filter.specialty.all`, `filter.specialty.label`)
- **Code style**: Follow Spring Boot conventions, use meaningful parameter names, keep methods focused
- **File organization**: Add filter tests to `src/test/java/org/springframework/samples/petclinic/vet/` alongside existing vet tests
- **Conventional commits**: Use format like `feat(vet): add specialty filter dropdown`, `test(vet): add specialty filter tests`
- **Pull Request**: Create PR within the forked repository with descriptive title and body referencing the issue (e.g., "Closes #2")

## Technical Considerations

**Existing Infrastructure to Leverage:**
- `VetController.java` already implements pagination with `@RequestParam` and `PageRequest`
- The `Vet` entity has a many-to-many relationship with `Specialty` using `@ManyToMany(fetch = FetchType.EAGER)`
- Database already contains specialty data (radiology, surgery, dentistry) in the `specialties` table
- `vetList.html` template uses Thymeleaf with Bootstrap 5 table styling

**Implementation Approach:**
- Modify `VetController.showVetList()` to accept an optional `@RequestParam String filter` parameter
- Parse the filter parameter format `specialty:surgery` or `specialty:surgery,dentistry` to extract specialty names
- Add new repository method `Page<Vet> findBySpecialtiesNameIn(List<String> specialtyNames, Pageable pageable)` or use custom query with AND logic
- For AND logic with multiple specialties, use a custom `@Query` that joins the `vet_specialties` table and applies `HAVING COUNT(DISTINCT specialty_id) = ?` to ensure vet has all specified specialties
- Store the filter parameter in the HTTP session using `@SessionAttribute` or `HttpSession.setAttribute()`
- Pass current filter state to the template via `Model` for dropdown selection state and visual feedback text
- Update `vetList.html` to include filter dropdown and maintain filter parameter in pagination links
- Add message keys for filter labels and empty state messages to all i18n message files

**Query Parameter Format:**
- Single specialty: `?filter=specialty:surgery`
- Multiple specialties: `?filter=specialty:surgery,dentistry`
- Combined with pagination: `?page=2&filter=specialty:radiology`

## Security Considerations

**Input Validation:**
- Validate that specialty names in the filter parameter match known specialties in the database to prevent SQL injection
- Use parameterized queries or Spring Data JPA specifications for all database filtering
- Sanitize user input from query parameters before displaying in "Showing vets with specialty: [X]" text to prevent XSS

**Data Privacy:**
- No sensitive data is exposed through the specialty filter
- Filter parameters in URLs are read-only and do not modify any data
- Session storage of filter preferences does not contain sensitive information

**Proof Artifact Security:**
- Screenshots should use default H2 database data, which does not contain real personal information
- Avoid including any production database credentials or connection strings in proof artifacts

## Success Metrics

1. **Functionality**: Users can successfully filter veterinarians by one or multiple specialties with results updating immediately
2. **Persistence**: Selected filter persists across at least 3 different page navigations (vet directory → home → find owners → back to vet directory)
3. **Test coverage**: Achieve >90% code coverage for specialty filter component with both unit and E2E tests passing
4. **Pagination**: Filtered results correctly integrate with pagination, showing accurate page counts and navigation controls
5. **Accessibility**: Filter dropdown is keyboard navigable (Tab to focus, Enter/Space to open, Arrow keys to select) and works with screen readers

## Open Questions

No open questions at this time. All requirements are clear based on the answered clarification questions and existing codebase infrastructure.
