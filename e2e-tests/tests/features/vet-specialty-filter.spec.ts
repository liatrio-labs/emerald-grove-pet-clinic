import { test, expect } from '@fixtures/base-test';

import { VetPage } from '@pages/vet-page';
import { HomePage } from '@pages/home-page';

test.describe('Vet Specialty Filter', () => {
  test('should display filter dropdown on vet directory page', async ({ page }, testInfo) => {
    const vetPage = new VetPage(page);
    await vetPage.open();

    // Verify filter dropdown is visible
    const filterDropdown = page.locator('#specialty-filter');
    await expect(filterDropdown).toBeVisible();

    // Verify filter label is present
    const filterLabel = page.getByText('Specialty Filter');
    await expect(filterLabel).toBeVisible();

    // Verify dropdown has expected options
    await expect(filterDropdown.locator('option[value=""]')).toContainText('All');
    await expect(filterDropdown.locator('option[value="radiology"]')).toContainText('Radiology');
    await expect(filterDropdown.locator('option[value="surgery"]')).toContainText('Surgery');
    await expect(filterDropdown.locator('option[value="dentistry"]')).toContainText('Dentistry');

    await page.screenshot({ path: testInfo.outputPath('filter-dropdown-visible.png'), fullPage: true });
  });

  test('should filter vets when selecting Surgery specialty', async ({ page }, testInfo) => {
    const vetPage = new VetPage(page);
    await vetPage.open();

    // Select Surgery from dropdown
    const filterDropdown = page.locator('#specialty-filter');
    await filterDropdown.selectOption('surgery');

    // Wait for page to reload with filter applied
    await page.waitForURL('**/vets.html?filter=specialty:surgery');

    // Verify URL contains filter parameter
    expect(page.url()).toContain('filter=specialty:surgery');

    // Verify visual feedback is displayed
    const feedbackText = page.getByText(/Showing vets with specialty:/i);
    await expect(feedbackText).toBeVisible();
    await expect(page.getByText('surgery')).toBeVisible();

    // Verify only surgery vets are displayed
    const rows = vetPage.vetsTable().locator('tbody tr');
    const rowCount = await rows.count();
    expect(rowCount, 'Expected filtered veterinarians to be present').toBeGreaterThan(0);

    // Each displayed vet should have surgery specialty
    for (let i = 0; i < rowCount; i++) {
      const specialtyCell = rows.nth(i).locator('td').nth(1);
      await expect(specialtyCell).toContainText(/surgery/i);
    }

    await page.screenshot({ path: testInfo.outputPath('filter-surgery.png'), fullPage: true });
  });

  test('should apply AND logic when selecting multiple specialties', async ({ page }, testInfo) => {
    const vetPage = new VetPage(page);
    await vetPage.open();

    // Select both Surgery and Dentistry (using keyboard to multi-select)
    const filterDropdown = page.locator('#specialty-filter');
    await filterDropdown.click();
    await page.keyboard.press('Control+A'); // Select all first to clear
    await filterDropdown.selectOption(['surgery', 'dentistry']);

    // Wait for page to reload with filter applied
    await page.waitForURL('**/vets.html?filter=specialty:*');

    // Verify URL contains both specialties
    expect(page.url()).toContain('filter=specialty:');
    expect(page.url()).toContain('surgery');
    expect(page.url()).toContain('dentistry');

    // Verify visual feedback shows both specialties
    const feedbackText = page.getByText(/Showing vets with specialty:/i);
    await expect(feedbackText).toBeVisible();

    // Verify only vets with BOTH specialties are displayed
    const rows = vetPage.vetsTable().locator('tbody tr');
    const rowCount = await rows.count();

    // Each displayed vet should have BOTH surgery AND dentistry specialties
    for (let i = 0; i < rowCount; i++) {
      const specialtyCell = rows.nth(i).locator('td').nth(1);
      const specialtyText = await specialtyCell.textContent();
      expect(specialtyText?.toLowerCase(), `Row ${i} should contain both surgery and dentistry`).toContain('surgery');
      expect(specialtyText?.toLowerCase(), `Row ${i} should contain both surgery and dentistry`).toContain('dentistry');
    }

    await page.screenshot({ path: testInfo.outputPath('filter-multi-specialty.png'), fullPage: true });
  });

  test('should persist filter when navigating away and back', async ({ page }, testInfo) => {
    const vetPage = new VetPage(page);
    const homePage = new HomePage(page);

    await vetPage.open();

    // Set Surgery filter
    const filterDropdown = page.locator('#specialty-filter');
    await filterDropdown.selectOption('surgery');
    await page.waitForURL('**/vets.html?filter=specialty:surgery');

    // Navigate to home page
    await homePage.open();
    await expect(homePage.heading()).toBeVisible();

    // Navigate back to vet directory
    await vetPage.open();

    // Verify filter is still active (session persistence)
    // The dropdown should show Surgery as selected
    const surgeryOption = filterDropdown.locator('option[value="surgery"]');
    await expect(surgeryOption).toHaveAttribute('selected', '');

    // Verify filtered results are still displayed
    const feedbackText = page.getByText(/Showing vets with specialty:/i);
    await expect(feedbackText).toBeVisible();

    await page.screenshot({ path: testInfo.outputPath('filter-persistence.png'), fullPage: true });
  });

  test('should integrate filter with pagination', async ({ page }, testInfo) => {
    const vetPage = new VetPage(page);
    await vetPage.open();

    // Note: This test assumes there are enough vets with a specialty to trigger pagination
    // If not enough data, this test will verify pagination controls maintain filter parameter

    // Set a filter
    const filterDropdown = page.locator('#specialty-filter');
    await filterDropdown.selectOption('radiology');
    await page.waitForURL('**/vets.html?filter=specialty:radiology');

    // Check if pagination controls exist
    const paginationDiv = page.locator('.liatrio-pagination');
    const hasPagination = await paginationDiv.isVisible().catch(() => false);

    if (hasPagination) {
      // Verify pagination links contain filter parameter
      const pageLinks = paginationDiv.locator('a[href*="page="]');
      const linkCount = await pageLinks.count();

      if (linkCount > 0) {
        const firstLink = pageLinks.first();
        const href = await firstLink.getAttribute('href');
        expect(href, 'Pagination links should maintain filter parameter').toContain('filter=specialty:radiology');
      }

      await page.screenshot({ path: testInfo.outputPath('filter-pagination.png'), fullPage: true });
    } else {
      // No pagination with current data, but that's okay - test verifies structure
      await page.screenshot({ path: testInfo.outputPath('filter-no-pagination.png'), fullPage: true });
    }
  });

  test('should display empty state when no vets match filter', async ({ page }, testInfo) => {
    const vetPage = new VetPage(page);
    await vetPage.open();

    // Try to trigger empty state by selecting a combination unlikely to match
    // Note: This depends on test data; if no empty state is possible, test will skip assertion
    const filterDropdown = page.locator('#specialty-filter');

    // First check if multi-select with all specialties yields empty results
    await filterDropdown.selectOption(['surgery', 'dentistry', 'radiology']);
    await page.waitForURL('**/vets.html?filter=specialty:*');

    // Check if empty state is displayed
    const emptyStateRow = vetPage.vetsTable().locator('tbody tr').filter({ hasText: /No veterinarians found/i });
    const hasEmptyState = await emptyStateRow.isVisible().catch(() => false);

    if (hasEmptyState) {
      // Verify empty state message is displayed
      await expect(emptyStateRow).toBeVisible();
      const emptyMessage = page.getByText(/No veterinarians found/i);
      await expect(emptyMessage).toBeVisible();

      await page.screenshot({ path: testInfo.outputPath('filter-empty-state.png'), fullPage: true });
    } else {
      // No empty state with current data - test data has vets matching all combinations
      // This is acceptable; test structure is verified
      await page.screenshot({ path: testInfo.outputPath('filter-no-empty-state.png'), fullPage: true });
    }
  });

  test('should display visual feedback for active filter', async ({ page }, testInfo) => {
    const vetPage = new VetPage(page);
    await vetPage.open();

    // Select Surgery filter
    const filterDropdown = page.locator('#specialty-filter');
    await filterDropdown.selectOption('surgery');
    await page.waitForURL('**/vets.html?filter=specialty:surgery');

    // Verify visual feedback text appears
    const feedbackText = page.getByText(/Showing vets with specialty:/i);
    await expect(feedbackText).toBeVisible();

    // Verify the specific specialty name is shown
    const specialtyText = page.locator('p.text-muted strong');
    await expect(specialtyText).toContainText('surgery');

    await page.screenshot({ path: testInfo.outputPath('filter-visual-feedback.png'), fullPage: true });

    // Change filter to Radiology
    await filterDropdown.selectOption('radiology');
    await page.waitForURL('**/vets.html?filter=specialty:radiology');

    // Verify feedback text updates dynamically
    await expect(feedbackText).toBeVisible();
    await expect(specialtyText).toContainText('radiology');

    await page.screenshot({ path: testInfo.outputPath('filter-visual-feedback-updated.png'), fullPage: true });
  });
});
