import { Page, Locator } from '@playwright/test';
import { step } from '../helpers/allure';

export class ButtonsSection {
  readonly page: Page;
  readonly primaryButton: Locator;
  readonly secondaryButton: Locator;
  readonly successButton: Locator;
  readonly dangerButton: Locator;
  readonly disabledButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.primaryButton  = page.locator('#button-primary');
    this.secondaryButton = page.locator('#button-secondary');
    this.successButton  = page.locator('#button-success');
    this.dangerButton   = page.locator('#button-danger');
    this.disabledButton = page.locator('#button-disabled');
  }

  @step('Click Primary Button')
  async clickPrimary(): Promise<void> {
    await this.primaryButton.click();
  }

  @step('Click Secondary Button')
  async clickSecondary(): Promise<void> {
    await this.secondaryButton.click();
  }

  @step('Click Success Button')
  async clickSuccess(): Promise<void> {
    await this.successButton.click();
  }

  @step('Click Danger Button')
  async clickDanger(): Promise<void> {
    await this.dangerButton.click();
  }
}
