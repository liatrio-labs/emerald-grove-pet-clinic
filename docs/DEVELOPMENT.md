# Development Guide

This guide covers development setup, testing, and contribution guidelines for the Emerald Grove Veterinary Clinic application.

## Prerequisites

- **Java 17** or later
- **Maven 3.6+** or **Gradle 7+**
- **Git** for version control
- **Docker** (optional, for containerized databases)

## Development Workflow

### TDD-First Development Process

⚠️ **Critical**: This project enforces **Strict Test-Driven Development (TDD)**. All development must follow the Red-Green-Refactor cycle:

#### 1. RED Phase - Write Failing Test

- Write a test that defines the desired behavior
- Ensure the test fails for the correct reason
- Test should be specific and focused on one behavior

#### 2. GREEN Phase - Make Test Pass

- Write the **minimum** code required to make the test pass
- No extra functionality beyond what the test requires
- Focus on making the test pass quickly

#### 3. REFACTOR Phase - Improve Code

- Improve code structure while keeping tests green
- Eliminate duplication and improve readability
- Ensure all tests still pass

### Feature Development Process

1. **Requirements Analysis**: Understand the feature requirements
2. **Test Design**: Write comprehensive failing tests
3. **TDD Implementation**: Follow Red-Green-Refactor cycle
4. **Integration**: Verify with existing code
5. **Review**: Code review and feedback
6. **Documentation**: Update relevant documentation

### TDD Quality Gates

#### Before Writing Code

- [ ] Test is written and failing
- [ ] Test clearly defines expected behavior
- [ ] Test covers edge cases and error conditions

#### Before Commit

- [ ] All tests pass (including new ones)
- [ ] Code coverage meets standards (>90%)
- [ ] Code follows clean code principles
- [ ] No code duplication

#### Before Merge

- [ ] Peer review completed
- [ ] Integration tests pass
- [ ] Documentation updated
- [ ] Performance impact assessed

## Development Setup

### Clone and Build

```bash
git clone <repository-url>
cd spring-petclinic

# Maven
./mvnw spring-boot:run

# Gradle
./gradlew bootRun
```

### IDE Configuration

#### IntelliJ IDEA

1. Open the project via `File -> Open` and select the `pom.xml`
2. Run configuration `PetClinicApplication` should be created automatically
3. Alternatively, right-click `PetClinicApplication` main class and select `Run`

#### Eclipse/STS

1. Import via `File -> Import -> Maven -> Existing Maven project`
2. Select the root directory of the cloned repo
3. Right-click project and `Run As -> Maven install` to generate resources
4. Run the application's main method by right-clicking and choosing `Run As -> Java Application`

#### VS Code

1. Install the Extension Pack for Java
2. Open the project folder
3. Use the integrated terminal to run `./mvnw spring-boot:run`

## Database Configuration

### Default (H2)

The application uses an in-memory H2 database by default with sample data.

- **Console:** `http://localhost:8080/h2-console`
- **JDBC URL:** `jdbc:h2:mem:<uuid>` (UUID shown in console)

### Persistent Databases

#### MySQL

```bash
# Start MySQL
docker run -e MYSQL_USER=petclinic -e MYSQL_PASSWORD=petclinic -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=petclinic -p 3306:3306 mysql:8.4

# Run with MySQL profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
```

#### PostgreSQL

```bash
# Start PostgreSQL
docker run -e POSTGRES_USER=petclinic -e POSTGRES_PASSWORD=petclinic -e POSTGRES_DB=petclinic -p 5432:5432 postgres:17

# Run with PostgreSQL profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
```

### Docker Compose

```bash
# MySQL
docker compose up mysql

# PostgreSQL
docker compose up postgres
```

### Tilt (PostgreSQL + local app)

```bash
tilt up
```

Tilt uses Docker Compose to start PostgreSQL and runs the app locally with the `postgres` profile. The database data is persisted under `.local/postgres-data`.

DBHub connection string:

```text
postgres://petclinic:petclinic@localhost:5432/petclinic
```

To stop Tilt:

```bash
tilt down
```

## Search Implementation Patterns

The application uses Spring Data JPA query methods for flexible search functionality across different entities.

### Repository Query Methods

Spring Data JPA automatically implements query methods based on method naming conventions.

#### Example: Owner Search

```java
public interface OwnerRepository extends JpaRepository<Owner, Integer> {
    // Prefix matching - finds owners whose last name starts with the given string
    Page<Owner> findByLastNameStartingWith(String lastName, Pageable pageable);

    // Exact match by ID
    Optional<Owner> findById(Integer id);
}
```

