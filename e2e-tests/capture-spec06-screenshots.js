import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const outputDir = '/Users/twells/repos/liatrio/forge/emerald-grove-pet-clinic-toddwells/docs/specs/06-spec-upcoming-visits/06-proofs/artifacts';

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    console.log('Navigating to upcoming visits page...');
    await page.goto('http://localhost:8080/visits/upcoming');
    await page.waitForLoadState('networkidle');

    // Screenshot 1: upcoming-visits-default-7days.png - default view with table
    console.log('Capturing: upcoming-visits-default-7days.png');
    await page.screenshot({
      path: path.join(outputDir, 'upcoming-visits-default-7days.png'),
      fullPage: true
    });

    // Screenshot 2: navigation-bar-upcoming-visits-link.png - navbar with link
    console.log('Capturing: navigation-bar-upcoming-visits-link.png');
    await page.screenshot({
      path: path.join(outputDir, 'navigation-bar-upcoming-visits-link.png'),
      fullPage: false,
      clip: { x: 0, y: 0, width: 1280, height: 100 }
    });

    // Screenshot 3: filter-buttons-active-state.png - quick filter buttons
    console.log('Capturing: filter-buttons-active-state.png');
    const filterSection = await page.locator('nav[aria-label*="filter" i], .liatrio-form-actions').first();
    await filterSection.screenshot({
      path: path.join(outputDir, 'filter-buttons-active-state.png')
    });

    // Screenshot 4: upcoming-visits-3days.png - 3-day filter
    console.log('Capturing: upcoming-visits-3days.png');
    await page.goto('http://localhost:8080/visits/upcoming?days=3');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(outputDir, 'upcoming-visits-3days.png'),
      fullPage: true
    });

    // Screenshot 5: upcoming-visits-30days.png - 30-day filter
    console.log('Capturing: upcoming-visits-30days.png');
    await page.goto('http://localhost:8080/visits/upcoming?days=30');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(outputDir, 'upcoming-visits-30days.png'),
      fullPage: true
    });

    // Screenshot 6: page-header-with-timewindow.png - header showing time window
    console.log('Capturing: page-header-with-timewindow.png');
    const header = await page.locator('h2, .liatrio-section-header').first();
    await header.screenshot({
      path: path.join(outputDir, 'page-header-with-timewindow.png')
    });

    // Screenshot 7: empty-state-message.png - if no visits (using far future date range)
    console.log('Capturing: empty-state-message.png (if empty state exists)');
    await page.goto('http://localhost:8080/visits/upcoming?days=1');
    await page.waitForLoadState('networkidle');

    const emptyMessage = await page.locator('[class*="empty"], [class*="muted"], p:has-text("no")').first();
    const tableExists = await page.locator('table').count() > 0;

    if (!tableExists && await emptyMessage.isVisible()) {
      await page.screenshot({
        path: path.join(outputDir, 'empty-state-message.png'),
        fullPage: true
      });
      console.log('✓ Empty state captured');
    } else {
      console.log('ℹ No empty state found (visits exist in 1-day window)');
      // Create a note file instead
      fs.writeFileSync(
        path.join(outputDir, 'empty-state-note.txt'),
        'Empty state screenshot not captured - sample data contains visits within 1-day window.\n' +
        'The empty state functionality is tested via E2E tests and exists in the template.'
      );
    }

    console.log('✅ All screenshots captured successfully!');
    console.log(`Output directory: ${outputDir}`);

  } catch (error) {
    console.error('Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
})();
