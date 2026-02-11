# Accessibility Guide

This comprehensive guide covers accessibility requirements, implementation patterns, and testing strategies for the Emerald Grove Veterinary Clinic application.

## Overview

The Emerald Grove Veterinary Clinic application is committed to providing an accessible experience for all users, including those with disabilities. This guide outlines the standards, patterns, and practices used to ensure the application meets **WCAG 2.1 Level AA** compliance requirements.

### Accessibility Standards

The application adheres to the following standards:

- **WCAG 2.1 Level AA** - Web Content Accessibility Guidelines
- **Section 508** - U.S. Federal accessibility standards
- **ARIA 1.2** - Accessible Rich Internet Applications specification
- **HTML5 Semantic Standards** - Proper use of semantic HTML elements

### Key Principles (POUR)

All accessibility implementations follow the four core WCAG principles:

1. **Perceivable** - Information must be presentable to users in ways they can perceive
2. **Operable** - Interface components must be operable by all users
3. **Understandable** - Information and operation must be understandable
4. **Robust** - Content must be robust enough to work with assistive technologies

## ARIA Attributes

ARIA (Accessible Rich Internet Applications) attributes enhance the accessibility of dynamic web content and custom UI components.

### Common ARIA Patterns

#### Role Attributes

Use ARIA roles to define the purpose of elements:

```html
<!-- Navigation with role -->
<nav class="navbar navbar-expand-lg navbar-dark" role="navigation">
  <ul class="navbar-nav" role="menubar">
    <li class="nav-item" role="none">
      <a class="nav-link" role="menuitem" href="/">Home</a>
    </li>
  </ul>
</nav>

<!-- Main content landmark -->
<main role="main" aria-label="Main content">
  <h1>Owner Information</h1>
  <!-- content -->
</main>

<!-- Form with role and label -->
<form role="form" aria-labelledby="form-heading">
  <h2 id="form-heading">Add New Owner</h2>
  <!-- form fields -->
</form>
```

#### State and Property Attributes

Communicate state changes to assistive technologies:

```html
<!-- Loading state -->
<button aria-busy="true" aria-live="polite">
  <span class="spinner" aria-hidden="true"></span>
  Loading...
</button>

<!-- Expanded/collapsed state -->
<button
  aria-expanded="false"
  aria-controls="owner-details"
  data-bs-toggle="collapse">
  Show Details
</button>

<div id="owner-details" class="collapse" aria-hidden="true">
  <!-- collapsible content -->
</div>

<!-- Required field -->
<input
  type="text"
  id="firstName"
  aria-required="true"
  aria-invalid="false"
  aria-describedby="firstName-error">
<span id="firstName-error" role="alert"></span>
```

#### Live Regions

Announce dynamic content updates:

```html
<!-- Polite announcement (doesn't interrupt) -->
<div aria-live="polite" aria-atomic="true" class="alert alert-success">
  Owner successfully saved
</div>

<!-- Assertive announcement (interrupts) -->
<div aria-live="assertive" aria-atomic="true" class="alert alert-danger" role="alert">
  Error: First name is required
</div>

<!-- Status messages -->
<div role="status" aria-live="polite">
  <span class="visually-hidden">Loading owners...</span>
</div>
```

### ARIA Labels

Provide accessible names for elements:

```html
<!-- aria-label for icons/buttons without visible text -->
<button aria-label="Search for owners" class="btn btn-search">
  <span class="fa fa-search" aria-hidden="true"></span>
</button>

<!-- aria-labelledby to reference existing text -->
<section aria-labelledby="section-heading">
  <h2 id="section-heading">Pet Information</h2>
  <!-- section content -->
</section>

<!-- aria-describedby for additional context -->
<input
  type="tel"
  id="telephone"
  aria-describedby="telephone-format">
<small id="telephone-format">Format: 10 digits without spaces</small>
```

### Hiding Decorative Content

Use `aria-hidden` to hide decorative elements from screen readers:

