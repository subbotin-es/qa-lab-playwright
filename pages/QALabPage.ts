import { Page, Locator } from '@playwright/test';
import { step } from '../helpers/allure';

export class QALabPage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 }).first();
  }

  @step('Navigate to QA Lab')
  async goto(): Promise<void> {
    await this.page.goto('/QA-Lab/qa-lab.html');
  }

  @step('Scroll to section')
  async scrollToSection(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }
}
