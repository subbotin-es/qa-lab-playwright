import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';

test.describe('Tables', () => {
  test.beforeEach(async ({ qaLab }) => {
    await qaLab.scrollToSection('#tables');
  });

  test('table has exactly 3 data rows', {
    tag: ['@smoke', '@tables'],
  }, async ({ tables }) => {
    await allure.feature('Tables');
    await allure.story('Row Count');
    await allure.severity('critical');

    const count = await tables.getRowCount();
    expect(count).toBe(3);
  });

  test('first row contains correct ID and name', {
    tag: ['@regression', '@tables'],
  }, async ({ tables }) => {
    await allure.feature('Tables');
    await allure.story('Cell Content');
    await allure.severity('normal');

    await expect.soft(tables.rows.nth(0).locator('td').nth(0)).toHaveText('1');
    await expect.soft(tables.rows.nth(0).locator('td').nth(1)).toHaveText('John Doe');
    await expect.soft(tables.rows.nth(0).locator('td').nth(2)).toHaveText('john@example.com');
  });

  test('second row contains correct data', {
    tag: ['@regression', '@tables'],
  }, async ({ tables }) => {
    await allure.feature('Tables');
    await allure.story('Cell Content');
    await allure.severity('normal');

    const id   = await tables.getCellText(1, 0);
    const name = await tables.getCellText(1, 1);

    expect(id).toBe('2');
    expect(name).toBe('Jane Smith');
  });

  test('each row has an Edit button', {
    tag: ['@smoke', '@tables'],
  }, async ({ tables }) => {
    await allure.feature('Tables');
    await allure.story('Action Column');
    await allure.severity('critical');

    await expect.soft(tables.getEditButton(0)).toBeVisible();
    await expect.soft(tables.getEditButton(1)).toBeVisible();
    await expect.soft(tables.getEditButton(2)).toBeVisible();
  });

  test('first row status is Active', {
    tag: ['@regression', '@tables'],
  }, async ({ tables }) => {
    await allure.feature('Tables');
    await allure.story('Cell Content');
    await allure.severity('minor');

    const status = await tables.getCellText(0, 3);
    expect(status).toBe('Active');
  });

  test('second row status is Inactive', {
    tag: ['@regression', '@tables'],
  }, async ({ tables }) => {
    await allure.feature('Tables');
    await allure.story('Cell Content');
    await allure.severity('minor');

    const status = await tables.getCellText(1, 3);
    expect(status).toBe('Inactive');
  });
});
