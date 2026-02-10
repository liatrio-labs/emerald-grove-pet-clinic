# 02-tasks-find-owners-by-telephone-city.md

## Relevant Files

- `src/main/java/org/springframework/samples/petclinic/owner/OwnerRepository.java` - Add new repository methods for telephone and city search with Spring Data JPA query derivation
- `src/main/java/org/springframework/samples/petclinic/owner/OwnerController.java` - Update `processFindForm()` method to handle telephone and city parameters with validation
- `src/main/resources/templates/owners/findOwners.html` - Add telephone and city input fields to search form with proper layout
- `src/main/resources/templates/owners/ownersList.html` - Update empty results message to show search criteria (may need modification)
- `src/test/java/org/springframework/samples/petclinic/service/ClinicServiceTests.java` - Add repository integration tests for new search methods
- `src/test/java/org/springframework/samples/petclinic/owner/OwnerControllerTests.java` - Add controller tests for multi-field search scenarios
- `e2e-tests/tests/features/owner-search.spec.ts` - New Playwright E2E test file for comprehensive search workflows
- `e2e-tests/pages/owner-page.ts` - Update page object to support telephone and city search methods (if needed)

### Notes

- Unit tests should be added to existing test files where appropriate (e.g., `ClinicServiceTests.java` for repository, `OwnerControllerTests.java` for controller)
- Use the repository's established testing patterns: `./mvnw test` for JUnit tests, `cd e2e-tests && npm test` for Playwright
- Follow strict TDD: write failing tests before implementing functionality (RED → GREEN → REFACTOR)
- Maintain minimum 90% line coverage, verify with `./mvnw jacoco:report`
- Use package-private access for controllers, constructor injection for dependencies
- Follow Spring Data JPA naming conventions for repository methods: `findBy[Property][Operator]`
- All commits should reference issue #3 and follow conventional commit format

## Tasks

### [x] 1.0 TDD: Repository Layer - Add Telephone and City Search Methods

#### 1.0 Proof Artifact(s)

- JUnit: `OwnerRepositoryTests.shouldFindOwnersByTelephone()` passes demonstrates telephone search repository method works
- JUnit: `OwnerRepositoryTests.shouldFindOwnersByCity()` passes demonstrates city search repository method works
- JUnit: `OwnerRepositoryTests.shouldFindOwnersByMultipleCriteria()` passes demonstrates AND combination logic in repository
- JUnit: All existing `OwnerRepositoryTests` still pass demonstrates backward compatibility maintained
- Screenshot: JaCoCo coverage report showing >90% coverage for new repository methods demonstrates test coverage requirements met

#### 1.0 Tasks

- [x] 1.1 RED: Write failing test `shouldFindOwnersByTelephoneStartingWith()` in `ClinicServiceTests.java` that searches for owners by telephone prefix (e.g., "608" finds "6085551023")
- [x] 1.2 GREEN: Implement `findByTelephoneStartingWith(String telephone, Pageable pageable)` method in `OwnerRepository.java` using Spring Data JPA query derivation to make test pass
- [x] 1.3 RED: Write failing test `shouldFindOwnersByCityStartingWithIgnoreCase()` in `ClinicServiceTests.java` that searches for owners by city prefix (case-insensitive)
- [x] 1.4 GREEN: Implement `findByCityStartingWithIgnoreCase(String city, Pageable pageable)` method in `OwnerRepository.java` to make test pass
- [x] 1.5 RED: Write failing test `shouldFindOwnersByLastNameAndCity()` that searches with both lastName and city (AND logic)
- [x] 1.6 GREEN: Implement method to support multi-field search (consider using `@Query` annotation or JPA Specifications for dynamic AND logic)
- [x] 1.7 RED: Write failing test `shouldFindOwnersByLastNameAndTelephone()` and `shouldFindOwnersByAllThreeFields()` for comprehensive combinations
- [x] 1.8 GREEN: Implement or extend repository method to support all field combinations with AND logic
- [x] 1.9 REFACTOR: Review repository methods for duplication, consider consolidating into single flexible search method if appropriate
- [x] 1.10 Verify all existing repository tests still pass (backward compatibility check)
- [x] 1.11 Run `./mvnw test -Dtest=ClinicServiceTests` and confirm all tests pass

### [ ] 2.0 TDD: Controller Layer - Update Search Handler with Multi-Field Support

#### 2.0 Proof Artifact(s)