**Key patterns:**

- **`findBy{Property}StartingWith`** - Prefix matching (e.g., "Davis" matches "Davis", "Davidson")
- **`findBy{Property}Containing`** - Substring matching (e.g., "vis" matches "Davis")
- **`findBy{Property}`** - Exact matching

### Multi-Field Search Patterns

For searching across multiple fields, use query method composition:

```java
// Search by multiple fields with OR logic
Page<Owner> findByLastNameStartingWithOrFirstNameStartingWith(
    String lastName, String firstName, Pageable pageable);

// Search by multiple fields with AND logic
Page<Owner> findByLastNameAndCity(String lastName, String city, Pageable pageable);
```

### Search Matching Strategies

#### Prefix Matching (Current Implementation)

The owner search uses prefix matching for better performance and predictable results:

```java
// Controller usage
Page<Owner> owners = ownerRepository.findByLastNameStartingWith(lastName, pageable);
```

**Advantages:**

- Fast database index utilization
- Predictable results for users
- Supports autocomplete functionality

#### Full-Text Search (Optional Enhancement)

For more flexible search, consider implementing full-text search:

```java
@Query("SELECT o FROM Owner o WHERE LOWER(o.lastName) LIKE LOWER(CONCAT('%', :term, '%'))")
Page<Owner> searchByLastName(@Param("term") String term, Pageable pageable);
```

### Backwards Compatibility

When enhancing search functionality:

1. **Add new methods** rather than modifying existing ones
2. **Maintain existing method signatures** for API stability
3. **Use method overloading** for additional search options

```java
// Original method - keep unchanged
Page<Owner> findByLastNameStartingWith(String lastName, Pageable pageable);

// New enhanced method
Page<Owner> findByLastNameContaining(String lastName, Pageable pageable);
```

### Input Normalization

Always normalize search input in controllers:

```java
@GetMapping("/owners")
public String processFindForm(@RequestParam(defaultValue = "1") int page,
                             Owner owner, BindingResult result, Model model) {
    // Normalize empty input
    if (owner.getLastName() == null || owner.getLastName().trim().isEmpty()) {
        owner.setLastName("");
    }

    // Perform search
    Page<Owner> owners = ownerRepository.findByLastNameStartingWith(
        owner.getLastName().trim(), PageRequest.of(page - 1, 5));

    return "owners/ownersList";
}
```

### Pagination Support

Always use `Pageable` for search results to handle large datasets:

```java
// Repository method with pagination
Page<Owner> findByLastNameStartingWith(String lastName, Pageable pageable);

// Controller usage
Pageable pageable = PageRequest.of(page - 1, pageSize);
Page<Owner> results = repository.findByLastNameStartingWith(searchTerm, pageable);
```

### Testing Search Methods

Write tests for different search scenarios:

```java
@Test
void shouldFindOwnersByLastNamePrefix() {
    Page<Owner> owners = repository.findByLastNameStartingWith("Davis", pageable);
    assertThat(owners).isNotEmpty();
    assertThat(owners.getContent().get(0).getLastName()).startsWith("Davis");
}

@Test
void shouldReturnEmptyForNonMatchingSearch() {
    Page<Owner> owners = repository.findByLastNameStartingWith("NonExistent", pageable);
    assertThat(owners).isEmpty();
}
```

## Testing

### Run Tests

```bash
# Maven
./mvnw test

```

For comprehensive testing information including test patterns, database-specific tests, and best practices, see the **[Testing Guide](TESTING.md)**.

### Quick Test Commands

Integration tests are available for different database configurations:

- H2 (default)
- MySQL (using Testcontainers)
- PostgreSQL (using Docker Compose)

```bash
# Run specific test types
./mvnw test -Dtest="*ControllerTests"     # Web layer tests
./mvnw test -Dtest="*IntegrationTests"   # Integration tests
./mvnw test -Dtest=MySqlIntegrationTests  # MySQL-specific tests
```

## Data Validation

The application uses two complementary validation approaches: Bean Validation (JSR-303) and custom validators.

### Bean Validation Annotations

Use JSR-303 annotations for standard validation rules on entity classes:

```java
@Entity
@Table(name = "owners")
public class Owner extends Person {

    @NotBlank
    private String address;

    @NotBlank
    private String city;

    @NotBlank
    @Pattern(regexp = "\\d{10}", message = "{telephone.invalid}")
    private String telephone;
}
```

