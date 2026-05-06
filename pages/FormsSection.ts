import { Page, Locator } from '@playwright/test';
import { step } from '../helpers/allure';
import { RegistrationForm } from '../types';

export class FormsSection {
  readonly page: Page;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly ageInput: Locator;
  readonly phoneInput: Locator;
  readonly registerButton: Locator;
  readonly feedbackMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fullNameInput  = page.locator('#reg-name');
    this.emailInput     = page.locator('#reg-email');
    this.ageInput       = page.locator('#reg-age');
    this.phoneInput     = page.locator('#reg-phone');
    this.registerButton = page.locator('#reg-submit');
    this.feedbackMessage = page.locator('#reg-feedback');
  }

  @step('Fill registration form')
  async fillForm(data: RegistrationForm): Promise<void> {
    await this.fullNameInput.fill(data.fullName);
    await this.emailInput.fill(data.email);
    await this.ageInput.fill(String(data.age));
    await this.phoneInput.fill(data.phone);
  }

  @step('Submit registration form')
  async submit(): Promise<void> {
    await this.registerButton.click();
  }

  @step('Clear registration form')
  async clear(): Promise<void> {
    await this.fullNameInput.clear();
    await this.emailInput.clear();
    await this.ageInput.clear();
    await this.phoneInput.clear();
  }
}
