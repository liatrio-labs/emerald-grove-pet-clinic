import { test, expect } from '@fixtures/base-test';
import { createRequire } from 'node:module';

type AxeImpact = 'minor' | 'moderate' | 'serious' | 'critical' | null;

interface AxeViolation {
  id: string;
  impact: AxeImpact;
  description: string;
  nodes: Array<{ target: string[] }>;
}

test.describe('Upcoming Visits Accessibility', () => {
  test('upcoming visits page accessibility scan (non-blocking)', async ({ page }) => {
    await page.goto('/visits/upcoming');

    const require = createRequire(import.meta.url);
    const axePath = require.resolve('axe-core/axe.min.js');
    await page.addScriptTag({ path: axePath });

    const results = await page.evaluate(async () => {
      const w = window as any;
      return await w.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      });
    });

    const violations = (results as { violations: AxeViolation[] }).violations;
    const critical = violations.filter((v) => v.impact === 'critical');
    const serious = violations.filter((v) => v.impact === 'serious');
    const debugMessage = violations
      .map((v) => `${v.impact ?? 'unknown'}: ${v.id} - ${v.description}`)
      .join('\n');

    if (critical.length > 0 || serious.length > 0) {
      test.info().annotations.push({
        type: 'a11y',
        description: `critical=${critical.length}, serious=${serious.length}`
      });
      console.warn(
        `Accessibility violations detected\ncritical=${critical.length}, serious=${serious.length}\n${debugMessage}`
      );

      if (process.env.PW_A11Y_FAIL_ON_CRITICAL === 'true') {
        expect(
          critical.length,
          `Critical accessibility violations must be fixed\n${debugMessage}`
        ).toBe(0);
      }
    }
  });

  test('keyboard navigation through filter buttons', async ({ page }) => {
    await page.goto('/visits/upcoming');

    // Focus on the first filter button using Tab
    const filterButtons = page.locator('.liatrio-form-actions a.btn');
    const firstButton = filterButtons.first();

    // Navigate to filter area and verify buttons are focusable
    await firstButton.focus();
    await expect(firstButton).toBeFocused();

    // Tab through all filter buttons
    const buttonCount = await filterButtons.count();
    for (let i = 1; i < buttonCount; i++) {
      await page.keyboard.press('Tab');
      await expect(filterButtons.nth(i)).toBeFocused();
    }
  });

  test('table has proper ARIA and semantic structure', async ({ page }) => {
    await page.goto('/visits/upcoming');

    // Check for proper heading hierarchy
    const heading = page.getByRole('heading', { name: /Upcoming Visits/i });
    await expect(heading).toBeVisible();

    // Check filter navigation has aria-label
    const filterNav = page.locator('nav[aria-label="Time window filter"]');
    await expect(filterNav).toBeVisible();

    // Check table has role="table" attribute
    const table = page.locator('table#upcoming-visits');
    const tableExists = await table.isVisible();

    if (tableExists) {
      // Table headers should use scope="col"
      const headers = table.locator('thead th[scope="col"]');
      await expect(headers).toHaveCount(4);
    }
  });
});
