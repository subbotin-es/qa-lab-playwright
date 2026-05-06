import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';

test.describe('Async Button States', () => {
  test.beforeEach(async ({ qaLab }) => {
    await qaLab.scrollToSection('#async-buttons');
  });

  test('submit button transitions: idle → loading → success', {
    tag: ['@smoke', '@async-buttons'],
  }, async ({ asyncButtons }) => {
    await allure.feature('Async Buttons');
    await allure.story('Success Flow');
    await allure.severity('critical');

    await expect(asyncButtons.submitButton).toHaveText('Submit Order');

    await asyncButtons.clickSubmit();

    await expect(asyncButtons.submitButton).toHaveText('Processing...');
    await asyncButtons.waitForButtonText(asyncButtons.submitButton, '✓ Order Confirmed');
  });

  test('delete button transitions: idle → loading → error', {
    tag: ['@smoke', '@async-buttons'],
  }, async ({ asyncButtons }) => {
    await allure.feature('Async Buttons');
    await allure.story('Error Flow');
    await allure.severity('critical');

    await expect(asyncButtons.deleteButton).toHaveText('Delete Record');

    await asyncButtons.clickDelete();

    await expect(asyncButtons.deleteButton).toHaveText('Deleting...');
    await asyncButtons.waitForButtonText(asyncButtons.deleteButton, '✗ Server Error 500');
  });

  test('reset restores both buttons to initial state', {
    tag: ['@regression', '@async-buttons'],
  }, async ({ asyncButtons }) => {
    await allure.feature('Async Buttons');
    await allure.story('Reset Flow');
    await allure.severity('normal');

    await asyncButtons.clickSubmit();
    await asyncButtons.waitForButtonText(asyncButtons.submitButton, '✓ Order Confirmed');

    await asyncButtons.clickReset();

    await expect(asyncButtons.submitButton).toHaveText('Submit Order');
    await expect(asyncButtons.deleteButton).toHaveText('Delete Record');
  });

  test('submit button is disabled during loading state', {
    tag: ['@regression', '@async-buttons'],
  }, async ({ asyncButtons }) => {
    await allure.feature('Async Buttons');
    await allure.story('Loading State');
    await allure.severity('normal');

    await asyncButtons.clickSubmit();
    await expect(asyncButtons.submitButton).toBeDisabled();
    await asyncButtons.waitForButtonText(asyncButtons.submitButton, '✓ Order Confirmed');
  });
});
