# 06-spec-upcoming-visits

## Introduction/Overview

The Upcoming Visits page provides veterinary clinic staff with a consolidated view of scheduled pet visits within a configurable time window. This feature enables proactive appointment management and improves clinic workflow by displaying all upcoming visits in a single, accessible location. The page displays visit date, owner name, pet name, and visit description in a sortable table format.

## Goals

- Provide clinic staff with visibility into upcoming appointments across all pets and owners
- Enable configurable time window filtering to view visits for different planning horizons
- Present visit information in a clear, accessible table format following application design patterns
- Support pagination for clinics with high visit volumes
- Maintain read-only access to prevent accidental modifications from the overview page

## User Stories

**As a veterinary clinic receptionist**, I want to view all upcoming visits for the next week so that I can prepare appointment schedules and contact owners about upcoming appointments.

**As a veterinary clinic manager**, I want to adjust the time window for upcoming visits (e.g., next 3 days, 7 days, 14 days, 30 days) so that I can plan staffing and resources based on different time horizons.

**As a veterinary technician**, I want to see which pets have visits scheduled so that I can prepare medical records and treatment plans in advance.

**As a clinic administrator**, I want the upcoming visits list to display owner and pet information alongside visit details so that I can quickly identify and contact pet owners if needed.

## Demoable Units of Work

### Unit 1: Basic Upcoming Visits Page

**Purpose:** Implement the core upcoming visits page that displays visits scheduled in the next 7 days (default), serving clinic staff who need to view near-term appointments.

**Functional Requirements:**
- The system shall create a new controller at `/visits/upcoming` that retrieves visits scheduled within the next 7 days by default
- The system shall add a repository query method `findUpcomingVisits(LocalDate startDate, LocalDate endDate)` that returns visits where `visit_date` is between the start and end dates, ordered by date ascending
- The system shall display upcoming visits in a table with columns: Visit Date, Owner Name, Pet Name, and Description
- The system shall use the `.liatrio-table-card` component with `.table.table-striped.liatrio-table` styling for consistent UI presentation
- The system shall add a navigation link in the main navbar to "Upcoming Visits" for easy access
- The user shall be able to access the page without authentication (consistent with existing application behavior)
- The system shall display an appropriate message when no upcoming visits are found

**Proof Artifacts:**
- Screenshot: Browser at `http://localhost:8080/visits/upcoming` displays a table of upcoming visits with proper column headers
- Screenshot: Table shows visit date, owner name, pet name, and description for each visit
- Screenshot: Navigation bar includes "Upcoming Visits" link with calendar icon
- Screenshot: Empty state message displays when no visits are scheduled

### Unit 2: Configurable Time Window

**Purpose:** Enable flexible time window filtering through a query parameter, allowing staff to plan for different time horizons (3, 7, 14, 30 days).

**Functional Requirements:**
- The system shall accept a `days` query parameter (default: 7) to configure the time window for upcoming visits
- The system shall validate that the `days` parameter is a positive integer between 1 and 90
- The system shall calculate the date range as today through today + days
- The system shall display the current time window prominently on the page (e.g., "Upcoming Visits: Next 7 Days")
- The system shall provide quick filter buttons/links for common time windows: 3 days, 7 days, 14 days, 30 days
- The user shall be able to navigate to different time windows by clicking filter buttons or modifying the URL query parameter
- The system shall maintain the current time window selection visually (e.g., active button state)

**Proof Artifacts:**
- Screenshot: URL `http://localhost:8080/visits/upcoming?days=3` displays visits for the next 3 days
- Screenshot: URL `http://localhost:8080/visits/upcoming?days=30` displays visits for the next 30 days
- Screenshot: Page header shows "Upcoming Visits: Next 7 Days" (or appropriate number based on parameter)
- Screenshot: Quick filter buttons are displayed and the active filter is highlighted
- CLI: `curl http://localhost:8080/visits/upcoming?days=14` returns HTML with visits for the next 14 days

### Unit 3: Testing and Quality Assurance

**Purpose:** Ensure the upcoming visits feature is thoroughly tested at all levels following Strict TDD methodology and meets quality standards.

**Functional Requirements:**
- The system shall include repository tests for `findUpcomingVisits()` verifying correct date filtering and ordering
- The system shall include controller tests using `@WebMvcTest` to verify endpoint behavior, parameter handling, and model attributes
- The system shall include integration tests using `@SpringBootTest` to verify end-to-end functionality with real database
- The system shall include Playwright E2E test that creates a future visit, navigates to upcoming visits page, and verifies the visit appears
- The system shall achieve minimum 90% line coverage for new code
- The system shall pass all accessibility checks using axe-core (WCAG 2.1 Level AA)
- The user shall be able to navigate the page using keyboard only (tab navigation, no keyboard traps)
- The system shall provide proper ARIA labels and table semantics for screen reader accessibility

