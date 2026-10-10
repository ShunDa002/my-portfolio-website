import { test, expect } from '@playwright/test';

test.describe('Live Knowledge Vault Smoke Test', () => {
  test('hits live vault to catch upstream shape changes @live-vault', async ({ page }) => {
    // Hits the real /wiki route with live GitHub network access
    await page.goto('/wiki');

    const svg = page.locator('svg[role="img"]');
    await expect(svg).toBeVisible({ timeout: 15000 });

    // Should render nodes matching the live vault
    const nodes = page.locator('g[role="button"]');
    const count = await nodes.count();
    expect(count).toBeGreaterThanOrEqual(10);

    // Legend should be present
    const legend = page.locator('aside[aria-label="Graph Legend"]');
    await expect(legend).toBeVisible();

    console.log(`Live vault smoke test rendered ${count} nodes successfully.`);
  });
});