- JUnit: `OwnerControllerTests.testSearchByTelephoneReturnsResults()` passes demonstrates controller handles telephone search
- JUnit: `OwnerControllerTests.testSearchByCityReturnsResults()` passes demonstrates controller handles city search
- JUnit: `OwnerControllerTests.testSearchByMultipleFieldsReturnsResults()` passes demonstrates controller handles combined search
- JUnit: `OwnerControllerTests.testSearchWithInvalidTelephoneShowsError()` passes demonstrates validation error handling
- JUnit: `OwnerControllerTests.testSearchWithInvalidCityShowsError()` passes demonstrates validation error handling
- JUnit: `OwnerControllerTests.testEmptySearchReturnsAllOwners()` passes demonstrates backward compatibility for empty search
- JUnit: All existing `OwnerControllerTests` still pass demonstrates backward compatibility maintained
- Screenshot: JaCoCo coverage report showing >90% coverage for updated controller method demonstrates test coverage requirements met

#### 2.0 Tasks

- [ ] 2.1 RED: Write failing test `testSearchByTelephoneOnly()` in `OwnerControllerTests.java` using MockMvc to submit form with only telephone field filled
- [ ] 2.2 RED: Write failing test `testSearchByCityOnly()` using MockMvc to submit form with only city field filled
- [ ] 2.3 RED: Write failing test `testSearchByLastNameAndCity()` for combined search
- [ ] 2.4 RED: Write failing test `testTelephoneValidationFailsWithLessThan3Digits()` that expects validation error when telephone has <3 digits
- [ ] 2.5 RED: Write failing test `testCityValidationFailsWithLessThan2Characters()` that expects validation error when city has <2 characters
- [ ] 2.6 RED: Write failing test `testTelephoneFormattingIsStripped()` that submits "(608) 555-1023" and verifies it's converted to "6085551023" for search
- [ ] 2.7 GREEN: Update `processFindForm()` method in `OwnerController.java` to accept telephone and city parameters from Owner object
- [ ] 2.8 GREEN: Add input sanitization logic to strip non-numeric characters from telephone input
- [ ] 2.9 GREEN: Add validation logic for telephone (min 3 digits) and city (min 2 characters), use `BindingResult` to add errors
- [ ] 2.10 GREEN: Update search logic to call appropriate repository method based on which fields are filled (lastName, telephone, city, or combinations)
- [ ] 2.11 GREEN: Update empty results handling to build descriptive message showing which criteria were searched
- [ ] 2.12 REFACTOR: Extract telephone sanitization to a helper method if appropriate
- [ ] 2.13 REFACTOR: Review controller method for complexity, consider extracting search logic to private methods
- [ ] 2.14 Verify all existing controller tests still pass (backward compatibility check)
- [ ] 2.15 Run `./mvnw test -Dtest=OwnerControllerTests` and confirm all tests pass

### [ ] 3.0 View Layer - Add Telephone and City Input Fields with Validation

#### 3.0 Proof Artifact(s)

- Screenshot: `/owners/find` page showing lastName, telephone, and city fields with telephone and city on same row demonstrates UI layout implementation
- Screenshot: Form submission with telephone "12" (less than 3 digits) showing inline validation error demonstrates telephone validation
- Screenshot: Form submission with city "M" (less than 2 characters) showing inline validation error demonstrates city validation
- Screenshot: Form with formatted telephone "(608) 555-1023" submitted successfully demonstrates flexible input handling
- Screenshot: Browser DevTools showing Liatrio CSS classes applied to new fields demonstrates styling consistency

#### 3.0 Tasks

- [ ] 3.1 Update `findOwners.html` to add a new form group for telephone field below lastName field
- [ ] 3.2 Add telephone input field with `th:field="*{telephone}"` binding, label "Telephone", and placeholder text
- [ ] 3.3 Add city input field on same row as telephone with `th:field="*{city}"` binding, label "City"
- [ ] 3.4 Apply proper CSS classes to maintain Liatrio styling: `.form-control`, `.liatrio-form`, `.control-group`
- [ ] 3.5 Ensure telephone and city fields are side-by-side using appropriate column classes (e.g., `col-sm-5` for each)
- [ ] 3.6 Add validation error display for telephone field using Thymeleaf `th:if="${#fields.hasErrors('telephone')}"` pattern
- [ ] 3.7 Add validation error display for city field using same pattern as telephone
- [ ] 3.8 Test form layout in browser to verify fields appear correctly and are responsive
- [ ] 3.9 Manually test form submission with invalid telephone (e.g., "12") to verify validation error appears inline
- [ ] 3.10 Manually test form submission with invalid city (e.g., "M") to verify validation error appears inline
- [ ] 3.11 Test with formatted telephone input (e.g., "(608) 555-1023") to verify it works correctly
- [ ] 3.12 Take screenshots of form with new fields for proof artifacts
- [ ] 3.13 Verify form maintains existing lastName functionality and doesn't break backward compatibility

### [ ] 4.0 E2E Testing - Comprehensive Search Workflow Validation

