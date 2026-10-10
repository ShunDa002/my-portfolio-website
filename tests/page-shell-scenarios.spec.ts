import { test, expect } from '@playwright/test';

test.describe('Page Shell Scenarios (spec.md validation)', () => {
  test('Scenario: Visitor loads the site and navigates sections', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#about')).toBeAttached();
    await expect(page.locator('#skills')).toBeAttached();
    await expect(page.locator('#projects')).toBeAttached();
    await expect(page.locator('#wiki')).toBeAttached();
    await expect(page.locator('#contact')).toBeAttached();
  });

  test('Scenario: Direct section paths return not-found (404)', async ({ page }) => {
    const resAbout = await page.goto('/about');
    expect(resAbout?.status()).toBe(404);

    const resProjects = await page.goto('/projects');
    expect(resProjects?.status()).toBe(404);
  });

  test('Scenario: Defined non-section route /wiki returns 200', async ({ page }) => {
    const resWiki = await page.goto('/wiki');
    expect(resWiki?.status()).toBe(200);
    await expect(page.locator('header a[href="/wiki"]')).toBeVisible();
  });

  test('Scenario: Navigation between root page and /wiki', async ({ page }) => {
    await page.goto('/');

    // Activate wiki navigation link from root page
    const wikiLink = page.locator('header a[href="/wiki"]');
    await wikiLink.click();
    await expect(page).toHaveURL(/\/wiki/);

    // From /wiki, use navigation to return to root page sections
    const aboutLink = page.locator('header a[href="/#about"]');
    await aboutLink.click();
    await expect(page).toHaveURL(/\/#about/);
  });
});
