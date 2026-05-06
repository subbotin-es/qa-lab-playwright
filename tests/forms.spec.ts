import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';

test.describe('Registration Form', () => {
  test.beforeEach(async ({ qaLab }) => {
    await qaLab.scrollToSection('#forms');
  });

  test('should submit form with valid data and show success', {
    tag: ['@smoke', '@forms'],
  }, async ({ forms }) => {
    await allure.feature('Forms');
    await allure.story('Registration');
    await allure.severity('critical');

    await forms.fillForm({
      fullName: 'John Doe',
      email: 'john@example.com',
      age: 30,
      phone: '+1234567890',
    });
    await forms.submit();

    await expect(forms.feedbackMessage).toHaveClass(/success/);
    await expect(forms.feedbackMessage).toHaveText('Registration successful! (demo)');
  });

  test('should show validation errors on empty submit', {
    tag: ['@regression', '@forms'],
  }, async ({ forms }) => {
    await allure.feature('Forms');
    await allure.story('Validation');
    await allure.severity('normal');

    await forms.submit();

    await expect.soft(forms.feedbackMessage).toHaveClass(/error/);
    await expect.soft(forms.feedbackMessage).toContainText('Name must be at least 2 characters');
    await expect.soft(forms.feedbackMessage).toContainText('Invalid email format');
    await expect.soft(forms.feedbackMessage).toContainText('Age must be between 18 and 99');
  });

  test('should show error for invalid email format', {
    tag: ['@regression', '@forms'],
  }, async ({ forms }) => {
    await allure.feature('Forms');
    await allure.story('Validation');
    await allure.severity('normal');

    await forms.fillForm({
      fullName: 'Jane Smith',
      email: 'not-an-email',
      age: 25,
      phone: '',
    });
    await forms.submit();

    await expect(forms.feedbackMessage).toHaveClass(/error/);
    await expect(forms.feedbackMessage).toContainText('Invalid email format');
  });

  test('should show error when age is below minimum', {
    tag: ['@regression', '@forms'],
  }, async ({ forms }) => {
    await allure.feature('Forms');
    await allure.story('Validation');
    await allure.severity('minor');

    await forms.fillForm({
      fullName: 'Young User',
      email: 'user@example.com',
      age: 16,
      phone: '',
    });
    await forms.submit();

    await expect(forms.feedbackMessage).toHaveClass(/error/);
    await expect(forms.feedbackMessage).toContainText('Age must be between 18 and 99');
  });

  test('register button is visible', {
    tag: ['@smoke', '@forms'],
  }, async ({ forms }) => {
    await allure.feature('Forms');
    await allure.story('Registration');
    await allure.severity('critical');

    await expect(forms.registerButton).toBeVisible();
    await expect(forms.registerButton).toBeEnabled();
  });
});
