# Task 7-9 Proof Artifacts: Configurable Time Window (Unit 2)

## Implementation Details

### Days Parameter Support (Task 7)
- Controller accepts `@RequestParam(defaultValue = "7") int days`
- Date range calculated as `LocalDate.now()` to `LocalDate.now().plusDays(days)`
- Model attributes: `visits`, `days`, `startDate`, `endDate`

### Days Validation (Task 8)
- `days < 1` (including 0 and negative): defaults to 7
- `days > 90`: clamps to 90
- `days` between 1 and 90: used as-is
- Boundary values 1 and 90 are valid

### Quick Filter Buttons (Task 9)
- Button group with `liatrio-form-actions` styling
- Buttons for 3, 7, 14, and 30 days
- Active button gets `btn-primary` class
- Inactive buttons get `liatrio-btn-secondary` class
- `aria-current="true"` set on active button
- Wrapped in `<nav aria-label="Time window filter">`

## Controller Test Coverage (from UpcomingVisitsControllerTests.java)

| Test Method | Description | Expected Result |
|---|---|---|
| testShowUpcomingVisitsDefaultDays | GET /visits/upcoming with no params | days=7, OK status |
| testShowUpcomingVisitsWithCustomDays | GET /visits/upcoming?days=14 | days=14 |
| testShowUpcomingVisitsWithThreeDays | GET /visits/upcoming?days=3 | days=3 |
| testModelContainsVisits | Verify visits model attribute | 2 mock visits |
| testModelContainsDateAttributes | Verify startDate/endDate | Both present |
| testEmptyVisitsList | No visits in repository | Empty list |
| testInvalidDaysZeroDefaultsToSeven | days=0 | days=7 (default) |
| testInvalidDaysNegativeDefaultsToSeven | days=-1 | days=7 (default) |
| testInvalidDaysExceedsMaxClampsToNinety | days=91 | days=90 (clamped) |
| testDaysAtBoundaryOne | days=1 | days=1 (valid) |
| testDaysAtBoundaryNinety | days=90 | days=90 (valid) |
| testThirtyDaysFilter | days=30 | days=30 (valid) |

## Git Commits

All configurable time window functionality was included in the core commit:
```
6219f38 feat: add upcoming visits page with repository, controller, and tests
```

## Verification

- 12 controller tests cover all days parameter variations
- Validation logic handles edge cases (0, negative, exceeds max)
- Filter buttons correctly toggle active state based on days parameter
- Template uses Thymeleaf expressions to conditionally apply CSS classes
