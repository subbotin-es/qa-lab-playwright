import { Page } from '@playwright/test';

export class DragDropSection {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
