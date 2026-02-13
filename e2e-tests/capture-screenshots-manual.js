import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Starting screenshot capture...');

  // Create artifacts directory
  const artifactsDir = path.join(__dirname, '../docs/specs/03-spec-language-selector/03-proofs/artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  try {
    // Language Selector Screenshots
    console.log('1. Capturing home page with language selector...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(artifactsDir, '03-language-selector-navbar.png'),
      fullPage: false
    });

    console.log('2. Capturing language selector dropdown expanded...');
    // Try to find and click the language selector dropdown
    try {
      const dropdownButton = page.locator('button:has-text("EN"), a:has-text("EN"), [data-bs-toggle="dropdown"]:has-text("EN")').first();
      await dropdownButton.waitFor({ timeout: 2000 });
      await dropdownButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(artifactsDir, '03-language-selector-dropdown-expanded.png'),
        fullPage: false
      });

      console.log('3. Selecting Spanish and capturing page in Spanish...');
      const spanishLink = page.locator('a:has-text("Español"), a[href*="lang=es"]').first();
      await spanishLink.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(artifactsDir, '03-language-selector-spanish-page.png'),
        fullPage: false
      });
    } catch (e) {
      console.log('Language selector not found - feature may not be visible on current page');
    }

    console.log('4. Capturing mobile view...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(artifactsDir, '03-language-selector-mobile.png'),
      fullPage: true
    });

    console.log('✓ Language selector screenshots captured!');

  } catch (error) {
    console.error('Error capturing screenshots:', error);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
