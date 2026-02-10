import { test, expect } from '@fixtures/base-test';

test.describe('Language Selector', () => {
  test('should display language selector on home page', async ({ page }) => {
    await page.goto('/');

    // Check that language selector exists
    const languageSelector = page.locator('#language-selector');
    await expect(languageSelector).toBeVisible();

    // Check that it shows the current language code
    await expect(languageSelector).toContainText(/EN|ES|DE/i);
  });

  test('should change page language when clicking Spanish', async ({ page }, testInfo) => {
    await page.goto('/');

    // Click on language selector dropdown
    await page.click('#languageDropdown');

    // Click on Español option
    await page.click('text=Español');

    // Wait for page to reload with Spanish
    await page.waitForLoadState('networkidle');

    // Verify page is in Spanish by checking for Spanish text
    await expect(page.locator('text=Inicio')).toBeVisible(); // "Home" in Spanish

    // Take screenshot showing Spanish language
    await page.screenshot({ path: testInfo.outputPath('home-page-spanish.png'), fullPage: true });
  });

  test('should persist language when navigating to Find Owners', async ({ page }) => {
    await page.goto('/');

    // Switch to Spanish
    await page.click('#languageDropdown');
    await page.click('text=Español');
    await page.waitForLoadState('networkidle');

    // Navigate to Find Owners (click the navbar link, not the hero button)
    await page.locator('.navbar').getByRole('link', { name: /Buscar propietarios/i }).click();

    // Verify still in Spanish by checking the page heading
    await expect(page.getByRole('heading', { name: /Buscar propietario/i })).toBeVisible();
  });

  test('should persist language when navigating to Veterinarians', async ({ page }) => {
    await page.goto('/');

    // Switch to Spanish
    await page.click('#languageDropdown');
    await page.click('text=Español');
    await page.waitForLoadState('networkidle');

    // Navigate to Veterinarians (click the navbar link)
    await page.locator('.navbar').getByRole('link', { name: /Veterinarios/i }).click();

    // Verify still in Spanish by checking the page heading
    await expect(page.getByRole('heading', { name: /Veterinarios/i })).toBeVisible();
  });

  test('should switch to German and persist across pages', async ({ page }, testInfo) => {
    await page.goto('/');

    // Switch to German
    await page.click('#languageDropdown');
    await page.click('text=Deutsch');
    await page.waitForLoadState('networkidle');

    // Verify home page is in German by checking navigation link
    await expect(page.locator('.navbar').getByRole('link', { name: /Tierärzte/i })).toBeVisible();

    // Navigate to Find Owners (click the navbar link)
    await page.locator('.navbar').getByRole('link', { name: /Besitzer suchen/i }).click();
    await page.waitForLoadState('networkidle');

    // Verify still in German by checking that the navbar link text is still in German
    await expect(page.locator('.navbar').getByRole('link', { name: /Besitzer suchen/i })).toBeVisible();

    // Navigate back to home
    await page.click('.navbar-brand'); // Click logo to go home

    // Verify still in German by checking navigation link again
    await expect(page.locator('.navbar').getByRole('link', { name: /Tierärzte/i })).toBeVisible();

    // Take screenshot showing German language
    await page.screenshot({ path: testInfo.outputPath('home-page-german.png'), fullPage: true });
  });

  test('should display language names in their native language', async ({ page }) => {
    await page.goto('/');

    // Click on language selector dropdown
    await page.click('#languageDropdown');

    // Verify all three languages are shown in their native form
    await expect(page.locator('text=English')).toBeVisible();
    await expect(page.locator('text=Español')).toBeVisible();
    await expect(page.locator('text=Deutsch')).toBeVisible();
  });
});
