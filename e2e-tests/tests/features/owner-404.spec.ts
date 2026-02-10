import { test, expect } from '@fixtures/base-test';

test.describe('Owner 404 Handling', () => {
  test('shows 404 error page for non-existent owner', async ({ page }, testInfo) => {
    // Navigate to a non-existent owner ID
    const nonExistentOwnerId = 99999;
    const response = await page.goto(`/owners/${nonExistentOwnerId}`);

    // Verify HTTP 404 status
    expect(response?.status()).toBe(404);

    // Verify error page displays with appropriate message
    await expect(page.getByText(/requested page was not found/i)).toBeVisible();

    // Verify navigation links are present in error page (use .last() to target error page links, not nav)
    await expect(page.getByRole('link', { name: /find owners/i }).last()).toBeVisible();
    await expect(page.getByRole('link', { name: /home/i }).last()).toBeVisible();

    // Take screenshot for proof artifacts
    await page.screenshot({
      path: testInfo.outputPath('owner-404-error-page.png'),
      fullPage: true,
    });
  });

  test('Find Owners link navigates correctly from 404 page', async ({ page }) => {
    // Navigate to non-existent owner
    await page.goto('/owners/99999');

    // Click "Find Owners" link (use .last() to target error page link)
    await page.getByRole('link', { name: /find owners/i }).last().click();

    // Verify navigation to find owners page
    await expect(page).toHaveURL(/\/owners\/find/);
    await expect(page.getByRole('button', { name: /find owner/i })).toBeVisible();
  });

  test('Home link navigates correctly from 404 page', async ({ page }) => {
    // Navigate to non-existent owner
    await page.goto('/owners/99999');

    // Click "Home" link (use .last() to target error page link)
    await page.getByRole('link', { name: /home/i }).last().click();

    // Verify navigation to home page
    await expect(page).toHaveURL('/');
  });
});
