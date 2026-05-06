import { Page, Locator } from '@playwright/test';
import { step } from '../helpers/allure';

export class InputsSection {
  readonly page: Page;
  readonly textInput: Locator;
  readonly numberInput: Locator;
  readonly dateInput: Locator;
  readonly searchInput: Locator;
  readonly urlInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.textInput   = page.locator('#text-input');
    this.numberInput = page.locator('#number-input');
    this.dateInput   = page.locator('#date-input');
    this.searchInput = page.locator('#search-input');
    this.urlInput    = page.locator('#url-input');
  }

  @step('Fill text input')
  async fillText(value: string): Promise<void> {
    await this.textInput.fill(value);
  }

  @step('Fill number input')
  async fillNumber(value: number): Promise<void> {
    await this.numberInput.fill(String(value));
  }

  @step('Fill date input')
  async fillDate(value: string): Promise<void> {
    await this.dateInput.fill(value);
  }

  @step('Fill search input')
  async fillSearch(value: string): Promise<void> {
    await this.searchInput.fill(value);
  }

  @step('Fill URL input')
  async fillUrl(value: string): Promise<void> {
    await this.urlInput.fill(value);
  }
}
