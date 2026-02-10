# 02-tasks-friendly-404-pages.md

## Relevant Files

### Files to Modify

- `src/main/resources/templates/error.html` - Add conditional navigation links for 404 status code (Find Owners + Home)
- `src/main/java/org/springframework/samples/petclinic/owner/OwnerController.java` - Replace IllegalArgumentException with ResponseStatusException in findOwner() and showOwner() methods
- `src/main/java/org/springframework/samples/petclinic/owner/PetController.java` - Replace IllegalArgumentException with ResponseStatusException in findOwner() and findPet() methods
- `src/test/java/org/springframework/samples/petclinic/owner/OwnerControllerTests.java` - Add unit tests for 404 scenarios in owner endpoints
- `src/test/java/org/springframework/samples/petclinic/owner/PetControllerTests.java` - Add unit tests for 404 scenarios in pet endpoints

### Files to Create

- `e2e-tests/tests/owner-404.spec.ts` - Playwright E2E test for owner not found scenarios
- `e2e-tests/tests/pet-404.spec.ts` - Playwright E2E test for pet not found scenarios

### Notes

- Follow **strict TDD methodology**: Write failing tests (RED), implement minimal code to pass (GREEN), then refactor
- Use `@WebMvcTest` for controller unit tests with MockMvc
- Mock repository responses using Mockito's `given()...willReturn()` pattern
- Apply Spring Java Format after code changes: `./mvnw spring-javaformat:apply`
- Run tests frequently: `./mvnw test -Dtest=OwnerControllerTests` or `./mvnw test -Dtest=PetControllerTests`
- Playwright tests should follow existing patterns in `e2e-tests/tests/` directory
- Use `ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found")` for 404 errors
- Ensure minimum 90% code coverage for modified controller methods

## Tasks

### [x] 1.0 Error Template Foundation - Add 404 Navigation Links

#### 1.0 Proof Artifact(s)

- Screenshot: Error page accessed via `/oups` (existing crash endpoint) shows "Find Owners" and "Home" navigation links demonstrates template changes
- Screenshot: Error page with 404 status shows proper Liatrio branding and navigation options demonstrates visual consistency
- Manual Test: Click "Find Owners" link navigates to `/owners/find` demonstrates navigation functionality
- Manual Test: Click "Home" link navigates to `/` demonstrates home navigation

#### 1.0 Tasks

- [x] 1.1 Review existing `error.html` template structure and Thymeleaf conditional blocks (`th:switch="${status}"`)
- [x] 1.2 Add conditional block for 404 status that includes "Find Owners" link (`/owners/find`) and "Home" link (`/`)
- [x] 1.3 Ensure navigation links use appropriate Thymeleaf URL syntax (`th:href="@{/owners/find}"`)
- [x] 1.4 Maintain existing Liatrio branding classes (`liatrio-section`, `liatrio-error-card`) and styling
- [x] 1.5 Apply Spring Java Format to modified template (if applicable)
- [x] 1.6 Start application and navigate to `/oups` to manually verify error page renders with navigation links
- [x] 1.7 Click "Find Owners" link and verify it navigates to `/owners/find`
- [x] 1.8 Click "Home" link and verify it navigates to `/`
- [x] 1.9 Take screenshots of error page showing navigation links for proof artifacts

### [x] 2.0 Owner 404 Handling - TDD Implementation

#### 2.0 Proof Artifact(s)

- Test: `OwnerControllerTests.testShowOwnerNotFound()` passes (RED → GREEN) demonstrates TDD workflow
- Test: `OwnerControllerTests.testFindOwnerNotFound()` passes (RED → GREEN) demonstrates @ModelAttribute 404 handling
- Unit Test Output: `./mvnw test -Dtest=OwnerControllerTests` shows all tests passing demonstrates controller changes don't break existing functionality
- Screenshot: Navigate to `/owners/99999` shows "Owner not found" error page with navigation links demonstrates end-to-end owner 404 handling
- HTTP Response: GET `/owners/99999` returns 404 status code demonstrates proper HTTP semantics

#### 2.0 Tasks

- [x] 2.1 **RED Phase**: Open `OwnerControllerTests.java` and write failing test `testShowOwnerNotFound()` that mocks repository returning `Optional.empty()` and expects 404 status
- [x] 2.2 **RED Phase**: Write failing test `testFindOwnerNotFoundInModelAttribute()` that tests the `@ModelAttribute` method with non-existent owner ID
- [x] 2.3 **RED Phase**: Run tests with `./mvnw test -Dtest=OwnerControllerTests` and verify both new tests fail (currently throws IllegalArgumentException, not 404)
- [x] 2.4 **GREEN Phase**: Open `OwnerController.java` and update `showOwner()` method (line ~170) to throw `ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found")` instead of IllegalArgumentException
- [x] 2.5 **GREEN Phase**: Update `findOwner()` method (line ~67) to throw `ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found")` instead of IllegalArgumentException
- [x] 2.6 **GREEN Phase**: Run tests with `./mvnw test -Dtest=OwnerControllerTests` and verify all tests pass (including new 404 tests)
- [x] 2.7 **REFACTOR Phase**: Apply Spring Java Format with `./mvnw spring-javaformat:apply`
- [x] 2.8 **REFACTOR Phase**: Run full test suite with `./mvnw test` to ensure no regressions in other tests
- [x] 2.9 **Manual Verification**: Start application and navigate to `/owners/99999` (non-existent owner)
- [x] 2.10 **Manual Verification**: Verify page shows "Owner not found" message and returns 404 status (check browser dev tools Network tab)
- [x] 2.11 **Manual Verification**: Take screenshot of 404 error page for proof artifacts

