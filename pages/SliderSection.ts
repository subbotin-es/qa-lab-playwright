import { Page, Locator } from '@playwright/test';
import { step } from '../helpers/allure';

export class SliderSection {
  readonly page: Page;
  readonly slider: Locator;
  readonly valueDisplay: Locator;

  constructor(page: Page) {
    this.page = page;
    this.slider       = page.locator('#test-slider');
    this.valueDisplay = page.locator('#slider-value');
  }

  @step('Set slider value')
  async setValue(value: number): Promise<void> {
    await this.slider.fill(String(value));
  }

  @step('Get displayed slider value')
  async getDisplayedValue(): Promise<string> {
    return this.valueDisplay.innerText();
  }
}
