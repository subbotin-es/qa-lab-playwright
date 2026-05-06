import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';

test.describe('Alerts & Modals', () => {
  test.beforeEach(async ({ qaLab }) => {
    await qaLab.scrollToSection('#alerts');
  });

  test('modal is hidden before opening', {
    tag: ['@smoke', '@modals'],
  }, async ({ modals }) => {
    await allure.feature('Modals');
    await allure.story('Initial State');
    await allure.severity('critical');

    await expect(modals.modal).toBeHidden();
  });

  test('should open modal on button click', {
    tag: ['@smoke', '@modals'],
  }, async ({ modals }) => {
    await allure.feature('Modals');
    await allure.story('Open Modal');
    await allure.severity('critical');

    await modals.open();

    await expect(modals.modal).toBeVisible();
    await expect(modals.confirmButton).toBeVisible();
    await expect(modals.cancelButton).toBeVisible();
  });

  test('Confirm button is visible and clickable inside modal', {
    tag: ['@regression', '@modals'],
  }, async ({ modals }) => {
    await allure.feature('Modals');
    await allure.story('Confirm Action');
    await allure.severity('normal');

    await modals.open();
    await expect(modals.confirmButton).toBeVisible();
    await expect(modals.confirmButton).toBeEnabled();
    // Confirm has no close handler by design — modal stays open
    await modals.confirm();
    await expect(modals.modal).toBeVisible();
  });

  test('should close modal on Cancel click', {
    tag: ['@regression', '@modals'],
  }, async ({ modals }) => {
    await allure.feature('Modals');
    await allure.story('Cancel Action');
    await allure.severity('normal');

    await modals.open();
    await expect(modals.modal).toBeVisible();

    await modals.cancel();

    await expect(modals.modal).toBeHidden();
  });

  test('should close modal via X button', {
    tag: ['@regression', '@modals'],
  }, async ({ modals }) => {
    await allure.feature('Modals');
    await allure.story('Close via X');
    await allure.severity('normal');

    await modals.open();
    await modals.close();

    await expect(modals.modal).toBeHidden();
  });

  test('alert banners are visible on page', {
    tag: ['@smoke', '@modals'],
  }, async ({ modals }) => {
    await allure.feature('Modals');
    await allure.story('Alert Banners');
    await allure.severity('normal');

    await expect.soft(modals.alertSuccess).toBeVisible();
    await expect.soft(modals.alertWarning).toBeVisible();
    await expect.soft(modals.alertError).toBeVisible();
    await expect.soft(modals.alertInfo).toBeVisible();
  });
});
