# Task 1.0 Proof Artifacts: Repository Layer - Telephone and City Search

## Test Results

All ClinicServiceTests pass, including new telephone, city, and multi-field search tests.

```bash
$ ./mvnw test -Dtest=ClinicServiceTests

[INFO] Tests run: 13, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

**Tests breakdown:**
- 10 existing tests (backward compatibility maintained)
- 3 new tests added:
  - `shouldFindOwnersByTelephoneStartingWith()`
  - `shouldFindOwnersByCityStartingWithIgnoreCase()`
  - `shouldFindOwnersByMultipleFields()`

## Repository Methods Implemented

### OwnerRepository.java

```java
// Single-field search methods
Page<Owner> findByTelephoneStartingWith(String telephone, Pageable pageable);
Page<Owner> findByCityStartingWithIgnoreCase(String city, Pageable pageable);

// Multi-field search methods (AND logic)
Page<Owner> findByLastNameStartingWithAndCityStartingWithIgnoreCase(String lastName, String city, Pageable pageable);
Page<Owner> findByLastNameStartingWithAndTelephoneStartingWith(String lastName, String telephone, Pageable pageable);
Page<Owner> findByLastNameStartingWithAndCityStartingWithIgnoreCaseAndTelephoneStartingWith(String lastName, String city, String telephone, Pageable pageable);
```

## Test Evidence

### 1. Telephone Search Test

```java
@Test
void shouldFindOwnersByTelephoneStartingWith() {
    // Search for owners whose telephone starts with "6085551"
    Page<Owner> owners = this.owners.findByTelephoneStartingWith("6085551", pageable);
    assertThat(owners).hasSize(2); // George Franklin, Betty Davis

    // Search for specific telephone prefix
    owners = this.owners.findByTelephoneStartingWith("6085557", pageable);
    assertThat(owners).hasSize(1); // Maria Escobito

    // Search with no matches
    owners = this.owners.findByTelephoneStartingWith("9999", pageable);
    assertThat(owners).isEmpty();
}
```

**Hibernate SQL:**
```sql
SELECT o1_0.id, o1_0.address, o1_0.city, o1_0.first_name, o1_0.last_name, o1_0.telephone
FROM owners o1_0
WHERE o1_0.telephone LIKE ? ESCAPE '\'
```

### 2. City Search Test

```java
@Test
void shouldFindOwnersByCityStartingWithIgnoreCase() {
    // Search for Madison (4 owners)
    Page<Owner> owners = this.owners.findByCityStartingWithIgnoreCase("Mad", pageable);
    assertThat(owners).hasSize(4);

    // Test case insensitivity
    owners = this.owners.findByCityStartingWithIgnoreCase("mad", pageable);
    assertThat(owners).hasSize(4);

    // Search for Monona (2 owners)
    owners = this.owners.findByCityStartingWithIgnoreCase("Monon", pageable);
    assertThat(owners).hasSize(2);

    // No matches
    owners = this.owners.findByCityStartingWithIgnoreCase("Chicago", pageable);
    assertThat(owners).isEmpty();
}
```

**Hibernate SQL:**
```sql
SELECT o1_0.id, o1_0.address, o1_0.city, o1_0.first_name, o1_0.last_name, o1_0.telephone
FROM owners o1_0
WHERE UPPER(o1_0.city) LIKE UPPER(?) ESCAPE '\'
```

### 3. Multi-Field Search Test

```java
@Test
void shouldFindOwnersByMultipleFields() {
    // lastName + city
    Page<Owner> owners = this.owners.findByLastNameStartingWithAndCityStartingWithIgnoreCase(
        "Franklin", "Madison", pageable);
    assertThat(owners).hasSize(1);

    // lastName + telephone
    owners = this.owners.findByLastNameStartingWithAndTelephoneStartingWith(
        "Franklin", "608555102", pageable);
    assertThat(owners).hasSize(1);

    // All three fields
    owners = this.owners.findByLastNameStartingWithAndCityStartingWithIgnoreCaseAndTelephoneStartingWith(
        "Franklin", "Madison", "608555102", pageable);
    assertThat(owners).hasSize(1);

    // No matches
    owners = this.owners.findByLastNameStartingWithAndCityStartingWithIgnoreCase(
        "Franklin", "Windsor", pageable);
    assertThat(owners).isEmpty();
}
```

**Hibernate SQL (AND logic):**
```sql
-- lastName + city
SELECT ... FROM owners o1_0
WHERE o1_0.last_name LIKE ? ESCAPE '\'
  AND UPPER(o1_0.city) LIKE UPPER(?) ESCAPE '\'

-- lastName + telephone
SELECT ... FROM owners o1_0
WHERE o1_0.last_name LIKE ? ESCAPE '\'
  AND o1_0.telephone LIKE ? ESCAPE '\'

-- All three fields
SELECT ... FROM owners o1_0
WHERE o1_0.last_name LIKE ? ESCAPE '\'
  AND UPPER(o1_0.city) LIKE UPPER(?) ESCAPE '\'
  AND o1_0.telephone LIKE ? ESCAPE '\'
```

## Backward Compatibility

All 10 existing ClinicServiceTests continue to pass:
- `shouldFindOwnersByLastName()` ✓
- `shouldFindSingleOwnerWithPet()` ✓
- `shouldInsertOwner()` ✓
- `shouldUpdateOwner()` ✓
- `shouldFindAllPetTypes()` ✓
- `shouldInsertPetIntoDatabaseAndGenerateId()` ✓
- `shouldUpdatePetName()` ✓
- `shouldFindVets()` ✓
- `shouldAddNewVisitForPet()` ✓
- `shouldFindVisitsByPetId()` ✓

## TDD Compliance

✅ **RED Phase**: Wrote failing tests before implementation
✅ **GREEN Phase**: Implemented minimal code to pass tests
✅ **REFACTOR Phase**: Reviewed for duplication (none found)

## Spring Data JPA Query Derivation

All methods use Spring Data JPA naming conventions for automatic query generation:
- `StartingWith` → SQL `LIKE 'value%'`
- `IgnoreCase` → SQL `UPPER(column) LIKE UPPER(?)`
- `And` → SQL `AND` operator

No custom `@Query` annotations needed.
