# UI/UX Guidelines

This comprehensive guide provides standards, patterns, and best practices for UI/UX development in the Emerald Grove Veterinary Clinic application. It addresses recurring design questions and ensures consistency across all features.

## Table of Contents

- [Design System](#design-system)
- [Component Standards](#component-standards)
- [Responsive Design](#responsive-design)
- [Common UI Patterns](#common-ui-patterns)
- [Accessibility](#accessibility)
- [Implementation Examples](#implementation-examples)

## Design System

### Brand Identity

The application follows **Liatrio branding** guidelines inspired by [liatrio.com/brand](https://liatrio.com/brand).

#### Color Palette

```scss
// Primary Colors
$spring-green:      #24AE1D    // Primary action color
$spring-dark-green: #24AE1D    // Hover states
$spring-brown:      #111111    // Dark surfaces
$spring-grey:       #666666    // Muted text
$spring-light-grey: #1E2327    // Secondary surfaces

// Background Colors
$body-bg:           #1a1f23    // Main background
$card-bg:           #1E2327    // Card/panel background
$surface-bg:        #111111    // Hero/elevated surfaces

// Text Colors
$text-color:        #f8f9fa    // Primary text
$text-secondary:    #cccccc    // Secondary text
$text-muted:        #b3b3b3    // Help text/captions
$link-color:        #24AE1D    // Links (Liatrio green)
$link-hover:        #6db33f    // Link hover state

// Border Colors
$border-color:      #333333    // Dividers and borders
$border-translucent: rgba(255, 255, 255, 0.15)  // Subtle borders

// Accent Colors
$accent-lime:       #89df00    // Accent highlights
$alert-success:     #24AE1D    // Success states
$alert-danger:      #dc3545    // Error states
```

#### Typography

**Font Family**: DM Sans (via Google Fonts)

```scss
// Font Stack
font-family: "DM Sans", sans-serif;

// Headings
h1 {
  font-size: 24px;
  line-height: 30px;
  font-weight: 700;
}

h2 {
  font-size: 18px;
  line-height: 24px;
  font-weight: 600;
  margin-bottom: 10px;
}

h3 {
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  margin-bottom: 10px;
}

// Body Text
body {
  font-size: 14px;
  line-height: 1.6;
  font-weight: 400;
  color: #f8f9fa;
}

// Small Text
.liatrio-muted {
  font-size: 14px;
  color: #b3b3b3;
}

// Helper Classes
strong {
  font-weight: 700;
}
```

#### Spacing System

The application uses a consistent spacing scale based on 4px increments:

```scss
:root {
  --liatrio-space-1: 4px;     // Tight spacing
  --liatrio-space-2: 8px;     // Small spacing
  --liatrio-space-3: 12px;    // Default gap
  --liatrio-space-4: 16px;    // Medium spacing
  --liatrio-space-6: 24px;    // Large spacing
  --liatrio-space-8: 32px;    // Section spacing
  --liatrio-space-12: 48px;   // Major sections
}
```

**Usage Guidelines:**

- `space-1` (4px): Icon spacing, tight gaps
- `space-2` (8px): Label-to-input, inline elements
- `space-3` (12px): Form element gaps, button groups
- `space-4` (16px): Default padding inside cards
- `space-6` (24px): Card padding, section headers
- `space-8` (32px): Between major sections
- `space-12` (48px): Page-level vertical spacing

#### Border Radius

```scss
:root {
  --liatrio-radius-sm: 4px;   // Small elements (badges, pills)
  --liatrio-radius-md: 8px;   // Standard cards, buttons
  --liatrio-radius-lg: 16px;  // Hero sections, large panels
}
```

#### Shadows

```scss
:root {
  --liatrio-shadow-sm: 0 1px 2px rgba(17, 17, 17, 0.08);   // Subtle elevation
  --liatrio-shadow-md: 0 8px 24px rgba(17, 17, 17, 0.12); // Cards, modals
}
```

#### Icons

**Icon Library**: Font Awesome 4.x (via WebJars)

```html
<!-- Icon Usage -->
<span class="fa fa-search" aria-hidden="true"></span>
<span class="fa fa-home" aria-hidden="true"></span>
<span class="fa fa-th-list" aria-hidden="true"></span>
<span class="fa fa-user" aria-hidden="true"></span>
<span class="fa fa-exclamation-triangle" aria-hidden="true"></span>
```

**Common Icons:**

- `fa-search` - Search/find functionality
- `fa-home` - Home/dashboard
- `fa-th-list` - Lists/directory
- `fa-user` - User/owner management
- `fa-plus` - Add/create actions
- `fa-edit` - Edit actions
- `fa-check` - Success states
- `fa-times` - Error/close
- `fa-exclamation-triangle` - Warnings/errors
- `fa-step-forward` / `fa-step-backward` - Pagination
- `fa-fast-forward` / `fa-fast-backward` - First/last page

## Component Standards

### 1. Forms

#### Question: What form layout should I use?

**Answer**: Use horizontal form layout with Bootstrap's `.form-horizontal` class and wrap forms in `.liatrio-form` for consistent styling.

#### Standard Form Structure

```html
<div class="liatrio-form-card">
  <h2>Form Title</h2>
  <p class="liatrio-muted">Help text explaining the form purpose.</p>

  <form th:object="${entity}" class="form-horizontal liatrio-form" method="post">
    <div class="form-group">
      <!-- Form fields here -->
    </div>

    <div class="form-group">
      <div class="col-sm-offset-2 col-sm-10 liatrio-form-actions">
        <button type="submit" class="btn btn-primary">Submit</button>
        <a class="btn liatrio-btn-secondary" th:href="@{/cancel}">Cancel</a>
      </div>
    </div>
  </form>
</div>
```

#### Input Fields

Use the reusable `inputField` fragment for consistent form inputs:

```html
<!-- Text Input -->
<input th:replace="~{fragments/inputField :: input (#{firstName}, 'firstName', 'text')}" />

<!-- Date Input -->
<input th:replace="~{fragments/inputField :: input (#{birthDate}, 'birthDate', 'date')}" />

<!-- Manual Input (when fragment not suitable) -->
<div class="form-group">
  <label for="lastName" class="col-sm-2 control-label">Last Name</label>
  <div class="col-sm-10">
    <input class="form-control" th:field="*{lastName}" type="text" />
    <div class="help-inline">
      <p th:if="${#fields.hasErrors('lastName')}" th:errors="*{lastName}">Error</p>
    </div>
  </div>
</div>
```

#### Select Fields

```html
<select th:replace="~{fragments/selectField :: select (#{type}, 'type', ${types})}" />
```

#### Form Validation Display

```html
<div th:with="valid=${!#fields.hasErrors(name)}"
     th:class="${'form-group' + (valid ? '' : ' has-error')}">
  <label th:for="${name}" class="col-sm-2 control-label">Label</label>
  <div class="col-sm-10">
    <input class="form-control" type="text" th:field="*{__${name}__}" />
    <span th:if="${valid}" class="fa fa-ok form-control-feedback" aria-hidden="true"></span>
    <th:block th:if="${!valid}">
      <span class="fa fa-remove form-control-feedback" aria-hidden="true"></span>
      <span class="help-inline" th:errors="*{__${name}__}">Error</span>
    </th:block>
  </div>
</div>
```

#### Form Buttons

```html
<!-- Primary Action Button -->
<button type="submit" class="btn btn-primary">Save</button>

<!-- Secondary Action Button -->
<a class="btn liatrio-btn-secondary" th:href="@{/owners}">Cancel</a>

<!-- Button Group -->
<div class="liatrio-form-actions">
  <button type="submit" class="btn btn-primary">Add Owner</button>
  <a class="btn liatrio-btn-secondary" th:href="@{/owners}">Cancel</a>
</div>
```

**Button Styling:**

```scss
.btn-primary {
  min-width: 140px;
  height: 44px;
  padding: 0 18px;
  color: #111111;
  background: #24AE1D;
  border: 2px solid #24AE1D;
  transition: all 0.15s;
}

.liatrio-btn-secondary {
  min-width: 140px;
  height: 44px;
  padding: 0 18px;
  border: 1px solid #24AE1D;
  color: #24AE1D;
  background: transparent;
}
```

### 2. Tables

#### Question: How should I display tabular data?

**Answer**: Use `.liatrio-table` class with Bootstrap's `.table` and `.table-striped` for consistent table styling.

#### Standard Table Structure

```html
<div class="liatrio-table-card">
  <h2>Table Title</h2>
  <p class="liatrio-muted">Description of the data.</p>

  <table class="table table-striped liatrio-table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
      </tr>
    </thead>
    <tbody>
      <tr th:each="item : ${items}">
        <td th:text="${item.name}"></td>
        <td th:text="${item.value}"></td>
      </tr>
    </tbody>
  </table>
</div>
```

#### Data Display Table (Key-Value Pairs)

```html
<h2>Owner Information</h2>
<table class="table table-striped liatrio-table" th:object="${owner}">
  <tr>
    <th>Name</th>
    <td><b th:text="*{firstName + ' ' + lastName}"></b></td>
  </tr>
  <tr>
    <th>Address</th>
    <td th:text="*{address}"></td>
  </tr>
  <tr>
    <th>Telephone</th>
    <td th:text="*{telephone}"></td>
  </tr>
</table>
```

#### Table with Actions

```html
<table class="table table-striped liatrio-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Specialties</th>
    </tr>
  </thead>
  <tbody>
    <tr th:each="vet : ${vets}">
      <td>
        <a th:href="@{/vets/__${vet.id}__}" th:text="${vet.firstName + ' ' + vet.lastName}"></a>
      </td>
      <td th:text="${vet.specialties}"></td>
    </tr>
  </tbody>
</table>
```

#### Nested Tables

```html
<table class="table table-striped liatrio-table">
  <tr th:each="pet : ${owner.pets}">
    <td valign="top">
      <dl class="dl-horizontal">
        <dt>Name</dt>
        <dd th:text="${pet.name}"></dd>
        <dt>Birth Date</dt>
        <dd th:text="${#temporals.format(pet.birthDate, 'yyyy-MM-dd')}"></dd>
      </dl>
    </td>
    <td valign="top">
      <table class="table-condensed liatrio-table">
        <thead>
          <tr>
            <th>Visit Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr th:each="visit : ${pet.visits}">
            <td th:text="${#temporals.format(visit.date, 'yyyy-MM-dd')}"></td>
            <td th:text="${visit.description}"></td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</table>
```

### 3. Navigation

#### Question: How should navigation be structured?

**Answer**: Use the standard navbar layout with brand, links, and responsive collapse.

#### Navigation Structure

```html
<nav class="navbar navbar-expand-lg navbar-dark" role="navigation">
  <div class="container-fluid">
    <a class="navbar-brand" th:href="@{/}">
      <span class="navbar-brand-logo" aria-hidden="true"></span>
      <span class="navbar-brand-text">Emerald Grove Veterinary Clinic</span>
    </a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-navbar">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="main-navbar">
      <ul class="nav navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" th:href="@{/}">
            <span class="fa fa-home" aria-hidden="true"></span>
            <span>Home</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" th:href="@{/owners/find}">
            <span class="fa fa-search" aria-hidden="true"></span>
            <span>Find Owners</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>
```

**Navigation Styling:**

```scss
.navbar {
  border-top: 4px solid #24AE1D;
  background-color: #111111;
}

.navbar a.navbar-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.navbar li > a {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  padding: 28px 20px;
  text-transform: uppercase;
  font-size: 14px;
  transition: all 0.15s;
}

.navbar li:hover > a {
  color: #eeeeee;
  background-color: #6db33f;
}
```

### 4. Cards and Panels

#### Question: What container should I use for content sections?

**Answer**: Use card components for distinct content areas. Choose the appropriate card type based on content.

#### Card Types

**Form Card** - For forms and input sections:

```html
<div class="liatrio-form-card">
  <h2>Form Title</h2>
  <p class="liatrio-muted">Description text</p>
  <!-- Form content -->
</div>
```

**Table Card** - For data tables:

```html
<div class="liatrio-table-card">
  <h2>Table Title</h2>
  <p class="liatrio-muted">Description text</p>
  <!-- Table content -->
</div>
```

**Feature Card** - For informational blocks:

```html
<div class="liatrio-feature-card">
  <h3>Feature Title</h3>
  <p>Feature description text.</p>
</div>
```

**Error Card** - For error pages:

```html
<div class="liatrio-error-card">
  <img src="/resources/images/pets.png" alt="Error illustration" />
  <h2>Something happened...</h2>
  <p>Error description</p>
</div>
```

**Card Styling:**

```scss
.liatrio-form-card,
.liatrio-table-card,
.liatrio-feature-card,
.liatrio-error-card {
  background: #1E2327;
  border: 1px solid #333333;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(17, 17, 17, 0.08);
}
```

### 5. Hero Sections

#### Question: How should I create prominent page headers?

**Answer**: Use `.liatrio-hero` for prominent landing sections with calls to action.

```html
<section class="liatrio-hero">
  <div class="row align-items-center">
    <div class="col-lg-6">
      <p class="liatrio-eyebrow">Emerald Grove Veterinary Clinic</p>
      <h1 class="liatrio-hero-title">Care made modern.</h1>
      <p class="liatrio-hero-subtitle">
        A comprehensive pet care management system built with Spring Boot and modern UI patterns.
      </p>
      <div class="liatrio-hero-actions">
        <a class="btn btn-primary" th:href="@{/owners/find}">Find owners</a>
        <a class="btn liatrio-btn-secondary" th:href="@{/vets.html}">Meet the vets</a>
      </div>
    </div>
    <div class="col-lg-6">
      <img class="img-responsive liatrio-hero-image"
           th:src="@{/resources/images/pets.png}"
           alt="Pets at the clinic" />
    </div>
  </div>
</section>
```

**Hero Styling:**

```scss
.liatrio-hero {
  background: #111111;
  color: #ffffff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(17, 17, 17, 0.12);
}

.liatrio-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 12px;
  color: #89df00;
  margin-bottom: 8px;
}

.liatrio-hero-title {
  font-size: 40px;
  line-height: 1.1;
  margin-bottom: 12px;
}

.liatrio-hero-subtitle {
  font-size: 18px;
  line-height: 1.6;
  color: #cccccc;
  margin-bottom: 16px;
}
```

### 6. Search Interfaces

#### Question: How should I design search functionality?

**Answer**: Use a card-wrapped form with search input, help text, and action buttons.

```html
<section class="liatrio-section">
  <div class="liatrio-form-card">
    <h2>Find Owners</h2>
    <p class="liatrio-muted">Search by last name to locate an owner record.</p>

    <form th:object="${owner}" th:action="@{/owners}" method="get"
          class="form-horizontal liatrio-form">
      <div class="form-group">
        <label for="lastName" class="col-sm-2 control-label">Last name</label>
        <div class="col-sm-10">
          <input class="form-control" th:field="*{lastName}"
                 size="30" maxlength="80" placeholder="Enter last name" />
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10 liatrio-form-actions">
          <button type="submit" class="btn btn-primary">Find Owner</button>
          <a class="btn liatrio-btn-secondary" th:href="@{/owners/new}">Add Owner</a>
        </div>
      </div>
    </form>
  </div>
</section>
```

### 7. Error Pages

#### Question: How should error pages be displayed?

**Answer**: Use centered error card with image, status-specific messaging, and helpful context.

```html
<section class="liatrio-section">
  <div class="liatrio-error-card">
    <img src="/resources/images/pets.png" alt="Pets at the clinic" />
    <h2>Something happened...</h2>

    <p th:switch="${status}">
      <span th:case="404">The requested page was not found.</span>
      <span th:case="500">An internal server error occurred.</span>
      <span th:case="*">An unexpected error occurred.</span>
    </p>

    <p class="liatrio-muted" th:text="${message}">Exception message</p>
  </div>
</section>
```

### 8. Pagination

#### Question: How should pagination be implemented?

**Answer**: Use `.liatrio-pagination` with Font Awesome icons for navigation controls.

```html
<div th:if="${totalPages > 1}" class="liatrio-pagination">
  <span>Pages:</span>
  <span>[</span>
  <span th:each="i: ${#numbers.sequence(1, totalPages)}">
    <a th:if="${currentPage != i}" th:href="@{'/items?page=__${i}__'}">[[${i}]]</a>
    <span th:unless="${currentPage != i}">[[${i}]]</span>
  </span>
  <span>]&nbsp;</span>

  <!-- First Page -->
  <a th:if="${currentPage > 1}" th:href="@{'/items?page=1'}"
     title="First" class="fa fa-fast-backward"></a>
  <span th:unless="${currentPage > 1}" title="First" class="fa fa-fast-backward"></span>

  <!-- Previous Page -->
  <a th:if="${currentPage > 1}" th:href="@{'/items?page=__${currentPage - 1}__'}"
     title="Previous" class="fa fa-step-backward"></a>
  <span th:unless="${currentPage > 1}" title="Previous" class="fa fa-step-backward"></span>

  <!-- Next Page -->
  <a th:if="${currentPage < totalPages}" th:href="@{'/items?page=__${currentPage + 1}__'}"
     title="Next" class="fa fa-step-forward"></a>
  <span th:unless="${currentPage < totalPages}" title="Next" class="fa fa-step-forward"></span>

  <!-- Last Page -->
  <a th:if="${currentPage < totalPages}" th:href="@{'/items?page=__${totalPages}__'}"
     title="Last" class="fa fa-fast-forward"></a>
  <span th:unless="${currentPage < totalPages}" title="Last" class="fa fa-fast-forward"></span>
</div>
```

### 9. Alert Messages

#### Question: How should I display success and error messages?

**Answer**: Use Bootstrap alerts with auto-hide functionality.

```html
<!-- Success Message -->
<div th:if="${message}" class="alert alert-success" id="success-message">
  <span th:text="${message}"></span>
</div>

<!-- Error Message -->
<div th:if="${error}" class="alert alert-danger" id="error-message">
  <span th:text="${error}"></span>
</div>

<script>
  // Auto-hide messages after 3 seconds
  function hideMessages() {
    setTimeout(function () {
      var successMsg = document.getElementById("success-message");
      var errorMsg = document.getElementById("error-message");
      if (successMsg) successMsg.style.display = "none";
      if (errorMsg) errorMsg.style.display = "none";
    }, 3000);
  }
  hideMessages();
</script>
```

## Responsive Design

### Breakpoints

The application uses Bootstrap 5 breakpoints:

```scss
// Extra small devices (portrait phones, less than 576px)
// No media query for `xs` since this is the default

// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) { ... }

// Medium devices (tablets, 768px and up)
@media (min-width: 768px) { ... }

// Large devices (desktops, 992px and up)
@media (min-width: 992px) { ... }

// Extra large devices (large desktops, 1200px and up)
@media (min-width: 1200px) { ... }
```

### Mobile-First Patterns

#### Question: How should content adapt on mobile?

**Answer**: Use Bootstrap's grid system and custom responsive utilities.

#### Responsive Navigation

```scss
@media (max-width: 768px) {
  .navbar-toggle {
    position: absolute;
    z-index: 9999;
    left: 0;
    top: 0;
  }

  .navbar a.navbar-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin: 8px auto 0;
    float: none;
  }

  .navbar {
    border-top-width: 0;
  }
}
```

#### Responsive Grid

```html
<!-- Desktop: 3 columns, Tablet: 2 columns, Mobile: 1 column -->
<div class="row g-4">
  <div class="col-12 col-md-6 col-lg-4">
    <div class="liatrio-feature-card">
      <!-- Content -->
    </div>
  </div>
  <div class="col-12 col-md-6 col-lg-4">
    <div class="liatrio-feature-card">
      <!-- Content -->
    </div>
  </div>
  <div class="col-12 col-md-6 col-lg-4">
    <div class="liatrio-feature-card">
      <!-- Content -->
    </div>
  </div>
</div>
```

#### Responsive Hero Section

```html
<section class="liatrio-hero">
  <div class="row align-items-center">
    <!-- Desktop: side-by-side, Mobile: stacked -->
    <div class="col-12 col-lg-6">
      <h1 class="liatrio-hero-title">Care made modern.</h1>
      <!-- Content -->
    </div>
    <div class="col-12 col-lg-6">
      <img class="img-responsive liatrio-hero-image" src="/images/hero.png" />
    </div>
  </div>
</section>
```

#### Responsive Forms

```html
<!-- Horizontal on desktop, stacked on mobile -->
<form class="form-horizontal liatrio-form">
  <div class="form-group">
    <label class="col-sm-2 control-label">Label</label>
    <div class="col-sm-10">
      <input class="form-control" type="text" />
    </div>
  </div>
</form>
```

#### Responsive Tables

For complex tables, consider:

1. **Scrollable container** for wide tables:

```html
<div class="table-responsive">
  <table class="table table-striped liatrio-table">
    <!-- Table content -->
  </table>
</div>
```

2. **Card layout** for mobile:

```html
<!-- Desktop: table, Mobile: cards -->
<div class="d-none d-md-block">
  <table class="table liatrio-table">
    <!-- Table -->
  </table>
</div>

<div class="d-md-none">
  <div class="card mb-3" th:each="item : ${items}">
    <!-- Card content -->
  </div>
</div>
```

## Common UI Patterns

### 1. Page Layout Structure

```html
<!DOCTYPE html>
<html xmlns:th="https://www.thymeleaf.org"
      th:replace="~{fragments/layout :: layout (~{::body},'pageMenu')}">
<body>

  <!-- Primary Heading -->
  <h2>Page Title</h2>

  <!-- Optional: Alert Messages -->
  <div th:if="${message}" class="alert alert-success">
    <span th:text="${message}"></span>
  </div>

  <!-- Primary Section -->
  <section class="liatrio-section">
    <div class="liatrio-form-card">
      <!-- Main content -->
    </div>
  </section>

  <!-- Secondary Section (if needed) -->
  <section class="liatrio-section">
    <div class="liatrio-table-card">
      <!-- Additional content -->
    </div>
  </section>

</body>
</html>
```

### 2. CRUD Operation Patterns

#### List/Index Page

```html
<section class="liatrio-section">
  <div class="liatrio-table-card">
    <div class="liatrio-card-header">
      <h2>Items</h2>
      <p class="liatrio-muted">Browse all available items.</p>
    </div>

    <table class="table table-striped liatrio-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr th:each="item : ${items}">
          <td>
            <a th:href="@{/items/__${item.id}__}" th:text="${item.name}"></a>
          </td>
          <td>
            <a th:href="@{/items/__${item.id}__/edit}">Edit</a>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination if needed -->
  </div>
</section>
```

#### Create/Edit Form

```html
<section class="liatrio-section">
  <div class="liatrio-form-card">
    <h2 th:text="${item['new']} ? 'Add Item' : 'Edit Item'">Add Item</h2>
    <p class="liatrio-muted">Fill in the details below.</p>

    <form th:object="${item}" class="form-horizontal liatrio-form" method="post">
      <!-- Form fields -->
      <input th:replace="~{fragments/inputField :: input ('Name', 'name', 'text')}" />

      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10 liatrio-form-actions">
          <button type="submit" class="btn btn-primary"
                  th:text="${item['new']} ? 'Add Item' : 'Update Item'">
            Add Item
          </button>
          <a class="btn liatrio-btn-secondary" th:href="@{/items}">Cancel</a>
        </div>
      </div>
    </form>
  </div>
</section>
```

#### Details/Show Page

```html
<h2>Item Details</h2>

<table class="table table-striped liatrio-table" th:object="${item}">
  <tr>
    <th>Name</th>
    <td><b th:text="*{name}"></b></td>
  </tr>
  <tr>
    <th>Description</th>
    <td th:text="*{description}"></td>
  </tr>
</table>

<a th:href="@{/items/__${item.id}__/edit}" class="btn btn-primary">Edit Item</a>
<a th:href="@{/items}" class="btn liatrio-btn-secondary">Back to List</a>
```

### 3. Visual Feedback Patterns

#### Question: How should I provide feedback for user actions?

**Answer**: Use a combination of alerts, transitions, and state indicators.

#### Loading States

```html
<!-- Button with loading state -->
<button type="submit" class="btn btn-primary" id="submit-btn">
  <span class="spinner-border spinner-border-sm d-none" role="status"></span>
  <span class="btn-text">Submit</span>
</button>

<script>
  document.getElementById('submit-btn').addEventListener('click', function() {
    this.querySelector('.spinner-border').classList.remove('d-none');
    this.querySelector('.btn-text').textContent = 'Submitting...';
    this.disabled = true;
  });
</script>
```

#### Success Confirmation

```html
<div th:if="${message}" class="alert alert-success alert-dismissible fade show">
  <span class="fa fa-check-circle" aria-hidden="true"></span>
  <span th:text="${message}">Operation successful</span>
  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
```

#### Error Display

```html
<div th:if="${error}" class="alert alert-danger alert-dismissible fade show">
  <span class="fa fa-exclamation-triangle" aria-hidden="true"></span>
  <span th:text="${error}">An error occurred</span>
  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
```

#### Form Field States

```scss
// Valid state
.form-control:valid {
  border-color: #24AE1D;
}

// Invalid state
.form-control:invalid,
.form-group.has-error .form-control {
  border-color: #dc3545;
}

// Focus state
.form-control:focus {
  border-color: #24AE1D;
  box-shadow: 0 0 0 0.2rem rgba(36, 174, 29, 0.2);
}
```

## Accessibility

### ARIA Labels and Roles

```html
<!-- Navigation -->
<nav class="navbar" role="navigation" aria-label="Main navigation">
  <!-- Navigation items -->
</nav>

<!-- Decorative Icons -->
<span class="fa fa-home" aria-hidden="true"></span>

<!-- Meaningful Icons -->
<a href="/home">
  <span class="fa fa-home" aria-label="Home page"></span>
</a>

<!-- Form Labels -->
<label for="firstName" class="control-label">First Name</label>
<input id="firstName" type="text" class="form-control" aria-required="true" />

<!-- Error Messages -->
<div role="alert" class="alert alert-danger">
  <span th:text="${error}">Error message</span>
</div>
```

### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```html
<!-- Focusable Links -->
<a href="/page" class="btn btn-primary" tabindex="0">Action</a>

<!-- Skip Links -->
<a href="#main-content" class="sr-only sr-only-focusable">Skip to main content</a>
```

### Color Contrast

Maintain WCAG AA contrast ratios:

- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **UI components**: 3:1 minimum

Current color combinations meet these requirements:

- Text `#f8f9fa` on background `#1a1f23` - **12.8:1** ✓
- Green `#24AE1D` on background `#111111` - **4.8:1** ✓
- Muted text `#b3b3b3` on background `#1a1f23` - **7.2:1** ✓

## Implementation Examples

### Complete Form Example

```html
<!DOCTYPE html>
<html xmlns:th="https://www.thymeleaf.org"
      th:replace="~{fragments/layout :: layout (~{::body},'owners')}">
<body>

  <section class="liatrio-section">
    <div class="liatrio-form-card">
      <h2>Add Owner</h2>
      <p class="liatrio-muted">Enter the owner's contact information.</p>

      <form th:object="${owner}" class="form-horizontal liatrio-form"
            id="add-owner-form" method="post">
        <div class="form-group has-feedback">
          <input th:replace="~{fragments/inputField :: input ('First Name', 'firstName', 'text')}" />
          <input th:replace="~{fragments/inputField :: input ('Last Name', 'lastName', 'text')}" />
          <input th:replace="~{fragments/inputField :: input ('Address', 'address', 'text')}" />
          <input th:replace="~{fragments/inputField :: input ('City', 'city', 'text')}" />
          <input th:replace="~{fragments/inputField :: input ('Telephone', 'telephone', 'text')}" />
        </div>

        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-10 liatrio-form-actions">
            <button class="btn btn-primary" type="submit">Add Owner</button>
            <a class="btn liatrio-btn-secondary" th:href="@{/owners}">Cancel</a>
          </div>
        </div>
      </form>
    </div>
  </section>

</body>
</html>
```

### Complete Table Example

```html
<!DOCTYPE html>
<html xmlns:th="https://www.thymeleaf.org"
      th:replace="~{fragments/layout :: layout (~{::body},'vets')}">
<body>

  <section class="liatrio-section">
    <div class="liatrio-table-card">
      <div class="liatrio-card-header">
        <h2>Veterinarians</h2>
        <p class="liatrio-muted">A snapshot of the care team and specialties.</p>
      </div>

      <table id="vets" class="table table-striped liatrio-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialties</th>
          </tr>
        </thead>
        <tbody>
          <tr th:each="vet : ${vets}">
            <td th:text="${vet.firstName + ' ' + vet.lastName}"></td>
            <td>
              <span th:each="specialty : ${vet.specialties}"
                    th:text="${specialty.name + ' '}" />
              <span th:if="${vet.nrOfSpecialties == 0}">none</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div th:if="${totalPages > 1}" class="liatrio-pagination">
        <!-- Pagination controls -->
      </div>
    </div>
  </section>

</body>
</html>
```

### Complete Landing Page Example

```html
<!DOCTYPE html>
<html xmlns:th="https://www.thymeleaf.org"
      th:replace="~{fragments/layout :: layout (~{::body},'home')}">
<body>

  <!-- Hero Section -->
  <section class="liatrio-hero">
    <div class="row align-items-center">
      <div class="col-12 col-lg-6">
        <p class="liatrio-eyebrow">Emerald Grove Veterinary Clinic</p>
        <h1 class="liatrio-hero-title">Care made modern.</h1>
        <p class="liatrio-hero-subtitle">
          A comprehensive pet care management system built with Spring Boot
          and modern UI patterns inspired by Liatrio.
        </p>
        <div class="liatrio-hero-actions">
          <a class="btn btn-primary" th:href="@{/owners/find}">Find owners</a>
          <a class="btn liatrio-btn-secondary" th:href="@{/vets.html}">Meet the vets</a>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <img class="img-responsive liatrio-hero-image"
             th:src="@{/resources/images/pets.png}"
             alt="Pets at the clinic" />
      </div>
    </div>
  </section>

  <!-- Feature Cards -->
  <section class="liatrio-section">
    <div class="row g-4">
      <div class="col-12 col-md-4">
        <div class="liatrio-feature-card">
          <h3>Owner-first workflows</h3>
          <p>Quickly locate, update, and manage owner records with confidence.</p>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="liatrio-feature-card">
          <h3>Care team visibility</h3>
          <p>See veterinarians, specialties, and schedules in one clear place.</p>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="liatrio-feature-card">
          <h3>Reliable operations</h3>
          <p>Stay organized with modern UI patterns inspired by Liatrio.</p>
        </div>
      </div>
    </div>
  </section>

</body>
</html>
```

## Best Practices

### 1. Component Selection Decision Tree

```
Need to display content?
├─ Is it a form?
│  └─ Use: .liatrio-form-card with .form-horizontal
├─ Is it a data table?
│  └─ Use: .liatrio-table-card with .table.liatrio-table
├─ Is it a hero/landing section?
│  └─ Use: .liatrio-hero
├─ Is it an error page?
│  └─ Use: .liatrio-error-card
└─ Is it informational content?
   └─ Use: .liatrio-feature-card
```

### 2. Information Display Guidelines

- **Key-value pairs**: Use definition list (`<dl>`) or two-column table
- **Tabular data**: Use `.liatrio-table` with appropriate columns
- **Hierarchical data**: Use nested tables or cards
- **Actions**: Group related buttons in `.liatrio-form-actions` or `.liatrio-hero-actions`

### 3. Element Positioning

- **Primary actions**: Top-right or bottom-left of forms
- **Navigation**: Sticky top navbar
- **Footer**: Fixed at page bottom with `.liatrio-footer`
- **Alerts**: Top of page content, below heading

### 4. Mobile Responsiveness Checklist

- [ ] Navigation collapses to hamburger menu
- [ ] Forms stack vertically on mobile
- [ ] Tables use `.table-responsive` wrapper or card layout
- [ ] Hero sections stack content vertically
- [ ] Button groups wrap with `flex-wrap`
- [ ] Font sizes scale appropriately
- [ ] Touch targets are at least 44x44px
- [ ] Images scale with `img-responsive` class

### 5. CSS Class Naming

**Liatrio-specific classes** (prefixed with `liatrio-`):

- `.liatrio-hero` - Hero sections
- `.liatrio-form-card` - Form containers
- `.liatrio-table-card` - Table containers
- `.liatrio-feature-card` - Feature blocks
- `.liatrio-error-card` - Error pages
- `.liatrio-section` - Major page sections
- `.liatrio-muted` - Muted text
- `.liatrio-btn-secondary` - Secondary buttons
- `.liatrio-form-actions` - Button groups
- `.liatrio-pagination` - Pagination controls

**Bootstrap classes** (use as-is):

- `.btn`, `.btn-primary` - Buttons
- `.form-control`, `.form-group` - Forms
- `.table`, `.table-striped` - Tables
- `.alert`, `.alert-success`, `.alert-danger` - Alerts
- `.row`, `.col-*` - Grid system
- `.navbar`, `.nav-item` - Navigation

### 6. Testing UI Components

When implementing new UI features, test:

1. **Visual rendering** across breakpoints (mobile, tablet, desktop)
2. **Interactive states** (hover, focus, active, disabled)
3. **Accessibility** (keyboard navigation, screen readers, color contrast)
4. **Form validation** (client-side and server-side)
5. **Error states** (empty states, error messages, loading states)

## Quick Reference

### Common Component Usage

| Scenario | Component | Class |
|----------|-----------|-------|
| Create/edit form | Form card | `.liatrio-form-card` |
| Data listing | Table card | `.liatrio-table-card` |
| Landing section | Hero | `.liatrio-hero` |
| Informational block | Feature card | `.liatrio-feature-card` |
| Error page | Error card | `.liatrio-error-card` |
| Search interface | Form card | `.liatrio-form-card` |
| Primary button | Button | `.btn.btn-primary` |
| Secondary button | Button | `.btn.liatrio-btn-secondary` |
| Data table | Table | `.table.table-striped.liatrio-table` |
| Help text | Paragraph | `.liatrio-muted` |

### File Locations

- **Templates**: `src/main/resources/templates/`
- **Fragments**: `src/main/resources/templates/fragments/`
- **SCSS source**: `src/main/scss/`
- **Compiled CSS**: `src/main/resources/static/resources/css/`
- **Images**: `src/main/resources/static/resources/images/`

### Compiling Styles

After modifying SCSS files:

```bash
./mvnw package -P css
```

This compiles `petclinic.scss` into `petclinic.css` with Bootstrap 5 combined.

## Conclusion

This guide provides comprehensive patterns for consistent UI/UX implementation in the Emerald Grove Veterinary Clinic application. When implementing new features:

1. Review the relevant section for your use case
2. Copy the appropriate code examples
3. Adapt to your specific requirements
4. Test across breakpoints and browsers
5. Verify accessibility standards

For questions not covered in this guide, refer to:

- **Bootstrap 5 Documentation**: [getbootstrap.com](https://getbootstrap.com)
- **Font Awesome 4.x Icons**: [fontawesome.com/v4](https://fontawesome.com/v4.7.0/)
- **Liatrio Brand Guide**: [liatrio.com/brand](https://liatrio.com/brand)

Maintain consistency with existing patterns, and propose new patterns through code review when needed.