**Common annotations:**

- **`@NotBlank`** - Field cannot be empty or whitespace
- **`@NotNull`** - Field cannot be null
- **`@Pattern`** - Field must match regular expression
- **`@Size(min, max)`** - Field length constraints
- **`@Min` / `@Max`** - Numeric range constraints

### Custom Validators

For complex business rules, implement Spring's `Validator` interface:

```java
public class PetValidator implements Validator {

    private static final String REQUIRED = "required";

    @Override
    public void validate(Object obj, Errors errors) {
        Pet pet = (Pet) obj;

        // Name validation
        if (!StringUtils.hasText(pet.getName())) {
            errors.rejectValue("name", REQUIRED, REQUIRED);
        }

        // Type validation
        if (pet.isNew() && pet.getType() == null) {
            errors.rejectValue("type", REQUIRED, REQUIRED);
        }

        // Birth date validation
        if (pet.getBirthDate() == null) {
            errors.rejectValue("birthDate", REQUIRED, REQUIRED);
        }
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return Pet.class.isAssignableFrom(clazz);
    }
}
```

**When to use custom validators:**

- Cross-field validation (e.g., date ranges)
- Complex business rules
- Conditional validation logic
- Database-dependent validation

### Form vs Search Validation

Different validation rules apply to different contexts:

#### Form Validation (Strict)

Forms use strict validation to ensure data quality:

```java
@PostMapping("/owners/new")
public String processCreationForm(@Valid Owner owner, BindingResult result) {
    if (result.hasErrors()) {
        return "owners/createOrUpdateOwnerForm";
    }
    ownerRepository.save(owner);
    return "redirect:/owners/" + owner.getId();
}
```

**Characteristics:**

- All fields must pass validation
- User cannot proceed with invalid data
- Error messages displayed inline

#### Search Validation (Lenient)

Search forms use lenient validation:

```java
@GetMapping("/owners")
public String processFindForm(Owner owner, BindingResult result, Model model) {
    // Allow empty search to show all results
    if (owner.getLastName() == null || owner.getLastName().trim().isEmpty()) {
        owner.setLastName("");
    }

    // Perform search without validation errors
    Page<Owner> owners = ownerRepository.findByLastNameStartingWith(
        owner.getLastName(), pageable);

    return "owners/ownersList";
}
```

**Characteristics:**

- Empty input allowed (show all results)
- No blocking validation errors
- Normalize input rather than reject

### Validation Error Messages

Define validation messages in `messages.properties`:

```properties
# Generic validation messages
required=is required
notFound=has not been found
duplicate=is already in use
nonNumeric=must be all numeric

# Field-specific messages
telephone.invalid=Telephone must be a 10-digit number
typeMismatch.date=invalid date
typeMismatch.birthDate=invalid date
```

Reference messages in validation annotations:

```java
@Pattern(regexp = "\\d{10}", message = "{telephone.invalid}")
private String telephone;
```

### Testing Validation

#### Bean Validation Tests

```java
@Test
void shouldNotValidateWhenTelephoneInvalid() {
    Owner owner = new Owner();
    owner.setFirstName("John");
    owner.setLastName("Doe");
    owner.setAddress("123 Main St");
    owner.setCity("Boston");
    owner.setTelephone("123");  // Invalid - must be 10 digits

    Validator validator = createValidator();
    Set<ConstraintViolation<Owner>> violations = validator.validate(owner);

    assertThat(violations).hasSize(1);
    assertThat(violations.iterator().next().getMessage())
        .isEqualTo("Telephone must be a 10-digit number");
}
```

#### Custom Validator Tests

```java
@Test
void shouldRejectPetWithoutName() {
    Pet pet = new Pet();
    pet.setBirthDate(LocalDate.now());
    pet.setType(new PetType());

    PetValidator validator = new PetValidator();
    Errors errors = new BeanPropertyBindingResult(pet, "pet");
    validator.validate(pet, errors);

    assertThat(errors.hasFieldErrors("name")).isTrue();
    assertThat(errors.getFieldError("name").getCode()).isEqualTo("required");
}
```

### Best Practices

1. **Layer validation appropriately**:
   - Bean validation for field-level constraints
   - Custom validators for business logic
   - Controller-level for context-specific validation

2. **Use meaningful error messages**:
   - Keep messages user-friendly
   - Avoid technical jargon
   - Support internationalization

