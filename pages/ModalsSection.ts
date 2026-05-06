import { Page, Locator } from '@playwright/test';
import { step } from '../helpers/allure';

export class ModalsSection {
  readonly page: Page;
  readonly openModalButton: Locator;
  readonly modal: Locator;
  readonly closeButton: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  readonly alertSuccess: Locator;
  readonly alertWarning: Locator;
  readonly alertError: Locator;
  readonly alertInfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.openModalButton = page.locator('#open-modal');
    this.modal           = page.locator('#test-modal');
    this.closeButton     = page.locator('#close-modal');
    this.confirmButton   = page.locator('#modal-confirm');
    this.cancelButton    = page.locator('#modal-cancel');
    this.alertSuccess    = page.locator('#alert-success');
    this.alertWarning    = page.locator('#alert-warning');
    this.alertError      = page.locator('#alert-error');
    this.alertInfo       = page.locator('#alert-info');
  }

  @step('Open modal')
  async open(): Promise<void> {
    await this.openModalButton.click();
  }

  @step('Confirm modal')
  async confirm(): Promise<void> {
    await this.confirmButton.click();
  }

  @step('Cancel modal')
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  @step('Close modal via X button')
  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
