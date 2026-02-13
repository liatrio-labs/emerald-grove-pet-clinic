import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const outputDir = path.join(__dirname, '../docs/specs/05-spec-vet-specialty-filter/05-proofs/artifacts');

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    console.log('Navigating to vets page...');
    await page.goto('http://localhost:8080/vets.html');
    await page.waitForLoadState('networkidle');

    // Screenshot 1: specialty-filter-dropdown.png - dropdown expanded
    console.log('Capturing: specialty-filter-dropdown.png');
    await page.locator('#specialty').click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(outputDir, 'specialty-filter-dropdown.png'),
      fullPage: false
    });

    // Close dropdown by clicking elsewhere
    await page.locator('h2').click();
    await page.waitForTimeout(300);

    // Screenshot 2: filtered-results-dentistry.png
    console.log('Capturing: filtered-results-dentistry.png');
    await page.locator('#specialty').selectOption('dentistry');
    await page.locator('#filter-specialty-form button[type="submit"]').click();
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(outputDir, 'filtered-results-dentistry.png'),
      fullPage: true
    });

    // Screenshot 3: filtered-url-query-param.png - focus on URL bar
    console.log('Capturing: filtered-url-query-param.png');
    await page.goto('http://localhost:8080/vets.html?specialty=radiology');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(outputDir, 'filtered-url-query-param.png'),
      fullPage: false
    });

    // Screenshot 4: empty-filter-results.png - filter with no results
    console.log('Capturing: empty-filter-results.png');
    // Use a specialty that doesn't exist (cardiology)
    await page.goto('http://localhost:8080/vets.html?specialty=cardiology');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(outputDir, 'empty-filter-results.png'),
      fullPage: true
    });

    // Screenshot 5: filter-persistence-pagination.png
    console.log('Capturing: filter-persistence-pagination.png');
    await page.goto('http://localhost:8080/vets.html?specialty=all');
    await page.waitForLoadState('networkidle');

    // Check if pagination exists
    const paginationExists = await page.locator('.liatrio-pagination').count() > 0;
    if (paginationExists) {
      // Click page 2 link
      await page.locator('a[href*="page=2"]').first().click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: path.join(outputDir, 'filter-persistence-pagination.png'),
        fullPage: true
      });
    } else {
      console.log('Note: No pagination available, using single page view');
      await page.screenshot({
        path: path.join(outputDir, 'filter-persistence-pagination.png'),
        fullPage: true
      });
    }

    console.log('✅ All screenshots captured successfully!');
    console.log(`Output directory: ${outputDir}`);

  } catch (error) {
    console.error('Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
})();