3. **Test validation thoroughly**:
   - Test valid cases
   - Test each validation constraint
   - Test edge cases and boundary values

4. **Distinguish form vs search validation**:
   - Forms: strict validation, block submission
   - Search: lenient validation, normalize input

## Project Structure

```text
src/main/java/org/springframework/samples/petclinic/
├── PetClinicApplication.java     # Main application class
├── model/                        # Domain entities
│   ├── BaseEntity.java          # Base entity with ID
│   ├── NamedEntity.java         # Named entity base class
│   └── Person.java              # Person base class
├── owner/                        # Owner-related components
│   ├── Owner.java               # Owner entity
│   ├── OwnerController.java     # Web controller
│   ├── OwnerRepository.java     # Data repository
│   ├── Pet.java                 # Pet entity
│   ├── PetController.java       # Pet web controller
│   └── PetType.java             # Pet type entity
├── vet/                          # Veterinarian components
│   ├── Vet.java                 # Vet entity
│   ├── VetController.java       # Vet web controller
│   ├── VetRepository.java       # Vet repository
│   └── Specialty.java           # Medical specialty entity
└── system/                       # System utilities
    ├── CacheConfiguration.java  # Caching setup
    └── PetClinicRuntimeHints.java # Runtime hints
```

## Internationalization (i18n)

The application supports multiple languages through Spring's internationalization framework.

### Supported Languages

The application currently supports 8 languages:

- **English** (default) - `messages_en.properties`
- **German** - `messages_de.properties`
- **Spanish** - `messages_es.properties`
- **Persian** - `messages_fa.properties`
- **Korean** - `messages_ko.properties`
- **Portuguese** - `messages_pt.properties`
- **Russian** - `messages_ru.properties`
- **Turkish** - `messages_tr.properties`

All message files are located in `src/main/resources/messages/`.

### Language Configuration

Internationalization is configured in `WebConfiguration.java`:

```java
@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    @Bean
    public LocaleResolver localeResolver() {
        SessionLocaleResolver resolver = new SessionLocaleResolver();
        resolver.setDefaultLocale(Locale.ENGLISH);
        return resolver;
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor interceptor = new LocaleChangeInterceptor();
        interceptor.setParamName("lang");
        return interceptor;
    }
}
```

**Key components:**

- **LocaleResolver**: Stores user's language preference in session
- **LocaleChangeInterceptor**: Allows language switching via URL parameter
- **Default Locale**: English is used when no language is specified

### Language Switching

Users can switch languages by appending the `lang` parameter to any URL:

```text
http://localhost:8080/?lang=es      # Switch to Spanish
http://localhost:8080/?lang=de      # Switch to German
http://localhost:8080/owners?lang=ko # Switch to Korean
```

The selected language persists across requests within the user's session.

### Message Key Conventions

Message keys follow a structured naming convention:

```properties
# Entity names
owner=Owner
pet=Pet
vet=Veterinarian

# Field labels
firstName=First Name
lastName=Last Name
birthDate=Birth Date

# Actions
addOwner=Add Owner
editOwner=Edit Owner
findOwners=Find Owners

# Validation messages
required=is required
notFound=has not been found
telephone.invalid=Telephone must be a 10-digit number

# Error messages
error.404=The requested page was not found.
error.500=An internal server error occurred.
```

**Best practices:**

- Use lowercase with dots for hierarchy (e.g., `home.hero.title`)
- Keep keys descriptive and consistent
- Group related keys with common prefixes
- Use generic keys for reusable messages (e.g., `required`, `notFound`)

### Using Messages in Templates

Reference message keys in Thymeleaf templates using the `#{}` syntax:

```html
<!-- Simple message -->
<h2 th:text="#{owner}">Owner</h2>

<!-- Field labels -->
<label th:text="#{firstName}">First Name</label>
<input type="text" th:field="*{firstName}" />

<!-- Messages with parameters -->
<p th:text="#{welcome.user(${user.name})}">Welcome, User!</p>
```

### Using Messages in Java Code

Access messages programmatically in controllers and services:

```java
@Controller
public class OwnerController {

    @Autowired
    private MessageSource messageSource;

    @GetMapping("/owners/{ownerId}")
    public String showOwner(@PathVariable("ownerId") int ownerId,
                           Locale locale, Model model) {
        String title = messageSource.getMessage("owner", null, locale);
        model.addAttribute("pageTitle", title);
        return "owners/ownerDetails";
    }
}
```

### Adding New Languages

