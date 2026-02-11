# 06-tasks-upcoming-visits

## Unit 1: Basic Upcoming Visits Page

### Task 1: Create VisitRepository with findUpcomingVisits query method

- [ ] 1.1 **RED**: Write `VisitRepositoryTests` with `@DataJpaTest` that tests `findUpcomingVisits(startDate, endDate)` returns visits within date range ordered by date ascending
- [ ] 1.2 **RED**: Write test that `findUpcomingVisits` returns empty list when no visits exist in range
- [ ] 1.3 **GREEN**: Create `VisitRepository` interface extending `JpaRepository<Visit, Integer>` with `@Query` method for finding upcoming visits joining Pet and Owner
- [ ] 1.4 **REFACTOR**: Ensure Visit entity has proper ManyToOne relationship to Pet for the JPQL join

### Task 2: Create UpcomingVisitDTO for transferring visit data with owner/pet info

- [ ] 2.1 **RED**: Write unit test for `UpcomingVisitDTO` verifying it holds visitDate, ownerName, petName, and description
- [ ] 2.2 **GREEN**: Create `UpcomingVisitDTO` record/class with required fields
- [ ] 2.3 **REFACTOR**: Update `VisitRepository` query to return `List<UpcomingVisitDTO>` using constructor expression in JPQL

### Task 3: Create UpcomingVisitsController with GET /visits/upcoming endpoint

- [ ] 3.1 **RED**: Write `UpcomingVisitsControllerTests` with `@WebMvcTest` testing GET `/visits/upcoming` returns OK status and correct view name
- [ ] 3.2 **RED**: Write test that model contains `visits` attribute
- [ ] 3.3 **RED**: Write test that model contains `days` attribute defaulting to 7
- [ ] 3.4 **GREEN**: Create `UpcomingVisitsController` with `@GetMapping("/visits/upcoming")` that calls repository and populates model
- [ ] 3.5 **REFACTOR**: Extract date calculation logic; ensure constructor injection

### Task 4: Create upcomingVisits.html Thymeleaf template

- [ ] 4.1 **GREEN**: Create `src/main/resources/templates/visits/upcomingVisits.html` with liatrio-table-card layout and visit data table
- [ ] 4.2 **GREEN**: Add empty state message when no visits are found
- [ ] 4.3 **REFACTOR**: Ensure proper table semantics with `scope="col"` on headers and `table-responsive` wrapper

### Task 5: Add i18n message keys for upcoming visits

- [ ] 5.1 **RED**: Verify I18nPropertiesSyncTest will detect missing keys in translation files
- [ ] 5.2 **GREEN**: Add message keys to `messages.properties` and all locale files
- [ ] 5.3 **REFACTOR**: Use message keys in template via `th:text="#{...}"`

### Task 6: Add navigation link in navbar

- [ ] 6.1 **RED**: Write controller test verifying the nav link is accessible
- [ ] 6.2 **GREEN**: Add "Upcoming Visits" link to `layout.html` navbar between "Find Owners" and "Veterinarians" with `fa-calendar` icon
- [ ] 6.3 **REFACTOR**: Verify active state works for `visits` menu item

## Unit 2: Configurable Time Window

### Task 7: Add days query parameter support

- [ ] 7.1 **RED**: Write controller test for GET `/visits/upcoming?days=3` returning visits for 3-day window
- [ ] 7.2 **RED**: Write controller test for GET `/visits/upcoming?days=14` returning visits for 14-day window
- [ ] 7.3 **GREEN**: Update controller to accept `@RequestParam(defaultValue = "7") int days` and calculate date range
- [ ] 7.4 **REFACTOR**: Add model attributes for `startDate` and `endDate`

### Task 8: Add days parameter validation

- [ ] 8.1 **RED**: Write controller test for invalid `days=0` returning default 7
- [ ] 8.2 **RED**: Write controller test for invalid `days=91` clamping to 90
- [ ] 8.3 **RED**: Write controller test for negative `days=-1` returning default 7
- [ ] 8.4 **GREEN**: Add validation logic to clamp days between 1 and 90

### Task 9: Add quick filter buttons to template

- [ ] 9.1 **GREEN**: Add quick filter button group (3d, 7d, 14d, 30d) with `liatrio-form-actions` styling
- [ ] 9.2 **GREEN**: Apply `btn-primary` to active filter, `liatrio-btn-secondary` to others
- [ ] 9.3 **REFACTOR**: Display page header showing "Upcoming Visits: Next N Days" with current time window

## Unit 3: Testing and Quality Assurance

### Task 10: Repository integration tests

- [ ] 10.1 **RED/GREEN**: Write test inserting future visits and verifying `findUpcomingVisits` retrieves them correctly
- [ ] 10.2 **RED/GREEN**: Write test verifying visits outside date range are excluded
- [ ] 10.3 **RED/GREEN**: Write test verifying result ordering by date ascending

### Task 11: Controller comprehensive tests

- [ ] 11.1 **RED/GREEN**: Write test for empty visits list showing empty state
- [ ] 11.2 **RED/GREEN**: Write test verifying model attributes contain correct visit data
- [ ] 11.3 **RED/GREEN**: Write test for non-numeric days parameter handling

### Task 12: Integration test with @SpringBootTest

- [ ] 12.1 Write integration test using `@SpringBootTest` to verify `/visits/upcoming` end-to-end with real database
- [ ] 12.2 Verify response contains HTML with table structure

### Task 13: Playwright E2E test

- [ ] 13.1 Create `e2e-tests/tests/features/upcoming-visits.spec.ts` E2E test
- [ ] 13.2 Test navigating to upcoming visits page and verifying table structure
- [ ] 13.3 Test quick filter buttons change the displayed time window

### Task 14: Accessibility tests

- [ ] 14.1 Create `e2e-tests/tests/a11y/upcoming-visits.a11y.test.ts` with axe-core scan
- [ ] 14.2 Verify keyboard navigation through filter buttons and table

### Task 15: Final quality verification

- [ ] 15.1 Run full test suite and verify all tests pass
- [ ] 15.2 Verify code coverage meets >90% threshold for new code
- [ ] 15.3 Run linting and formatting checks
