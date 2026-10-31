import { test, expect } from '@playwright/test';
import { waitForLoaderDismiss } from './helpers/wait-for-loader';

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

  test('Scenario: Direct section paths and non-existent routes return not-found (404)', async ({ page }) => {
    const resAbout = await page.goto('/about');
    expect(resAbout?.status()).toBe(404);

    const resProjects = await page.goto('/projects');
    expect(resProjects?.status()).toBe(404);

    const resWiki = await page.goto('/wiki');
    expect(resWiki?.status()).toBe(404);
  });

  test('Scenario: Navigation from header to wiki section', async ({ page }) => {
    await page.goto('/');
    await waitForLoaderDismiss(page);

    const wikiLink = page.locator('header a[href="/#wiki"]');
    await expect(wikiLink).toBeVisible();
    await wikiLink.click();
    await expect(page).toHaveURL(/\/#wiki/);
  });

  test('Scenario: Re-clicking header navigation link after scrolling scrolls back to target section', async ({ page }) => {
    await page.goto('/');
    await waitForLoaderDismiss(page);

    const skillsLink = page.locator('header a[href="/#skills"]');
    await expect(skillsLink).toBeVisible();
    await skillsLink.click();
    await expect(page).toHaveURL(/\/#skills/);

    // Verify scrolled down to skills section
    await page.waitForFunction(() => {
      const el = document.getElementById('skills');
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return Math.abs(rect.top) < 150;
    });

    // Manually scroll away to top of page
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    // Click Skills link again while URL already ends with /#skills
    await skillsLink.click();

    // Verify page scrolls back to skills section
    await page.waitForFunction(() => {
      const el = document.getElementById('skills');
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return Math.abs(rect.top) < 150;
    });
  });
});