```html
<!-- Decorative icons -->
<span class="fa fa-home" aria-hidden="true"></span>
<span>Home</span>

<!-- Logo image -->
<span class="navbar-brand-logo" aria-hidden="true"></span>

<!-- Validation icons -->
<span class="fa fa-ok form-control-feedback" aria-hidden="true"></span>
```

## Keyboard Navigation

All interactive elements must be accessible via keyboard alone, without requiring a mouse.

### Focus Management

#### Focus Order

Ensure logical tab order through proper HTML structure:

```html
<!-- Good: Natural tab order -->
<form>
  <label for="firstName">First Name</label>
  <input type="text" id="firstName" name="firstName">

  <label for="lastName">Last Name</label>
  <input type="text" id="lastName" name="lastName">

  <button type="submit">Save</button>
</form>

<!-- Avoid: Manual tabindex unless necessary -->
<div tabindex="0"><!-- Only when making non-interactive elements focusable --></div>
```

#### Focus Indicators

Maintain visible focus indicators for all interactive elements:

```css
/* Default focus styles */
a:focus,
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* High contrast focus for buttons */
.btn:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 95, 204, 0.5);
  outline: 2px solid #005fcc;
}

/* Skip link focus */
.skip-link:focus {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  padding: 1rem;
  background: #000;
  color: #fff;
}
```

#### Focus Trap

Trap focus within modal dialogs:

```javascript
// Modal focus trap pattern
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}
```

### Keyboard Shortcuts

#### Standard Navigation Keys

Support standard keyboard patterns:

- **Tab** - Navigate forward through focusable elements
- **Shift+Tab** - Navigate backward through focusable elements
- **Enter** - Activate buttons and links
- **Space** - Activate buttons, toggle checkboxes
- **Escape** - Close modals and dropdowns
- **Arrow keys** - Navigate within components (dropdowns, tabs)

#### Skip Links

Provide skip navigation for keyboard users:

```html
<body>
  <!-- Skip to main content link -->
  <a href="#main-content" class="skip-link visually-hidden-focusable">
    Skip to main content
  </a>

  <nav>
    <!-- navigation -->
  </nav>

  <main id="main-content" tabindex="-1">
    <!-- main content -->
  </main>
</body>
```

```css
/* Skip link styling */
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 999;
}

.skip-link:focus {
  position: fixed;
  top: 0;
  left: 0;
  padding: 1rem 1.5rem;
  background: #000;
  color: #fff;
  text-decoration: none;
}
```

### Interactive Components

#### Buttons

Ensure buttons are keyboard accessible:

```html
<!-- Button with keyboard support (native) -->
<button type="button" onclick="handleClick()">
  Add Owner
</button>

<!-- If using non-button elements (avoid when possible) -->
<div
  role="button"
  tabindex="0"
  aria-pressed="false"
  onkeydown="handleKeyPress(event)">
  Toggle
</div>
```

```javascript
// Handle keyboard activation for custom button elements
function handleKeyPress(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
}
```

#### Links vs Buttons

Use semantic HTML correctly:

```html
<!-- Links navigate to new locations -->
<a href="/owners/1">View Owner Details</a>

<!-- Buttons perform actions -->
<button type="submit">Save Owner</button>
<button type="button" onclick="deleteOwner()">Delete</button>
```

## Screen Reader Support

### Semantic HTML

Use semantic HTML elements to provide structure and meaning:

```html
<!-- Document structure -->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Emerald Grove Veterinary Clinic - Owner Details</title>
</head>
<body>
  <header>
    <nav><!-- navigation --></nav>
  </header>

  <main>
    <h1>Owner Information</h1>
    <section aria-labelledby="contact-info">
      <h2 id="contact-info">Contact Information</h2>
      <!-- content -->
    </section>
  </main>

  <footer>
    <!-- footer content -->
  </footer>
</body>
</html>
```

### Heading Hierarchy

Maintain proper heading structure:

