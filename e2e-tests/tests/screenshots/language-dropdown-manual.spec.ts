import { test } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

/**
 * Manual capture of language dropdown expanded view
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTIFACTS_DIR = path.join(
  __dirname,
  '../../../docs/specs/03-spec-language-selector/03-proofs/artifacts'
);

test.describe('Language Dropdown - Manual Capture', () => {
  test('Capture dropdown expanded', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Try to click the dropdown toggle
    try {
      const toggle = page.locator('#language-selector-toggle');
      await toggle.waitFor({ state: 'visible', timeout: 5000 });
      await toggle.click();
      await page.waitForTimeout(800);

      // Capture expanded dropdown
      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, '02-language-dropdown-expanded-full.png'),
        fullPage: true
      });

      console.log('✓ Captured: Dropdown expanded');
    } catch (error) {
      console.log('Could not capture dropdown:', error.message);

      // Take a screenshot anyway to see the state
      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, 'debug-page-state.png'),
        fullPage: true
      });
    }
  });
});
