import { Page, Locator } from '@playwright/test';
import { step } from '../helpers/allure';

export class DynamicVisibilitySection {
  readonly page: Page;
  readonly toggleCheckbox: Locator;
  readonly secretPanel: Locator;
  readonly secretButton: Locator;
  readonly secretText: Locator;
  readonly counter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toggleCheckbox = page.locator('#show-secret-panel');
    this.secretPanel    = page.locator('#secret-panel');
    this.secretButton   = page.locator('#secret-btn');
    this.secretText     = page.locator('#secret-text');
    this.counter        = page.locator('#secret-counter');
  }

  @step('Toggle secret panel checkbox')
  async toggle(): Promise<void> {
    await this.toggleCheckbox.click();
  }

  @step('Click secret button')
  async clickSecretButton(): Promise<void> {
    await this.secretButton.click();
  }

  @step('Get counter text')
  async getCounterText(): Promise<string> {
    return this.counter.innerText();
  }
}
