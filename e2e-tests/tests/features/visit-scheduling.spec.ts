import { test, expect } from '@fixtures/base-test';

import { VisitPage } from '@pages/visit-page';

test.describe('Visit Scheduling', () => {
  test('can schedule a visit for an existing pet', async ({ page }, testInfo) => {
    const visitPage = new VisitPage(page);
    // Note: searching by last name may redirect directly to owner details when there is a single match.
    // Use a stable direct URL to avoid depending on the owners list table.
    await page.goto('/owners/1');
    await expect(page.getByRole('heading', { name: /Owner Information/i })).toBeVisible();

    const addVisitLink = page.getByRole('link', { name: /^Add Visit$/i }).first();
    const addVisitHref = await addVisitLink.getAttribute('href');
    if (!addVisitHref) {
      throw new Error('Expected Add Visit link to have an href');
    }

    const petIdMatch = addVisitHref.match(/pets\/(\d+)\//);
    if (!petIdMatch) {
      throw new Error(`Expected Add Visit href to include pet id, got: ${addVisitHref}`);
    }

    const petId = petIdMatch[1];

    await addVisitLink.click();

    await expect(visitPage.heading()).toBeVisible();

    // Use a future date to pass validation
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 7);
    const visitDate = futureDate.toISOString().split('T')[0];
    const description = `E2E visit ${Date.now()}`;
    await visitPage.fillVisitDate(visitDate);
    await visitPage.fillDescription(description);

    await page.screenshot({ path: testInfo.outputPath('visit-scheduling-form.png'), fullPage: true });

    await visitPage.submit();

    await expect(page.getByRole('heading', { name: /Pets and Visits/i })).toBeVisible();

    const petVisitsTable = page
      .locator(`a[href*="pets/${petId}/visits/new"]`)
      .first()
      .locator('xpath=ancestor::table[1]');

    const visitRow = petVisitsTable.locator('tr').filter({ hasText: visitDate }).filter({ hasText: description });
    await expect(visitRow).toHaveCount(1);
  });

  test('validates visit description is required', async ({ page }) => {
    const visitPage = new VisitPage(page);
    await page.goto('/owners/1');
    await expect(page.getByRole('heading', { name: /Owner Information/i })).toBeVisible();

    await page.getByRole('link', { name: /Add Visit/i }).first().click();

    // Use a valid future date for this validation test
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 7);
    const visitDate = futureDate.toISOString().split('T')[0];
    await visitPage.fillVisitDate(visitDate);
    await visitPage.submit();

    await expect(page.getByText(/must not be blank/i)).toBeVisible();
  });

  test('rejects visit with past date', async ({ page }, testInfo) => {
    const visitPage = new VisitPage(page);
    await page.goto('/owners/1');
    await expect(page.getByRole('heading', { name: /Owner Information/i })).toBeVisible();

    await page.getByRole('link', { name: /Add Visit/i }).first().click();
    await expect(visitPage.heading()).toBeVisible();

    // Use a past date that should be rejected
    const pastDate = '2020-01-01';
    const description = 'Past visit attempt';
    await visitPage.fillVisitDate(pastDate);
    await visitPage.fillDescription(description);

    await page.screenshot({ path: testInfo.outputPath('visit-past-date-validation.png'), fullPage: true });

    await visitPage.submit();

    // Expect validation error message for past date
    await expect(page.getByText(/cannot be in the past/i)).toBeVisible();

    // Verify we're still on the form page (not redirected)
    await expect(visitPage.heading()).toBeVisible();

    await page.screenshot({ path: testInfo.outputPath('visit-past-date-error.png'), fullPage: true });
  });
});
