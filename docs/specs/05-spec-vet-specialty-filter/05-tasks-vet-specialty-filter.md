# 05-tasks-vet-specialty-filter

## Tasks

### [~] 1.0 Implement Repository Query Methods for Specialty Filtering (TDD)

**Purpose**: Create the foundational data access layer methods that enable filtering veterinarians by specialty using Spring Data JPA query derivation. This follows strict TDD by writing failing tests first, then implementing minimal code to pass tests.

**Demoable Value**: Repository methods are testable and demonstrate correct data filtering through unit tests. This establishes the data layer foundation for the feature.

#### 1.0 Proof Artifact(s)

- Test: `VetRepositoryTests.testFindBySpecialtiesName()` passes, demonstrates filtering vets by specific specialty name with pagination
- Test: `VetRepositoryTests.testFindBySpecialtiesIsEmpty()` passes, demonstrates finding vets with zero specialties with pagination
- Test: `VetRepositoryTests.testFindDistinctSpecialtyNames()` passes, demonstrates retrieving all unique specialty names sorted alphabetically
- CLI: `./mvnw test -Dtest=VetRepositoryTests` shows all new repository tests passing with 100% coverage of new query methods

#### 1.0 Tasks

TBD

---

### [ ] 2.0 Implement Controller Logic for Specialty Filter Parameter Handling (TDD)

**Purpose**: Enhance `VetController.showVetList()` to accept and process the `specialty` query parameter, routing to appropriate repository methods and populating model attributes for the view. Follows TDD with controller tests written before implementation.

**Demoable Value**: Controller correctly handles specialty filtering logic and can be demonstrated through MockMvc tests showing proper routing, model population, and pagination integration.

#### 2.0 Proof Artifact(s)

- Test: `VetControllerTests.testShowVetListWithSpecialtyFilter()` passes, demonstrates controller handles `specialty` query parameter and filters results
- Test: `VetControllerTests.testShowVetListWithAllSpecialties()` passes, demonstrates controller shows all vets when filter is "all" or empty
- Test: `VetControllerTests.testShowVetListWithNoSpecialty()` passes, demonstrates controller shows vets with zero specialties when filter is "none"
- Test: `VetControllerTests.testSpecialtyFilterWithPagination()` passes, demonstrates filter persists across page navigation
- CLI: `./mvnw test -Dtest=VetControllerTests` shows all new controller tests passing with 90%+ coverage of modified controller code

#### 2.0 Tasks

TBD

---

### [ ] 3.0 Implement UI Filter Dropdown and Query Parameter Integration

**Purpose**: Add specialty filter UI to `vetList.html` template with dropdown control, URL query parameter handling, empty state messaging, and pagination integration. This makes the filter feature visible and usable in the browser.

**Demoable Value**: Complete end-to-end filter functionality is visible in browser. Users can select specialties, see URL updates, view filtered results, navigate paginated results with filter persistence, and see appropriate empty states.

#### 3.0 Proof Artifact(s)

- Screenshot: `docs/specs/05-spec-vet-specialty-filter/05-proofs/specialty-filter-dropdown.png` demonstrates filter dropdown UI with all specialty options visible and properly styled
- Screenshot: `docs/specs/05-spec-vet-specialty-filter/05-proofs/filtered-results-dentistry.png` demonstrates filtered vet list showing only vets with "dentistry" specialty
- Screenshot: `docs/specs/05-spec-vet-specialty-filter/05-proofs/filtered-url-query-param.png` demonstrates browser URL bar showing query parameter (e.g., `/vets.html?page=1&specialty=radiology`)
- Screenshot: `docs/specs/05-spec-vet-specialty-filter/05-proofs/empty-filter-results.png` demonstrates empty state message when no vets match selected specialty
- Screenshot: `docs/specs/05-spec-vet-specialty-filter/05-proofs/filter-persistence-pagination.png` demonstrates filter persisting when navigating to page 2
- URL: `http://localhost:8080/vets.html?specialty=surgery` demonstrates direct navigation to filtered view works correctly

#### 3.0 Tasks

TBD

---

### [ ] 4.0 Implement End-to-End Playwright Tests for Complete Filter Workflow

**Purpose**: Create comprehensive E2E tests validating complete user workflows including filter selection, URL updates, pagination integration, empty states, and shareable URL functionality. This provides automated regression protection and validates acceptance criteria.

**Demoable Value**: Complete automated test suite demonstrates all filter scenarios work correctly from end-user perspective. Playwright HTML report shows passing tests with screenshots/videos of each scenario.

#### 4.0 Proof Artifact(s)

- Test: `e2e-tests/tests/vet-specialty-filter.spec.ts` all tests pass, demonstrates complete filter workflow validation
- HTML Report: `e2e-tests/test-results/html-report/index.html` demonstrates all E2E tests passing with trace/video artifacts
- Screenshot: E2E test artifacts showing filter interaction captured by Playwright demonstrate test coverage
- CLI: `cd e2e-tests && npm test -- vet-specialty-filter` shows all E2E tests passing with detailed execution logs

#### 4.0 Tasks

TBD

---

## Notes

This task list follows the **Strict TDD** methodology required by CLAUDE.md:

1. **RED Phase**: Write failing tests that define desired behavior
2. **GREEN Phase**: Write minimal code to make tests pass
3. **REFACTOR Phase**: Improve code while maintaining test coverage

Each parent task represents a **demoable unit** that delivers tangible value and can be independently verified through proof artifacts. Tasks are ordered by architectural layer dependencies (Repository → Controller → UI → E2E) while maintaining TDD principles within each layer.

**Target Coverage**: 90%+ for new code, 100% branch coverage for critical business logic (specialty filtering conditions).

**Estimated Effort**: 12-15 hours total across all tasks (each task approximately 2-4 hours including TDD cycle).
