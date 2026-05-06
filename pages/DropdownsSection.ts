import { Page, Locator } from '@playwright/test';
import { step } from '../helpers/allure';

export class DropdownsSection {
  readonly page: Page;
  readonly countrySelect: Locator;
  readonly multipleSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.countrySelect  = page.locator('#select-country');
    this.multipleSelect = page.locator('#select-multiple');
  }

  @step('Select country by value')
  async selectCountry(value: string): Promise<void> {
    await this.countrySelect.selectOption(value);
  }

  @step('Get selected country value')
  async getSelectedCountry(): Promise<string> {
    return this.countrySelect.inputValue();
  }

  @step('Select multiple options')
  async selectMultiple(values: string[]): Promise<void> {
    await this.multipleSelect.selectOption(values);
  }

  @step('Get selected multiple values')
  async getSelectedMultiple(): Promise<string[]> {
    return this.multipleSelect.evaluate((el: HTMLSelectElement) =>
      Array.from(el.selectedOptions).map((opt) => opt.value),
    );
  }
}
