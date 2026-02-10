# 02-spec-find-owners-by-telephone-city.md

## Introduction/Overview

This specification describes enhancements to the existing owner search functionality by adding telephone number and city search capabilities. Currently, users can only search for owners by last name, which limits their ability to locate owner records when the last name is unknown or ambiguous. This feature will enable clinic staff to search by telephone number or city in addition to last name, making it easier to find owner records using any available information.

## Goals

- Enable searching for owners by telephone number (partial match from start)
- Enable searching for owners by city name (partial match from start)
- Support flexible search combinations (any field or multiple fields together)
- Maintain backward compatibility with existing last name search functionality
- Provide clear feedback when no results are found with specified criteria

## User Stories

**As a veterinary clinic receptionist**, I want to search for an owner by their telephone number so that I can quickly locate their record when they call to schedule an appointment without knowing their exact last name spelling.

**As a veterinary clinic staff member**, I want to search for owners by city so that I can identify all clients from a specific geographic area for local outreach or service notifications.

**As a veterinary clinic administrator**, I want to use multiple search criteria together (e.g., last name and city) so that I can narrow down results when there are multiple owners with similar names.

## Demoable Units of Work

### Unit 1: Add Telephone and City Fields to Search Form

**Purpose:** Extends the owner search form to include telephone and city input fields, providing users with multiple search options beyond last name.

**Functional Requirements:**
- The system shall display a "Telephone" input field on the Find Owners form below the existing "Last Name" field
- The system shall display a "City" input field on the Find Owners form on the same row as the Telephone field
- The system shall accept telephone input with or without formatting (e.g., "(608) 555-1023" or "6085551023")
- The system shall strip all non-numeric characters from telephone input before searching
- The user shall be able to submit the search form with any combination of fields (all empty, one field, two fields, or all three fields)
- The system shall validate that telephone input, if provided, contains at least 3 digits
- The system shall validate that city input, if provided, contains at least 2 characters
- The system shall display inline validation errors if telephone or city validation fails

**Proof Artifacts:**
- Screenshot: Updated Find Owners form (`/owners/find`) showing lastName, telephone, and city fields with telephone and city on the same row demonstrates UI layout
- Screenshot: Form submission with invalid telephone (less than 3 digits) showing validation error demonstrates validation requirements
- Screenshot: Form submission with invalid city (less than 2 characters) showing validation error demonstrates validation requirements

### Unit 2: Implement Multi-Field Search Logic

**Purpose:** Implements the repository and controller logic to search owners by lastName, telephone, and/or city with AND combination logic.

**Functional Requirements:**
- The system shall search for owners whose last name starts with the provided lastName (case-insensitive) if lastName is provided
- The system shall search for owners whose telephone starts with the provided telephone digits if telephone is provided
- The system shall search for owners whose city name starts with the provided city (case-insensitive) if city is provided
- The system shall combine multiple search criteria using AND logic (results must match ALL provided fields)
- The system shall return paginated results (5 items per page) matching the search criteria
- The system shall automatically redirect to owner details if exactly one owner matches the search criteria
- The system shall display a results list if multiple owners match the search criteria
- The system shall display an empty results page with message "No owners found matching: [criteria]" if no owners match, showing which fields were searched
- The system shall preserve existing behavior when only lastName is used (backward compatibility)

**Proof Artifacts:**
- JUnit: `OwnerRepositoryTests.shouldFindOwnersByTelephone()` passes demonstrates telephone search works
- JUnit: `OwnerRepositoryTests.shouldFindOwnersByCity()` passes demonstrates city search works
- JUnit: `OwnerRepositoryTests.shouldFindOwnersByLastNameAndCity()` passes demonstrates AND combination logic
- JUnit: `OwnerControllerTests.testSearchByTelephoneReturnsResults()` passes demonstrates controller integration
- Screenshot: Search results page showing owners filtered by telephone demonstrates end-to-end telephone search
- Screenshot: Search results page showing owners filtered by city demonstrates end-to-end city search
- Screenshot: Search results page showing owners filtered by lastName + city demonstrates AND logic

### Unit 3: End-to-End Search Workflows

**Purpose:** Validates all search scenarios work correctly through browser-based testing, ensuring the feature meets user needs.

**Functional Requirements:**
- The user shall be able to search by telephone only and receive matching results
- The user shall be able to search by city only and receive matching results
- The user shall be able to search by lastName + telephone and receive results matching both criteria
- The user shall be able to search by lastName + city and receive results matching both criteria
- The user shall be able to search by telephone + city and receive results matching both criteria
- The user shall be able to search by all three fields and receive results matching all criteria
- The user shall be able to search with formatted telephone (e.g., "(608) 555-1023") and receive same results as unformatted search
- The system shall automatically redirect to owner details when exactly one owner is found
- The system shall display helpful message when no results are found specifying search criteria used

**Proof Artifacts:**
- Playwright: `owner-search.spec.ts` - test "should search owners by telephone" passes demonstrates telephone-only search
- Playwright: `owner-search.spec.ts` - test "should search owners by city" passes demonstrates city-only search
- Playwright: `owner-search.spec.ts` - test "should search owners by lastName and city" passes demonstrates combined search
- Playwright: `owner-search.spec.ts` - test "should handle formatted telephone input" passes demonstrates flexible telephone format
- Playwright: `owner-search.spec.ts` - test "should redirect when single result found" passes demonstrates auto-redirect behavior
- Playwright: `owner-search.spec.ts` - test "should show empty results message when no matches" passes demonstrates no-results handling
- Screenshot: Playwright test results showing all tests passing demonstrates complete E2E validation

