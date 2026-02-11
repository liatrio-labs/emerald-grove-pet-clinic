# 03-tasks-vet-specialty-filter.md

## Relevant Files

### Files to Modify

- `src/main/java/org/springframework/samples/petclinic/vet/VetController.java` - Add filter parameter handling, session management, and filter logic to showVetList() method
- `src/main/java/org/springframework/samples/petclinic/vet/VetRepository.java` - Add custom query methods for filtering vets by specialty with AND logic
- `src/main/resources/templates/vets/vetList.html` - Add filter dropdown component above vet table and visual feedback text
- `src/main/resources/messages/messages.properties` - Add filter message keys (filter labels, empty state messages)
- `src/main/resources/messages/messages_en.properties` - Add English language labels for filter (All, Radiology, Surgery, Dentistry, etc.)
- `src/main/resources/messages/messages_es.properties` - Add Spanish language labels for filter (Todos, Radiología, Cirugía, Odontología, etc.)
- `src/main/resources/messages/messages_de.properties` - Add German language labels for filter (Alle, Radiologie, Chirurgie, Zahnmedizin, etc.)

### Files to Create

- `src/test/java/org/springframework/samples/petclinic/vet/VetSpecialtyFilterTests.java` - Unit tests for filter component rendering and behavior using @WebMvcTest and MockMvc
- `e2e-tests/tests/vet-specialty-filter.spec.ts` - Playwright E2E tests for complete filter workflow and session persistence

### Notes

- Follow strict TDD methodology: RED (write failing test) → GREEN (implement) → REFACTOR (improve)
- Use JUnit 5 with @WebMvcTest for controller/view tests, MockMvc for web layer testing
- Use Playwright test patterns from existing E2E tests in `e2e-tests/tests/` directory
- Run tests with `./mvnw test` (for unit tests) and `cd e2e-tests && npm test` (for E2E tests)
- Thymeleaf conventions: Use `th:*` attributes, `#{}` for i18n messages, `@{}` for URLs
- Message key naming: Use camelCase (e.g., `filter.specialty.all`, `filter.specialty.radiology`)
- Spring Data JPA: Use custom `@Query` annotation with JPQL for AND logic filtering
- Git workflow: NEVER commit to main - use feature branch `feature/vet-specialty-filter` and create PR
- Follow conventional commits format for git commits (e.g., `feat(vet): add specialty filter dropdown`)

## Tasks

### [x] 1.0 Setup: Add Filter Message Keys and Create Git Branch

#### 1.0 Proof Artifact(s)

- Diff: Message files (`messages.properties`, `messages_en.properties`, `messages_es.properties`, `messages_de.properties`) showing new filter keys demonstrates setup completion
- Build: Application builds successfully demonstrates no syntax errors in message files
- CLI: `git branch` output showing `feature/vet-specialty-filter` demonstrates feature branch created
- CLI: `./mvnw spring-boot:run` starts application without errors demonstrates configuration is valid

#### 1.0 Tasks

- [x] 1.1 Create feature branch `feature/vet-specialty-filter` from main branch using `git checkout -b feature/vet-specialty-filter`
- [x] 1.2 Add filter message keys to `messages.properties`: `filter.specialty.label=Specialty Filter`, `filter.specialty.all=All`, `filter.specialty.radiology=Radiology`, `filter.specialty.surgery=Surgery`, `filter.specialty.dentistry=Dentistry`, `filter.showing=Showing vets with specialty:`, `filter.noResults=No veterinarians found for`
- [x] 1.3 Add English filter labels to `messages_en.properties`: `filter.specialty.label=Specialty Filter`, `filter.specialty.all=All`, `filter.specialty.radiology=Radiology`, `filter.specialty.surgery=Surgery`, `filter.specialty.dentistry=Dentistry`, `filter.showing=Showing vets with specialty:`, `filter.noResults=No veterinarians found for`
- [x] 1.4 Add Spanish filter labels to `messages_es.properties`: `filter.specialty.label=Filtro de Especialidad`, `filter.specialty.all=Todos`, `filter.specialty.radiology=Radiología`, `filter.specialty.surgery=Cirugía`, `filter.specialty.dentistry=Odontología`, `filter.showing=Mostrando veterinarios con especialidad:`, `filter.noResults=No se encontraron veterinarios para`
- [x] 1.5 Add German filter labels to `messages_de.properties`: `filter.specialty.label=Fachgebiet Filter`, `filter.specialty.all=Alle`, `filter.specialty.radiology=Radiologie`, `filter.specialty.surgery=Chirurgie`, `filter.specialty.dentistry=Zahnmedizin`, `filter.showing=Anzeige von Tierärzten mit Fachgebiet:`, `filter.noResults=Keine Tierärzte gefunden für`
- [x] 1.6 Run `./mvnw clean compile` to verify no syntax errors in message files
- [x] 1.7 Run `./mvnw spring-boot:run` and verify application starts without errors
- [x] 1.8 Capture git diff showing the added message keys using `git diff`
- [x] 1.9 Verify feature branch is active with `git branch` (should show `* feature/vet-specialty-filter`)

