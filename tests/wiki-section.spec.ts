import { test, expect } from '@playwright/test';
import { setupWikiMockRoutes } from './helpers/wiki-routes';

test.describe('Wiki Graph Section on Root Page', () => {
  test('renders wiki graph section and occupies ~70% viewport width', async ({ page }) => {
    await setupWikiMockRoutes(page);
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

  test('clicking the expand button in window header redirects to /wiki', async ({ page }) => {
    await setupWikiMockRoutes(page);
    await page.goto('/');

    const expandBtn = page.locator('#wiki a[aria-label="Expand to full wiki page"]');
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();

    await expect(page).toHaveURL(/\/wiki/);
    await expect(page.locator('svg[role="img"]')).toBeVisible();
  });

  test('embedded graph displays nodes and supports zoom controls', async ({ page }) => {
    await setupWikiMockRoutes(page);
    await page.goto('/');

    const frame = page.locator('[data-testid="wiki-window-frame"]');
    await expect(frame).toBeVisible();

    const svg = frame.locator('svg[role="img"]');
    await expect(svg).toBeVisible();

    // Nodes and edges render
    const nodes = svg.locator('g.nodes > g[role="button"]');
    const nodeCount = await nodes.count();
    expect(nodeCount).toBeGreaterThan(0);

    // Zoom controls inside window
    const zoomInBtn = frame.locator('button[aria-label="Zoom in"]');
    const zoomOutBtn = frame.locator('button[aria-label="Zoom out"]');
    const resetBtn = frame.locator('button[aria-label="Reset view"]');

    await expect(zoomInBtn).toBeVisible();
    await expect(zoomOutBtn).toBeVisible();
    await expect(resetBtn).toBeVisible();

    const initialViewBox = await svg.getAttribute('viewBox');
    await zoomInBtn.click();
    const zoomedViewBox = await svg.getAttribute('viewBox');
    expect(zoomedViewBox).not.toBe(initialViewBox);

    await resetBtn.click();
    const resetViewBox = await svg.getAttribute('viewBox');
    expect(resetViewBox).toBe(initialViewBox);
  });

  test('wheel scrolling inside graph zooms graph and prevents window scrolling, while scrolling outside scrolls page', async ({ page }) => {
    await setupWikiMockRoutes(page);
    await page.goto('/');

    const frame = page.locator('[data-testid="wiki-window-frame"]');
    await frame.scrollIntoViewIfNeeded();

    const initialScrollY = await page.evaluate(() => window.scrollY);
    const svg = frame.locator('svg[role="img"]');
    await expect(svg).toBeVisible();

    const initialViewBox = await svg.getAttribute('viewBox');

    // Scroll wheel over SVG
    await svg.hover();
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(100);

    const zoomedViewBox = await svg.getAttribute('viewBox');
    expect(zoomedViewBox).not.toBe(initialViewBox);

    // Window scroll position should NOT have changed because preventDefault was called on non-passive listener
    const scrollYAfterGraphWheel = await page.evaluate(() => window.scrollY);
    expect(scrollYAfterGraphWheel).toBe(initialScrollY);

    // Move mouse outside the window to header area and scroll
    await page.mouse.move(10, 10);
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(100);

    const scrollYAfterOutsideWheel = await page.evaluate(() => window.scrollY);
    expect(scrollYAfterOutsideWheel).not.toBe(scrollYAfterGraphWheel);
  });

  test('gracefully contains failure state without breaking other sections', async ({ page }) => {
    await setupWikiMockRoutes(page, { simulateFailure: 'http_500' });
    await page.goto('/');

    // Entire root page still intact
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#about')).toBeAttached();
    await expect(page.locator('#skills')).toBeAttached();
    await expect(page.locator('#projects')).toBeAttached();
    await expect(page.locator('#wiki')).toBeAttached();
    await expect(page.locator('#contact')).toBeAttached();

    // Fallback message rendered inside window frame
    const frame = page.locator('[data-testid="wiki-window-frame"]');
    await expect(frame.locator('[data-testid="wiki-window-error"]')).toBeVisible();
  });
});
