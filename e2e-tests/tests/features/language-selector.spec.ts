import { test, expect } from '@fixtures/base-test';

test.describe('Language Selector', () => {
	test('language selector is visible on home page', async ({ page }) => {
		await page.goto('/');

		const languageSelector = page.locator('#language-selector');
		await expect(languageSelector).toBeVisible();

		const toggleButton = page.locator('#language-selector-toggle');
		await expect(toggleButton).toBeVisible();
		await expect(toggleButton).toContainText('EN');

		const globeIcon = toggleButton.locator('.fa-globe');
		await expect(globeIcon).toBeVisible();
	});

	test('language selector dropdown contains all 8 languages with native names', async ({ page }) => {
		await page.goto('/');

		const toggleButton = page.locator('#language-selector-toggle');
		await toggleButton.click();

		const dropdown = page.locator('#language-selector .dropdown-menu');
		await expect(dropdown).toBeVisible();

		// Verify all 8 languages are present with native names
		await expect(dropdown.getByText(/English.*EN/)).toBeVisible();
		await expect(dropdown.getByText(/Español.*ES/)).toBeVisible();
		await expect(dropdown.getByText(/Deutsch.*DE/)).toBeVisible();
		await expect(dropdown.getByText(/فارسی.*FA/)).toBeVisible();
		await expect(dropdown.getByText(/한국어.*KO/)).toBeVisible();
		await expect(dropdown.getByText(/Português.*PT/)).toBeVisible();
		await expect(dropdown.getByText(/Русский.*RU/)).toBeVisible();
		await expect(dropdown.getByText(/Türkçe.*TR/)).toBeVisible();
	});

	test('can switch to Spanish and content updates', async ({ page }, testInfo) => {
		await page.goto('/');

		// Verify English content
		await expect(page.getByRole('heading', { name: /Care made modern/i })).toBeVisible();

		// Open language selector
		const toggleButton = page.locator('#language-selector-toggle');
		await toggleButton.click();

		// Select Spanish
		const spanishOption = page.locator('#language-selector .dropdown-menu a:has-text("Español")');
		await spanishOption.click();

		// Wait for page to reload with Spanish content
		await page.waitForLoadState('networkidle');

		// Verify Spanish content appears
		await expect(page.getByRole('heading', { name: /Cuidado moderno/i })).toBeVisible();

		// Verify URL contains lang parameter
		expect(page.url()).toContain('lang=es');

		// Verify language selector button shows ES
		await expect(toggleButton).toContainText('ES');

		await page.screenshot({ path: testInfo.outputPath('language-spanish.png'), fullPage: true });
	});

	test('can switch to German and content updates', async ({ page }) => {
		await page.goto('/');

		// Open language selector and select German
		const toggleButton = page.locator('#language-selector-toggle');
		await toggleButton.click();

		const germanOption = page.locator('#language-selector .dropdown-menu a:has-text("Deutsch")');
		await germanOption.click();

		await page.waitForLoadState('networkidle');

		// Verify German content
		await expect(page.getByRole('heading', { name: /Moderne Tierpflege/i })).toBeVisible();
		expect(page.url()).toContain('lang=de');
		await expect(toggleButton).toContainText('DE');
	});

	test('language selection persists across navigation', async ({ page }) => {
		await page.goto('/');

		// Switch to Spanish
		const toggleButton = page.locator('#language-selector-toggle');
		await toggleButton.click();
		await page.locator('#language-selector .dropdown-menu a:has-text("Español")').click();
		await page.waitForLoadState('networkidle');

		// Navigate to Find Owners page
		await page.getByRole('link', { name: /Buscar propietarios/i }).click();
		await page.waitForLoadState('networkidle');

		// Verify language persists
		expect(page.url()).toContain('lang=es');
		await expect(toggleButton).toContainText('ES');
		await expect(page.getByRole('heading', { name: /Buscar propietarios/i })).toBeVisible();

		// Navigate to Veterinarians page
		await page.getByRole('link', { name: /Veterinarios/i }).click();
		await page.waitForLoadState('networkidle');

		// Verify language still persists
		expect(page.url()).toContain('lang=es');
		await expect(toggleButton).toContainText('ES');
	});

	test('selected language is highlighted in dropdown', async ({ page }) => {
		await page.goto('/?lang=pt');
		await page.waitForLoadState('networkidle');

		const toggleButton = page.locator('#language-selector-toggle');
		await expect(toggleButton).toContainText('PT');

		await toggleButton.click();

		// Verify Portuguese option has active class
		const portugueseOption = page.locator('#language-selector .dropdown-menu a:has-text("Português")');
		await expect(portugueseOption).toHaveClass(/active/);
	});

	test('language selector works on multiple pages', async ({ page }) => {
		// Test on home page
		await page.goto('/');
		await expect(page.locator('#language-selector')).toBeVisible();

		// Test on vets page
		await page.goto('/vets.html');
		await expect(page.locator('#language-selector')).toBeVisible();

		// Test on find owners page
		await page.goto('/owners/find');
		await expect(page.locator('#language-selector')).toBeVisible();
	});

	test('can switch between multiple languages', async ({ page }) => {
		await page.goto('/');

		const toggleButton = page.locator('#language-selector-toggle');

		// Switch to Korean
		await toggleButton.click();
		await page.locator('#language-selector .dropdown-menu a:has-text("한국어")').click();
		await page.waitForLoadState('networkidle');
		await expect(toggleButton).toContainText('KO');
		expect(page.url()).toContain('lang=ko');

		// Switch to Russian
		await toggleButton.click();
		await page.locator('#language-selector .dropdown-menu a:has-text("Русский")').click();
		await page.waitForLoadState('networkidle');
		await expect(toggleButton).toContainText('RU');
		expect(page.url()).toContain('lang=ru');

		// Switch back to English
		await toggleButton.click();
		await page.locator('#language-selector .dropdown-menu a:has-text("English")').click();
		await page.waitForLoadState('networkidle');
		await expect(toggleButton).toContainText('EN');
	});

	test('language selector has proper ARIA attributes', async ({ page }) => {
		await page.goto('/');

		const toggleButton = page.locator('#language-selector-toggle');

		// Check ARIA label
		await expect(toggleButton).toHaveAttribute('aria-label', 'Select language');

		// Open dropdown and check active language has aria-current
		await toggleButton.click();
		const activeLanguage = page.locator('#language-selector .dropdown-menu a.active');
		await expect(activeLanguage).toHaveAttribute('aria-current', 'true');
	});

	test('dropdown closes after language selection', async ({ page }) => {
		await page.goto('/');

		const toggleButton = page.locator('#language-selector-toggle');
		const dropdown = page.locator('#language-selector .dropdown-menu');

		// Open dropdown
		await toggleButton.click();
		await expect(dropdown).toBeVisible();

		// Select a language
		await page.locator('#language-selector .dropdown-menu a:has-text("Español")').click();
		await page.waitForLoadState('networkidle');

		// Dropdown should be closed after page reload
		await expect(dropdown).not.toBeVisible();
	});
});