```html
<!-- Correct heading hierarchy -->
<h1>Owner Details</h1>
  <h2>Personal Information</h2>
    <h3>Contact Details</h3>
  <h2>Pets</h2>
    <h3>Active Pets</h3>
    <h3>Previous Pets</h3>

<!-- Incorrect: Skipping levels -->
<h1>Owner Details</h1>
  <h3>Personal Information</h3> <!-- Don't skip h2 -->
```

### Alternative Text

Provide meaningful alt text for images:

```html
<!-- Informative image -->
<img
  src="owner-photo.jpg"
  alt="Profile photo of George Franklin">

<!-- Decorative image -->
<img
  src="decorative-pattern.png"
  alt=""
  role="presentation">

<!-- Logo with text -->
<img
  src="logo.png"
  alt="Emerald Grove Veterinary Clinic">

<!-- Complex image -->
<figure>
  <img
    src="chart.png"
    alt="Bar chart showing visit frequency"
    aria-describedby="chart-description">
  <figcaption id="chart-description">
    Pet visits have increased 20% this quarter,
    with the highest frequency in July.
  </figcaption>
</figure>
```

### Tables

Structure data tables properly:

```html
<!-- Data table with proper markup -->
<table role="table">
  <caption>Pet Visit History</caption>
  <thead>
    <tr>
      <th scope="col">Date</th>
      <th scope="col">Pet Name</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2024-01-15</td>
      <td>Max</td>
      <td>Annual checkup</td>
    </tr>
  </tbody>
</table>
```

### Form Labels

Associate labels with form controls:

```html
<!-- Label with for attribute -->
<label for="firstName">First Name</label>
<input type="text" id="firstName" name="firstName" required>

<!-- Label wrapping input -->
<label>
  Last Name
  <input type="text" name="lastName" required>
</label>

<!-- Group related fields -->
<fieldset>
  <legend>Contact Information</legend>
  <label for="email">Email</label>
  <input type="email" id="email" name="email">

  <label for="telephone">Phone</label>
  <input type="tel" id="telephone" name="telephone">
</fieldset>
```

### Screen Reader Only Text

Provide additional context for screen reader users:

```html
<!-- Visually hidden but available to screen readers -->
<span class="visually-hidden">
  Current page: Owners List
</span>

<!-- Status messages -->
<div role="status" aria-live="polite">
  <span class="visually-hidden">Loading complete. 5 owners found.</span>
</div>
```

```css
/* Screen reader only utility class */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Show on focus (e.g., skip links) */
.visually-hidden-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

## Color Contrast Requirements

### WCAG 2.1 Level AA Standards

Meet minimum contrast ratios:

- **Normal text** (< 18pt): 4.5:1 contrast ratio
- **Large text** (≥ 18pt or 14pt bold): 3:1 contrast ratio
- **UI components**: 3:1 contrast ratio for interactive elements
- **Graphical objects**: 3:1 contrast ratio for meaningful graphics

### Color Contrast Examples

```css
/* Good contrast examples */

/* Text on background: 7.2:1 ratio */
.text-primary {
  color: #212529; /* Dark gray */
  background-color: #ffffff; /* White */
}

/* Button with good contrast: 5.1:1 ratio */
.btn-primary {
  color: #ffffff; /* White */
  background-color: #0066cc; /* Blue */
}

/* Link contrast: 4.8:1 ratio */
a {
  color: #005fcc; /* Dark blue */
}

/* Error message: 6.3:1 ratio */
.text-danger {
  color: #c41e3a; /* Red */
}

