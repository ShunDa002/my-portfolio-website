import { test, expect } from '@playwright/test';

test.describe('External Knowledge Graph Embed', () => {
  test('renders embedded graph inside wiki window frame on root page', async ({ page }) => {
    // Intercept remote graph requests to respond quickly with dummy HTML in tests
    await page.route('**/*wiki-graph.tay-shon-da1.workers.dev/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body><div id="mock-graph-canvas">Mock Canvas</div></body></html>',
      });
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const section = page.locator('#wiki');
    await expect(section).toBeAttached();
    await expect(section.getByText('LLM Wiki Knowledge Graph')).toBeVisible();

    const frame = page.locator('[data-testid="wiki-window-frame"]');
    await expect(frame).toBeVisible();

    // Verify titlebar
    await expect(frame.getByText('vault://llm-wiki3/graph')).toBeVisible();

    // Verify GraphEmbed container and viewport
    const embedContainer = frame.locator('[data-testid="graph-embed-container"]');
    await expect(embedContainer).toBeVisible();

    const viewport = frame.locator('[data-testid="graph-embed-viewport"]');
    await expect(viewport).toBeVisible();

    // Check cropHeader styling (-56px margin)
    await expect(viewport).toHaveCSS('margin-top', '-56px');

    // Check iframe source
    const iframe = viewport.locator('iframe');
    await expect(iframe).toBeVisible();
    const src = await iframe.getAttribute('src');
    expect(src).toContain('https://wiki-graph.tay-shon-da1.workers.dev/graph');
    expect(src).toContain('chat=false');

    // Verify loading overlay disappears
    const loading = embedContainer.locator('[data-testid="graph-embed-loading"]');
    await expect(loading).not.toBeVisible();

    // Check host controls overlay
    const controls = embedContainer.locator('[data-testid="graph-embed-controls"]');
    await expect(controls).toBeVisible();
    await expect(controls.getByRole('button', { name: /Reload/i })).toBeVisible();
    await expect(controls.getByRole('button', { name: /Fullscreen/i })).toBeVisible();
    await expect(controls.getByRole('link', { name: /Open/i })).toBeVisible();
  });

  test('dedicated /embed route serves full-viewport graph viewer', async ({ page }) => {
    await page.route('https://wiki-graph.tay-shon-da1.workers.dev/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body><div id="mock-canvas">Mock Canvas</div></body></html>',
      });
    });

    await page.goto('/embed?note=index&cropHeader=true&controls=true');

    const embedContainer = page.locator('[data-testid="graph-embed-container"]');
    await expect(embedContainer).toBeVisible();

    // Check iframe has forwarded note query parameter and disabled chat by default
    const iframe = page.locator('iframe');
    await expect(iframe).toBeVisible();
    const src = await iframe.getAttribute('src');
    expect(src).toContain('https://wiki-graph.tay-shon-da1.workers.dev/graph');
    expect(src).toContain('note=index');
    expect(src).toContain('chat=false');

    // Controls should be visible
    const controls = page.locator('[data-testid="graph-embed-controls"]');
    await expect(controls).toBeVisible();

    // Viewport should have -56px crop margin
    const viewport = page.locator('[data-testid="graph-embed-viewport"]');
    await expect(viewport).toHaveCSS('margin-top', '-56px');
  });

  test('/embed route respects controls=false parameter', async ({ page }) => {
    await page.route('https://wiki-graph.tay-shon-da1.workers.dev/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body>Mock</body></html>',
      });
    });

    await page.goto('/embed?controls=false');

    const controls = page.locator('[data-testid="graph-embed-controls"]');
    await expect(controls).toHaveCount(0);
  });

  test('/embed route respects chat=true parameter', async ({ page }) => {
    await page.route('https://wiki-graph.tay-shon-da1.workers.dev/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body>Mock</body></html>',
      });
    });

    await page.goto('/embed?chat=true');

    const iframe = page.locator('iframe');
    await expect(iframe).toBeVisible();
    const src = await iframe.getAttribute('src');
    expect(src).not.toContain('chat=false');
  });
});
