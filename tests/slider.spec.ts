import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';

test.describe('Slider', () => {
  test.beforeEach(async ({ qaLab }) => {
    await qaLab.scrollToSection('#test-slider');
  });

  test('slider has initial value of 50', {
    tag: ['@smoke', '@slider'],
  }, async ({ slider }) => {
    await allure.feature('Slider');
    await allure.story('Initial State');
    await allure.severity('critical');

    await expect(slider.slider).toHaveValue('50');
    const displayed = await slider.getDisplayedValue();
    expect(displayed).toBe('50');
  });

  test('slider value display updates when value changes', {
    tag: ['@regression', '@slider'],
  }, async ({ slider }) => {
    await allure.feature('Slider');
    await allure.story('Value Change');
    await allure.severity('normal');

    await slider.setValue(75);

    await expect(slider.slider).toHaveValue('75');
    const displayed = await slider.getDisplayedValue();
    expect(displayed).toBe('75');
  });

  test('slider minimum boundary value', {
    tag: ['@regression', '@slider'],
  }, async ({ slider }) => {
    await allure.feature('Slider');
    await allure.story('Boundary Values');
    await allure.severity('minor');

    await slider.setValue(0);

    await expect(slider.slider).toHaveValue('0');
  });

  test('slider maximum boundary value', {
    tag: ['@regression', '@slider'],
  }, async ({ slider }) => {
    await allure.feature('Slider');
    await allure.story('Boundary Values');
    await allure.severity('minor');

    await slider.setValue(100);

    await expect(slider.slider).toHaveValue('100');
  });
});