/* Success message: 4.6:1 ratio */
.text-success {
  color: #28a745; /* Green */
}
```

### Testing Contrast

Use browser tools or online calculators:

```bash
# Example contrast ratios to verify
Background: #ffffff (white)
- Primary text (#212529): 16.1:1 ✓
- Secondary text (#6c757d): 4.5:1 ✓
- Link color (#005fcc): 7.8:1 ✓
- Disabled text (#adb5bd): 2.9:1 ✗ (use for non-essential text only)
```

### Color Independence

Never rely on color alone to convey information:

```html
<!-- Bad: Color only -->
<span style="color: red;">Required</span>

<!-- Good: Color + text/icon -->
<span class="text-danger">
  <span aria-hidden="true">*</span>
  <span>Required</span>
</span>

<!-- Form validation with multiple cues -->
<div class="form-group has-error">
  <label for="email">
    Email
    <span class="text-danger" aria-label="required">*</span>
  </label>
  <input
    type="email"
    id="email"
    aria-invalid="true"
    aria-describedby="email-error">
  <!-- Icon + color + text -->
  <span class="fa fa-remove form-control-feedback text-danger" aria-hidden="true"></span>
  <span id="email-error" class="help-block text-danger">
    Please enter a valid email address
  </span>
</div>
```

## Form Accessibility

### Form Structure

```html
<form id="add-owner-form" method="post" novalidate>
  <!-- Form heading -->
  <h2 id="form-heading">Add New Owner</h2>

  <!-- Fieldset for related fields -->
  <fieldset>
    <legend>Personal Information</legend>

    <!-- Form field with proper labels -->
    <div class="form-group">
      <label for="firstName" class="control-label">
        First Name
        <span class="text-danger" aria-label="required">*</span>
      </label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        class="form-control"
        required
        aria-required="true"
        aria-invalid="false"
        aria-describedby="firstName-help">
      <small id="firstName-help" class="form-text text-muted">
        Enter the owner's legal first name
      </small>
    </div>
  </fieldset>

  <!-- Submit button -->
  <div class="form-group">
    <button type="submit" class="btn btn-primary">
      Add Owner
    </button>
  </div>
</form>
```

### Input Field Pattern

The application uses a reusable input field fragment:

```html
<!-- Thymeleaf fragment: fragments/inputField.html -->
<th:block th:fragment="input (label, name, type)">
  <div th:with="valid=${!#fields.hasErrors(name)}"
       th:class="${'form-group' + (valid ? '' : ' has-error')}"
       class="form-group">

    <!-- Label -->
    <label th:for="${name}" class="col-sm-2 control-label" th:text="${label}">
      Label
    </label>

    <div class="col-sm-10">
      <!-- Input field -->
      <div th:switch="${type}">
        <input th:case="'text'"
               class="form-control"
               type="text"
               th:field="*{__${name}__}"
               th:aria-invalid="${!valid}">
        <input th:case="'date'"
               class="form-control"
               type="date"
               th:field="*{__${name}__}"
               th:aria-invalid="${!valid}">
      </div>

      <!-- Success indicator -->
      <span th:if="${valid}"
            class="fa fa-ok form-control-feedback"
            aria-hidden="true"></span>

      <!-- Error indicator and message -->
      <th:block th:if="${!valid}">
        <span class="fa fa-remove form-control-feedback"
              aria-hidden="true"></span>
        <span class="help-inline"
              th:errors="*{__${name}__}"
              th:id="${name + '-error'}"
              role="alert">
          Error
        </span>
      </th:block>
    </div>
  </div>
</th:block>
```

### Error Messages

Display validation errors accessibly:

```html
<!-- Inline error message -->
<div class="form-group has-error">
  <label for="telephone">Telephone</label>
  <input
    type="tel"
    id="telephone"
    aria-invalid="true"
    aria-describedby="telephone-error">
  <span id="telephone-error" class="help-block" role="alert">
    Please enter a valid 10-digit phone number
  </span>
</div>

<!-- Summary of errors at top of form -->
<div class="alert alert-danger" role="alert" aria-labelledby="error-summary-heading">
  <h3 id="error-summary-heading">Form Errors</h3>
  <ul>
    <li><a href="#firstName">First name is required</a></li>
    <li><a href="#telephone">Telephone number format is invalid</a></li>
  </ul>
</div>
```

### Select Dropdown Pattern

```html
<!-- Accessible select dropdown -->
<th:block th:fragment="selectField (label, name, items)">
  <div class="form-group">
    <label th:for="${name}" class="control-label" th:text="${label}">
      Label
    </label>
    <select
      th:id="${name}"
      th:name="${name}"
      class="form-control"
      th:aria-describedby="${name + '-help'}">
      <option value="">-- Select --</option>
      <option th:each="item : ${items}"
              th:value="${item.id}"
              th:text="${item.name}">
        Option
      </option>
    </select>
    <small th:id="${name + '-help'}" class="form-text text-muted">
      Choose from the available options
    </small>
  </div>
</th:block>
```

## Testing

### Automated Testing with axe-core

The application includes automated accessibility testing using axe-core in the E2E test suite.

#### Test Structure

Location: `e2e-tests/tests/a11y/`

```typescript
// e2e-tests/tests/a11y/home-page.a11y.test.ts
import { test, expect } from '@fixtures/base-test';
import { createRequire } from 'node:module';

type AxeImpact = 'minor' | 'moderate' | 'serious' | 'critical' | null;

interface AxeViolation {
  id: string;
  impact: AxeImpact;
  description: string;
  nodes: Array<{ target: string[] }>;
}

test('Home page accessibility scan (non-blocking)', async ({ page }) => {
  // Navigate to page
  await page.goto('/');

  // Inject axe-core
  const require = createRequire(import.meta.url);
  const axePath = require.resolve('axe-core/axe.min.js');
  await page.addScriptTag({ path: axePath });

  // Run accessibility scan
  const results = await page.evaluate(async () => {
    const w = window as any;
    return await w.axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      }
    });
  });

  // Filter violations by severity
  const violations = (results as { violations: AxeViolation[] }).violations;
  const critical = violations.filter((v) => v.impact === 'critical');
  const serious = violations.filter((v) => v.impact === 'serious');

  // Report violations
  const debugMessage = violations
    .map((v) => `${v.impact ?? 'unknown'}: ${v.id} - ${v.description}`)
    .join('\n');

  if (critical.length > 0 || serious.length > 0) {
    test.info().annotations.push({
      type: 'a11y',
      description: `critical=${critical.length}, serious=${serious.length}`
    });
    console.warn(
      `Accessibility violations detected\n` +
      `critical=${critical.length}, serious=${serious.length}\n` +
      `${debugMessage}`
    );

    // Fail on critical violations in CI
    if (process.env.PW_A11Y_FAIL_ON_CRITICAL === 'true') {
      expect(
        critical.length,
        `Critical accessibility violations must be fixed\n${debugMessage}`
      ).toBe(0);
    }
  }
});
```

#### Running Accessibility Tests

```bash
# Run all E2E tests including accessibility scans
cd e2e-tests
npm test

# Run only accessibility tests
npm test -- --grep "accessibility"

# Fail on critical violations (CI mode)
PW_A11Y_FAIL_ON_CRITICAL=true npm test

# Run with UI mode for debugging
npm run test:ui -- tests/a11y/
```

#### Adding New Accessibility Tests

Create test files for each major page or component:

```typescript
// e2e-tests/tests/a11y/owner-form.a11y.test.ts
import { test, expect } from '@fixtures/base-test';
import { injectAxe, checkA11y } from './a11y-helpers';

test.describe('Owner Form Accessibility', () => {
  test('Add owner form meets WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/owners/new');
    await injectAxe(page);
    await checkA11y(page, {
      detailedReport: true,
      detailedReportOptions: {
        html: true
      }
    });
  });

  test('Form validation errors are accessible', async ({ page }) => {
    await page.goto('/owners/new');

    // Submit empty form to trigger validation
    await page.click('button[type="submit"]');

    // Check that error messages are accessible
    const errorMessages = await page.locator('[role="alert"]').all();
    expect(errorMessages.length).toBeGreaterThan(0);

    // Verify aria-invalid is set
    const invalidInputs = await page.locator('[aria-invalid="true"]').all();
    expect(invalidInputs.length).toBeGreaterThan(0);
  });
});
```

### Manual Testing

#### Screen Reader Testing

Test with multiple screen readers:

- **NVDA** (Windows) - Free, widely used
- **JAWS** (Windows) - Commercial, industry standard
- **VoiceOver** (macOS/iOS) - Built-in Apple screen reader
- **TalkBack** (Android) - Built-in Android screen reader

##### VoiceOver Testing (macOS)

```bash
# Enable VoiceOver
Cmd + F5

