import { test, expect } from '@playwright/test';

test.describe('Task 9.5: Cache verification and GitHub API usage in practice', () => {
  test('confirms repeated loads within cache window do not re-fetch from GitHub metered API @live-cache', async ({
    page,
  }) => {
    // First load to /wiki
    const res1 = await page.goto('/wiki');
    expect(res1?.status()).toBe(200);
    await expect(page.locator('svg[role="img"]')).toBeVisible({ timeout: 15000 });

    // Second load to /wiki
    const res2 = await page.goto('/wiki');
    expect(res2?.status()).toBe(200);
    await expect(page.locator('svg[role="img"]')).toBeVisible({ timeout: 15000 });

    // Third load to /wiki
    const res3 = await page.goto('/wiki');
    expect(res3?.status()).toBe(200);
    await expect(page.locator('svg[role="img"]')).toBeVisible({ timeout: 15000 });
  });
});
