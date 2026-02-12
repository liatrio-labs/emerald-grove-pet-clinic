# Task 3.0 Proof Artifacts - UI Filter Dropdown

## Template Changes

### vetList.html

Added filter form section above the vet table:

```html
<section class="liatrio-section">
  <div class="liatrio-form-card">
    <form id="filter-specialty-form" th:action="@{/vets.html}" method="get">
      <select id="specialty" name="specialty"
              aria-label="Filter veterinarians by specialty"
              aria-describedby="specialty-help">
        <option value="all">All Specialties</option>
        <option value="none">None (General Practice)</option>
        <!-- Dynamic specialty options from availableSpecialties -->
      </select>
      <button type="submit">Filter</button>
    </form>
  </div>
</section>
```

### Features Implemented

1. **Filter Dropdown**: `<select>` element with `id="specialty"` and ARIA attributes for accessibility
2. **Option Groups**: "All Specialties" (value="all"), "None (General Practice)" (value="none"), plus dynamic specialty options
3. **Filter Persistence**: Dropdown reflects current filter via `th:selected="${specialtyFilter == spec}"`
4. **Empty State**: `<div role="status" aria-live="polite">` shown when `listVets` is empty
5. **Pagination Integration**: All pagination links include `&specialty=' + ${specialtyFilter}` parameter
6. **i18n**: All user-facing strings use `#{vets.filter.*}` message keys

### i18n Keys Added

Added 6 keys to all 8 locale files:

| Key | English |
|-----|---------|
| `vets.filter.label` | Filter by Specialty |
| `vets.filter.help` | Select a specialty to filter... |
| `vets.filter.all` | All Specialties |
| `vets.filter.none` | None (General Practice) |
| `vets.filter.submit` | Filter |
| `vets.filter.empty` | No veterinarians found... |

Locales updated: en, de, es, ko, fa, pt, ru, tr

### Accessibility

- `aria-label="Filter veterinarians by specialty"` on select element
- `aria-describedby="specialty-help"` linking to help text
- `role="status" aria-live="polite"` on empty state message

### URL

- `http://localhost:8080/vets.html?specialty=surgery` - Direct navigation to filtered view
- `http://localhost:8080/vets.html?specialty=none` - General practice vets only
- `http://localhost:8080/vets.html?specialty=all` - All vets (default)

**Note**: Screenshots require running the application locally. Run `./mvnw spring-boot:run` and visit the URLs above.
