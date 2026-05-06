import { Page, Locator } from '@playwright/test';
import { step } from '../helpers/allure';

export class DragDropSection {
  readonly page: Page;
  readonly sourceContainer: Locator;
  readonly targetZone: Locator;
  readonly dropLog: Locator;
  readonly itemAlpha: Locator;
  readonly itemBeta: Locator;
  readonly itemGamma: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sourceContainer = page.locator('#drag-source');
    this.targetZone      = page.locator('#drag-target');
    this.dropLog         = page.locator('#drag-drop-log');
    this.itemAlpha       = page.locator('#drag-1');
    this.itemBeta        = page.locator('#drag-2');
    this.itemGamma       = page.locator('#drag-3');
  }

  getDragItem(itemId: string): Locator {
    return this.page.locator(`#${itemId}`);
  }

  @step('Drag item to target zone')
  async dragItemToTarget(itemLocator: Locator): Promise<void> {
    await itemLocator.dragTo(this.targetZone);
  }

  @step('Get drop log text')
  async getDropLogText(): Promise<string> {
    return this.dropLog.innerText();
  }
}
