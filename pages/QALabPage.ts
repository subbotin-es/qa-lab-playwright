import { Page, Locator } from '@playwright/test';
import { step } from '../helpers/allure';

export class QALabPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly sidebarNav: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'QA Lab - UI Automated Testing Elements' });
    this.sidebarNav = page.locator('.qa-sidebar');
  }

  @step('Navigate to QA Lab')
  async goto(): Promise<void> {
    await this.page.goto('/QA-Lab/qa-lab.html');
  }

  @step('Scroll to section')
  async scrollToSection(sectionId: string): Promise<void> {
    await this.page.locator(sectionId).scrollIntoViewIfNeeded();
  }

  navLink(label: string): Locator {
    return this.sidebarNav.getByRole('link', { name: label });
  }
}
