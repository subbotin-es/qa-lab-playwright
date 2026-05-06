import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';

test.describe('Buttons', () => {
  test.beforeEach(async ({ qaLab }) => {
    await qaLab.scrollToSection('#buttons');
  });

  test('primary button is visible and enabled', {
    tag: ['@smoke', '@buttons'],
  }, async ({ buttons }) => {
    await allure.feature('Buttons');
    await allure.story('Primary Button');
    await allure.severity('critical');

    await expect(buttons.primaryButton).toBeVisible();
    await expect(buttons.primaryButton).toBeEnabled();
  });

  test('secondary button is visible and enabled', {
    tag: ['@smoke', '@buttons'],
  }, async ({ buttons }) => {
    await allure.feature('Buttons');
    await allure.story('Secondary Button');
    await allure.severity('normal');

    await expect(buttons.secondaryButton).toBeVisible();
    await expect(buttons.secondaryButton).toBeEnabled();
  });

  test('success button is visible and enabled', {
    tag: ['@regression', '@buttons'],
  }, async ({ buttons }) => {
    await allure.feature('Buttons');
    await allure.story('Success Button');
    await allure.severity('normal');

    await expect(buttons.successButton).toBeVisible();
    await expect(buttons.successButton).toBeEnabled();
  });

  test('danger button is visible and enabled', {
    tag: ['@regression', '@buttons'],
  }, async ({ buttons }) => {
    await allure.feature('Buttons');
    await allure.story('Danger Button');
    await allure.severity('normal');

    await expect(buttons.dangerButton).toBeVisible();
    await expect(buttons.dangerButton).toBeEnabled();
  });

  test('disabled button is not interactive', {
    tag: ['@regression', '@buttons'],
  }, async ({ buttons }) => {
    await allure.feature('Buttons');
    await allure.story('Disabled Button');
    await allure.severity('normal');

    await expect(buttons.disabledButton).toBeVisible();
    await expect(buttons.disabledButton).toBeDisabled();
  });

  test('primary button click does not throw', {
    tag: ['@regression', '@buttons'],
  }, async ({ buttons }) => {
    await allure.feature('Buttons');
    await allure.story('Primary Button Click');
    await allure.severity('minor');

    await buttons.clickPrimary();
    await expect(buttons.primaryButton).toBeVisible();
  });
});
