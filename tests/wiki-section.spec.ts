import { test, expect } from '@playwright/test';

test.describe('Wiki Graph Section on Root Page', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept remote graph endpoint
    await page.route('https://wiki-graph.tay-shon-da1.workers.dev/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body><div id="mock-graph">Mock Graph Content</div></body></html>',
      });
    });
  });

  test('renders wiki graph section and occupies ~70% viewport width', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const section = page.locator('#wiki');
    await expect(section).toBeAttached();
    await expect(section.getByText('LLM Wiki Knowledge Graph')).toBeVisible();

    const frame = page.locator('[data-testid="wiki-window-frame"]');
    await expect(frame).toBeVisible();

    // Verify window occupies ~70% of viewport width
    const box = await frame.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      const viewportWidth = 1280;
      const widthRatio = box.width / viewportWidth;
      // Allow minor border/padding tolerance (e.g. 68% - 72%)
      expect(widthRatio).toBeGreaterThan(0.65);
      expect(widthRatio).toBeLessThan(0.75);
    }
  });

  test('embedded graph displays iframe with host action controls', async ({ page }) => {
    await page.goto('/');

    const frame = page.locator('[data-testid="wiki-window-frame"]');
    await expect(frame).toBeVisible();

    const iframe = frame.locator('iframe');
    await expect(iframe).toBeVisible();

    const controls = frame.locator('[data-testid="graph-embed-controls"]');
    await expect(controls).toBeVisible();
    await expect(controls.getByRole('button', { name: /Reload/i })).toBeVisible();
    await expect(controls.getByRole('button', { name: /Fullscreen/i })).toBeVisible();
    await expect(controls.getByRole('link', { name: /Open/i })).toBeVisible();
  });

  test('root page sections remain fully intact with wiki embed', async ({ page }) => {
    await page.goto('/');

    // Entire root page still intact
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#about')).toBeAttached();
    await expect(page.locator('#skills')).toBeAttached();
    await expect(page.locator('#projects')).toBeAttached();
    await expect(page.locator('#wiki')).toBeAttached();
    await expect(page.locator('#contact')).toBeAttached();
  });
});
