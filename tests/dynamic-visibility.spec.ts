import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';

test.describe('Dynamic Visibility', () => {
  test.beforeEach(async ({ qaLab }) => {
    await qaLab.scrollToSection('#dynamic-visibility');
  });

  test('secret panel is hidden before checkbox is checked', {
    tag: ['@smoke', '@dynamic-visibility'],
  }, async ({ dynamicVisibility }) => {
    await allure.feature('Dynamic Visibility');
    await allure.story('Initial State');
    await allure.severity('critical');

    await expect(dynamicVisibility.secretPanel).toBeHidden();
  });

  test('checking the checkbox reveals the secret panel', {
    tag: ['@smoke', '@dynamic-visibility'],
  }, async ({ dynamicVisibility }) => {
    await allure.feature('Dynamic Visibility');
    await allure.story('Panel Reveal');
    await allure.severity('critical');

    await dynamicVisibility.toggle();

    await expect(dynamicVisibility.secretPanel).toBeVisible();
    await expect(dynamicVisibility.secretText).toBeVisible();
    await expect(dynamicVisibility.secretButton).toBeVisible();
  });

  test('unchecking hides the panel again', {
    tag: ['@regression', '@dynamic-visibility'],
  }, async ({ dynamicVisibility }) => {
    await allure.feature('Dynamic Visibility');
    await allure.story('Panel Hide');
    await allure.severity('normal');

    await dynamicVisibility.toggle();
    await expect(dynamicVisibility.secretPanel).toBeVisible();

    await dynamicVisibility.toggle();
    await expect(dynamicVisibility.secretPanel).toBeHidden();
  });

  test('secret button click increments counter', {
    tag: ['@regression', '@dynamic-visibility'],
  }, async ({ dynamicVisibility }) => {
    await allure.feature('Dynamic Visibility');
    await allure.story('Counter');
    await allure.severity('minor');

    await dynamicVisibility.toggle();
    await dynamicVisibility.clickSecretButton();

    const counterText = await dynamicVisibility.getCounterText();
    expect(counterText).toContain('1');
  });
});