### [ ] 3.0 Pet 404 Handling - TDD Implementation

#### 3.0 Proof Artifact(s)

- Test: `PetControllerTests.testFindPetNotFound()` passes (RED → GREEN) demonstrates TDD workflow for pet lookup
- Test: `PetControllerTests.testEditPetNotFound()` passes (RED → GREEN) demonstrates pet edit 404 handling
- Unit Test Output: `./mvnw test -Dtest=PetControllerTests` shows all tests passing demonstrates controller changes don't break existing functionality
- Screenshot: Navigate to `/owners/1/pets/99999` shows "Pet not found" error page with navigation links demonstrates end-to-end pet 404 handling
- HTTP Response: GET `/owners/1/pets/99999` returns 404 status code demonstrates proper HTTP semantics

#### 3.0 Tasks

- [ ] 3.1 **RED Phase**: Open `PetControllerTests.java` and write failing test `testFindPetNotFound()` that mocks owner existing but `owner.getPet(petId)` returning null, expects 404 status
- [ ] 3.2 **RED Phase**: Write failing test `testEditPetNotFound()` that tests pet edit endpoint with non-existent pet ID
- [ ] 3.3 **RED Phase**: Run tests with `./mvnw test -Dtest=PetControllerTests` and verify new tests fail appropriately
- [ ] 3.4 **GREEN Phase**: Open `PetController.java` and update `findOwner()` method (line ~69) to throw `ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found")` instead of IllegalArgumentException
- [ ] 3.5 **GREEN Phase**: Update `findPet()` method (line ~83) - after `owner.getPet(petId)` call, add null check and throw `ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found")` if pet is null
- [ ] 3.6 **GREEN Phase**: Run tests with `./mvnw test -Dtest=PetControllerTests` and verify all tests pass (including new 404 tests)
- [ ] 3.7 **REFACTOR Phase**: Apply Spring Java Format with `./mvnw spring-javaformat:apply`
- [ ] 3.8 **REFACTOR Phase**: Run full test suite with `./mvnw test` to ensure no regressions
- [ ] 3.9 **Manual Verification**: Start application and navigate to `/owners/1/pets/99999` (existing owner, non-existent pet)
- [ ] 3.10 **Manual Verification**: Verify page shows "Pet not found" message and returns 404 status
- [ ] 3.11 **Manual Verification**: Take screenshot of 404 error page for proof artifacts

### [ ] 4.0 End-to-End Validation - Playwright Tests

#### 4.0 Proof Artifact(s)

- Test: Playwright test `owner-404.spec.ts` passes demonstrates automated E2E verification for owner not found
- Test: Playwright test `pet-404.spec.ts` passes demonstrates automated E2E verification for pet not found
- Playwright Report: HTML report shows all 404 scenarios passing demonstrates comprehensive E2E coverage
- Screenshot: Playwright screenshot artifacts from test runs demonstrate visual validation
- CLI Output: `cd e2e-tests && npm test -- --grep "404"` shows all 404 tests passing demonstrates CI-ready validation

#### 4.0 Tasks

- [ ] 4.1 Create `e2e-tests/tests/owner-404.spec.ts` following existing Playwright test patterns
- [ ] 4.2 In `owner-404.spec.ts`, write test that navigates to `/owners/99999` and asserts response status is 404
- [ ] 4.3 In `owner-404.spec.ts`, assert page contains text "Owner not found" (or appropriate error message)
- [ ] 4.4 In `owner-404.spec.ts`, assert page contains "Find Owners" link and verify it's clickable
- [ ] 4.5 Create `e2e-tests/tests/pet-404.spec.ts` following existing Playwright test patterns
- [ ] 4.6 In `pet-404.spec.ts`, write test that navigates to `/owners/1/pets/99999` and asserts response status is 404
- [ ] 4.7 In `pet-404.spec.ts`, assert page contains text "Pet not found" (or appropriate error message)
- [ ] 4.8 In `pet-404.spec.ts`, assert page contains "Find Owners" link and verify navigation
- [ ] 4.9 Run Playwright tests locally with `cd e2e-tests && npm test -- --grep "404"` and verify all pass
- [ ] 4.10 Generate Playwright HTML report with `cd e2e-tests && npm run report`
- [ ] 4.11 Review Playwright screenshot artifacts captured during test runs
- [ ] 4.12 Run full Playwright test suite with `cd e2e-tests && npm test` to ensure no regressions
- [ ] 4.13 Verify test results and HTML report are available for proof artifacts
