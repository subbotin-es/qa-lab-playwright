import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';

/**
 * Known limitation: QA Lab drag-and-drop uses HTML5 drag events (dragstart/drop),
 * not mouse events. Playwright's dragTo() simulates mouse events which may not
 * trigger HTML5 drag handlers reliably. Tests use JS event dispatch as workaround.
 * See CLAUDE.md section 15.
 */
test.describe('Drag and Drop', () => {
  test.beforeEach(async ({ qaLab }) => {
    await qaLab.scrollToSection('#drag-drop');
  });

  test('source items are visible in drag zone', {
    tag: ['@smoke', '@drag-drop'],
  }, async ({ dragDrop }) => {
    await allure.feature('Drag and Drop');
    await allure.story('Source Items');
    await allure.severity('critical');

    await expect.soft(dragDrop.itemAlpha).toBeVisible();
    await expect.soft(dragDrop.itemBeta).toBeVisible();
    await expect.soft(dragDrop.itemGamma).toBeVisible();
  });

  test('target drop zone is visible', {
    tag: ['@smoke', '@drag-drop'],
  }, async ({ dragDrop }) => {
    await allure.feature('Drag and Drop');
    await allure.story('Drop Zone');
    await allure.severity('critical');

    await expect(dragDrop.targetZone).toBeVisible();
  });

  test('dragging Item Alpha updates the drop log', {
    tag: ['@regression', '@drag-drop'],
  }, async ({ page, dragDrop }) => {
    await allure.feature('Drag and Drop');
    await allure.story('Drop Action');
    await allure.severity('normal');

    // Dispatch HTML5 drag events directly — Playwright mouse events do not
    // trigger the page's dragstart/drop handlers (see CLAUDE.md §15)
    await page.evaluate(() => {
      const source = document.getElementById('drag-1')!;
      const target = document.getElementById('drag-target')!;

      source.dispatchEvent(new DragEvent('dragstart', { bubbles: true }));
      target.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true }));
      target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true }));
      source.dispatchEvent(new DragEvent('dragend', { bubbles: true }));
    });

    await expect(dragDrop.dropLog).toContainText('Item Alpha');
  });

  test('dragging Item Beta updates the drop log', {
    tag: ['@regression', '@drag-drop'],
  }, async ({ page, dragDrop }) => {
    await allure.feature('Drag and Drop');
    await allure.story('Drop Action');
    await allure.severity('minor');

    await page.evaluate(() => {
      const source = document.getElementById('drag-2')!;
      const target = document.getElementById('drag-target')!;

      source.dispatchEvent(new DragEvent('dragstart', { bubbles: true }));
      target.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true }));
      target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true }));
      source.dispatchEvent(new DragEvent('dragend', { bubbles: true }));
    });

    await expect(dragDrop.dropLog).toContainText('Item Beta');
  });
});
