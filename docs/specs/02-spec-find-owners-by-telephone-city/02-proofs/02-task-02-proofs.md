# Task 2.0 Proof Artifacts: Controller Layer - Multi-Field Search Handler

## Test Results

All OwnerControllerTests pass, including new multi-field search tests.

```bash
$ ./mvnw test -Dtest=OwnerControllerTests

[INFO] Tests run: 19, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

**Tests breakdown:**
- 13 existing tests (backward compatibility maintained)
- 6 new tests added:
  - `testSearchByTelephoneOnly()`
  - `testSearchByCityOnly()`
  - `testSearchByLastNameAndCity()`
  - `testTelephoneValidationFailsWithLessThan3Digits()`
  - `testCityValidationFailsWithLessThan2Characters()`
  - `testTelephoneFormattingIsStripped()`

## Controller Implementation

### Updated processFindForm() Method

```java
@GetMapping("/owners")
public String processFindForm(@RequestParam(defaultValue = "1") int page, Owner owner,
        BindingResult result, Model model) {
    // Extract search parameters
    String lastName = owner.getLastName();
    String city = owner.getCity();
    String telephone = owner.getTelephone();

    // Sanitize telephone input (strip non-numeric characters)
    if (telephone != null && !telephone.isEmpty()) {
        telephone = sanitizeTelephone(telephone);
        owner.setTelephone(telephone);
    }

    // Validate telephone (minimum 3 digits if provided)
    if (telephone != null && !telephone.isEmpty() && telephone.length() < 3) {
        result.rejectValue("telephone", "tooShort", "must be at least 3 digits");
        return "owners/findOwners";
    }

    // Validate city (minimum 2 characters if provided)
    if (city != null && !city.isEmpty() && city.length() < 2) {
        result.rejectValue("city", "tooShort", "must be at least 2 characters");
        return "owners/findOwners";
    }

    // Search based on which fields are provided
    Page<Owner> ownersResults = findOwnersBySearchCriteria(page, lastName, city, telephone);

    // Handle results (empty, single, or multiple)
    // ...
}
```

### Helper Methods

**1. Input Sanitization:**
```java
private String sanitizeTelephone(String telephone) {
    // Strip all non-numeric characters
    return telephone.replaceAll("[^0-9]", "");
}
```

**2. Search Criteria Message:**
```java
private String buildSearchCriteriaMessage(String lastName, String city, String telephone) {
    // Builds descriptive message: "not found matching: lastName='X', city='Y'"
    // ...
}
```

**3. Dynamic Search Logic:**
```java
private Page<Owner> findOwnersBySearchCriteria(int page, String lastName,
        String city, String telephone) {
    // Calls appropriate repository method based on filled fields:
    // - All three fields
    // - lastName + city
    // - lastName + telephone
    // - lastName only
    // - city only
    // - telephone only
    // - no criteria (return all)
}
```

## Test Evidence

### 1. Telephone-Only Search

```java
@Test
void testSearchByTelephoneOnly() throws Exception {
    given(this.owners.findByTelephoneStartingWith(eq("608555"), any(Pageable.class)))
        .willReturn(new PageImpl<>(List.of(george, other)));

    mockMvc.perform(get("/owners").param("telephone", "608555"))
        .andExpect(status().isOk())
        .andExpect(view().name("owners/ownersList"));
}
```
✅ **Passes** - Controller correctly calls `findByTelephoneStartingWith()`

### 2. City-Only Search

```java
@Test
void testSearchByCityOnly() throws Exception {
    given(this.owners.findByCityStartingWithIgnoreCase(eq("Madison"), any(Pageable.class)))
        .willReturn(new PageImpl<>(List.of(george, other)));

    mockMvc.perform(get("/owners").param("city", "Madison"))
        .andExpect(status().isOk())
        .andExpect(view().name("owners/ownersList"));
}
```
✅ **Passes** - Controller correctly calls `findByCityStartingWithIgnoreCase()`

### 3. Multi-Field Search (lastName + city)

```java
@Test
void testSearchByLastNameAndCity() throws Exception {
    given(this.owners.findByLastNameStartingWithAndCityStartingWithIgnoreCase(
        eq("Franklin"), eq("Madison"), any(Pageable.class)))
        .willReturn(new PageImpl<>(List.of(george, other)));

    mockMvc.perform(get("/owners").param("lastName", "Franklin").param("city", "Madison"))
        .andExpect(status().isOk())
        .andExpect(view().name("owners/ownersList"));
}
```
✅ **Passes** - Controller correctly combines search parameters with AND logic

### 4. Telephone Validation (< 3 digits)

```java
@Test
void testTelephoneValidationFailsWithLessThan3Digits() throws Exception {
    mockMvc.perform(get("/owners").param("telephone", "12"))
        .andExpect(status().isOk())
        .andExpect(model().attributeHasFieldErrors("owner", "telephone"))
        .andExpect(view().name("owners/findOwners"));
}
```
✅ **Passes** - Validation error returned for telephone with < 3 digits

### 5. City Validation (< 2 characters)

```java
@Test
void testCityValidationFailsWithLessThan2Characters() throws Exception {
    mockMvc.perform(get("/owners").param("city", "M"))
        .andExpect(status().isOk())
        .andExpect(model().attributeHasFieldErrors("owner", "city"))
        .andExpect(view().name("owners/findOwners"));
}
```
✅ **Passes** - Validation error returned for city with < 2 characters

### 6. Telephone Formatting Stripped

```java
@Test
void testTelephoneFormattingIsStripped() throws Exception {
    // Formatted input: "(608) 555-1023"
    // Expected sanitized: "6085551023"
    given(this.owners.findByTelephoneStartingWith(eq("6085551023"), any(Pageable.class)))
        .willReturn(new PageImpl<>(List.of(george, other)));

    mockMvc.perform(get("/owners").param("telephone", "(608) 555-1023"))
        .andExpect(status().isOk())
        .andExpect(view().name("owners/ownersList"));
}
```
✅ **Passes** - Non-numeric characters stripped from telephone input

## Backward Compatibility

All 13 existing OwnerControllerTests continue to pass:
- `testInitCreationForm()` ✓
- `testProcessCreationFormSuccess()` ✓
- `testProcessCreationFormHasErrors()` ✓
- `testInitFindForm()` ✓
- `testProcessFindFormSuccess()` ✓
- `testProcessFindFormByLastName()` ✓
- `testProcessFindFormNoOwnersFound()` ✓
- `testProcessFindFormSingleOwnerFound()` ✓
- `testInitUpdateOwnerForm()` ✓
- `testProcessUpdateOwnerFormSuccess()` ✓
- `testProcessUpdateOwnerFormHasErrors()` ✓
- `testShowOwner()` ✓
- `testProcessUpdateOwnerIdMismatch()` ✓

## Input Sanitization

The `sanitizeTelephone()` method strips all non-numeric characters:
- `"(608) 555-1023"` → `"6085551023"`
- `"608-555-1023"` → `"6085551023"`
- `"608.555.1023"` → `"6085551023"`

## Validation Rules

**Telephone:**
- Minimum 3 digits (after sanitization)
- Error message: "must be at least 3 digits"
- Field error: `telephone`

**City:**
- Minimum 2 characters
- Error message: "must be at least 2 characters"
- Field error: `city`

## Empty Results Messaging

When no owners are found, descriptive message shows search criteria:

**Examples:**
- `"not found matching: telephone='608555'"`
- `"not found matching: city='Chicago'"`
- `"not found matching: lastName='Smith', city='Seattle'"`
- `"not found matching: lastName='Jones', city='Boston', telephone='617555'"`

## TDD Compliance

✅ **RED Phase**: Wrote 6 failing tests before implementation
✅ **GREEN Phase**: Implemented multi-field search logic to pass tests
✅ **REFACTOR Phase**: Extracted helper methods (`sanitizeTelephone`, `buildSearchCriteriaMessage`, `findOwnersBySearchCriteria`)

## Search Logic Flow

The controller determines which repository method to call based on filled fields:

| lastName | city | telephone | Repository Method Called |
|----------|------|-----------|--------------------------|
| ✓ | ✓ | ✓ | `findByLastNameStartingWithAndCityStartingWithIgnoreCaseAndTelephoneStartingWith` |
| ✓ | ✓ | ✗ | `findByLastNameStartingWithAndCityStartingWithIgnoreCase` |
| ✓ | ✗ | ✓ | `findByLastNameStartingWithAndTelephoneStartingWith` |
| ✓ | ✗ | ✗ | `findByLastNameStartingWith` |
| ✗ | ✓ | ✗ | `findByCityStartingWithIgnoreCase` |
| ✗ | ✗ | ✓ | `findByTelephoneStartingWith` |
| ✗ | ✗ | ✗ | `findByLastNameStartingWith("")` (all owners) |
