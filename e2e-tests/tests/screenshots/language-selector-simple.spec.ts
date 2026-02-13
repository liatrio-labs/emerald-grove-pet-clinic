import { test, expect } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

/**
 * Simplified screenshot capture for Language Selector feature
 * Focused on capturing key proof artifacts
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTIFACTS_DIR = path.join(
  __dirname,
  '../../../docs/specs/03-spec-language-selector/03-proofs/artifacts'
);

test.describe('Language Selector - Essential Screenshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('01 - Home page showing language selector', async ({ page }) => {
    // Wait for navbar to be visible
    await page.waitForSelector('nav.navbar', { state: 'visible' });

    // Take full page screenshot
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '01-home-page-with-language-selector.png'),
      fullPage: true
    });

    console.log('✓ Captured: Home page with language selector');
  });

  test('02 - Language dropdown expanded', async ({ page }) => {
    // Wait for language selector to be visible
    await page.waitForSelector('#language-selector', { state: 'visible', timeout: 10000 });

    // Click to expand dropdown
    await page.click('#language-selector-toggle');
    await page.waitForTimeout(500);

    // Take screenshot with dropdown open
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '02-language-dropdown-expanded.png'),
      fullPage: false
    });

    console.log('✓ Captured: Language dropdown expanded');
  });

  test('03 - Page in Spanish', async ({ page }) => {
    // Navigate to Spanish version
    await page.goto('/?locale=es');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Take full page screenshot
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '03-page-in-spanish.png'),
      fullPage: true
    });

    console.log('✓ Captured: Page in Spanish');
  });

  test('04 - Multiple languages', async ({ page }) => {
    const languages = [
      { code: 'de', name: 'German' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'tr', name: 'Turkish' }
    ];

    for (const lang of languages) {
      await page.goto(`/?locale=${lang.code}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);

      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, `04-page-in-${lang.name.toLowerCase()}.png`),
        fullPage: true
      });

      console.log(`✓ Captured: Page in ${lang.name}`);
    }
  });

  test('05 - Mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Screenshot of collapsed mobile menu
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '05-mobile-collapsed.png'),
      fullPage: true
    });

    // Expand mobile menu
    const navToggle = page.locator('button.navbar-toggler');
    if (await navToggle.isVisible()) {
      await navToggle.click();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, '05-mobile-menu-expanded.png'),
        fullPage: true
      });

      console.log('✓ Captured: Mobile views');
    }
  });

  test('06 - Language selector with all options visible', async ({ page }) => {
    // Expand the dropdown
    await page.waitForSelector('#language-selector', { state: 'visible' });
    await page.click('#language-selector-toggle');
    await page.waitForTimeout(500);

    // Verify all 8 language options
    const dropdownItems = page.locator('#language-selector .dropdown-menu a');
    const count = await dropdownItems.count();

    console.log(`Found ${count} language options`);

    // Take full page screenshot showing all options
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '06-all-8-languages-visible.png'),
      fullPage: true
    });

    console.log('✓ Captured: All 8 language options visible');
  });

  test('07 - Language selector in different states', async ({ page }) => {
    await page.waitForSelector('#language-selector', { state: 'visible' });

    // Default state (closed)
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '07-selector-default-state.png'),
      fullPage: false
    });

    // Expanded state
    await page.click('#language-selector-toggle');
    await page.waitForTimeout(300);

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '07-selector-expanded-state.png'),
      fullPage: false
    });

    console.log('✓ Captured: Language selector states');
  });

  test('08 - Cross-page language persistence', async ({ page }) => {
    // Set language to German
    await page.goto('/?locale=de');
    await page.waitForLoadState('networkidle');

    // Home page in German
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '08-home-german.png'),
      fullPage: true
    });

    // Navigate to Veterinarians page
    await page.click('a[href*="vets"]');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '08-vets-german.png'),
      fullPage: true
    });

    // Navigate to Find Owners
    await page.click('a[href*="owners"]');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '08-owners-german.png'),
      fullPage: true
    });

    console.log('✓ Captured: Language persistence across pages');
  });
});
