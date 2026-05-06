import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';

test.describe('IFrame Elements', () => {
  test.beforeEach(async ({ qaLab }) => {
    await qaLab.scrollToSection('#iframes');
  });

  test('iframe inner text is accessible via frame context', {
    tag: ['@smoke', '@iframes'],
  }, async ({ iframes }) => {
    await allure.feature('IFrames');
    await allure.story('Frame Context');
    await allure.severity('critical');

    const text = await iframes.getInnerText();
    expect(text).toContain('This element lives inside an iframe');
  });

  test('iframe inner elements are visible', {
    tag: ['@smoke', '@iframes'],
  }, async ({ iframes }) => {
    await allure.feature('IFrames');
    await allure.story('Frame Elements Visibility');
    await allure.severity('critical');

    await expect.soft(iframes.innerText).toBeVisible();
    await expect.soft(iframes.innerButton).toBeVisible();
    await expect.soft(iframes.innerInput).toBeVisible();
  });

  test('button click inside iframe produces a result', {
    tag: ['@regression', '@iframes'],
  }, async ({ iframes }) => {
    await allure.feature('IFrames');
    await allure.story('Frame Interaction');
    await allure.severity('normal');

    await iframes.clickButton();

    const result = await iframes.getResultText();
    expect(result).toContain('Button clicked at');
  });

  test('input field inside iframe accepts text', {
    tag: ['@regression', '@iframes'],
  }, async ({ iframes }) => {
    await allure.feature('IFrames');
    await allure.story('Frame Input');
    await allure.severity('normal');

    await iframes.fillInput('hello from outside');

    await expect(iframes.innerInput).toHaveValue('hello from outside');
  });
});