### [x] 2.0 RED: Write Failing Unit Tests for Specialty Filter

#### 2.0 Proof Artifact(s)

- Test: `VetSpecialtyFilterTests.java` fails with expected error demonstrates tests are written correctly
- CLI: `./mvnw test -Dtest=VetSpecialtyFilterTests` output showing test failures demonstrates RED phase completion
- Coverage: JaCoCo report showing new test methods demonstrates test infrastructure is ready

#### 2.0 Tasks

- [x] 2.1 Create `src/test/java/org/springframework/samples/petclinic/vet/VetSpecialtyFilterTests.java` test class
- [x] 2.2 Set up test class with `@WebMvcTest(VetController.class)` annotation and MockMvc configuration (inject MockMvc and mock VetRepository with @MockitoBean)
- [x] 2.3 Write test `testFilterDropdownIsPresent()` - verify filter dropdown element exists in the HTML response using MockMvc and CSS selectors (check for element with id or class containing "filter")
- [x] 2.4 Write test `testFilterBySpecialty()` - verify single specialty filtering by passing `?filter=specialty:surgery` parameter and checking that only surgery vets are returned
- [x] 2.5 Write test `testFilterByMultipleSpecialties()` - verify AND logic by passing `?filter=specialty:surgery,dentistry` and checking that only vets with BOTH specialties are returned
- [x] 2.6 Write test `testFilterWithPagination()` - verify pagination integration by passing both `?page=2&filter=specialty:radiology` parameters and checking pagination controls are correct
- [x] 2.7 Write test `testFilterSessionPersistence()` - verify session storage by setting filter in session, then making request without filter parameter and checking filter is applied from session
- [x] 2.8 Write test `testEmptyFilterResults()` - verify empty state by filtering for a specialty combination with no matches and checking for "No veterinarians found" message
- [x] 2.9 Write test `testVisualFeedbackText()` - verify "Showing vets with specialty: Surgery" text appears in response when filter is active
- [x] 2.10 Run `./mvnw test -Dtest=VetSpecialtyFilterTests` and verify all tests fail (methods and components don't exist yet)
- [x] 2.11 Run `./mvnw test jacoco:report` to generate coverage report showing new test methods in `target/site/jacoco/index.html`

### [x] 3.0 GREEN: Implement Filter Dropdown UI and Basic Filtering

#### 3.0 Proof Artifact(s)

- Screenshot: Vet directory page showing filter dropdown with "All", "Radiology", "Surgery", "Dentistry" options demonstrates filter UI exists
- Screenshot: Vet directory page with URL `?filter=specialty:surgery` showing only surgery vets demonstrates single-specialty filtering works
- Screenshot: Page showing "Showing vets with specialty: Surgery" text above table demonstrates visual feedback
- Test: `VetSpecialtyFilterTests.java` basic filter tests pass demonstrates GREEN phase completion
- CLI: `./mvnw test -Dtest=VetSpecialtyFilterTests` shows tests passing

#### 3.0 Tasks

- [x] 3.1 Open `src/main/resources/templates/vets/vetList.html` for editing
- [x] 3.2 Add filter dropdown above the vet table (before the `<table>` element) using Bootstrap 5 `<select>` with `multiple` attribute and `form-select` class
- [x] 3.3 Populate dropdown with options using Thymeleaf: `<option value="">All</option>`, `<option value="radiology">Radiology</option>`, `<option value="surgery">Surgery</option>`, `<option value="dentistry">Dentistry</option>` (use `th:text="#{filter.specialty.all}"` etc. for i18n)
- [x] 3.4 Add JavaScript/form submission to update URL with `?filter=specialty:X` when dropdown selection changes (use `onchange` event to trigger form submission or page navigation)
- [x] 3.5 Add visual feedback text above table: `<p th:if="${filterActive}" th:text="#{filter.showing} + ' ' + ${filterText}"></p>` to show "Showing vets with specialty: Surgery"
- [x] 3.6 Open `src/main/java/org/springframework/samples/petclinic/vet/VetController.java` for editing
- [x] 3.7 Modify `showVetList()` method signature to accept `@RequestParam(required = false) String filter` parameter
- [x] 3.8 Parse filter parameter to extract specialty name(s): if filter starts with "specialty:", extract the value after the colon (e.g., "surgery" from "specialty:surgery")
- [x] 3.9 Open `src/main/java/org/springframework/samples/petclinic/vet/VetRepository.java` for editing
- [x] 3.10 Add method `Page<Vet> findBySpecialtiesNameIgnoreCase(String specialtyName, Pageable pageable)` using Spring Data JPA naming conventions for single specialty filtering
- [x] 3.11 Update `VetController.showVetList()` to call appropriate repository method: if filter is present, use `findBySpecialtiesNameIgnoreCase()`, otherwise use `findAll()`
- [x] 3.12 Pass filter state to model: `model.addAttribute("filterActive", filter != null)` and `model.addAttribute("filterText", specialtyName)`
- [x] 3.13 Run `./mvnw test -Dtest=VetSpecialtyFilterTests` and verify basic filter tests now pass
- [x] 3.14 Run `./mvnw spring-boot:run` to start application for manual testing
- [x] 3.15 Navigate to `http://localhost:8080/vets.html` and capture screenshot of filter dropdown
- [x] 3.16 Select "Surgery" from dropdown and capture screenshot of URL `http://localhost:8080/vets.html?filter=specialty:surgery` with filtered results
- [x] 3.17 Capture screenshot showing "Showing vets with specialty: Surgery" text above the table
- [x] 3.18 Stop the application

### [x] 4.0 GREEN: Implement Multi-Specialty AND Logic and Pagination

#### 4.0 Proof Artifact(s)

- Screenshot: Vet directory filtered by "Surgery,Dentistry" showing only vets with BOTH specialties demonstrates AND logic works
- Screenshot: Empty table with "No veterinarians found for Surgery, Dentistry" message demonstrates empty state handling
- Screenshot: Filtered vet list with URL `?page=2&filter=specialty:surgery` demonstrates pagination integration
- Test: `VetSpecialtyFilterTests.java` AND logic and pagination tests pass demonstrates correct filtering behavior
- CLI: `./mvnw test -Dtest=VetSpecialtyFilterTests` output showing all tests pass

#### 4.0 Tasks

- [x] 4.1 Open `src/main/java/org/springframework/samples/petclinic/vet/VetRepository.java` for editing
- [x] 4.2 Add custom `@Query` method for AND logic filtering: `@Query("SELECT v FROM Vet v JOIN v.specialties s WHERE s.name IN :specialtyNames GROUP BY v.id HAVING COUNT(DISTINCT s.id) = :count")` with method signature `Page<Vet> findByAllSpecialties(@Param("specialtyNames") List<String> specialtyNames, @Param("count") long count, Pageable pageable)`
- [x] 4.3 Open `src/main/java/org/springframework/samples/petclinic/vet/VetController.java` for editing
- [x] 4.4 Update filter parsing logic to handle comma-separated specialties: split filter value by comma (e.g., "specialty:surgery,dentistry" → ["surgery", "dentistry"])
- [x] 4.5 Update controller logic to call `findByAllSpecialties()` when multiple specialties are present, passing the list and count
- [x] 4.6 Add logic to reset to page 1 when filter changes: check if filter parameter differs from session filter, if so, set page to 1
- [x] 4.7 Update pagination link generation in template to maintain filter parameter: modify `th:href` in pagination controls to include `${filter}` parameter
- [x] 4.8 Open `src/main/resources/templates/vets/vetList.html` for editing
- [x] 4.9 Add empty state handling: `<tr th:if="${#lists.isEmpty(listVets)}"><td colspan="2" th:text="#{filter.noResults} + ' ' + ${filterText}">No veterinarians found</td></tr>`
- [x] 4.10 Update pagination controls to include filter parameter: `th:href="@{/vets.html(page=${i}, filter=${filter})}"` in page number links
- [x] 4.11 Run `./mvnw test -Dtest=VetSpecialtyFilterTests` and verify AND logic and pagination tests pass
- [x] 4.12 Run `./mvnw spring-boot:run` to start application for manual testing
- [x] 4.13 Navigate to vet directory and select both "Surgery" and "Dentistry", capture screenshot of URL `?filter=specialty:surgery,dentistry` showing only vets with BOTH specialties
- [x] 4.14 Test a specialty combination with no results (if available in test data) and capture screenshot of empty state message
- [x] 4.15 Test pagination with filter: navigate to `?page=2&filter=specialty:surgery` and capture screenshot showing pagination controls maintain filter
- [x] 4.16 Stop the application

### [x] 5.0 GREEN: Implement Session Persistence and Visual Feedback

#### 5.0 Proof Artifact(s)

- Screenshot: Filter selection persists after navigating to home page and back demonstrates session persistence
- Screenshot: Visual feedback text changes when different filter is selected demonstrates dynamic feedback
- Test: `VetSpecialtyFilterTests.java` session persistence tests pass demonstrates session handling works
- CLI: `./mvnw test` all unit tests pass demonstrates no regressions

#### 5.0 Tasks

- [x] 5.1 Open `src/main/java/org/springframework/samples/petclinic/vet/VetController.java` for editing
- [x] 5.2 Add `HttpSession session` parameter to `showVetList()` method signature
- [x] 5.3 Add logic to store filter in session when filter parameter is present: `if (filter != null) { session.setAttribute("vetFilter", filter); }`
- [x] 5.4 Add logic to retrieve filter from session when no query parameter provided: `if (filter == null) { filter = (String) session.getAttribute("vetFilter"); }`
- [x] 5.5 Ensure query parameters override session state by checking filter parameter first before falling back to session
- [x] 5.6 Pass current filter value to template for dropdown selection state: `model.addAttribute("currentFilter", filter)`
- [x] 5.7 Open `src/main/resources/templates/vets/vetList.html` for editing
- [x] 5.8 Update dropdown to show selected state: add `th:selected="${specialty == currentFilter}"` to each `<option>` element to highlight currently active filter
- [x] 5.9 Ensure visual feedback text updates dynamically based on current filter (already implemented in previous task, verify it uses `${filterText}`)
- [x] 5.10 Run `./mvnw test -Dtest=VetSpecialtyFilterTests` and verify session persistence tests pass
- [x] 5.11 Run full unit test suite `./mvnw test` to ensure no regressions in other components
- [x] 5.12 Run `./mvnw spring-boot:run` to start application for manual testing
- [x] 5.13 Navigate to vet directory, select "Surgery" filter, then navigate to home page using navbar
- [x] 5.14 Navigate back to vet directory and capture screenshot showing filter is still active (Surgery is selected)
- [x] 5.15 Change filter to "Radiology" and capture screenshot showing visual feedback updates to "Showing vets with specialty: Radiology"
- [x] 5.16 Stop the application

### [x] 6.0 RED: Write Failing E2E Tests for Filter Workflow

#### 6.0 Proof Artifact(s)

- Test: `vet-specialty-filter.spec.ts` fails with expected error demonstrates E2E tests are written correctly
- CLI: `cd e2e-tests && npm test -- vet-specialty-filter.spec.ts` output showing test failures demonstrates RED phase completion
- Diff: New E2E test file in `e2e-tests/tests/` demonstrates test infrastructure expansion

#### 6.0 Tasks

- [x] 6.1 Create `e2e-tests/tests/vet-specialty-filter.spec.ts` following existing Playwright test patterns
- [x] 6.2 Import necessary Playwright test utilities: `import { test, expect } from '@playwright/test';`
- [x] 6.3 Set up test suite with `test.describe('Vet Specialty Filter', () => { ... })`
- [x] 6.4 Write test "should display filter dropdown on vet directory page" - navigate to /vets.html, verify dropdown element is visible using `page.locator()` and `expect().toBeVisible()`
- [x] 6.5 Write test "should filter vets when selecting Surgery specialty" - navigate to /vets.html, select "Surgery" from dropdown, verify URL contains `?filter=specialty:surgery`, verify only surgery vets are displayed
- [x] 6.6 Write test "should apply AND logic when selecting multiple specialties" - select both Surgery and Dentistry, verify URL contains both, verify only vets with both specialties appear
- [x] 6.7 Write test "should persist filter when navigating away and back" - set Surgery filter, navigate to home page, navigate back to vets, verify Surgery filter is still active
- [x] 6.8 Write test "should integrate filter with pagination" - set filter with multiple pages of results, verify pagination controls appear, click page 2, verify URL contains both page and filter parameters
- [x] 6.9 Write test "should display empty state when no vets match filter" - select specialty combination with no matches (if available), verify "No veterinarians found" message appears
- [x] 6.10 Write test "should display visual feedback for active filter" - select Surgery, verify "Showing vets with specialty: Surgery" text appears on page
- [x] 6.11 Run `cd e2e-tests && npm test -- vet-specialty-filter.spec.ts` and verify tests run (should fail if application is not running or implementation incomplete)
- [x] 6.12 Capture test output showing failures as proof of RED phase completion

### [ ] 7.0 GREEN: Verify E2E Tests Pass and Complete Implementation

#### 7.0 Proof Artifact(s)

- Test: `vet-specialty-filter.spec.ts` passes demonstrates language persists across navigation
- Video/Screenshot: Playwright test artifacts showing filter persistence across vet directory → home → find owners → vet directory demonstrates end-to-end functionality
- CLI: `cd e2e-tests && npm test -- vet-specialty-filter.spec.ts` output showing all tests pass demonstrates GREEN phase completion
- Test Report: Playwright HTML report demonstrates comprehensive E2E validation

#### 7.0 Tasks

- [ ] 7.1 Run `./mvnw spring-boot:run` to ensure application is running for E2E tests
- [ ] 7.2 In a separate terminal, run `cd e2e-tests && npm test -- vet-specialty-filter.spec.ts` to execute E2E tests
- [ ] 7.3 Review test output for any failures and fix implementation issues if needed
- [ ] 7.4 Verify all E2E tests pass (green checkmarks in test output)
- [ ] 7.5 Review Playwright test artifacts in `e2e-tests/test-results/` for screenshots/videos of filter workflow
- [ ] 7.6 Manually test complete workflow: navigate to vet directory → select Surgery → verify filtered results → navigate to home → navigate back → verify filter persists
- [ ] 7.7 Run `cd e2e-tests && npm run report` to open Playwright HTML report
- [ ] 7.8 Review HTML report for test coverage, timings, and any warnings or issues
- [ ] 7.9 Capture screenshot or save report showing all tests passed
- [ ] 7.10 Stop the application

### [ ] 8.0 REFACTOR: Polish, Documentation, and Final Validation

#### 8.0 Proof Artifact(s)

- Screenshot: Mobile view of filter dropdown in responsive layout demonstrates responsive design
- Screenshot: Keyboard navigation highlighting filter dropdown demonstrates accessibility
- Coverage: JaCoCo report showing >90% coverage for specialty filter component demonstrates quality gate met
- Git: Clean commit history following conventional commits demonstrates professional workflow
- CLI: `./mvnw test` all tests pass demonstrates comprehensive validation

#### 8.0 Tasks

- [ ] 8.1 Test mobile responsiveness: resize browser to mobile width (< 768px) and verify filter dropdown is usable on small screens
- [ ] 8.2 Capture screenshot of mobile view showing filter dropdown in responsive layout
- [ ] 8.3 Test keyboard navigation: use Tab key to navigate to filter dropdown, press Enter/Space to open, use Arrow keys to select options, verify dropdown is fully keyboard accessible
- [ ] 8.4 Capture screenshot or describe keyboard focus states (focus ring on dropdown, selected option highlight)
- [ ] 8.5 Review code in `VetController.java`, `VetRepository.java`, and `vetList.html` for clarity and simplification - refactor if needed (extract methods, improve naming, remove duplication)
- [ ] 8.6 Ensure proper indentation and formatting in all modified files (follow Spring Boot conventions for Java, HTML5 conventions for Thymeleaf templates)
- [ ] 8.7 Run `./mvnw test jacoco:report` to generate final coverage report
- [ ] 8.8 Review `target/site/jacoco/index.html` and verify >90% line coverage for VetController and VetRepository specialty filter methods
- [ ] 8.9 Run full test suite (unit + E2E): `./mvnw test && cd e2e-tests && npm test` to ensure all tests pass
- [ ] 8.10 Review git commit history with `git log --oneline` and ensure commits follow conventional format (feat:, test:, refactor:, etc.)
- [ ] 8.11 If needed, squash or reword commits to maintain clean history before PR
- [ ] 8.12 Perform final manual smoke test: test all filter scenarios (All, single specialty, multiple specialties, pagination, session persistence, empty state)
- [ ] 8.13 Create Pull Request with title "feat(vet): add specialty filter to veterinarian directory" and body "Closes #2" and summary of changes
- [ ] 8.14 Ensure PR is created in forked repository (liatrio/emerald-grove-pet-clinic-yusuf) NOT upstream repository