**Proof Artifacts:**
- Test Report: JUnit tests pass for `VisitRepositoryTests.findUpcomingVisits()`
- Test Report: JUnit tests pass for `VisitControllerTests` covering GET /visits/upcoming with various days parameters
- Test Report: Playwright test `upcoming-visits.spec.ts` passes, verifying visit creation and display
- Screenshot: JaCoCo coverage report shows >90% coverage for new Visit controller methods
- Test Report: axe-core accessibility scan shows 0 critical or serious violations for `/visits/upcoming`
- Screenshot: Keyboard navigation successfully moves through all interactive elements on the page

## Non-Goals (Out of Scope)

1. **Visit editing or deletion from upcoming visits page** - The page is read-only; editing must be done through owner details page
2. **Advanced filtering by owner, pet, or visit type** - Only date-based filtering via the `days` parameter is supported
3. **Calendar view or timeline visualization** - Only table display is implemented
4. **Visit reminders or notifications** - No email/SMS notification functionality
5. **Past visits or visit history** - Only future visits are displayed; historical visits remain on the owner/pet details page
6. **Export functionality (PDF, CSV)** - No data export capabilities in this phase
7. **Visit status or appointment confirmation tracking** - Visits are treated as confirmed appointments
8. **Staff assignment or veterinarian scheduling** - No resource allocation or scheduling features
9. **Real-time updates or auto-refresh** - Page requires manual refresh to see new visits

## Design Considerations

The upcoming visits page follows the established Liatrio branding and UI patterns documented in UI_GUIDELINES.md:

- **Layout**: Use `.liatrio-section` with `.liatrio-table-card` container following the standard table pattern from vetList.html
- **Table Structure**: Follow the data table pattern with proper `<thead>`, `<tbody>`, column headers with `scope="col"`, and `.table.table-striped.liatrio-table` classes
- **Navigation**: Add "Upcoming Visits" link to navbar between "Find Owners" and "Veterinarians" with `fa-calendar` icon
- **Filter UI**: Use `.liatrio-form-actions` style button group for time window quick filters (3d, 7d, 14d, 30d buttons)
- **Active State**: Apply `.btn-primary` to the currently selected time window, `.liatrio-btn-secondary` to others
- **Empty State**: Display friendly message "No upcoming visits scheduled" in a `.liatrio-muted` paragraph when no results
- **Page Header**: Include page title "Upcoming Visits" as `<h2>` and subtitle describing current time window as `.liatrio-muted` paragraph
- **Responsive Design**: Table wraps in `.table-responsive` container for mobile compatibility
- **Date Format**: Display dates as `yyyy-MM-dd` format using `th:text="${#temporals.format(visit.date, 'yyyy-MM-dd')}"`
- **Pagination**: If implementing pagination (optional), use the `.liatrio-pagination` pattern from vetList.html with Font Awesome icons

**Template Location**: `src/main/resources/templates/visits/upcomingVisits.html`

**Template Structure**:
```html
<!DOCTYPE html>
<html xmlns:th="https://www.thymeleaf.org"
      th:replace="~{fragments/layout :: layout (~{::body},'visits')}">
<body>
  <section class="liatrio-section">
    <div class="liatrio-table-card">
      <!-- Header with time window -->
      <!-- Quick filter buttons -->
      <!-- Table or empty state -->
      <!-- Optional pagination -->
    </div>
  </section>
</body>
</html>
```

## Repository Standards

Follow established patterns and practices from the Emerald Grove Veterinary Clinic codebase:

**Architectural Patterns**:
- Layered architecture: Controller → Repository → Database
- Spring Data JPA repository pattern with query methods
- Spring MVC controller with `@GetMapping` annotation
- Thymeleaf template engine for server-side rendering

**Coding Standards**:
- Follow existing package structure: `org.springframework.samples.petclinic.owner` package for Visit-related code
- Use constructor injection for dependencies (no field injection)
- Apply `@Controller` annotation (not `@RestController` - this returns HTML pages)
- Use `@RequestParam` with `defaultValue` for optional parameters
- Follow Java naming conventions: camelCase for methods, PascalCase for classes

**Repository Query Methods**:
- Add query method to `OwnerRepository` or create `VisitRepository` if needed
- Use Spring Data JPA query derivation: `findBy...` method naming convention
- Consider using `@Query` annotation with JPQL for complex joins to retrieve owner and pet information
- Return `List<Visit>` or custom DTO if additional fields needed

**Testing Patterns**:
- Repository tests: Use `@DataJpaTest` for isolated repository testing
- Controller tests: Use `@WebMvcTest` with `MockMvc` for endpoint testing
- Integration tests: Use `@SpringBootTest` for full-stack testing
- E2E tests: Use Playwright in `e2e-tests/` directory
- Follow Arrange-Act-Assert pattern in all tests
- Mock dependencies using `@MockBean` in unit tests

