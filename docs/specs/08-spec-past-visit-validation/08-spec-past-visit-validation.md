# 08-spec-past-visit-validation

## Introduction/Overview

Currently, the visit scheduling form allows users to schedule visits with dates in the past, which does not reflect real-world business requirements. Veterinary clinics need to ensure that visits can only be scheduled for today or future dates to maintain accurate scheduling workflows and prevent data entry errors. This feature adds validation to the visit form to reject past dates and provide clear, user-friendly error messaging.

## Goals

- Prevent scheduling visits with dates earlier than today
- Provide clear, user-friendly validation error messages when past dates are submitted
- Maintain existing functionality for scheduling visits for today and future dates
- Follow established validation patterns using custom validators as documented in DEVELOPMENT.md
- Display validation errors inline below the date field following UI_GUIDELINES.md patterns
- Use internationalization (i18n) for error messages to support all 8 supported languages

## User Stories

**As a clinic receptionist**, I want the system to prevent me from scheduling visits in the past, so that I avoid accidentally creating incorrect visit records due to date entry errors.

**As a clinic staff member**, I want to see a clear error message when I try to schedule a visit for a past date, so that I understand what went wrong and can correct it immediately.

**As a clinic administrator**, I want the system to enforce business rules automatically, so that data integrity is maintained without requiring manual oversight.

## Demoable Units of Work

### Unit 1: Past Visit Date Validation

**Purpose:** Implement server-side validation to reject past dates in the visit scheduling form, ensuring that only today's date or future dates can be submitted.

**Functional Requirements:**

- The system shall create a custom `VisitValidator` class implementing Spring's `Validator` interface
- The system shall validate that visit dates are not before today's date (`LocalDate.now()`)
- The system shall allow visits scheduled for today's date (same day appointments)
- The system shall allow visits scheduled for any future date
- The system shall register the `VisitValidator` in the `VisitController` using `@InitBinder("visit")`
- The user shall see an inline error message below the date field when submitting a past date
- The system shall use the error message key `visit.date.past` for internationalization
- The system shall provide translated error messages in all 8 supported languages (EN, ES, DE, FA, KO, PT, RU, TR)
- The system shall handle null dates gracefully without throwing exceptions (delegating to existing validators)
- The system shall achieve minimum 90% code coverage for the new validator class

**Proof Artifacts:**

- Test Report: JUnit tests for `VisitValidatorTests.java` pass with 100% success rate
- Test Report: `testProcessNewVisitFormWithPastDate()` in `VisitControllerTests.java` passes
- Screenshot: Browser form showing inline error message when past date is submitted
- Test Report: Playwright E2E test `visit-scheduling.spec.ts` includes past date rejection test that passes
- CLI: `./mvnw test` runs with zero regressions demonstrates all tests pass
- Test Report: JaCoCo coverage report shows >90% coverage for `VisitValidator.java`
- File Diff: All 8 message properties files include `visit.date.past` key with appropriate translations

## Non-Goals (Out of Scope)

1. **Future date limits** - No maximum future date restriction; clinics can schedule as far ahead as needed
2. **Time-of-day validation** - Only date validation; no time component validation
3. **Business hours validation** - No validation for clinic operating hours or days
4. **Holiday or weekend restrictions** - Visits can be scheduled on any day including weekends/holidays
5. **Veterinarian availability** - No checking of vet schedules or resource allocation
6. **Appointment reminder system** - No notifications or reminders functionality
7. **Appointment rescheduling** - This spec only covers initial scheduling validation
8. **Client-side validation** - Only server-side validation is implemented; no JavaScript date picker restrictions
9. **Historical visit records** - No changes to existing past visit records; validation only applies to new submissions

## Design Considerations

The visit validation follows established patterns from the codebase:

- **Validator Pattern**: Use Spring's `Validator` interface similar to `PetValidator`
- **Error Display**: Follow existing form error patterns with inline messages below the field
- **Error Styling**: Use Bootstrap's `.is-invalid` class and `.invalid-feedback` div for error display
- **Registration**: Register validator in controller using `@InitBinder` annotation pattern
- **Internationalization**: Add message keys to all properties files following existing i18n patterns
- **Testing Strategy**: Follow TDD approach with unit tests → integration tests → E2E tests

## Repository Standards

Follow established patterns and practices from the Emerald Grove Veterinary Clinic codebase:

**Architectural Patterns:**

