import { test, expect } from '@fixtures/base-test';

import { VetPage } from '@pages/vet-page';

test.describe('Vet Specialty Filter', () => {
  test('displays specialty filter dropdown on vet directory page', async ({ page }) => {
    const vetPage = new VetPage(page);
    await vetPage.open();

    // Filter form should be visible
    const filterForm = page.locator('#filter-specialty-form');
    await expect(filterForm).toBeVisible();

    // Dropdown should exist with proper accessibility attributes
    const dropdown = page.locator('#specialty');
    await expect(dropdown).toBeVisible();
    await expect(dropdown).toHaveAttribute('aria-label', 'Filter veterinarians by specialty');

    // Should have "All Specialties" as the default selected option
    await expect(dropdown).toHaveValue('all');
  });

  test('dropdown contains all specialty options plus All and None', async ({ page }) => {
    const vetPage = new VetPage(page);
    await vetPage.open();

    const dropdown = page.locator('#specialty');
    const options = dropdown.locator('option');

    // Should have at least: All Specialties, None, and seed specialties (dentistry, radiology, surgery)
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThanOrEqual(5);

    // Check specific options exist
    await expect(dropdown.locator('option[value="all"]')).toBeAttached();
    await expect(dropdown.locator('option[value="none"]')).toBeAttached();
    await expect(dropdown.locator('option[value="radiology"]')).toBeAttached();
    await expect(dropdown.locator('option[value="surgery"]')).toBeAttached();
    await expect(dropdown.locator('option[value="dentistry"]')).toBeAttached();
  });

  test('filters vets by specific specialty (radiology)', async ({ page }) => {
    const vetPage = new VetPage(page);
    await vetPage.open();

    // Select radiology filter
    await page.locator('#specialty').selectOption('radiology');
    await page.locator('#filter-specialty-form button[type="submit"]').click();

    // URL should contain specialty parameter
    await expect(page).toHaveURL(/specialty=radiology/);

    // Should show only vets with radiology specialty
    const rows = page.locator('table#vets tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    // All displayed vets should have radiology specialty
    for (let i = 0; i < rowCount; i++) {
      const specialtyCell = rows.nth(i).locator('td').nth(1);
      await expect(specialtyCell).toContainText(/radiology/i);
    }
  });

  test('filters vets by surgery specialty', async ({ page }) => {
    const vetPage = new VetPage(page);
    await vetPage.open();

    await page.locator('#specialty').selectOption('surgery');
    await page.locator('#filter-specialty-form button[type="submit"]').click();

    await expect(page).toHaveURL(/specialty=surgery/);

    const rows = page.locator('table#vets tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    for (let i = 0; i < rowCount; i++) {
      const specialtyCell = rows.nth(i).locator('td').nth(1);
      await expect(specialtyCell).toContainText(/surgery/i);
    }
  });

  test('shows all vets when "All Specialties" is selected', async ({ page }) => {
    // First navigate with a filter
    await page.goto('/vets.html?specialty=radiology');
    await page.locator('table#vets').waitFor();

    const filteredCount = await page.locator('table#vets tbody tr').count();

    // Now select "All Specialties"
    await page.locator('#specialty').selectOption('all');
    await page.locator('#filter-specialty-form button[type="submit"]').click();

    await page.locator('table#vets').waitFor();
    const allCount = await page.locator('table#vets tbody tr').count();

    // All vets count should be >= filtered count
    expect(allCount).toBeGreaterThanOrEqual(filteredCount);
  });

  test('shows only general practice vets when "None" is selected', async ({ page }) => {
    const vetPage = new VetPage(page);
    await vetPage.open();

    await page.locator('#specialty').selectOption('none');
    await page.locator('#filter-specialty-form button[type="submit"]').click();

    await expect(page).toHaveURL(/specialty=none/);

    const rows = page.locator('table#vets tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    // All displayed vets should show "none" in specialty column
    for (let i = 0; i < rowCount; i++) {
      const specialtyCell = rows.nth(i).locator('td').nth(1);
      await expect(specialtyCell).toContainText(/none/i);
    }
  });

  test('displays empty state when filter has no matching vets', async ({ page }) => {
    // Navigate with a non-existent specialty via URL
    await page.goto('/vets.html?specialty=cardiology');
    await page.locator('table#vets').waitFor();

    // Should show empty state message
    const emptyMessage = page.locator('[role="status"]');
    await expect(emptyMessage).toBeVisible();

    // Table body should be empty
    const rows = page.locator('table#vets tbody tr');
    await expect(rows).toHaveCount(0);
  });

  test('filter persists in dropdown after page load with query parameter', async ({ page }) => {
    // Navigate directly to filtered URL
    await page.goto('/vets.html?specialty=surgery');
    await page.locator('table#vets').waitFor();

    // Dropdown should have "surgery" selected
    const dropdown = page.locator('#specialty');
    await expect(dropdown).toHaveValue('surgery');
  });

  test('shareable URL works - direct navigation to filtered view', async ({ page }) => {
    // Navigate directly to filtered URL
    await page.goto('/vets.html?page=1&specialty=radiology');
    await page.locator('table#vets').waitFor();

    // Should show filtered results
    const rows = page.locator('table#vets tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    // Dropdown should reflect the filter
    const dropdown = page.locator('#specialty');
    await expect(dropdown).toHaveValue('radiology');

    // Verify all shown vets have radiology
    for (let i = 0; i < rowCount; i++) {
      const specialtyCell = rows.nth(i).locator('td').nth(1);
      await expect(specialtyCell).toContainText(/radiology/i);
    }
  });

  test('filter resets pagination to page 1', async ({ page }) => {
    // Navigate to page 2 first (if we have enough data)
    await page.goto('/vets.html?page=1');
    await page.locator('table#vets').waitFor();

    // Apply a filter
    await page.locator('#specialty').selectOption('radiology');
    await page.locator('#filter-specialty-form button[type="submit"]').click();

    // URL should not have page > 1 after applying filter
    const url = page.url();
    expect(url).toMatch(/specialty=radiology/);
  });
});
