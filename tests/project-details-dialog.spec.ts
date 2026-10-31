import { test, expect } from '@playwright/test';

test.describe('Featured Projects Details Dialog Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#projects').scrollIntoViewIfNeeded();
  });

  test('Clicking a project card opens the horizontal video-dominant dialog with details', async ({ page }) => {
    const firstCard = page.locator('#projects [role="button"]').first();
    await expect(firstCard).toBeVisible();

    // Verify card title is not a direct link to GitHub
    const titleLink = firstCard.locator('a');
    await expect(titleLink).toHaveCount(0);

    // Click card to open dialog
    await firstCard.click();

    // Dialog content should be visible
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Dialog title and description should be displayed
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText('Deepfake Detector');
    await expect(dialog.getByText(/combat misinformation/i)).toBeVisible();

    // Tags should be displayed inside dialog
    await expect(dialog.getByText('Next.js')).toBeVisible();
    await expect(dialog.getByText('FastAPI')).toBeVisible();

    // Dominant 16:9 iframe video should be present
    const iframe = dialog.locator('iframe');
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute('src', /youtube-nocookie\.com\/embed/);

    // Demo and GitHub action buttons should be present with correct links
    const demoBtn = dialog.locator('a', { hasText: 'View demo' });
    await expect(demoBtn).toBeVisible();
    await expect(demoBtn).toHaveAttribute('href', 'https://deepfake-web-nine.vercel.app');
    await expect(demoBtn).toHaveAttribute('target', '_blank');

    const githubBtn = dialog.locator('a', { hasText: 'View on GitHub' });
    await expect(githubBtn).toBeVisible();
    await expect(githubBtn).toHaveAttribute('href', 'https://github.com/ShunDa002/deepfake-detector-website');
    await expect(githubBtn).toHaveAttribute('target', '_blank');

    // Dismiss using Close button
    const closeBtn = dialog.getByRole('button', { name: 'Close' });
    await closeBtn.click();
    await expect(dialog).not.toBeVisible();
  });

  test('Keyboard navigation opens dialog with Enter and closes with Escape', async ({ page }) => {
    const card = page.locator('#projects [role="button"]').first();
    await card.focus();
    await page.keyboard.press('Enter');

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Press Escape to dismiss
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('Project without video displays stylized fallback panel in dialog', async ({ page }) => {
    const noVideoCard = page.locator('#projects [role="button"]', {
      hasText: 'Yahoo Finance MCP',
    });
    await noVideoCard.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText('Yahoo Finance MCP');

    // Should render fallback panel instead of iframe
    await expect(dialog.locator('iframe')).toHaveCount(0);
    await expect(dialog.getByText('Demonstration available in repository')).toBeVisible();

    // Projects without demo should not render the View demo button
    await expect(dialog.locator('a', { hasText: 'View demo' })).toHaveCount(0);
    const githubBtn = dialog.locator('a', { hasText: 'View on GitHub' });
    await expect(githubBtn).toBeVisible();

    // Close dialog
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });
});
