import { Page } from '@playwright/test';

export class CheckboxesSection {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
