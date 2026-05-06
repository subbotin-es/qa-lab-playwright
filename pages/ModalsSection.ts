import { Page } from '@playwright/test';

export class ModalsSection {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
