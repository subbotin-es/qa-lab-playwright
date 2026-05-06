import { Page, FrameLocator, Locator } from '@playwright/test';
import { step } from '../helpers/allure';

export class IFrameSection {
  readonly page: Page;
  readonly frame: FrameLocator;
  readonly innerText: Locator;
  readonly innerButton: Locator;
  readonly innerResult: Locator;
  readonly innerInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.frame       = page.frameLocator('#lab-iframe');
    this.innerText   = this.frame.locator('#iframe-text');
    this.innerButton = this.frame.locator('#iframe-btn');
    this.innerResult = this.frame.locator('#iframe-result');
    this.innerInput  = this.frame.locator('#iframe-input');
  }

  @step('Get iframe inner text')
  async getInnerText(): Promise<string> {
    return this.innerText.innerText();
  }

  @step('Click button inside iframe')
  async clickButton(): Promise<void> {
    await this.innerButton.click();
  }

  @step('Fill input inside iframe')
  async fillInput(value: string): Promise<void> {
    await this.innerInput.fill(value);
  }

  @step('Get iframe result text')
  async getResultText(): Promise<string> {
    return this.innerResult.innerText();
  }
}