# Basic navigation
Control + Option + Right Arrow  # Next element
Control + Option + Left Arrow   # Previous element
Control + Option + Space        # Activate element
Control + Option + Shift + Down # Interact with element
Control + Option + H            # Next heading
Control + Option + L            # Next link
Control + Option + F            # Next form control
```

##### NVDA Testing (Windows)

```bash
# Start NVDA
Control + Alt + N

# Basic navigation
Down Arrow              # Next element
Up Arrow                # Previous element
Tab                     # Next focusable element
Enter / Space           # Activate element
H                       # Next heading
L                       # Next list
F                       # Next form field
B                       # Next button
```

#### Keyboard Navigation Testing

Test all interactive functionality using only the keyboard:

**Test Checklist:**

- [ ] Can navigate to all interactive elements using Tab
- [ ] Can activate all buttons and links using Enter/Space
- [ ] Can navigate within components using arrow keys
- [ ] Can dismiss modals and dropdowns using Escape
- [ ] Focus indicators are visible for all focused elements
- [ ] Focus order is logical and follows visual layout
- [ ] No keyboard traps (can always move focus away)
- [ ] Skip links work and are visible when focused

#### Browser Tools

##### Chrome DevTools Accessibility Panel

1. Open DevTools (F12)
2. Navigate to Accessibility panel
3. Inspect element accessibility tree
4. Check ARIA attributes and roles
5. Verify computed accessibility properties

##### Firefox Accessibility Inspector

1. Open Developer Tools (F12)
2. Select Accessibility panel
3. Check for accessibility issues
4. Inspect accessibility tree
5. Simulate color vision deficiencies

##### Lighthouse Accessibility Audit

```bash
# Run Lighthouse audit
# In Chrome DevTools:
# 1. Open DevTools (F12)
# 2. Navigate to Lighthouse panel
# 3. Select "Accessibility" category
# 4. Click "Generate report"
```

#### Color Contrast Testing

Tools for testing color contrast:

- **WebAIM Contrast Checker** - https://webaim.org/resources/contrastchecker/
- **Colour Contrast Analyser** - Desktop application for Windows/macOS
- **Chrome DevTools** - Built-in color picker shows contrast ratio

```bash
# Test contrast ratios
Foreground: #212529
Background: #ffffff
Ratio: 16.1:1 (AAA for normal text, AAA for large text)
```

### Continuous Integration

#### GitHub Actions Integration

Add accessibility testing to CI pipeline:

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests

on: [push, pull_request]

jobs:
  a11y-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd e2e-tests
          npm ci
          npx playwright install --with-deps

      - name: Run accessibility tests
        run: |
          cd e2e-tests
          PW_A11Y_FAIL_ON_CRITICAL=true npm test -- tests/a11y/
        env:
          CI: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: accessibility-report
          path: e2e-tests/test-results/
```

