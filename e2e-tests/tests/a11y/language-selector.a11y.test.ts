import { test, expect } from '@fixtures/base-test';
import { createRequire } from 'node:module';

type AxeImpact = 'minor' | 'moderate' | 'serious' | 'critical' | null;

interface AxeViolation {
	id: string;
	impact: AxeImpact;
	description: string;
	nodes: Array<{ target: string[] }>;
}

test.describe('Language Selector Accessibility', () => {
	test('language selector has no critical accessibility violations', async ({ page }) => {
		await page.goto('/');

		// Inject axe-core
		const require = createRequire(import.meta.url);
		const axePath = require.resolve('axe-core/axe.min.js');
		await page.addScriptTag({ path: axePath });

		// Run axe-core scan on the language selector specifically
		const results = await page.evaluate(async () => {
			const w = window as any;
			return await w.axe.run('#language-selector', {
				runOnly: {
					type: 'tag',
					values: ['wcag2a', 'wcag2aa', 'best-practice']
				}
			});
		});

		const violations = (results as { violations: AxeViolation[] }).violations;
		const critical = violations.filter((v) => v.impact === 'critical');
		const serious = violations.filter((v) => v.impact === 'serious');

		const debugMessage = violations
			.map((v) => `${v.impact ?? 'unknown'}: ${v.id} - ${v.description}`)
			.join('\n');

		// Language selector should have ZERO critical or serious violations
		expect(critical.length, `Critical accessibility violations in language selector:\n${debugMessage}`).toBe(0);
		expect(serious.length, `Serious accessibility violations in language selector:\n${debugMessage}`).toBe(0);
	});

	test('language selector dropdown has proper ARIA attributes', async ({ page }) => {
		await page.goto('/');

		const toggleButton = page.locator('#language-selector-toggle');

		// Verify toggle button has aria-label
		const ariaLabel = await toggleButton.getAttribute('aria-label');
		expect(ariaLabel).toBeTruthy();
		expect(ariaLabel).toBe('Select language');

		// Open dropdown
		await toggleButton.click();

		// Verify dropdown menu has proper labelledby
		const dropdownMenu = page.locator('#language-selector .dropdown-menu');
		const labelledBy = await dropdownMenu.getAttribute('aria-labelledby');
		expect(labelledBy).toBe('language-selector-toggle');

		// Verify active language has aria-current
		const activeItem = page.locator('#language-selector .dropdown-item.active');
		const ariaCurrent = await activeItem.getAttribute('aria-current');
		expect(ariaCurrent).toBe('true');
	});

	test('language selector is keyboard accessible with Tab key', async ({ page }) => {
		await page.goto('/');

		// Tab through navbar to reach language selector
		await page.keyboard.press('Tab'); // Focus on first nav item
		await page.keyboard.press('Tab'); // Home
		await page.keyboard.press('Tab'); // Find Owners
		await page.keyboard.press('Tab'); // Veterinarians
		await page.keyboard.press('Tab'); // Error
		await page.keyboard.press('Tab'); // Language Selector

		// Verify language selector toggle is focused
		const toggleButton = page.locator('#language-selector-toggle');
		await expect(toggleButton).toBeFocused();
	});

	test('language selector opens with Enter key', async ({ page }) => {
		await page.goto('/');

		const toggleButton = page.locator('#language-selector-toggle');

		// Focus on language selector by clicking it first, then blur and refocus with keyboard
		await toggleButton.focus();

		// Press Enter to open dropdown
		await page.keyboard.press('Enter');

		// Verify dropdown is visible
		const dropdownMenu = page.locator('#language-selector .dropdown-menu');
		await expect(dropdownMenu).toBeVisible();
	});

	test('language selector opens with Space key', async ({ page }) => {
		await page.goto('/');

		const toggleButton = page.locator('#language-selector-toggle');
		await toggleButton.focus();

		// Press Space to open dropdown
		await page.keyboard.press('Space');

		// Verify dropdown is visible
		const dropdownMenu = page.locator('#language-selector .dropdown-menu');
		await expect(dropdownMenu).toBeVisible();
	});

	test('can select language using keyboard navigation', async ({ page }) => {
		await page.goto('/');

		const toggleButton = page.locator('#language-selector-toggle');
		await toggleButton.focus();

		// Open dropdown with Enter
		await page.keyboard.press('Enter');

		// Wait for dropdown to be visible
		await page.waitForSelector('#language-selector .dropdown-menu', { state: 'visible' });

		// Use Arrow Down to navigate to Spanish (second option)
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');

		// Press Enter to select
		await page.keyboard.press('Enter');

		// Wait for page to reload
		await page.waitForLoadState('networkidle');

		// Verify Spanish is selected
		expect(page.url()).toContain('lang=es');
		await expect(toggleButton).toContainText('ES');
	});

	test('can navigate dropdown options with arrow keys', async ({ page }) => {
		await page.goto('/');

		const toggleButton = page.locator('#language-selector-toggle');
		await toggleButton.focus();
		await page.keyboard.press('Enter');

		await page.waitForSelector('#language-selector .dropdown-menu', { state: 'visible' });

		// Arrow Down moves focus through options
		await page.keyboard.press('ArrowDown');
		let focusedElement = await page.evaluate(() => document.activeElement?.textContent?.trim());
		expect(focusedElement).toContain('English');

		await page.keyboard.press('ArrowDown');
		focusedElement = await page.evaluate(() => document.activeElement?.textContent?.trim());
		expect(focusedElement).toContain('Español');

		// Arrow Up moves focus back
		await page.keyboard.press('ArrowUp');
		focusedElement = await page.evaluate(() => document.activeElement?.textContent?.trim());
		expect(focusedElement).toContain('English');
	});

	test('Escape key closes dropdown', async ({ page }) => {
		await page.goto('/');

		const toggleButton = page.locator('#language-selector-toggle');
		await toggleButton.focus();
		await page.keyboard.press('Enter');

		const dropdownMenu = page.locator('#language-selector .dropdown-menu');
		await expect(dropdownMenu).toBeVisible();

		// Press Escape to close
		await page.keyboard.press('Escape');

		// Verify dropdown is hidden
		await expect(dropdownMenu).not.toBeVisible();
	});

	test('language selector maintains focus visibility', async ({ page }) => {
		await page.goto('/');

		const toggleButton = page.locator('#language-selector-toggle');
		await toggleButton.focus();

		// Check that focused element has visible focus indicator
		const hasFocusStyles = await toggleButton.evaluate((el) => {
			const styles = window.getComputedStyle(el);
			// Bootstrap typically adds outline or box-shadow on focus
			return styles.outline !== 'none' || styles.boxShadow !== 'none';
		});

		expect(hasFocusStyles).toBeTruthy();
	});

	test('screen reader can identify current language selection', async ({ page }) => {
		await page.goto('/?lang=de');

		const toggleButton = page.locator('#language-selector-toggle');

		// Verify button text includes language code
		await expect(toggleButton).toContainText('DE');

		// Open dropdown
		await toggleButton.click();

		// Verify German option has aria-current
		const germanOption = page.locator('#language-selector .dropdown-menu a:has-text("Deutsch")');
		await expect(germanOption).toHaveAttribute('aria-current', 'true');
		await expect(germanOption).toHaveClass(/active/);
	});
});
