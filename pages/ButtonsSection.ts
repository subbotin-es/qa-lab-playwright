import { Page } from '@playwright/test';

export class ButtonsSection {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