To add support for a new language:

1. **Create a new message file** following the naming pattern:

```bash
# Example: Adding French support
cp src/main/resources/messages/messages_en.properties \
   src/main/resources/messages/messages_fr.properties
```

2. **Translate all message keys** in the new file:

```properties
# messages_fr.properties
owner=Propriétaire
pet=Animal de compagnie
firstName=Prénom
lastName=Nom de famille
```

3. **No code changes required** - Spring automatically detects the new file

4. **Test the new language**:

```text
http://localhost:8080/?lang=fr
```

### Adding New Features with i18n

When adding new features, follow this workflow:

1. **Add message keys to `messages.properties`** (default/English):

```properties
# New feature messages
appointment.title=Appointment Schedule
appointment.date=Appointment Date
appointment.confirm=Confirm Appointment
```

2. **Add translations to all language files**:

```bash
# Add to messages_de.properties
appointment.title=Terminplan
appointment.date=Termin Datum
appointment.confirm=Termin bestätigen

# Add to messages_es.properties
appointment.title=Horario de Citas
appointment.date=Fecha de la Cita
appointment.confirm=Confirmar Cita
```

3. **Use keys in templates and code**:

```html
<h1 th:text="#{appointment.title}">Appointment Schedule</h1>
```

### Testing Internationalization

Test message resolution and language switching:

```java
@Test
void shouldLoadMessagesInDifferentLocales() {
    LocaleContextHolder.setLocale(Locale.ENGLISH);
    String englishMessage = messageSource.getMessage("owner", null,
        LocaleContextHolder.getLocale());
    assertThat(englishMessage).isEqualTo("Owner");

    LocaleContextHolder.setLocale(Locale.GERMAN);
    String germanMessage = messageSource.getMessage("owner", null,
        LocaleContextHolder.getLocale());
    assertThat(germanMessage).isEqualTo("Besitzer");
}
```

### Message Synchronization

Keep all language files synchronized:

- **Use tools** to detect missing keys across language files
- **Test runs** include `I18nPropertiesSyncTest.java` to verify consistency
- **Document changes** when adding or removing message keys

```bash
# The test suite includes automatic synchronization checks
./mvnw test -Dtest=I18nPropertiesSyncTest
```

### Fallback Behavior

When a message key is not found:

1. Spring checks the language-specific file (e.g., `messages_es.properties`)
2. If not found, falls back to default `messages.properties`
3. If still not found, returns the key itself as a string

This ensures the application remains functional even with incomplete translations.

## Customization

### Profiles

Switch between configurations using Spring profiles:

- `h2` (default) - In-memory database
- `mysql` - MySQL database
- `postgres` - PostgreSQL database

### CSS/SCSS

Update styling using the provided build profile:

```bash
./mvnw package -P css
```

The `petclinic.css` is generated from `petclinic.scss` combined with Bootstrap 5.

### Configuration Files

- `application.properties` - Main configuration
- `application-{profile}.properties` - Profile-specific settings

### Environment Variables

Override configuration:

```bash
export SPRING_PROFILES_ACTIVE=mysql
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/petclinic
```

## Containerization

Build a Docker image using Spring Boot build plugin:

```bash
./mvnw spring-boot:build-image
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Style

- Follow Spring Boot conventions
- Use meaningful variable and method names
- Add JavaDoc for public APIs
- Keep methods small and focused

### Testing Guidelines

- Write unit tests for business logic
- Add integration tests for data access
- Test web controllers with MockMvc
- Maintain test coverage above 90%

## Troubleshooting

### Common Issues

#### Build fails with Java version error

- Ensure Java 17+ is installed and active
- Check `JAVA_HOME` environment variable

#### Database connection errors

- Verify database is running
- Check profile-specific configuration
- Ensure correct database credentials

#### CSS not updating

- Run `./mvnw package -P css` to recompile styles
- Clear browser cache

#### Hot reload not working

- Ensure Spring Boot Devtools is included
- Check IDE auto-compilation settings

### Debug Mode

Enable debug logging:

```bash
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Dlogging.level.org.springframework=DEBUG"
```

## Performance

### Caching

The application uses Spring Cache abstraction. Configure caching in `CacheConfiguration.java`.

### Database Optimization

- Use appropriate indexes for frequent queries
- Consider connection pooling for production
- Monitor query performance with database tools

### Memory Management

- Monitor heap usage with JVM tools
- Consider garbage collection tuning for production
- Use profiling tools to identify bottlenecks
