import { Page, Locator } from '@playwright/test';
import { step } from '../helpers/allure';

export class CheckboxesSection {
  readonly page: Page;
  readonly checkbox1: Locator;
  readonly checkbox2: Locator;
  readonly checkbox3: Locator;
  readonly checkbox4: Locator;
  readonly radioYes: Locator;
  readonly radioNo: Locator;
  readonly radioMaybe: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkbox1  = page.locator('#checkbox-1');
    this.checkbox2  = page.locator('#checkbox-2');
    this.checkbox3  = page.locator('#checkbox-3');
    this.checkbox4  = page.locator('#checkbox-4');
    this.radioYes   = page.locator('#radio-1');
    this.radioNo    = page.locator('#radio-2');
    this.radioMaybe = page.locator('#radio-3');
  }

  @step('Check checkbox option')
  async check(locator: Locator): Promise<void> {
    await locator.check();
  }

  @step('Uncheck checkbox option')
  async uncheck(locator: Locator): Promise<void> {
    await locator.uncheck();
  }

  @step('Select radio: Yes')
  async selectYes(): Promise<void> {
    await this.radioYes.check();
  }

  @step('Select radio: No')
  async selectNo(): Promise<void> {
    await this.radioNo.check();
  }

  @step('Select radio: Maybe')
  async selectMaybe(): Promise<void> {
    await this.radioMaybe.check();
  }
}
