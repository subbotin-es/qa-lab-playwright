import { Page } from '@playwright/test';

export class DropdownsSection {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
