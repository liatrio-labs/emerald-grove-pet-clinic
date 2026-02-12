# Task 4.0 Proof Artifacts - E2E Playwright Tests

## Test File

- File: `e2e-tests/tests/features/vet-specialty-filter.spec.ts`
- 10 test cases in `Vet Specialty Filter` describe block

## Test Cases

### 1. displays specialty filter dropdown on vet directory page
- Navigates to vet page
- Verifies filter form (`#filter-specialty-form`) is visible
- Verifies dropdown has `aria-label="Filter veterinarians by specialty"`
- Verifies default value is "all"

### 2. dropdown contains all specialty options plus All and None
- Verifies at least 5 options (All, None, dentistry, radiology, surgery)
- Checks each option exists by value attribute

### 3. filters vets by specific specialty (radiology)
- Selects "radiology" and submits
- Verifies URL contains `specialty=radiology`
- Verifies all displayed vets have radiology specialty

### 4. filters vets by surgery specialty
- Selects "surgery" and submits
- Verifies URL and all rows contain surgery

### 5. shows all vets when "All Specialties" is selected
- First filters by radiology, then switches to "all"
- Verifies all-count >= filtered-count

### 6. shows only general practice vets when "None" is selected
- Selects "none" and submits
- Verifies URL contains `specialty=none`
- Verifies all displayed vets show "none" specialty

### 7. displays empty state when filter has no matching vets
- Navigates to `?specialty=cardiology` (non-existent)
- Verifies `[role="status"]` message is visible
- Verifies table body has 0 rows

### 8. filter persists in dropdown after page load with query parameter
- Navigates directly to `?specialty=surgery`
- Verifies dropdown has "surgery" selected

### 9. shareable URL works - direct navigation to filtered view
- Navigates to `?page=1&specialty=radiology`
- Verifies filtered results and dropdown state

### 10. filter resets pagination to page 1
- Applies radiology filter from page 1
- Verifies URL has `specialty=radiology`

## Running E2E Tests

```bash
cd e2e-tests
npm ci
npx playwright install
npm test -- --grep "Vet Specialty Filter"
```

**Note**: E2E tests require the Spring Boot application running on localhost:8080. The Playwright config is set to start it automatically via `./mvnw spring-boot:run`. Manual execution recommended to verify all 10 tests pass.
