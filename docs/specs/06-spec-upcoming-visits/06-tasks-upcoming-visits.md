# 06-tasks-upcoming-visits

## Unit 1: Basic Upcoming Visits Page

### [x] Task 1: Create VisitRepository with findUpcomingVisits query method

- [x] 1.1 **RED**: Write `VisitRepositoryTests` with `@DataJpaTest` that tests `findUpcomingVisits(startDate, endDate)` returns visits within date range ordered by date ascending
- [x] 1.2 **RED**: Write test that `findUpcomingVisits` returns empty list when no visits exist in range
- [x] 1.3 **GREEN**: Create `VisitRepository` interface extending `JpaRepository<Visit, Integer>` with `@Query` method for finding upcoming visits joining Pet and Owner
- [x] 1.4 **REFACTOR**: Used native SQL query instead of JPQL since Visit entity has no `@ManyToOne` to Pet; interface-based projection for DTO

### [x] Task 2: Create UpcomingVisitDTO for transferring visit data with owner/pet info

- [x] 2.1 **RED**: DTO tested via controller tests and repository tests that validate projection fields
- [x] 2.2 **GREEN**: Create `UpcomingVisitDTO` as interface-based projection (not record) for Spring Data JPA native query compatibility
- [x] 2.3 **REFACTOR**: VisitRepository query returns `List<UpcomingVisitDTO>` using interface-based projection with native SQL

### [x] Task 3: Create UpcomingVisitsController with GET /visits/upcoming endpoint

- [x] 3.1 **RED**: Write `UpcomingVisitsControllerTests` with `@WebMvcTest` testing GET `/visits/upcoming` returns OK status and correct view name
- [x] 3.2 **RED**: Write test that model contains `visits` attribute
- [x] 3.3 **RED**: Write test that model contains `days` attribute defaulting to 7
- [x] 3.4 **GREEN**: Create `UpcomingVisitsController` with `@GetMapping("/visits/upcoming")` that calls repository and populates model
- [x] 3.5 **REFACTOR**: Extract date calculation logic; ensure constructor injection

### [x] Task 4: Create upcomingVisits.html Thymeleaf template

- [x] 4.1 **GREEN**: Create `src/main/resources/templates/visits/upcomingVisits.html` with liatrio-table-card layout and visit data table
- [x] 4.2 **GREEN**: Add empty state message when no visits are found
- [x] 4.3 **REFACTOR**: Ensure proper table semantics with `scope="col"` on headers and `table-responsive` wrapper

### [x] Task 5: Add i18n message keys for upcoming visits

- [x] 5.1 **RED**: I18nPropertiesSyncTest validates key sync across all locales
- [x] 5.2 **GREEN**: Add message keys to `messages.properties` and all 7 locale files (de, es, fa, ko, pt, ru, tr)
- [x] 5.3 **REFACTOR**: Use message keys in template via `th:text="#{...}"`

### [x] Task 6: Add navigation link in navbar

- [x] 6.1 **RED**: Nav link accessibility tested via E2E test
- [x] 6.2 **GREEN**: Add "Upcoming Visits" link to `layout.html` navbar between "Find Owners" and "Veterinarians" with `fa-calendar` icon
- [x] 6.3 **REFACTOR**: Active state works for `visits` menu item via layout fragment menuItem

## Unit 2: Configurable Time Window

### [x] Task 7: Add days query parameter support

- [x] 7.1 **RED**: Write controller test for GET `/visits/upcoming?days=3` returning visits for 3-day window
- [x] 7.2 **RED**: Write controller test for GET `/visits/upcoming?days=14` returning visits for 14-day window
- [x] 7.3 **GREEN**: Controller accepts `@RequestParam(defaultValue = "7") int days` and calculates date range
- [x] 7.4 **REFACTOR**: Model attributes include `startDate` and `endDate`

### [x] Task 8: Add days parameter validation

- [x] 8.1 **RED**: Write controller test for invalid `days=0` returning default 7
- [x] 8.2 **RED**: Write controller test for invalid `days=91` clamping to 90
- [x] 8.3 **RED**: Write controller test for negative `days=-1` returning default 7
- [x] 8.4 **GREEN**: Validation logic: days < 1 defaults to 7, days > 90 clamps to 90

### [x] Task 9: Add quick filter buttons to template

- [x] 9.1 **GREEN**: Add quick filter button group (3d, 7d, 14d, 30d) with `liatrio-form-actions` styling
- [x] 9.2 **GREEN**: Apply `btn-primary` to active filter, `liatrio-btn-secondary` to others
- [x] 9.3 **REFACTOR**: Page header shows subtitle with current time window via `upcomingVisits.subtitle(${days})`

## Unit 3: Testing and Quality Assurance

### [x] Task 10: Repository integration tests

- [x] 10.1 **RED/GREEN**: Test inserting future visits and verifying `findUpcomingVisits` retrieves them (shouldFindUpcomingVisitsWithinDateRange)
- [x] 10.2 **RED/GREEN**: Test verifying visits outside date range are excluded (shouldExcludeVisitsOutsideDateRange)
- [x] 10.3 **RED/GREEN**: Test verifying result ordering by date ascending (shouldReturnVisitsOrderedByDateAscending)

### [x] Task 11: Controller comprehensive tests

- [x] 11.1 **RED/GREEN**: Test for empty visits list showing empty state (testEmptyVisitsList)
- [x] 11.2 **RED/GREEN**: Test verifying model attributes contain correct visit data (testModelContainsVisits, testModelContainsDateAttributes)
- [x] 11.3 **RED/GREEN**: Boundary tests for days=1, days=90, days=30 (testDaysAtBoundaryOne, testDaysAtBoundaryNinety, testThirtyDaysFilter)

### [x] Task 12: Integration test with @SpringBootTest

- [x] 12.1 Write integration test using `@SpringBootTest` to verify `/visits/upcoming` end-to-end with real database
- [x] 12.2 Verify response contains HTML with table structure and filter buttons

### [x] Task 13: Playwright E2E test

- [x] 13.1 Create `e2e-tests/tests/features/upcoming-visits.spec.ts` E2E test
- [x] 13.2 Test navigating to upcoming visits page and verifying table structure
- [x] 13.3 Test quick filter buttons change the displayed time window

### [x] Task 14: Accessibility tests

- [x] 14.1 Create `e2e-tests/tests/a11y/upcoming-visits.a11y.test.ts` with axe-core scan
- [x] 14.2 Verify keyboard navigation through filter buttons and ARIA/semantic structure

### [~] Task 15: Final quality verification

- [~] 15.1 Run full test suite and verify all tests pass (Java runtime not available in current environment; tests must be run manually with `./mvnw test`)
- [ ] 15.2 Verify code coverage meets >90% threshold for new code (requires `./mvnw test jacoco:report`)
- [ ] 15.3 Run linting and formatting checks
