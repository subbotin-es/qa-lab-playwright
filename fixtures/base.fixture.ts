import { test as base } from '@playwright/test';
import { QALabPage } from '../pages/QALabPage';
import { ButtonsSection } from '../pages/ButtonsSection';
import { FormsSection } from '../pages/FormsSection';
import { InputsSection } from '../pages/InputsSection';
import { CheckboxesSection } from '../pages/CheckboxesSection';
import { DropdownsSection } from '../pages/DropdownsSection';
import { TablesSection } from '../pages/TablesSection';
import { ModalsSection } from '../pages/ModalsSection';
import { DynamicVisibilitySection } from '../pages/DynamicVisibilitySection';
import { AsyncButtonsSection } from '../pages/AsyncButtonsSection';
import { IFrameSection } from '../pages/IFrameSection';
import { DragDropSection } from '../pages/DragDropSection';

type QALabFixtures = {
  qaLab: QALabPage;
  buttons: ButtonsSection;
  forms: FormsSection;
  inputs: InputsSection;
  checkboxes: CheckboxesSection;
  dropdowns: DropdownsSection;
  tables: TablesSection;
  modals: ModalsSection;
  dynamicVisibility: DynamicVisibilitySection;
  asyncButtons: AsyncButtonsSection;
  iframes: IFrameSection;
  dragDrop: DragDropSection;
};

export const test = base.extend<QALabFixtures>({
  qaLab: async ({ page }, use) => {
    const qaLab = new QALabPage(page);
    await qaLab.goto();
    await use(qaLab);
  },
  buttons: async ({ page }, use) => {
    await use(new ButtonsSection(page));
  },
  forms: async ({ page }, use) => {
    await use(new FormsSection(page));
  },
  inputs: async ({ page }, use) => {
    await use(new InputsSection(page));
  },
  checkboxes: async ({ page }, use) => {
    await use(new CheckboxesSection(page));
  },
  dropdowns: async ({ page }, use) => {
    await use(new DropdownsSection(page));
  },
  tables: async ({ page }, use) => {
    await use(new TablesSection(page));
  },
  modals: async ({ page }, use) => {
    await use(new ModalsSection(page));
  },
  dynamicVisibility: async ({ page }, use) => {
    await use(new DynamicVisibilitySection(page));
  },
  asyncButtons: async ({ page }, use) => {
    await use(new AsyncButtonsSection(page));
  },
  iframes: async ({ page }, use) => {
    await use(new IFrameSection(page));
  },
  dragDrop: async ({ page }, use) => {
    await use(new DragDropSection(page));
  },
});

export { expect } from '@playwright/test';