## Common Patterns

### Navigation Menu

Accessible navigation implementation:

```html
<nav class="navbar navbar-expand-lg navbar-dark" role="navigation" aria-label="Main navigation">
  <div class="container-fluid">
    <!-- Brand/logo -->
    <a class="navbar-brand" href="/">
      <span class="navbar-brand-logo" aria-hidden="true"></span>
      <span class="navbar-brand-text">Emerald Grove Veterinary Clinic</span>
    </a>

    <!-- Mobile toggle -->
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#main-navbar"
      aria-controls="main-navbar"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Navigation items -->
    <div class="collapse navbar-collapse" id="main-navbar">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" href="/" aria-current="page">
            <span class="fa fa-home" aria-hidden="true"></span>
            Home
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/owners/find">
            <span class="fa fa-search" aria-hidden="true"></span>
            Find Owners
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/vets.html">
            <span class="fa fa-th-list" aria-hidden="true"></span>
            Veterinarians
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>
```

### Data Tables

Accessible table markup:

```html
<table class="table table-striped" role="table">
  <caption class="visually-hidden">
    List of owners and their pets
  </caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Address</th>
      <th scope="col">City</th>
      <th scope="col">Telephone</th>
      <th scope="col">Pets</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <a href="/owners/1">George Franklin</a>
      </td>
      <td>110 W. Liberty St.</td>
      <td>Madison</td>
      <td>6085551023</td>
      <td>Max</td>
    </tr>
  </tbody>
</table>
```