**File Organization**:
- Controller: `src/main/java/org/springframework/samples/petclinic/owner/VisitController.java` (extend existing or create new controller class)
- Repository: Add method to `OwnerRepository.java` or create `VisitRepository.java`
- Template: `src/main/resources/templates/visits/upcomingVisits.html`
- Controller Tests: `src/test/java/org/springframework/samples/petclinic/owner/VisitControllerTests.java`
- Repository Tests: `src/test/java/org/springframework/samples/petclinic/owner/VisitRepositoryTests.java` (if new repository)
- E2E Tests: `e2e-tests/tests/upcoming-visits.spec.ts`

**TDD Workflow**:
- Follow Strict TDD: RED (write failing test) → GREEN (minimal implementation) → REFACTOR (improve code)
- Write repository test first, then implement query method
- Write controller test, then implement endpoint
- Write E2E test, then verify full integration
- Maintain >90% code coverage for new code

**Commit Conventions**:
- Use conventional commits format: `feat: add upcoming visits page`
- Reference issue number: `feat: add upcoming visits page (#10)`
- Include co-author attribution: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

## Technical Considerations

**Database Query Approach**:
- Visits are stored in the `visits` table with `pet_id` foreign key
- Pets are stored in the `pets` table with `owner_id` foreign key
- To retrieve upcoming visits with owner and pet information, use JPQL query with joins:
  - Join `Visit` → `Pet` → `Owner` to get all required fields
  - Filter by `visit.date >= :startDate AND visit.date <= :endDate`
  - Order by `visit.date ASC`

**Repository Decision**:
- **Option A**: Extend `OwnerRepository` with a custom query method using `@Query` annotation
- **Option B**: Create new `VisitRepository extends JpaRepository<Visit, Integer>` (recommended for separation of concerns)
- Recommended: Create `VisitRepository` since this query is visit-centric, not owner-centric

**Controller Design**:
- Add new method to existing `VisitController.java` or create `UpcomingVisitsController.java`
- Use `@GetMapping("/visits/upcoming")` for the endpoint
- Accept `@RequestParam(defaultValue = "7") int days` parameter
- Validate `days` parameter: must be > 0 and <= 90 (throw `IllegalArgumentException` for invalid values)
- Calculate date range: `LocalDate.now()` to `LocalDate.now().plusDays(days)`
- Add model attributes: `visits`, `days`, `startDate`, `endDate` for template usage

**Performance Considerations**:
- Query performance: Add database index on `visits.visit_date` if not already present
- Pagination: Consider implementing if visit count could exceed 50-100 results
- Eager vs Lazy loading: Use appropriate fetch strategy for Pet and Owner relationships (likely EAGER for this use case)

**Error Handling**:
- Invalid `days` parameter: Return appropriate error message or default to 7 days
- No database connection: Let Spring's default error handling manage
- Empty results: Display user-friendly "No upcoming visits" message (not an error)

**Internationalization**:
- Add message keys to `src/main/resources/messages/messages.properties`:
  - `upcoming.visits.title=Upcoming Visits`
  - `upcoming.visits.subtitle=Scheduled visits for the next {0} days`
  - `upcoming.visits.empty=No upcoming visits scheduled`
- Use `th:text="#{upcoming.visits.title}"` in template

**Dependencies**:
- No new dependencies required - feature uses existing Spring Boot, Spring Data JPA, and Thymeleaf

## Security Considerations

No specific security considerations identified. The application currently does not implement authentication or authorization, and the upcoming visits page follows the same access model as other pages (public access for demonstration purposes).

**Future Considerations** (not in scope for this feature):
- If authentication is added later, this page should require clinic staff role
- No sensitive data (SSN, credit card) is displayed on this page
- Visit descriptions may contain medical information but are already visible on owner details pages

**Proof Artifact Security**:
- Screenshots and test data should not contain real patient information
- Use sample/test data for all proof artifacts
- E2E tests should use test fixtures, not production data

## Success Metrics

1. **Functional Completeness**: All functional requirements in the three demoable units are implemented and verified with proof artifacts
2. **Code Coverage**: Achieve >90% line coverage for all new code (VisitRepository query method, controller endpoint, template rendering)
3. **Test Pass Rate**: 100% of unit, integration, and E2E tests pass
4. **Accessibility Compliance**: 0 critical or serious accessibility violations detected by axe-core for WCAG 2.1 Level AA
5. **Performance**: Page loads in < 2 seconds with up to 100 upcoming visits (measured via browser dev tools)
6. **User Acceptance**: Page successfully displays upcoming visits with correct filtering when manually tested with various `days` parameter values (3, 7, 14, 30, 90)

## Open Questions

No open questions at this time. The specification provides sufficient detail for implementation based on:
- GitHub issue #10 requirements
- Existing codebase patterns and conventions
- Comprehensive documentation (ARCHITECTURE.md, DEVELOPMENT.md, TESTING.md, UI_GUIDELINES.md, ACCESSIBILITY.md)
- Clear functional requirements and proof artifacts defined in demoable units
