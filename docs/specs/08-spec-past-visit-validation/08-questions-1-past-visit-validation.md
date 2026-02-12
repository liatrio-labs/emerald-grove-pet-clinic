# 08 Questions Round 1 - Past Visit Validation

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Date Validation Rule

What specific date validation rule should be applied to visit scheduling?

- [ ] (A) Visits can only be scheduled for today or future dates (date >= today)
- [ ] (B) Visits can only be scheduled for future dates (date > today, excluding today)
- [ ] (C) Visits can be scheduled up to X days in the past (configurable grace period)
- [ ] (D) Other (describe)

**Notes:**

## 2. Validation Error Message

What should the validation error message communicate to users?

- [ ] (A) Simple message: "Visit date cannot be in the past"
- [ ] (B) Helpful message: "Visit date must be today or later. Please select a valid date."
- [ ] (C) Detailed message with current date: "Visit date must be on or after {current date}"
- [ ] (D) Other (describe)

**Notes:**

## 3. Validation Implementation Approach

Where should the date validation logic be implemented?

- [ ] (A) Create a new `VisitValidator` class (following the PetValidator pattern)
- [ ] (B) Add Bean Validation annotation to Visit entity (e.g., @Future or custom constraint)
- [ ] (C) Add validation directly in VisitController
- [ ] (D) Combination approach (specify which)
- [ ] (E) Other (describe)

**Notes:**

## 4. Existing Visit Data

How should existing visits with past dates be handled?

- [ ] (A) Leave existing past visits unchanged (validation only applies to new submissions)
- [ ] (B) Add migration to update existing past visits
- [ ] (C) Display warning for existing past visits but allow them to remain
- [ ] (D) Other (describe)

**Notes:**

## 5. Edge Case: Time Zone Considerations

Should the "today" date validation account for time zones?

- [ ] (A) Use server's local date/time (LocalDate.now())
- [ ] (B) Use UTC date/time
- [ ] (C) Use user's time zone (if available)
- [ ] (D) Not a concern for this implementation
- [ ] (E) Other (describe)

**Notes:**

## 6. User Experience: Form Behavior

What should happen when a user submits a past date?

- [ ] (A) Show validation error on the form, user must correct and resubmit
- [ ] (B) Show validation error and automatically set date to today
- [ ] (C) Prevent submission with client-side validation (HTML5 min attribute)
- [ ] (D) Combination: client-side prevention + server-side validation
- [ ] (E) Other (describe)

**Notes:**

## 7. Internationalization (i18n)

Should the validation error message support multiple languages?

- [ ] (A) Yes, add to all existing message property files (en, de, es, fa, ko, pt, ru, tr)
- [ ] (B) Yes, but only add English for now
- [ ] (C) No, use hardcoded message
- [ ] (D) Other (describe)

**Notes:**

## 8. Proof Artifacts

What proof artifacts should demonstrate this feature works correctly?

- [ ] (A) Screenshot: Form showing validation error for past date
- [ ] (B) Screenshot: Successful visit creation with today's date
- [ ] (C) Screenshot: Successful visit creation with future date
- [ ] (D) JUnit test output showing all validation tests pass
- [ ] (E) Playwright E2E test output showing past date rejection
- [ ] (F) All of the above
- [ ] (G) Other combination (specify)

**Notes:**

## 9. Success Criteria

How will we verify this feature is complete and working?

- [ ] (A) Unit tests for VisitValidator pass (today, future, past dates)
- [ ] (B) Controller tests verify validation errors are shown
- [ ] (C) Integration tests verify database behavior
- [ ] (D) E2E Playwright tests verify UI behavior
- [ ] (E) Code coverage meets 90%+ requirement
- [ ] (F) Manual testing confirms user experience
- [ ] (G) All of the above
- [ ] (H) Other combination (specify)

**Notes:**

## 10. Additional Requirements

Are there any other requirements or considerations for this feature?

**Notes:**