- Layered architecture: Controller → Validator → Domain Model
- Spring MVC controller with validation via `@InitBinder`
- Custom validator implementing Spring's `Validator` interface
- Thymeleaf template with form binding and error display

**Coding Standards:**

- Follow existing package structure: `org.springframework.samples.petclinic.owner` package for Visit-related code
- Use constructor injection for dependencies (no field injection)
- Apply `@Controller` annotation (not `@RestController`)
- Follow Java naming conventions: camelCase for methods, PascalCase for classes

**Validator Implementation:**

- Implement `Validator` interface with `supports()` and `validate()` methods
- Use `errors.rejectValue("field", "error.key", "Default message")` for validation errors
- Check for null values before validation to avoid `NullPointerException`
- Use `LocalDate.now()` for current date comparison

**Testing Patterns:**

- Unit tests: Test validator logic in isolation with `VisitValidatorTests.java`
- Controller tests: Use `@WebMvcTest` with `MockMvc` for endpoint testing
- Integration tests: Verify form submission with `@SpringBootTest`
- E2E tests: Use Playwright in `e2e-tests/` directory
- Follow Arrange-Act-Assert pattern in all tests
- Mock dependencies using `@MockBean` in unit tests

**File Organization:**

- Validator: `src/main/java/org/springframework/samples/petclinic/owner/VisitValidator.java`
- Unit Tests: `src/test/java/org/springframework/samples/petclinic/owner/VisitValidatorTests.java`
- Controller Integration: Modify existing `VisitController.java`
- Controller Tests: Modify existing `VisitControllerTests.java`
- E2E Tests: Modify existing `e2e-tests/tests/visit-scheduling.spec.ts`
- i18n: Update all 8 `messages*.properties` files in `src/main/resources/messages/`

**TDD Workflow:**

- Follow Strict TDD: RED (write failing test) → GREEN (minimal implementation) → REFACTOR (improve code)
- Write validator unit tests first, then implement validator
- Write controller test, then register validator in controller
- Write E2E test, then verify full integration
- Maintain >90% code coverage for new code

**Commit Conventions:**

- Use conventional commits format: `feat: add past visit date validation`
- Reference issue number: `feat: add past visit date validation (#8)`
- Include co-author attribution: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

## Technical Considerations

**Validation Approach:**

- Custom validator provides better control and testability than JSR-303 annotations
- Use `LocalDate.isBefore(LocalDate.now())` for past date detection
- Handle null dates gracefully (delegate to existing `@NotNull` validation)
- Error message uses i18n key for multilingual support

**Controller Integration:**

- Register validator in `VisitController` using `@InitBinder("visit")` method
- Validator automatically invoked before form processing
- Existing `BindingResult` handling in controller remains unchanged

**Performance Considerations:**

- Validator logic is lightweight (single date comparison)
- No database queries or external calls
- Minimal memory footprint

**Error Handling:**

- Validation errors displayed inline below the date field
- Form submission prevented when validation fails
- User can correct and resubmit immediately
- Error messages are clear and actionable

**Internationalization:**

- Add message key to all 8 `messages*.properties` files
- Use descriptive error messages appropriate for each language
- Follow existing translation patterns in the codebase
- Test i18n sync with `I18nPropertiesSyncTest`

## Security Considerations

No specific security considerations identified. The validation is a business rule enforcement mechanism and does not handle sensitive data.

**Data Validation:**

- Server-side validation prevents client-side bypass attempts
- No user input is directly used in error messages (preventing XSS)
- Validation does not expose system information

**Proof Artifact Security:**

- Screenshots should not contain real patient information
- Use test data for all proof artifacts
- E2E tests use test fixtures, not production data

## Success Metrics

1. **Functional Completeness**: All functional requirements implemented and verified with proof artifacts
2. **Code Coverage**: Achieve >90% line coverage for `VisitValidator.java`
3. **Test Pass Rate**: 100% of unit, integration, and E2E tests pass
4. **Zero Regressions**: All existing tests continue to pass after implementation
5. **i18n Completeness**: All 8 language files include `visit.date.past` key with appropriate translations
6. **User Experience**: Clear, actionable error message displayed when past date is submitted

## Open Questions

No open questions at this time. The specification provides sufficient detail for implementation based on:

- GitHub issue #8 requirements
- Existing codebase patterns and conventions (PetValidator example)
- Comprehensive documentation (ARCHITECTURE.md, DEVELOPMENT.md, TESTING.md, UI_GUIDELINES.md)
- Clear functional requirements and proof artifacts defined in demoable unit
