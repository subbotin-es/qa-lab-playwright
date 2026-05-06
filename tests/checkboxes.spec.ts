import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';

test.describe('Checkboxes & Radio Buttons', () => {
  test.beforeEach(async ({ qaLab }) => {
    await qaLab.scrollToSection('#checkboxes');
  });

  test('should check an unchecked checkbox', {
    tag: ['@smoke', '@checkboxes'],
  }, async ({ checkboxes }) => {
    await allure.feature('Checkboxes');
    await allure.story('Check State');
    await allure.severity('critical');

    await checkboxes.check(checkboxes.checkbox1);

    await expect(checkboxes.checkbox1).toBeChecked();
  });

  test('should uncheck a pre-checked checkbox', {
    tag: ['@regression', '@checkboxes'],
  }, async ({ checkboxes }) => {
    await allure.feature('Checkboxes');
    await allure.story('Uncheck State');
    await allure.severity('normal');

    await expect(checkboxes.checkbox3).toBeChecked();
    await checkboxes.uncheck(checkboxes.checkbox3);
    await expect(checkboxes.checkbox3).not.toBeChecked();
  });

  test('disabled checkbox is not interactive', {
    tag: ['@regression', '@checkboxes'],
  }, async ({ checkboxes }) => {
    await allure.feature('Checkboxes');
    await allure.story('Disabled State');
    await allure.severity('normal');

    await expect(checkboxes.checkbox4).toBeDisabled();
    await expect(checkboxes.checkbox4).not.toBeChecked();
  });

  test('radio buttons are mutually exclusive', {
    tag: ['@smoke', '@checkboxes'],
  }, async ({ checkboxes }) => {
    await allure.feature('Checkboxes');
    await allure.story('Radio Mutual Exclusivity');
    await allure.severity('critical');

    await checkboxes.selectYes();
    await expect(checkboxes.radioYes).toBeChecked();
    await expect(checkboxes.radioNo).not.toBeChecked();

    await checkboxes.selectMaybe();
    await expect(checkboxes.radioMaybe).toBeChecked();
    await expect(checkboxes.radioYes).not.toBeChecked();
  });

  test('radio No is checked by default', {
    tag: ['@regression', '@checkboxes'],
  }, async ({ checkboxes }) => {
    await allure.feature('Checkboxes');
    await allure.story('Default State');
    await allure.severity('minor');

    await expect(checkboxes.radioNo).toBeChecked();
  });

  test('checkbox 2 is unchecked by default', {
    tag: ['@regression', '@checkboxes'],
  }, async ({ checkboxes }) => {
    await allure.feature('Checkboxes');
    await allure.story('Default State');
    await allure.severity('minor');

    await expect(checkboxes.checkbox2).not.toBeChecked();
  });
});
