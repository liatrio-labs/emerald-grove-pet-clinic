import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureLanguageSelectorScreenshots(page) {
  console.log('\n=== Capturing Language Selector Screenshots ===');
  const artifactsDir = path.join(__dirname, '../docs/specs/03-spec-language-selector/03-proofs/artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  try {
    // 1. Home page with language selector
    console.log('1. Home page with language selector in navbar...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(artifactsDir, '03-language-selector-navbar.png'),
      fullPage: false
    });

    // 2. Language dropdown expanded
    console.log('2. Language selector dropdown expanded...');
    const languageDropdown = page.locator('.dropdown-toggle').filter({ hasText: /EN|English|Select language|🌐/ });
    const dropdownCount = await languageDropdown.count();

    if (dropdownCount > 0) {
      await languageDropdown.first().click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(artifactsDir, '03-language-selector-dropdown-expanded.png'),
        fullPage: false
      });

      // 3. Select Spanish and capture
      console.log('3. Page in Spanish after language switch...');
      const spanishLink = page.locator('a').filter({ hasText: /Español|Spanish/ });
      if (await spanishLink.count() > 0) {
        await spanishLink.first().click();
        await page.waitForTimeout(1500);
        await page.screenshot({
          path: path.join(artifactsDir, '03-language-selector-spanish-page.png'),
          fullPage: false
        });
      }
    } else {
      console.log('   Language selector not found - feature may not be on this branch');
    }

    // 4. Mobile view
    console.log('4. Mobile view...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(artifactsDir, '03-language-selector-mobile.png'),
      fullPage: true
    });

    console.log('✓ Language selector screenshots complete!');
  } catch (error) {
    console.error('Error capturing language selector screenshots:', error.message);
  }
}

async function captureVetFilterScreenshots(page) {
  console.log('\n=== Capturing Vet Specialty Filter Screenshots ===');
  const artifactsDir = path.join(__dirname, '../docs/specs/05-spec-vet-specialty-filter/05-proofs/artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  try {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // 1. Vet list page
    console.log('1. Vet list page with specialty filter...');
    await page.goto('http://localhost:8080/vets.html', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(artifactsDir, '05-vet-list-with-filter.png'),
      fullPage: false
    });

    // 2. Filter dropdown expanded
    console.log('2. Specialty filter dropdown expanded...');
    const filterDropdown = page.locator('select[name="specialty"], #specialty-filter');
    if (await filterDropdown.count() > 0) {
      await filterDropdown.first().click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(artifactsDir, '05-filter-dropdown-expanded.png'),
        fullPage: false
      });

      // 3. Filtered results
      console.log('3. Filtered results (radiology)...');
      await filterDropdown.first().selectOption({ label: /radiology/i });
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(artifactsDir, '05-filtered-results-radiology.png'),
        fullPage: false
      });
    } else {
      console.log('   Specialty filter not found - feature may not be on this branch');
    }

    console.log('✓ Vet filter screenshots complete!');
  } catch (error) {
    console.error('Error capturing vet filter screenshots:', error.message);
  }
}

async function captureUpcomingVisitsScreenshots(page) {
  console.log('\n=== Capturing Upcoming Visits Screenshots ===');
  const artifactsDir = path.join(__dirname, '../docs/specs/06-spec-upcoming-visits/06-proofs/artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  try {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // 1. Upcoming visits page
    console.log('1. Upcoming visits page...');
    await page.goto('http://localhost:8080/visits/upcoming', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(artifactsDir, '06-upcoming-visits-page.png'),
      fullPage: true
    });

    // 2. Time window filters
    console.log('2. Time window filter buttons...');
    const filterButton = page.locator('a').filter({ hasText: /14 days|30 days/ }).first();
    if (await filterButton.count() > 0) {
      await filterButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(artifactsDir, '06-time-window-filter.png'),
        fullPage: true
      });
    }

    console.log('✓ Upcoming visits screenshots complete!');
  } catch (error) {
    console.error('Error capturing upcoming visits screenshots:', error.message);
  }
}

async function capturePastVisitValidationScreenshots(page) {
  console.log('\n=== Capturing Past Visit Validation Screenshots ===');
  const artifactsDir = path.join(__dirname, '../docs/specs/08-spec-past-visit-validation/08-proofs/artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  try {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Navigate to a pet's visit form
    console.log('1. Navigating to visit form...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 10000 });
    await page.click('text=Find Owners');
    await page.fill('input[name="lastName"]', '');
    await page.click('button:has-text("Find Owner")');
    await page.waitForTimeout(1000);

    // Click first owner
    const ownerLink = page.locator('a[href*="/owners/"]').first();
    if (await ownerLink.count() > 0) {
      await ownerLink.click();
      await page.waitForTimeout(1000);

      // Click Add Visit button
      const addVisitButton = page.locator('a').filter({ hasText: /Add Visit|New Visit/ }).first();
      if (await addVisitButton.count() > 0) {
        await addVisitButton.click();
        await page.waitForTimeout(1000);

        // 2. Form with past date showing validation error
        console.log('2. Visit form with past date validation error...');
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const pastDate = yesterday.toISOString().split('T')[0];

        await page.fill('input[type="date"], input[name="date"]', pastDate);
        await page.fill('textarea[name="description"], input[name="description"]', 'Test visit');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: path.join(artifactsDir, '08-past-date-validation-error.png'),
          fullPage: false
        });

        // 3. Form with today's date (valid)
        console.log('3. Visit form with today\'s date (valid)...');
        const today = new Date().toISOString().split('T')[0];
        await page.fill('input[type="date"], input[name="date"]', today);
        await page.screenshot({
          path: path.join(artifactsDir, '08-today-date-valid.png'),
          fullPage: false
        });

        // 4. Form with future date (valid)
        console.log('4. Visit form with future date (valid)...');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 7);
        const futureDate = tomorrow.toISOString().split('T')[0];
        await page.fill('input[type="date"], input[name="date"]', futureDate);
        await page.screenshot({
          path: path.join(artifactsDir, '08-future-date-valid.png'),
          fullPage: false
        });
      } else {
        console.log('   Add Visit button not found');
      }
    } else {
      console.log('   No owners found in database');
    }

    console.log('✓ Past visit validation screenshots complete!');
  } catch (error) {
    console.error('Error capturing past visit validation screenshots:', error.message);
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Starting comprehensive screenshot capture...');
  console.log('Server: http://localhost:8080');

  try {
    await captureLanguageSelectorScreenshots(page);
    await captureVetFilterScreenshots(page);
    await captureUpcomingVisitsScreenshots(page);
    await capturePastVisitValidationScreenshots(page);

    console.log('\n✅ All screenshots captured successfully!');
  } catch (error) {
    console.error('\n❌ Error during screenshot capture:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
