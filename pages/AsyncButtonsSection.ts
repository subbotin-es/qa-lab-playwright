import { Page } from '@playwright/test';

export class AsyncButtonsSection {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
