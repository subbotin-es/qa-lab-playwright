import { Locator, expect } from '@playwright/test';

export async function waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
  await expect(locator).toBeVisible({ timeout });
}

export async function waitForText(locator: Locator, text: string, timeout = 10_000): Promise<void> {
  await expect(locator).toHaveText(text, { timeout });
}

export async function waitForHidden(locator: Locator, timeout = 10_000): Promise<void> {
  await expect(locator).toBeHidden({ timeout });
}
