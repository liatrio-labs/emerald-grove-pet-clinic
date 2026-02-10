# Task 2.0 Proof Artifacts: RED - Write Failing Tests for Language Selector Component

## Overview

This document contains proof artifacts demonstrating the successful completion of Task 2.0: Writing failing tests for the language selector component following TDD RED phase.

## Test Class Created

**File:** `src/test/java/org/springframework/samples/petclinic/system/LanguageSelectorTests.java`

### Test Methods

1. `testLanguageSelectorIsPresent()` - Verifies language selector dropdown exists in navbar
2. `testLanguageSelectorShowsCurrentLanguage()` - Verifies dropdown button displays current language code (EN, ES, or DE)
3. `testLanguageSelectorContainsAllLanguages()` - Verifies dropdown menu contains links for English, Spanish, and German
4. `testLanguageLinksHaveCorrectHref()` - Verifies each language link has correct `?lang=xx` parameter

## Test Execution Results (RED Phase)

Tests are failing as expected since the language selector component hasn't been implemented yet:

```
[ERROR] Tests run: 4, Failures: 4, Errors: 0, Skipped: 0
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-surefire-plugin:3.5.4:test
```

### Test Failure Examples

```
java.lang.AssertionError:
Response content
Expected: a string containing "language-selector"
     but: was "<!DOCTYPE html>..."

Expected: a string containing "EN"
     but: was "<!DOCTYPE html>..."

Expected: a string containing "English"
     but: was "<!DOCTYPE html>..."

Expected: a string containing "?lang=en"
     but: was "<!DOCTYPE html>..."
```

## Code Quality

### Java Formatting

Code formatting was applied using Spring Java Format:

```bash
$ ./mvnw spring-javaformat:apply -q
```

All code follows repository formatting standards.

## Test Infrastructure

### Test Configuration

- **Annotation:** `@WebMvcTest(WelcomeController.class)` - Tests web layer in isolation
- **Framework:** JUnit 5 with MockMvc for testing controllers
- **Assertions:** Hamcrest matchers for content verification
- **Pattern:** Follows existing test patterns from `OwnerControllerTests.java`

### Dependencies Used

- Spring Boot Test
- MockMvc for HTTP request simulation
- Hamcrest for assertions

## Verification Summary

✅ Test class created with proper structure and annotations
✅ Four test methods written following TDD principles
✅ All tests fail as expected (RED phase confirmed)
✅ Code formatting applied and passes quality gates
✅ Test infrastructure follows repository standards

## Next Steps

The GREEN phase (Task 3.0) will implement the language selector component in `layout.html` to make these tests pass.

## Task Status

**Task 2.0: RED - Write Failing Tests for Language Selector Component** - ✅ **COMPLETE**

All sub-tasks (2.1 through 2.8) have been successfully completed following strict TDD methodology.
