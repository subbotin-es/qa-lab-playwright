import { Page, Locator } from '@playwright/test';
import { step } from '../helpers/allure';

export class TablesSection {
  readonly page: Page;
  readonly table: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.locator('#test-table');
    this.rows  = page.locator('#test-table tbody tr');
  }

  @step('Get table row count')
  async getRowCount(): Promise<number> {
    return this.rows.count();
  }

  @step('Get cell text')
  async getCellText(rowIndex: number, colIndex: number): Promise<string> {
    return this.rows.nth(rowIndex).locator('td').nth(colIndex).innerText();
  }

  getEditButton(rowIndex: number): Locator {
    return this.rows.nth(rowIndex).getByRole('button', { name: 'Edit' });
  }

  @step('Click edit button for row')
  async clickEdit(rowIndex: number): Promise<void> {
    await this.getEditButton(rowIndex).click();
  }
}