### Alert Messages

Accessible alert and notification patterns:

```html
<!-- Success message -->
<div class="alert alert-success" role="alert" aria-live="polite">
  <span class="fa fa-check-circle" aria-hidden="true"></span>
  Owner successfully added
</div>

<!-- Error message -->
<div class="alert alert-danger" role="alert" aria-live="assertive">
  <span class="fa fa-exclamation-triangle" aria-hidden="true"></span>
  <strong>Error:</strong> Unable to save owner. Please try again.
</div>

<!-- Info message -->
<div class="alert alert-info" role="status" aria-live="polite">
  <span class="fa fa-info-circle" aria-hidden="true"></span>
  Loading owner information...
</div>

<!-- Warning message -->
<div class="alert alert-warning" role="alert">
  <span class="fa fa-warning" aria-hidden="true"></span>
  This action cannot be undone.
</div>
```

### Modal Dialogs

Accessible modal implementation:

```html
<!-- Modal trigger -->
<button
  type="button"
  class="btn btn-primary"
  data-bs-toggle="modal"
  data-bs-target="#confirmModal"
  aria-haspopup="dialog">
  Delete Owner
</button>

<!-- Modal -->
<div
  class="modal fade"
  id="confirmModal"
  tabindex="-1"
  role="dialog"
  aria-labelledby="confirmModalLabel"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmModalLabel">
          Confirm Delete
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close">
        </button>
      </div>
      <div class="modal-body">
        Are you sure you want to delete this owner?
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-secondary"
          data-bs-dismiss="modal">
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-danger"
          onclick="confirmDelete()">
          Delete
        </button>
      </div>
    </div>
  </div>
</div>
```

### Loading States

Communicate loading states to assistive technologies:

```html
<!-- Loading indicator -->
<div class="loading-container" role="status" aria-live="polite">
  <div class="spinner-border" role="presentation">
    <span class="visually-hidden">Loading...</span>
  </div>
  <span class="loading-text">Loading owner information</span>
</div>

<!-- Button loading state -->
<button
  type="submit"
  class="btn btn-primary"
  aria-busy="true"
  disabled>
  <span class="spinner-border spinner-border-sm" role="presentation" aria-hidden="true"></span>
  <span>Saving...</span>
</button>
```

## Best Practices

### Development Checklist

Use this checklist when implementing new features:

#### Semantic HTML
- [ ] Use semantic HTML elements (header, nav, main, footer, article, section)
- [ ] Maintain proper heading hierarchy (h1-h6)
- [ ] Use lists for related items (ul, ol, dl)
- [ ] Use tables only for tabular data
- [ ] Use buttons for actions, links for navigation

