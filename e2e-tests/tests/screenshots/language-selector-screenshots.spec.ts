import { test, expect } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

/**
 * Screenshot capture script for Language Selector feature
 * Captures comprehensive screenshots for proof artifacts
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTIFACTS_DIR = path.join(
  __dirname,
  '../../../docs/specs/03-spec-language-selector/03-proofs/artifacts'
);

test.describe('Language Selector - Screenshot Capture', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('01 - Home page with language selector in navbar', async ({ page }) => {
    // Ensure the language selector is visible
    const languageSelector = page.locator('#language-selector');
    await expect(languageSelector).toBeVisible();

    // Take full page screenshot
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '01-home-page-with-language-selector.png'),
      fullPage: true
    });

    // Take screenshot of just the navbar area
    const navbar = page.locator('nav.navbar').first();
    await navbar.screenshot({
      path: path.join(ARTIFACTS_DIR, '01-navbar-language-selector-detail.png')
    });
  });

  test('02 - Language dropdown expanded with all 8 languages', async ({ page }) => {
    // Find the language selector dropdown toggle
    const languageToggle = page.locator('#language-selector-toggle');

    // Click to expand the dropdown
    await languageToggle.click();

    // Wait for dropdown menu to be visible
    await page.waitForTimeout(300);

    // Verify dropdown menu is expanded
    const dropdownMenu = page.locator('#language-selector .dropdown-menu');
    await expect(dropdownMenu).toBeVisible();

    // Take a screenshot with the dropdown expanded
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '02-language-dropdown-expanded.png'),
      fullPage: false
    });

    // Get all language options and verify we have 8
    const languageLinks = page.locator('#language-selector .dropdown-menu a');
    const count = await languageLinks.count();
    console.log(`Found ${count} language options`);

    // Take full page screenshot showing all options
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '02-language-dropdown-all-8-languages.png'),
      fullPage: true
    });
  });

  test('03 - Page in Spanish after language switch', async ({ page }) => {
    // Click the language selector toggle
    await page.click('#language-selector-toggle');
    await page.waitForTimeout(200);

    // Click on Spanish language link
    await page.click('a[href="?locale=es"]');

    // Wait for the page to reload/update
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Verify Spanish text is displayed
    await expect(page.locator('body')).toContainText(/Inicio|Buscar|Veterinarios/i);

    // Take full page screenshot in Spanish
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '03-page-in-spanish.png'),
      fullPage: true
    });

    // Take a close-up of the navigation to show Spanish labels
    const navbar = page.locator('nav.navbar').first();
    await navbar.screenshot({
      path: path.join(ARTIFACTS_DIR, '03-navbar-spanish-labels.png')
    });
  });

  test('04 - Multiple languages demonstration', async ({ page }) => {
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'de', name: 'German' },
      { code: 'pt', name: 'Portuguese' }
    ];

    // Capture each language
    for (const lang of languages) {
      // Navigate to the home page with the locale parameter
      await page.goto(`/?locale=${lang.code}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500); // Small delay for rendering

      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, `04-page-in-${lang.name.toLowerCase()}.png`),
        fullPage: true
      });
    }
  });

  test('05 - Mobile view with language selector', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take mobile home page screenshot
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '05-mobile-home-with-language-selector.png'),
      fullPage: true
    });

    // Check if there's a mobile menu toggle
    const mobileMenuToggle = page.locator('button.navbar-toggler');
    if (await mobileMenuToggle.isVisible()) {
      await mobileMenuToggle.click();
      await page.waitForTimeout(300);

      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, '05-mobile-menu-expanded.png'),
        fullPage: true
      });

      // Open language selector dropdown
      await page.click('#language-selector-toggle');
      await page.waitForTimeout(300);

      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, '05-mobile-language-selector-active.png'),
        fullPage: true
      });
    }

    // Switch language on mobile
    await page.click('a[href="?locale=es"]');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '05-mobile-spanish-view.png'),
      fullPage: true
    });
  });

  test('06 - Tablet view with language selector', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '06-tablet-home-with-language-selector.png'),
      fullPage: true
    });

    // Click language selector to expand
    await page.click('#language-selector-toggle');
    await page.waitForTimeout(300);

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '06-tablet-language-selector-expanded.png'),
      fullPage: false
    });
  });

  test('07 - Language persistence across navigation', async ({ page }) => {
    // Select German language
    await page.goto('/?locale=de');
    await page.waitForLoadState('networkidle');

    // Take screenshot of home page in German
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '07-home-page-german.png'),
      fullPage: true
    });

    // Navigate to Find Owners
    await page.locator('a[href*="owners"]').first().click();
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '07-owners-page-german.png'),
      fullPage: true
    });

    // Navigate to Veterinarians
    await page.locator('a[href*="vets"]').first().click();
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '07-vets-page-german.png'),
      fullPage: true
    });
  });

  test('08 - Language selector accessibility states', async ({ page }) => {
    const languageToggle = page.locator('#language-selector-toggle');

    // Default state
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '08-language-selector-default.png'),
      fullPage: false
    });

    // Hover state (if applicable)
    await languageToggle.hover();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '08-language-selector-hover.png'),
      fullPage: false
    });

    // Focused state
    await languageToggle.focus();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '08-language-selector-focused.png'),
      fullPage: false
    });

    // Expanded state
    await languageToggle.click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '08-language-selector-expanded.png'),
      fullPage: false
    });
  });
});
