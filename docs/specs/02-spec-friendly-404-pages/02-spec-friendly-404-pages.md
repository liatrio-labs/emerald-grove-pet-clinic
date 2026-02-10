# 02-spec-friendly-404-pages.md

## Introduction/Overview

Currently, when users attempt to access a non-existent owner or pet (e.g., by manually entering an invalid ID in the URL), the application throws an `IllegalArgumentException` which results in a generic error page, potentially exposing stack traces or internal exception details. This specification defines a user-friendly 404 error handling system that provides clear feedback and navigation options when owners or pets are not found, improving the overall user experience and security posture of the application.

## Goals

1. Replace exception-based error handling with proper HTTP 404 responses for missing owners and pets
2. Provide user-friendly error messages without exposing internal implementation details or stack traces
3. Implement clear navigation paths from error pages back to functional parts of the application
4. Ensure both unit tests (MockMvc) and end-to-end tests (Playwright) validate the 404 behavior
5. Maintain consistency with existing Liatrio branding and error page styling

## User Stories

1. **As a clinic staff member**, I want to see a friendly error message when I enter an incorrect owner ID in the URL, so that I understand what went wrong and can easily navigate back to search for the correct owner.

2. **As a clinic staff member**, I want to see a clear error message when I try to access a pet that doesn't exist, so that I can quickly return to finding the correct information without confusion.

3. **As a system administrator**, I want 404 errors to return proper HTTP status codes and avoid exposing stack traces, so that the application maintains security best practices and proper HTTP semantics.

## Demoable Units of Work

### Unit 1: Owner 404 Handling

**Purpose:** Implement friendly 404 error handling when an owner is not found, providing clear feedback and navigation options for clinic staff.

**Functional Requirements:**
- The system shall return HTTP 404 status code when a requested owner ID does not exist in the database
- The system shall display a user-friendly error page with the message "Owner not found" (without exposing the requested ID or internal details)
- The system shall provide a "Find Owners" link that navigates to `/owners/find`
- The system shall provide a "Home" link that navigates to the application home page (`/`)
- The system shall use Spring's `ResponseStatusException` with `HttpStatus.NOT_FOUND` when owner lookup fails
- The system shall modify existing `error.html` template to include navigation links for 404 status codes
- The user shall not see stack traces, exception class names, or internal error details on the 404 page

**Proof Artifacts:**
- **Unit Test**: `OwnerControllerTests` includes test method that mocks missing owner and asserts HTTP 404 status and error view demonstrates proper controller behavior
- **Playwright E2E Test**: Navigate to `/owners/99999` (non-existent ID) and verify page returns 404 status, shows "Owner not found" message, and contains "Find Owners" link demonstrates end-to-end 404 handling
- **Screenshot**: Error page for missing owner shows Liatrio-branded 404 page with navigation links demonstrates user-facing result

### Unit 2: Pet 404 Handling

**Purpose:** Implement friendly 404 error handling when a pet is not found for an owner, using the same error page pattern established for owners.

**Functional Requirements:**
- The system shall return HTTP 404 status code when a requested pet ID does not exist for a given owner
- The system shall display the same user-friendly error page with the message "Pet not found"
- The system shall provide the same "Find Owners" and "Home" navigation links as owner 404 errors
- The system shall use Spring's `ResponseStatusException` with `HttpStatus.NOT_FOUND` when pet lookup fails
- The system shall handle the case where the owner exists but the pet does not (e.g., `/owners/1/pets/999`)
- The user shall not see stack traces, exception class names, or internal error details on the 404 page

**Proof Artifacts:**
- **Unit Test**: `PetControllerTests` includes test method that mocks missing pet and asserts HTTP 404 status and error view demonstrates proper controller behavior
- **Playwright E2E Test**: Navigate to `/owners/1/pets/99999` (existing owner, non-existent pet) and verify 404 status and "Pet not found" message demonstrates pet-specific 404 handling
- **Screenshot**: Error page for missing pet shows consistent 404 page with navigation links demonstrates unified error experience

## Non-Goals (Out of Scope)

1. **Visit 404 handling**: This spec focuses only on owners and pets. Visit resource 404 handling is explicitly out of scope.
2. **Veterinarian 404 handling**: Vet resource not-found errors are not included in this implementation.
3. **General 404 handler**: This is not a comprehensive 404 system for all resources; only owner and pet endpoints are addressed.
4. **Custom exception classes**: We will use Spring's built-in `ResponseStatusException` rather than creating custom exception hierarchies.
5. **Advanced logging or monitoring**: No special logging, alerting, or monitoring infrastructure will be added beyond Spring Boot's default logging.
6. **Detailed error messages with IDs**: Error messages will be minimal ("Owner not found") and will not include the requested ID or detailed explanations.
7. **Internationalization (i18n)**: While the existing error page supports i18n, adding new translations for 404-specific messages is out of scope.

## Design Considerations

