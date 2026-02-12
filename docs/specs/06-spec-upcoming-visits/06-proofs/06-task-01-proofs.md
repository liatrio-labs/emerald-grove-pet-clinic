# Task 1-6 Proof Artifacts: Basic Upcoming Visits Page (Unit 1)

## Implementation Files Created

### UpcomingVisitDTO.java (Interface-based Projection)
```
src/main/java/org/springframework/samples/petclinic/owner/UpcomingVisitDTO.java
```
- Interface-based projection (not record) for Spring Data JPA native query compatibility
- Fields: `getVisitDate()`, `getOwnerName()`, `getPetName()`, `getDescription()`

### VisitRepository.java
```
src/main/java/org/springframework/samples/petclinic/owner/VisitRepository.java
```
- Extends `JpaRepository<Visit, Integer>`
- Native SQL query joining `visits -> pets -> owners` (native SQL required because Visit entity has no `@ManyToOne` to Pet)
- Returns `List<UpcomingVisitDTO>` via interface-based projection
- Filters by date range and orders by visit_date ASC

### UpcomingVisitsController.java
```
src/main/java/org/springframework/samples/petclinic/owner/UpcomingVisitsController.java
```
- `@GetMapping("/visits/upcoming")` endpoint
- Accepts `@RequestParam(defaultValue = "7") int days`
- Validation: days < 1 defaults to 7, days > 90 clamps to 90
- Model attributes: `visits`, `days`, `startDate`, `endDate`
- Constructor injection of VisitRepository

### upcomingVisits.html Thymeleaf Template
```
src/main/resources/templates/visits/upcomingVisits.html
```
- Uses `liatrio-table-card` with `liatrio-section` layout
- Quick filter buttons (3d, 7d, 14d, 30d) with `liatrio-form-actions` styling
- Active button uses `btn-primary`, others use `liatrio-btn-secondary`
- Empty state message with `liatrio-muted` class
- Table with `scope="col"` headers and `table-responsive` wrapper
- `aria-label` on filter nav, `aria-current` on active button
- Date format: `yyyy-MM-dd`

### Navigation Link in layout.html
```
src/main/resources/templates/fragments/layout.html
```
- Added nav link between "Find Owners" and "Veterinarians"
- Uses `fa-calendar` icon
- Menu item key: `'visits'` for active state tracking

### i18n Keys
Added to `messages.properties` and all 7 locale files (de, es, fa, ko, pt, ru, tr):
- `upcomingVisits` - Page title
- `upcomingVisits.subtitle` - Subtitle with `{0}` days parameter
- `upcomingVisits.empty` - Empty state message
- `upcomingVisits.filter.days` - "days" label for filter buttons
- `upcomingVisits.ownerName` - Column header
- `upcomingVisits.petName` - Column header
- `visit.date.past` - Past date validation message (added for consistency)

## Test Files

### UpcomingVisitsControllerTests.java (12 tests)
```
src/test/java/org/springframework/samples/petclinic/owner/UpcomingVisitsControllerTests.java
```
- `@WebMvcTest(UpcomingVisitsController.class)` with `@MockitoBean VisitRepository`
- Tests: default 7-day view, custom days (3, 14, 30), model attributes, empty visits, invalid days (0, -1, 91), boundary (1, 90)

### VisitRepositoryTests.java (5 tests)
```
src/test/java/org/springframework/samples/petclinic/owner/VisitRepositoryTests.java
```
- `@DataJpaTest` with `@AutoConfigureTestDatabase(replace = Replace.NONE)`
- Tests: find within range, empty when no visits, ordering by date, exclude outside range, include owner/pet names

## Git Commits

```
6219f38 feat: add upcoming visits page with repository, controller, and tests
cebb80d feat: add upcoming visits navigation link to navbar
6d4e4e0 feat: add upcomingVisits i18n keys to base messages.properties
d910fb4 feat: add upcomingVisits i18n keys to German locale
331039e feat: add upcomingVisits i18n keys to Spanish locale
1c0621c feat: add upcomingVisits i18n keys to Farsi locale
c911080 feat: add upcomingVisits i18n keys to Korean locale
55f930b feat: add upcomingVisits i18n keys to Portuguese locale
259a468 feat: add upcomingVisits i18n keys to Russian locale
2a979d2 feat: add upcomingVisits i18n keys to Turkish locale
```

## Verification

- All implementation files follow established repository patterns
- Interface-based projection chosen over record for Spring Data JPA native query compatibility
- Native SQL used because Visit entity has no `@ManyToOne` relationship to Pet
- Controller uses constructor injection (no field injection)
- Template follows Liatrio branding patterns from vetList.html
- All 8 locale files have synchronized message keys
