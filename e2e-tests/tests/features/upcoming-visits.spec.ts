import { test, expect } from '@fixtures/base-test';

import { UpcomingVisitsPage } from '@pages/upcoming-visits-page';

test.describe('Upcoming Visits', () => {
  test('can navigate to upcoming visits page and view table structure', async ({ page }, testInfo) => {
    const upcomingVisitsPage = new UpcomingVisitsPage(page);

    await upcomingVisitsPage.open();

    await expect(upcomingVisitsPage.heading()).toBeVisible();

    // Verify filter buttons are present for all time windows
    await expect(upcomingVisitsPage.filterButton(3)).toBeVisible();
    await expect(upcomingVisitsPage.filterButton(7)).toBeVisible();
    await expect(upcomingVisitsPage.filterButton(14)).toBeVisible();
    await expect(upcomingVisitsPage.filterButton(30)).toBeVisible();

    // Default view should have 7-day button active
    await expect(upcomingVisitsPage.activeFilterButton()).toContainText('7');

    await page.screenshot({
      path: testInfo.outputPath('upcoming-visits-default.png'),
      fullPage: true
    });
  });

  test('filter buttons change the time window', async ({ page }, testInfo) => {
    const upcomingVisitsPage = new UpcomingVisitsPage(page);

    // Navigate with 3-day filter
    await upcomingVisitsPage.open(3);
    await expect(upcomingVisitsPage.activeFilterButton()).toContainText('3');

    await page.screenshot({
      path: testInfo.outputPath('upcoming-visits-3-days.png'),
      fullPage: true
    });

    // Navigate with 30-day filter
    await upcomingVisitsPage.open(30);
    await expect(upcomingVisitsPage.activeFilterButton()).toContainText('30');

    await page.screenshot({
      path: testInfo.outputPath('upcoming-visits-30-days.png'),
      fullPage: true
    });
  });

  test('page shows empty state or visit table', async ({ page }) => {
    const upcomingVisitsPage = new UpcomingVisitsPage(page);

    await upcomingVisitsPage.open();

    // Either the table or empty message should be visible
    const table = upcomingVisitsPage.visitsTable();
    const emptyMsg = upcomingVisitsPage.emptyMessage();

    const tableVisible = await table.isVisible();
    const emptyVisible = await emptyMsg.isVisible();

    // One of them must be visible
    expect(tableVisible || emptyVisible).toBeTruthy();

    if (tableVisible) {
      // Table should have expected column headers
      const headers = table.locator('thead th');
      await expect(headers).toHaveCount(4);
    }
  });

  test('can navigate to upcoming visits from navbar', async ({ page }) => {
    const upcomingVisitsPage = new UpcomingVisitsPage(page);

    await page.goto('/');

    // Click the Upcoming Visits nav link
    const navLink = page.locator('nav.navbar').getByRole('link', { name: /Upcoming Visits/i });
    await expect(navLink).toBeVisible();
    await navLink.click();

    await expect(upcomingVisitsPage.heading()).toBeVisible();
  });
});