**Error Page Design:**
- Modify existing `src/main/resources/templates/error.html` Thymeleaf template
- Add navigation links specifically for 404 status code
- Maintain existing Liatrio branding, styling, and visual elements (pet image, error card layout)
- Use existing CSS classes (`liatrio-section`, `liatrio-error-card`, etc.)
- Ensure responsive design principles are maintained

**Navigation Elements:**
- "Find Owners" button/link: navigates to `/owners/find`
- "Home" button/link: navigates to `/` (welcome page)
- Position navigation links prominently below the error message
- Use consistent button styling from existing UI components

**Message Display:**
- Generic messages: "Owner not found" or "Pet not found"
- No exposure of requested IDs, database details, or technical information
- Maintain existing Thymeleaf i18n structure for future translation support

## Repository Standards

**Coding Standards:**
- Follow Spring Boot best practices for exception handling
- Use Spring Java Format for code formatting (`./mvnw spring-javaformat:apply`)
- Follow existing controller patterns and conventions from `OwnerController` and `PetController`
- Maintain consistent use of `Optional<T>` for repository lookups
- Use constructor-based dependency injection (already established pattern)

**Testing Standards:**
- Write tests before implementation (TDD Red-Green-Refactor cycle)
- Use `@WebMvcTest` for controller unit tests with MockMvc
- Mock repository responses using Mockito (`given()...willReturn()` pattern)
- Use Hamcrest matchers for assertions (`is()`, `hasProperty()`, etc.)
- Playwright tests should follow existing E2E test patterns in `e2e-tests/` directory
- Maintain minimum 90% code coverage for new controller changes

**Architectural Patterns:**
- Controllers handle HTTP concerns and return views
- Repository layer handles data access (existing pattern with `OwnerRepository`)
- Use `ResponseStatusException` at controller layer (no service layer needed for this feature)
- Thymeleaf templates for server-side rendering
- Follow existing package structure: `org.springframework.samples.petclinic.owner`

**Commit Conventions:**
- Use conventional commits format: `feat:`, `test:`, `fix:`, `refactor:`
- Reference this spec in commit messages: `[spec-02]`
- Include co-author attribution as per project standards

## Technical Considerations

**Exception Handling Implementation:**
- Replace `IllegalArgumentException` throws with `ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found")`
- Use `orElseThrow()` on `Optional<Owner>` and `Optional<Pet>` results
- Spring Boot's error handling will automatically route to `error.html` template
- No need for `@ControllerAdvice` or custom exception classes

**Controller Changes Required:**
- **OwnerController**:
  - `findOwner()` method (line 65-70): Change exception type to `ResponseStatusException`
  - `showOwner()` method (line 167-174): Change exception type to `ResponseStatusException`
- **PetController**:
  - `findOwner()` method (line 67-72): Change exception type to `ResponseStatusException`
  - `findPet()` method (line 75-86): Add null check for `owner.getPet(petId)` and throw `ResponseStatusException` if null

**Template Changes:**
- **error.html**: Add conditional rendering for 404 status that displays:
  - Existing error message structure
  - Two navigation buttons/links: "Find Owners" and "Home"
  - Maintain existing Thymeleaf conditionals for different status codes (404, 500, etc.)

**Testing Strategy:**
- **Unit Tests**: Mock repository to return `Optional.empty()`, perform GET request, assert 404 status
- **E2E Tests**: Use Playwright to navigate to invalid URLs, verify HTTP status code and page content
- **Coverage**: Ensure both success and failure paths are tested for affected controller methods

## Security Considerations

**Information Disclosure Prevention:**
- Error messages must not expose:
  - Requested resource IDs (avoid "Owner #123 not found")
  - Database structure or internal implementation details
  - Stack traces or exception class names
  - SQL queries or repository method names
- Use Spring Boot's default error handling which sanitizes exception details in production mode

**Proof Artifact Security:**
- Screenshots used as proof artifacts are safe to commit (no sensitive data)
- Playwright test results and reports are safe to store in repository
- Ensure test data uses non-production IDs and data

**Production Considerations:**
- Spring Boot's `server.error.include-stacktrace=never` should remain in production configuration
- Default Spring Security settings (if enabled) should handle authentication before 404 errors
- No API keys, tokens, or credentials are involved in this feature

## Success Metrics

1. **User Experience**: Users navigating to invalid owner or pet URLs see a friendly error page with clear next steps (validated via E2E tests)
2. **HTTP Compliance**: All missing resource requests return proper HTTP 404 status codes (validated via unit and E2E tests)
3. **Security**: Zero instances of stack trace or internal implementation details visible on 404 pages (validated via manual review and E2E tests)
4. **Test Coverage**: Minimum 90% code coverage on modified controller methods (validated via JaCoCo report)
5. **Consistency**: 404 error pages maintain Liatrio branding and match existing error page styling (validated via visual review of screenshots)

## Open Questions

No open questions at this time. All implementation details have been clarified through the questions round.