#### 4.0 Proof Artifact(s)

- Playwright: `owner-search.spec.ts` - test "should search owners by telephone only" passes demonstrates telephone-only search workflow
- Playwright: `owner-search.spec.ts` - test "should search owners by city only" passes demonstrates city-only search workflow
- Playwright: `owner-search.spec.ts` - test "should search owners by lastName and city" passes demonstrates combined search workflow
- Playwright: `owner-search.spec.ts` - test "should search owners by lastName and telephone" passes demonstrates combined search workflow
- Playwright: `owner-search.spec.ts` - test "should handle formatted telephone input" passes demonstrates flexible telephone format handling
- Playwright: `owner-search.spec.ts` - test "should redirect when single result found" passes demonstrates auto-redirect behavior
- Playwright: `owner-search.spec.ts` - test "should show empty results with criteria message" passes demonstrates empty results handling
- Screenshot: Playwright HTML report showing all 7 tests passing demonstrates complete E2E validation

#### 4.0 Tasks

- [ ] 4.1 Create new file `e2e-tests/tests/features/owner-search.spec.ts` with proper imports and test structure
- [ ] 4.2 Write test "should search owners by telephone only" that fills telephone field, submits, and verifies results contain expected owner
- [ ] 4.3 Write test "should search owners by city only" that fills city field, submits, and verifies results contain expected owners from that city
- [ ] 4.4 Write test "should search owners by lastName and city" that fills both fields and verifies results match both criteria (AND logic)
- [ ] 4.5 Write test "should search owners by lastName and telephone" that fills both fields and verifies results
- [ ] 4.6 Write test "should search owners by all three fields" that fills lastName, telephone, and city, then verifies results match all criteria
- [ ] 4.7 Write test "should handle formatted telephone input" that enters "(608) 555-1023" and verifies same results as "6085551023"
- [ ] 4.8 Write test "should redirect when single result found" that searches for unique owner and verifies automatic redirect to owner details page
- [ ] 4.9 Write test "should show empty results with criteria message" that searches for non-existent data and verifies message shows searched criteria
- [ ] 4.10 Add page object methods to `owner-page.ts` if needed to support telephone and city search (e.g., `searchByTelephone()`, `searchByCity()`)
- [ ] 4.11 Run `cd e2e-tests && npm test -- owner-search.spec.ts` to execute all tests
- [ ] 4.12 Verify all 7+ tests pass and take screenshot of Playwright HTML report
- [ ] 4.13 Review test output for any flaky tests or timing issues, add explicit waits if needed

### [ ] 5.0 Integration Verification and Documentation

#### 5.0 Proof Artifact(s)

- CLI: `./mvnw test` output showing all tests pass demonstrates full test suite passes
- CLI: `./mvnw jacoco:report` output showing overall >90% coverage demonstrates coverage requirements met
- Screenshot: Manual test of search form with real data showing all search combinations work demonstrates feature works end-to-end
- Screenshot: Search results page showing "No owners found matching: lastName='Smith', city='Seattle'" demonstrates descriptive empty results message
- Git: Commit history showing proper commit messages with issue reference (#3) demonstrates proper version control practices

#### 5.0 Tasks

- [ ] 5.1 Run full test suite: `./mvnw test` and verify all tests pass (JUnit unit + integration tests)
- [ ] 5.2 Run E2E test suite: `cd e2e-tests && npm test` and verify all Playwright tests pass
- [ ] 5.3 Generate coverage report: `./mvnw jacoco:report` and verify overall coverage >90%
- [ ] 5.4 Take screenshot of JaCoCo coverage summary showing coverage percentage
- [ ] 5.5 Manually test search form in browser: Start app with `./mvnw spring-boot:run`
- [ ] 5.6 Manually test search by telephone only (e.g., "608") and verify results
- [ ] 5.7 Manually test search by city only (e.g., "Madison") and verify results
- [ ] 5.8 Manually test search by lastName + city and verify AND logic works correctly
- [ ] 5.9 Manually test search by lastName + telephone and verify results
- [ ] 5.10 Manually test search with all three fields and verify results
- [ ] 5.11 Manually test search with non-existent criteria and verify descriptive empty results message appears
- [ ] 5.12 Take screenshots of successful searches for proof artifacts
- [ ] 5.13 Review all code changes for compliance with repository standards (TDD, package-private, constructor injection, etc.)
- [ ] 5.14 Ensure all new code has Apache 2.0 license headers
- [ ] 5.15 Run pre-commit hooks (if configured) or code quality checks
- [ ] 5.16 Review git commit history to ensure proper commit messages with issue #3 reference
- [ ] 5.17 Prepare summary of changes: files modified, tests added, coverage achieved, proof artifacts collected
