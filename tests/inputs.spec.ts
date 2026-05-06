import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';

test.describe('Input Fields', () => {
  test.beforeEach(async ({ qaLab }) => {
    await qaLab.scrollToSection('#inputs');
  });

  test('should accept text input', {
    tag: ['@smoke', '@inputs'],
  }, async ({ inputs }) => {
    await allure.feature('Input Fields');
    await allure.story('Text Input');
    await allure.severity('critical');

    await inputs.fillText('Hello World');

    await expect(inputs.textInput).toHaveValue('Hello World');
  });

  test('should accept number input within range', {
    tag: ['@regression', '@inputs'],
  }, async ({ inputs }) => {
    await allure.feature('Input Fields');
    await allure.story('Number Input');
    await allure.severity('normal');

    await inputs.fillNumber(42);

    await expect(inputs.numberInput).toHaveValue('42');
  });

  test('should accept date input', {
    tag: ['@regression', '@inputs'],
  }, async ({ inputs }) => {
    await allure.feature('Input Fields');
    await allure.story('Date Input');
    await allure.severity('normal');

    await inputs.fillDate('2026-01-15');

    await expect(inputs.dateInput).toHaveValue('2026-01-15');
  });

  test('should accept search input', {
    tag: ['@regression', '@inputs'],
  }, async ({ inputs }) => {
    await allure.feature('Input Fields');
    await allure.story('Search Input');
    await allure.severity('normal');

    await inputs.fillSearch('playwright automation');

    await expect(inputs.searchInput).toHaveValue('playwright automation');
  });

  test('should accept URL input', {
    tag: ['@regression', '@inputs'],
  }, async ({ inputs }) => {
    await allure.feature('Input Fields');
    await allure.story('URL Input');
    await allure.severity('normal');

    await inputs.fillUrl('https://example.com');

    await expect(inputs.urlInput).toHaveValue('https://example.com');
  });

  test('all input fields are visible', {
    tag: ['@smoke', '@inputs'],
  }, async ({ inputs }) => {
    await allure.feature('Input Fields');
    await allure.story('Visibility');
    await allure.severity('critical');

    await expect.soft(inputs.textInput).toBeVisible();
    await expect.soft(inputs.numberInput).toBeVisible();
    await expect.soft(inputs.dateInput).toBeVisible();
    await expect.soft(inputs.searchInput).toBeVisible();
    await expect.soft(inputs.urlInput).toBeVisible();
  });
});
