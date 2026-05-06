import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { step } from '../helpers/allure';

export class AsyncButtonsSection {
  readonly page: Page;
  readonly submitButton: Locator;
  readonly deleteButton: Locator;
  readonly resetButton: Locator;
  readonly statusText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.locator('#btn-async-success');
    this.deleteButton = page.locator('#btn-async-error');
    this.resetButton  = page.locator('#btn-async-reset');
    this.statusText   = page.locator('#async-status');
  }

  @step('Click Submit Order button')
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  @step('Click Delete Record button')
  async clickDelete(): Promise<void> {
    await this.deleteButton.click();
  }

  @step('Click Reset All button')
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  @step('Wait for button text')
  async waitForButtonText(button: Locator, text: string): Promise<void> {
    await expect(button).toHaveText(text, { timeout: 10_000 });
  }
}
