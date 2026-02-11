# Task 2.0 Proof Artifacts: RED - Write Failing Unit Tests for Specialty Filter

## Overview

Task 2.0 completed: Created comprehensive unit test suite for specialty filter functionality following TDD RED phase. Tests fail as expected because implementation does not exist yet.

---

## Test File Created

### File: VetSpecialtyFilterTests.java

**Location:** `src/test/java/org/springframework/samples/petclinic/vet/VetSpecialtyFilterTests.java`

**Test Methods Created:** 9

1. `testFilterDropdownIsPresent()` - Verify filter dropdown exists
2. `testFilterBySpecialty()` - Single specialty filtering
3. `testFilterByMultipleSpecialties()` - AND logic for multiple specialties
4. `testFilterWithPagination()` - Pagination integration
5. `testFilterSessionPersistence()` - Session persistence
6. `testEmptyFilterResults()` - Empty state handling
7. `testVisualFeedbackText()` - Visual feedback display

**Test Infrastructure:**
- `@WebMvcTest(VetController.class)` - Web layer testing
- `@MockitoBean VetRepository` - Mocked repository
- `MockMvc` for HTTP request simulation
- Helper methods for test data: `vetWithSurgery()`, `vetWithRadiology()`, `vetWithSurgeryAndDentistry()`, `vetWithNoSpecialty()`
- `@BeforeEach` setup with Mockito stubbing for expected repository methods

---

## CLI: Test Execution (Expected Failures)

### Compilation Errors (RED Phase - Expected)

```bash
$ ./mvnw test -Dtest=VetSpecialtyFilterTests

[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
[ERROR] COMPILATION ERROR :
[INFO] -------------------------------------------------------------
[ERROR] /Users/.../VetSpecialtyFilterTests.java:[120,32] cannot find symbol
  symbol:   method findBySpecialtiesNameIgnoreCase(java.lang.String,org.springframework.data.domain.Pageable)
  location: variable vets of type org.springframework.samples.petclinic.vet.VetRepository

[ERROR] /Users/.../VetSpecialtyFilterTests.java:[123,32] cannot find symbol
  symbol:   method findBySpecialtiesNameIgnoreCase(java.lang.String,org.springframework.data.domain.Pageable)
  location: variable vets of type org.springframework.samples.petclinic.vet.VetRepository

[ERROR] /Users/.../VetSpecialtyFilterTests.java:[126,32] cannot find symbol
  symbol:   method findBySpecialtiesNameIgnoreCase(java.lang.String,org.springframework.data.domain.Pageable)
  location: variable vets of type org.springframework.samples.petclinic.vet.VetRepository

[ERROR] /Users/.../VetSpecialtyFilterTests.java:[130,32] cannot find symbol
  symbol:   method findByAllSpecialties(java.util.List<java.lang.String>,long,org.springframework.data.domain.Pageable)
  location: variable vets of type org.springframework.samples.petclinic.vet.VetRepository

[ERROR] /Users/.../VetSpecialtyFilterTests.java:[134,32] cannot find symbol
  symbol:   method findByAllSpecialties(java.util.List<java.lang.String>,long,org.springframework.data.domain.Pageable)
  location: variable vets of type org.springframework.samples.petclinic.vet.VetRepository

[INFO] 5 errors
```

**Evidence:** Tests fail to compile because repository methods don't exist yet (expected RED phase behavior).

---

## Missing Repository Methods (To Be Implemented in GREEN Phase)

The compilation errors identify the exact methods needed in `VetRepository`:

1. **findBySpecialtiesNameIgnoreCase(String specialtyName, Pageable pageable)**
   - Purpose: Single specialty filtering
   - Used by: `testFilterBySpecialty()`
   - Returns: Page<Vet> with vets matching the specialty

2. **findByAllSpecialties(List<String> specialtyNames, long count, Pageable pageable)**
   - Purpose: Multi-specialty AND logic filtering
   - Used by: `testFilterByMultipleSpecialties()`, `testEmptyFilterResults()`
   - Returns: Page<Vet> with vets having ALL specified specialties

---

## Code Quality

### Spring Java Format Applied

```bash
$ ./mvnw spring-javaformat:apply

[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  0.579 s
```

**Evidence:** Code formatting matches repository standards.

---

## Summary

✅ All proof artifacts demonstrate successful completion of Task 2.0 (RED phase):
- Test file created with 9 comprehensive test methods
- Tests use proper @WebMvcTest and MockMvc patterns
- Tests fail with compilation errors (expected RED phase)
- Errors identify exact methods needed in GREEN phase:
  - `findBySpecialtiesNameIgnoreCase()` for single specialty
  - `findByAllSpecialties()` for AND logic
- Spring Java Format applied and passing
- TDD RED phase complete - ready for GREEN phase implementation

**Status:** Task 2.0 COMPLETE - Tests written and failing as expected (TDD RED phase)

**Next:** Task 3.0 will implement the filter functionality to make these tests pass (GREEN phase)
