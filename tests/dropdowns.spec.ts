import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';

test.describe('Dropdowns', () => {
  test.beforeEach(async ({ qaLab }) => {
    await qaLab.scrollToSection('#dropdowns');
  });

  test('should select a country from single select', {
    tag: ['@smoke', '@dropdowns'],
  }, async ({ dropdowns }) => {
    await allure.feature('Dropdowns');
    await allure.story('Single Select');
    await allure.severity('critical');

    await dropdowns.selectCountry('usa');

    await expect(dropdowns.countrySelect).toHaveValue('usa');
  });

  test('should reflect the selected country value', {
    tag: ['@regression', '@dropdowns'],
  }, async ({ dropdowns }) => {
    await allure.feature('Dropdowns');
    await allure.story('Single Select');
    await allure.severity('normal');

    await dropdowns.selectCountry('uk');
    const selected = await dropdowns.getSelectedCountry();

    expect(selected).toBe('uk');
  });

  test('should select multiple options', {
    tag: ['@smoke', '@dropdowns'],
  }, async ({ dropdowns }) => {
    await allure.feature('Dropdowns');
    await allure.story('Multi Select');
    await allure.severity('critical');

    await dropdowns.selectMultiple(['programming', 'testing']);

    const selected = await dropdowns.getSelectedMultiple();
    expect(selected).toContain('programming');
    expect(selected).toContain('testing');
  });

  test('country select defaults to empty', {
    tag: ['@regression', '@dropdowns'],
  }, async ({ dropdowns }) => {
    await allure.feature('Dropdowns');
    await allure.story('Single Select');
    await allure.severity('minor');

    await expect(dropdowns.countrySelect).toHaveValue('');
  });

  test('should select all available multi-select options', {
    tag: ['@regression', '@dropdowns'],
  }, async ({ dropdowns }) => {
    await allure.feature('Dropdowns');
    await allure.story('Multi Select');
    await allure.severity('normal');

    await dropdowns.selectMultiple(['programming', 'testing', 'design', 'marketing']);

    const selected = await dropdowns.getSelectedMultiple();
    expect(selected).toHaveLength(4);
  });
});
