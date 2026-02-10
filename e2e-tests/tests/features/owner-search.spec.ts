import { test, expect } from '@fixtures/base-test';
import { OwnerPage } from '@pages/owner-page';

test.describe('Owner Search - Multi-Field Search', () => {

	test('should search owners by telephone only', async ({ page }, testInfo) => {
		const ownerPage = new OwnerPage(page);

		// Navigate to find owners page
		await ownerPage.openFindOwners();

		// Search by telephone prefix "608555"
		await page.locator('input#telephone').fill('608555');
		await page.getByRole('button', { name: /Find Owner/i }).click();

		// Verify results page displays
		await expect(page.locator('h2').filter({ hasText: 'Owners' })).toBeVisible();

		// Verify owners table contains results
		const ownersTable = ownerPage.ownersTable();
		await expect(ownersTable).toBeVisible();

		// Verify at least one owner with matching telephone appears
		const tableRows = page.locator('table#owners tbody tr');
		await expect(tableRows.first()).toBeVisible();

		// Take screenshot
		await page.screenshot({ path: testInfo.outputPath('search-by-telephone.png'), fullPage: true });
	});

	test('should search owners by city only', async ({ page }, testInfo) => {
		const ownerPage = new OwnerPage(page);

		// Navigate to find owners page
		await ownerPage.openFindOwners();

		// Search by city "Madison"
		await page.locator('input#city').fill('Madison');
		await page.getByRole('button', { name: /Find Owner/i }).click();

		// Verify results page displays
		await expect(page.locator('h2').filter({ hasText: 'Owners' })).toBeVisible();

		// Verify owners table contains results
		const ownersTable = ownerPage.ownersTable();
		await expect(ownersTable).toBeVisible();

		// Verify multiple owners from Madison appear
		const tableRows = page.locator('table#owners tbody tr');
		await expect(tableRows.first()).toBeVisible();

		// Take screenshot
		await page.screenshot({ path: testInfo.outputPath('search-by-city.png'), fullPage: true });
	});

	test('should search owners by lastName and city', async ({ page }, testInfo) => {
		const ownerPage = new OwnerPage(page);

		// Navigate to find owners page
		await ownerPage.openFindOwners();

		// Search by lastName "Franklin" and city "Madison"
		await page.locator('input#lastName').fill('Franklin');
		await page.locator('input#city').fill('Madison');
		await page.getByRole('button', { name: /Find Owner/i }).click();

		// Should redirect to single owner details page (George Franklin)
		await expect(page).toHaveURL(/\/owners\/\d+/);

		// Verify owner details page
		await expect(page.locator('h2').filter({ hasText: /Owner Information/i })).toBeVisible();
		await expect(page.getByText('George Franklin')).toBeVisible();
		await expect(page.getByText('Madison')).toBeVisible();

		// Take screenshot
		await page.screenshot({ path: testInfo.outputPath('search-by-lastname-and-city.png'), fullPage: true });
	});

	test('should search owners by lastName and telephone', async ({ page }, testInfo) => {
		const ownerPage = new OwnerPage(page);

		// Navigate to find owners page
		await ownerPage.openFindOwners();

		// Search by lastName "Davis" and telephone "608555"
		await page.locator('input#lastName').fill('Davis');
		await page.locator('input#telephone').fill('608555');
		await page.getByRole('button', { name: /Find Owner/i }).click();

		// Verify results page displays
		await expect(page.locator('h2').filter({ hasText: 'Owners' })).toBeVisible();

		// Verify owners table contains results
		const ownersTable = ownerPage.ownersTable();
		await expect(ownersTable).toBeVisible();

		// Verify Davis owners with matching telephone appear
		const tableRows = page.locator('table#owners tbody tr');
		await expect(tableRows.first()).toBeVisible();

		// Take screenshot
		await page.screenshot({ path: testInfo.outputPath('search-by-lastname-and-telephone.png'), fullPage: true });
	});

	test('should search owners by all three fields', async ({ page }, testInfo) => {
		const ownerPage = new OwnerPage(page);

		// Navigate to find owners page
		await ownerPage.openFindOwners();

		// Search by all three fields: lastName "Franklin", city "Madison", telephone "6085551023"
		await page.locator('input#lastName').fill('Franklin');
		await page.locator('input#city').fill('Madison');
		await page.locator('input#telephone').fill('6085551023');
		await page.getByRole('button', { name: /Find Owner/i }).click();

		// Should redirect to single owner details page (George Franklin)
		await expect(page).toHaveURL(/\/owners\/\d+/);

		// Verify owner details page shows George Franklin
		await expect(page.locator('h2').filter({ hasText: /Owner Information/i })).toBeVisible();
		await expect(page.getByText('George Franklin')).toBeVisible();
		await expect(page.getByText('Madison')).toBeVisible();
		await expect(page.getByText('6085551023')).toBeVisible();

		// Take screenshot
		await page.screenshot({ path: testInfo.outputPath('search-by-all-three-fields.png'), fullPage: true });
	});

	test('should handle formatted telephone input', async ({ page }, testInfo) => {
		const ownerPage = new OwnerPage(page);

		// Navigate to find owners page
		await ownerPage.openFindOwners();

		// Search with formatted telephone "(608) 555-1023" instead of "6085551023"
		await page.locator('input#telephone').fill('(608) 555-1023');
		await page.getByRole('button', { name: /Find Owner/i }).click();

		// Should redirect to single owner details page (George Franklin)
		await expect(page).toHaveURL(/\/owners\/\d+/);

		// Verify owner details page shows correct owner
		await expect(page.locator('h2').filter({ hasText: /Owner Information/i })).toBeVisible();
		await expect(page.getByText('George Franklin')).toBeVisible();
		await expect(page.getByText('6085551023')).toBeVisible();

		// Take screenshot
		await page.screenshot({ path: testInfo.outputPath('search-formatted-telephone.png'), fullPage: true });
	});

	test('should redirect when single result found', async ({ page }, testInfo) => {
		const ownerPage = new OwnerPage(page);

		// Navigate to find owners page
		await ownerPage.openFindOwners();

		// Search for unique owner by telephone "6085558763"
		await page.locator('input#telephone').fill('6085558763');
		await page.getByRole('button', { name: /Find Owner/i }).click();

		// Should redirect to single owner details page
		await expect(page).toHaveURL(/\/owners\/\d+/);

		// Verify owner details page displays
		await expect(page.locator('h2').filter({ hasText: /Owner Information/i })).toBeVisible();

		// Take screenshot
		await page.screenshot({ path: testInfo.outputPath('search-single-result-redirect.png'), fullPage: true });
	});

	test('should show empty results with criteria message', async ({ page }, testInfo) => {
		const ownerPage = new OwnerPage(page);

		// Navigate to find owners page
		await ownerPage.openFindOwners();

		// Search with non-existent criteria
		await page.locator('input#lastName').fill('NonExistentOwner');
		await page.locator('input#city').fill('NonExistentCity');
		await page.locator('input#telephone').fill('9999999999');
		await page.getByRole('button', { name: /Find Owner/i }).click();

		// Should stay on owners page with query parameters
		await expect(page).toHaveURL(/\/owners\?/);

		// Verify error message displays
		const errorMessage = page.locator('.help-inline p');
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toContainText('has not been found');

		// Verify form fields retain the search values
		await expect(page.locator('input#lastName')).toHaveValue('NonExistentOwner');
		await expect(page.locator('input#city')).toHaveValue('NonExistentCity');
		await expect(page.locator('input#telephone')).toHaveValue('9999999999');

		// Take screenshot
		await page.screenshot({ path: testInfo.outputPath('search-empty-results.png'), fullPage: true });
	});

	test('should validate telephone minimum length', async ({ page }, testInfo) => {
		const ownerPage = new OwnerPage(page);

		// Navigate to find owners page
		await ownerPage.openFindOwners();

		// Submit with telephone less than 3 digits
		await page.locator('input#telephone').fill('12');
		await page.getByRole('button', { name: /Find Owner/i }).click();

		// Should stay on owners page with query parameters
		await expect(page).toHaveURL(/\/owners\?/);

		// Verify validation error message for telephone
		const telephoneError = page.locator('#telephoneGroup .help-inline p');
		await expect(telephoneError).toBeVisible();
		await expect(telephoneError).toContainText('must be at least 3 digits');

		// Take screenshot
		await page.screenshot({ path: testInfo.outputPath('search-telephone-validation.png'), fullPage: true });
	});

	test('should validate city minimum length', async ({ page }, testInfo) => {
		const ownerPage = new OwnerPage(page);

		// Navigate to find owners page
		await ownerPage.openFindOwners();

		// Submit with city less than 2 characters
		await page.locator('input#city').fill('M');
		await page.getByRole('button', { name: /Find Owner/i }).click();

		// Should stay on owners page with query parameters
		await expect(page).toHaveURL(/\/owners\?/);

		// Verify validation error message for city
		const cityError = page.locator('#cityGroup .help-inline p');
		await expect(cityError).toBeVisible();
		await expect(cityError).toContainText('must be at least 2 characters');

		// Take screenshot
		await page.screenshot({ path: testInfo.outputPath('search-city-validation.png'), fullPage: true });
	});

});