## Non-Goals (Out of Scope)

1. **Internationalization**: Field labels (Telephone, City) will be hardcoded in English initially. Adding i18n support for these labels is deferred to future work.
2. **Exact telephone matching**: The search will not support exact 10-digit telephone matching or "contains" matching - only "starts with" is supported.
3. **Address field search**: The owner's address field will not be searchable in this feature.
4. **Advanced search operators**: No support for wildcards, regex, or OR logic between fields.
5. **Search history or saved searches**: No persistence of previous search queries.
6. **Fuzzy matching or typo tolerance**: Searches are exact prefix matches only (case-insensitive for text fields).

## Design Considerations

**Form Layout:**
- Maintain existing Liatrio branding styles and form structure
- Last Name field remains on first row (full width with label on left)
- Telephone and City fields appear on second row, side-by-side
- Each field should have equal width when on the same row
- Maintain consistent spacing and alignment with existing form elements
- Use existing `.liatrio-form`, `.form-control`, and `.liatrio-form-actions` CSS classes

**Visual Consistency:**
- Labels should use same styling as existing "Last name" label
- Input fields should use same styling as existing lastName input
- Validation errors should appear inline below the respective field (matching current error display pattern)
- "Find Owner" and "Add Owner" buttons remain in same position below all search fields

**Responsive Behavior:**
- On mobile devices, telephone and city fields should stack vertically if horizontal layout causes overflow

## Repository Standards

This implementation must follow the established patterns and conventions identified in the Emerald Grove Veterinary Clinic codebase:

**Coding Standards:**
- Follow strict TDD methodology (tests written before implementation)
- Maintain minimum 90% line coverage, 100% branch coverage for critical logic
- Use package-private controllers (no public modifier)
- Use constructor injection only (no @Autowired field injection)
- Follow SOLID principles and DRY
- Add Apache 2.0 license headers to all new Java files

**Testing Conventions:**
- Test classes end with `Tests` (plural), not `Test`
- Use Arrange-Act-Assert pattern in all tests
- Use BDDMockito style: `given()...willReturn()`
- Use factory methods for test data creation
- MockMvc for controller layer tests with `@WebMvcTest`
- `@DataJpaTest` for repository integration tests

**Repository Pattern:**
- Return `Optional<T>` for single results
- Return `Page<T>` for paginated results
- Use Spring Data JPA query derivation naming conventions
- Method names: `findBy[Property][Operator]` (e.g., `findByTelephoneStartingWith`)
- Accept `Pageable` parameter for pagination support

**Controller Pattern:**
- Use `@ModelAttribute` for pre-loading resources
- Use `@InitBinder` to prevent ID binding (security)
- POST-Redirect-GET pattern with flash attributes for form submissions
- Validate form input with `@Valid` and `BindingResult`
- Store view names as `VIEWS_*` constants

**Validation:**
- Use Bean Validation annotations where appropriate
- Custom validators for complex business rules
- Register validators with `@InitBinder`

**Architecture:**
- Feature-based package organization (keep changes within `owner/` package)
- Controllers call repositories directly (no service layer currently)
- Use DTOs only when needed for data transfer

## Technical Considerations

**Repository Method Implementation:**
- New repository methods will use Spring Data JPA query derivation or `@Query` annotation
- Multiple search parameters require dynamic query construction or multiple repository methods
- Consider using Spring Data JPA Specifications for flexible multi-field queries
- Database queries must use indexed columns where available (telephone and city may not be indexed)

**Input Sanitization:**
- Strip non-numeric characters from telephone input before database query
- Trim whitespace from all search inputs
- Telephone validation: minimum 3 digits after stripping formatting
- City validation: minimum 2 characters after trimming

**Backward Compatibility:**
- Existing tests for lastName-only search must continue to pass
- Empty form submission behavior (returns all owners) must be preserved
- Single-result auto-redirect behavior must be maintained
- Pagination (5 items per page) must remain consistent

**Performance Considerations:**
- Searching by telephone or city may require table scans if fields are not indexed
- Consider adding database indexes on telephone and city columns if performance testing reveals issues
- Pagination limits result set size to prevent performance degradation

## Security Considerations

**Input Validation:**
- All search inputs should be validated before database queries
- Use parameterized queries (Spring Data JPA handles this automatically)
- Prevent SQL injection through proper input sanitization

**Data Privacy:**
- Search functionality exposes telephone numbers and city information
- Ensure only authenticated/authorized users can access search functionality (if authentication is implemented in future)

**Proof Artifact Security:**
- Screenshots should not include sensitive owner data (use test data only)
- Test data in E2E tests should be clearly synthetic/fake
- Do not commit screenshots containing real client information to version control

No specific security considerations identified beyond standard input validation and SQL injection prevention.

## Success Metrics

1. **Search Accuracy**: 100% of valid search queries return correct results matching the specified criteria (validated through automated tests)
2. **Test Coverage**: Minimum 90% line coverage for new code, 100% branch coverage for search logic
3. **Performance**: Search response time remains under 2 seconds for databases with up to 10,000 owner records
4. **User Adoption**: Receptionist staff report using telephone/city search at least once per day within first week of deployment (measured through user feedback)
5. **Error Reduction**: Validation errors provide clear guidance, with users successfully completing searches within 2 attempts

## Open Questions

No open questions at this time. All requirements have been clarified through the questions round.
