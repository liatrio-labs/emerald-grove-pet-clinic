import type { Locator, Page } from '@playwright/test';

import { BasePage } from './base-page';

export class UpcomingVisitsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  heading(): Locator {
    return this.page.getByRole('heading', { name: /Upcoming Visits/i });
  }

  visitsTable(): Locator {
    return this.page.locator('table#upcoming-visits');
  }

  emptyMessage(): Locator {
    return this.page.locator('.liatrio-muted').filter({ hasText: /No upcoming visits/i });
  }

  filterButton(days: number): Locator {
    return this.page.locator(`.liatrio-form-actions a[href*="days=${days}"]`);
  }

  activeFilterButton(): Locator {
    return this.page.locator('.liatrio-form-actions a.btn-primary');
  }

  async open(days?: number): Promise<void> {
    const path = days ? `/visits/upcoming?days=${days}` : '/visits/upcoming';
    await this.goto(path);
    await this.heading().waitFor();
  }
}