#### ARIA
- [ ] Add ARIA labels where visible text is insufficient
- [ ] Use ARIA live regions for dynamic content
- [ ] Add aria-invalid and aria-describedby to form fields with errors
- [ ] Use aria-hidden for decorative elements
- [ ] Avoid redundant ARIA (don't override native semantics unnecessarily)

#### Keyboard
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible and clear
- [ ] Logical tab order matches visual layout
- [ ] No keyboard traps
- [ ] Skip links provided for main content

#### Forms
- [ ] All inputs have associated labels
- [ ] Required fields are marked with aria-required
- [ ] Error messages are announced to screen readers
- [ ] Field hints use aria-describedby
- [ ] Group related fields with fieldset/legend

#### Color & Contrast
- [ ] Text meets 4.5:1 contrast ratio (7:1 for AAA)
- [ ] Large text meets 3:1 contrast ratio
- [ ] Interactive elements meet 3:1 contrast ratio
- [ ] Information conveyed with color also uses text/icons
- [ ] Test with color blindness simulators

#### Images & Media
- [ ] All images have appropriate alt text
- [ ] Decorative images use alt="" or aria-hidden="true"
- [ ] Complex images have long descriptions
- [ ] Icons paired with text or aria-labels
- [ ] Video/audio have captions and transcripts

#### Testing
- [ ] Automated tests pass with axe-core
- [ ] Manual keyboard navigation works
- [ ] Screen reader testing completed
- [ ] Color contrast verified
- [ ] Browser accessibility audits pass

### Code Review Guidelines

When reviewing code for accessibility:

1. **Check semantic HTML** - Are the right elements used for the right purpose?
2. **Verify ARIA usage** - Is ARIA used correctly and only when necessary?
3. **Test keyboard navigation** - Can you complete all tasks with keyboard alone?
4. **Review labels and text** - Are all interactive elements properly labeled?
5. **Check color usage** - Is information conveyed beyond just color?
6. **Validate with tools** - Run automated accessibility tests
7. **Consider edge cases** - Think about error states, loading states, empty states

### Documentation Requirements

When documenting features, include accessibility information:

```markdown
## Feature: Owner Search

### Accessibility Considerations

- Search input has associated label with `for` attribute
- Search button has descriptive text (not just icon)
- Results announced to screen readers via `aria-live="polite"`
- Empty results state is communicated clearly
- Keyboard users can navigate results with Tab
- Results table has proper `<caption>` and `<th scope="col">`
```

## Resources

### Official Guidelines

- **WCAG 2.1** - https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices** - https://www.w3.org/WAI/ARIA/apg/
- **Section 508** - https://www.section508.gov/

### Testing Tools

- **axe DevTools** - Browser extension for accessibility testing
- **WAVE** - Web accessibility evaluation tool
- **Lighthouse** - Built into Chrome DevTools
- **Pa11y** - Automated accessibility testing
- **WebAIM Contrast Checker** - https://webaim.org/resources/contrastchecker/

### Screen Readers

- **NVDA** - https://www.nvaccess.org/ (Windows, free)
- **JAWS** - https://www.freedomscientific.com/products/software/jaws/ (Windows, commercial)
- **VoiceOver** - Built into macOS and iOS
- **TalkBack** - Built into Android

### Learning Resources

- **WebAIM** - https://webaim.org/
- **A11y Project** - https://www.a11yproject.com/
- **MDN Accessibility** - https://developer.mozilla.org/en-US/docs/Web/Accessibility
- **Inclusive Components** - https://inclusive-components.design/

## Support and Questions

For accessibility questions or issues:

1. Review this guide and linked resources
2. Check existing E2E accessibility tests in `e2e-tests/tests/a11y/`
3. Run automated tests to identify issues
4. Consult the official WCAG 2.1 guidelines
5. Create an issue in the project repository with the `accessibility` label

## Continuous Improvement

Accessibility is an ongoing commitment. Regular activities include:

- **Monthly** - Review accessibility test results and address violations
- **Quarterly** - Conduct manual accessibility audits with screen readers
- **Per Release** - Run full automated accessibility test suite
- **Annually** - Update accessibility documentation and training materials
- **Ongoing** - Stay informed about WCAG updates and best practices

By following these guidelines and patterns, the Emerald Grove Veterinary Clinic application maintains a high standard of accessibility, ensuring all users can effectively interact with the system regardless of their abilities or assistive technologies.
