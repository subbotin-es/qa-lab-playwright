import { Page } from '@playwright/test';

export class IFrameSection {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
