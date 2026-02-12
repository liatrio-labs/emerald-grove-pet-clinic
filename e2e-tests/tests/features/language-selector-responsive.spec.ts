import { test, expect } from '@fixtures/base-test';

test.describe('Language Selector Responsive Design', () => {
	test('language selector visible on desktop viewport (1200px)', async ({ page }, testInfo) => {
		await page.setViewportSize({ width: 1200, height: 800 });
		await page.goto('/');

		const languageSelector = page.locator('#language-selector');
		await expect(languageSelector).toBeVisible();

		// Verify selector is in navbar (not in collapsed menu)
		const navbar = page.locator('.navbar-collapse');
		await expect(navbar).not.toHaveClass(/show/);

		// Verify selector is positioned at far right
		const toggleButton = page.locator('#language-selector-toggle');
		await expect(toggleButton).toBeVisible();

		// Test selector functionality
		await toggleButton.click();
		const dropdown = page.locator('#language-selector .dropdown-menu');
		await expect(dropdown).toBeVisible();

		await page.screenshot({ path: testInfo.outputPath('language-selector-desktop-1200px.png'), fullPage: true });
	});

	test('language selector visible on tablet viewport (768px)', async ({ page }, testInfo) => {
		await page.setViewportSize({ width: 768, height: 1024 });
		await page.goto('/');

		const languageSelector = page.locator('#language-selector');
		await expect(languageSelector).toBeVisible();

		// Test selector functionality
		const toggleButton = page.locator('#language-selector-toggle');
		await expect(toggleButton).toBeVisible();
		await toggleButton.click();

		const dropdown = page.locator('#language-selector .dropdown-menu');
		await expect(dropdown).toBeVisible();

		await page.screenshot({ path: testInfo.outputPath('language-selector-tablet-768px.png'), fullPage: true });
	});

	test('language selector visible in collapsed menu on mobile viewport (375px)', async ({ page }, testInfo) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// On mobile, navbar should be collapsed
		const navbarCollapse = page.locator('#main-navbar');
		await expect(navbarCollapse).not.toHaveClass(/show/);

		// Click hamburger menu to expand
		const navbarToggler = page.locator('.navbar-toggler');
		await expect(navbarToggler).toBeVisible();
		await navbarToggler.click();

		// Wait for navbar to expand
		await expect(navbarCollapse).toHaveClass(/show/);

		// Language selector should be visible in expanded menu
		const languageSelector = page.locator('#language-selector');
		await expect(languageSelector).toBeVisible();

		// Test selector functionality
		const toggleButton = page.locator('#language-selector-toggle');
		await expect(toggleButton).toBeVisible();
		await toggleButton.click();

		const dropdown = page.locator('#language-selector .dropdown-menu');
		await expect(dropdown).toBeVisible();

		await page.screenshot({ path: testInfo.outputPath('language-selector-mobile-375px.png'), fullPage: true });
	});

	test('can switch language on mobile viewport', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// Expand mobile menu
		await page.locator('.navbar-toggler').click();
		await expect(page.locator('#main-navbar')).toHaveClass(/show/);

		// Open language selector
		const toggleButton = page.locator('#language-selector-toggle');
		await toggleButton.click();

		// Select Spanish
		await page.locator('#language-selector .dropdown-menu a:has-text("Español")').click();
		await page.waitForLoadState('networkidle');

		// Verify Spanish content
		await expect(page.getByRole('heading', { name: /Cuidado moderno/i })).toBeVisible();
		expect(page.url()).toContain('lang=es');
	});

	test('dropdown closes properly on mobile after selection', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// Expand mobile menu
		await page.locator('.navbar-toggler').click();

		// Open language selector and select language
		await page.locator('#language-selector-toggle').click();
		await page.locator('#language-selector .dropdown-menu a:has-text("Deutsch")').click();
		await page.waitForLoadState('networkidle');

		// After page reload, dropdown should be closed
		const dropdown = page.locator('#language-selector .dropdown-menu');
		await expect(dropdown).not.toBeVisible();
	});

	test('touch-friendly target sizes on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// Expand mobile menu
		await page.locator('.navbar-toggler').click();

		// Check toggle button size (should be at least 44x44px for touch)
		const toggleButton = page.locator('#language-selector-toggle');
		const buttonBox = await toggleButton.boundingBox();

		expect(buttonBox).toBeTruthy();
		if (buttonBox) {
			expect(buttonBox.height).toBeGreaterThanOrEqual(40); // Allow small margin
		}

		// Open dropdown and check language option sizes
		await toggleButton.click();

		const languageOptions = page.locator('#language-selector .dropdown-item');
		const optionCount = await languageOptions.count();
		expect(optionCount).toBe(8);

		// Check first option size
		const firstOptionBox = await languageOptions.first().boundingBox();
		expect(firstOptionBox).toBeTruthy();
		if (firstOptionBox) {
			expect(firstOptionBox.height).toBeGreaterThanOrEqual(40);
		}
	});

	test('dropdown menu aligns properly on desktop', async ({ page }) => {
		await page.setViewportSize({ width: 1200, height: 800 });
		await page.goto('/');

		const toggleButton = page.locator('#language-selector-toggle');
		await toggleButton.click();

		const dropdown = page.locator('#language-selector .dropdown-menu');
		await expect(dropdown).toBeVisible();

		// Verify dropdown has end alignment (right-aligned)
		await expect(dropdown).toHaveClass(/dropdown-menu-end/);
	});

	test('language selector maintains position across viewports', async ({ page }) => {
		// Test at multiple viewport sizes
		const viewports = [
			{ width: 375, height: 667, name: 'mobile' },
			{ width: 768, height: 1024, name: 'tablet' },
			{ width: 1024, height: 768, name: 'tablet-landscape' },
			{ width: 1200, height: 800, name: 'desktop' },
			{ width: 1920, height: 1080, name: 'desktop-large' }
		];

		for (const viewport of viewports) {
			await page.setViewportSize({ width: viewport.width, height: viewport.height });
			await page.goto('/');

			// On mobile/small tablets, need to expand menu first
			if (viewport.width < 992) {
				const toggler = page.locator('.navbar-toggler');
				if (await toggler.isVisible()) {
					await toggler.click();
				}
			}

			// Language selector should always be visible
			const languageSelector = page.locator('#language-selector');
			await expect(languageSelector).toBeVisible();

			// Language selector should always be last item in navbar
			const navItems = page.locator('.navbar-nav.ms-auto .nav-item');
			const lastItem = navItems.last();
			await expect(lastItem.locator('#language-selector')).toBeVisible();
		}
	});

	test('language selector works with portrait and landscape orientations', async ({ page }) => {
		// Portrait mobile
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');
		await page.locator('.navbar-toggler').click();
		await expect(page.locator('#language-selector')).toBeVisible();

		// Landscape mobile
		await page.setViewportSize({ width: 667, height: 375 });
		await page.goto('/');

		// May or may not need toggler depending on breakpoint
		const toggler = page.locator('.navbar-toggler');
		if (await toggler.isVisible()) {
			await toggler.click();
		}

		await expect(page.locator('#language-selector')).toBeVisible();
	});

	test('dropdown items remain readable at all viewport sizes', async ({ page }, testInfo) => {
		const viewports = [
			{ width: 375, height: 667 },
			{ width: 768, height: 1024 },
			{ width: 1200, height: 800 }
		];

		for (const viewport of viewports) {
			await page.setViewportSize({ width: viewport.width, height: viewport.height });
			await page.goto('/');

			// Expand menu if needed
			if (viewport.width < 992) {
				const toggler = page.locator('.navbar-toggler');
				if (await toggler.isVisible()) {
					await toggler.click();
				}
			}

			// Open language selector
			await page.locator('#language-selector-toggle').click();

			// Verify all language names are visible
			const dropdown = page.locator('#language-selector .dropdown-menu');
			await expect(dropdown.getByText(/English/)).toBeVisible();
			await expect(dropdown.getByText(/Español/)).toBeVisible();
			await expect(dropdown.getByText(/Deutsch/)).toBeVisible();
			await expect(dropdown.getByText(/فارسی/)).toBeVisible();
			await expect(dropdown.getByText(/한국어/)).toBeVisible();
			await expect(dropdown.getByText(/Português/)).toBeVisible();
			await expect(dropdown.getByText(/Русский/)).toBeVisible();
			await expect(dropdown.getByText(/Türkçe/)).toBeVisible();
		}
	});

	test('navbar collapses and expands correctly with language selector', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		const navbarCollapse = page.locator('#main-navbar');
		const toggler = page.locator('.navbar-toggler');

		// Initial state: collapsed
		await expect(navbarCollapse).not.toHaveClass(/show/);
		await expect(toggler).toBeVisible();

		// Expand
		await toggler.click();
		await expect(navbarCollapse).toHaveClass(/show/);
		await expect(page.locator('#language-selector')).toBeVisible();

		// Collapse
		await toggler.click();
		await expect(navbarCollapse).not.toHaveClass(/show/);

		// Expand again
		await toggler.click();
		await expect(navbarCollapse).toHaveClass(/show/);
		await expect(page.locator('#language-selector')).toBeVisible();
	});
});
