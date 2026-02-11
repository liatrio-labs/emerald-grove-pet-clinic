# 08-tasks-past-visit-validation.md

## Task List for Past Visit Validation (Spec 08)

### Task 1: VisitValidator Unit Tests (RED Phase)

- [x] 1.0 Parent: Write failing VisitValidator unit tests
  - [x] 1.1 Create `VisitValidatorTests.java` with test for `supports()` method returning true for Visit class
  - [x] 1.2 Add test for `supports()` returning false for non-Visit class
  - [x] 1.3 Add test for valid visit with today's date passes validation
  - [x] 1.4 Add test for valid visit with future date passes validation
  - [x] 1.5 Add test for invalid visit with past date fails validation with correct error code
  - [x] 1.6 Add test for null date is handled gracefully (no NPE)

### Task 2: VisitValidator Implementation (GREEN Phase)

- [x] 2.0 Parent: Implement VisitValidator to make all tests pass
  - [x] 2.1 Create `VisitValidator.java` implementing Spring `Validator` interface with `supports()` and `validate()` methods
  - [x] 2.2 Run VisitValidator tests and verify all pass (GREEN)

### Task 3: i18n Message Key

- [x] 3.0 Parent: Add internationalized error message for past visit date
  - [x] 3.1 Add `visit.date.past` message key to `messages.properties` (base) and all locale files
  - [x] 3.2 Run I18nPropertiesSyncTest and verify it passes

### Task 4: VisitController Integration (RED-GREEN)

- [x] 4.0 Parent: Register VisitValidator in VisitController and add controller test
  - [x] 4.1 Add failing controller test `testProcessNewVisitFormWithPastDate()` in `VisitControllerTests.java`
  - [x] 4.2 Register VisitValidator in VisitController via `@InitBinder("visit")`
  - [x] 4.3 Run all controller tests and verify they pass

### Task 5: Full Test Suite and E2E Tests

- [x] 5.0 Parent: Run full test suite and add Playwright E2E test for past visit validation
  - [x] 5.1 Run full Java test suite (`./mvnw test`) and verify zero regressions
  - [x] 5.2 Add Playwright E2E test in `visit-scheduling.spec.ts` for past date rejection
  - [x] 5.3 Update existing E2E test to use valid future date instead of past date

### Task 6: Final Verification and Proof Artifacts

- [ ] 6.0 Parent: Final verification, proof artifacts, and documentation
  - [ ] 6.1 Run full Java test suite one final time and capture output
  - [ ] 6.2 Create proof artifacts for all tasks
