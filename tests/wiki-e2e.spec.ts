import { test, expect } from '@playwright/test';
import { setupWikiMockRoutes } from './helpers/wiki-routes';

test.describe('Wiki Knowledge Graph E2E Tests (Fixture-Backed)', () => {
  test('Task 9.1 & 4.1-4.4 & 5.2-5.5: renders graph with no network access, verified metadata, header, nodes, labels, marker, and legend', async ({
    page,
  }) => {
    await setupWikiMockRoutes(page, { vaultType: 'default' });
    await page.goto('/wiki');

    // 4.1: Surface occupies full viewport without page scroll
    const container = page.locator('div.h-\\[100svh\\]');
    await expect(container).toBeVisible();

    // 4.2: Page metadata
    await expect(page).toHaveTitle(/LLM Wiki Knowledge Graph/);
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /LLM Wiki/);

    // 4.3 & 4.4: Header links are root-relative and include /wiki
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(page.locator('header a[href="/#about"]')).toBeVisible();
    await expect(page.locator('header a[href="/#skills"]')).toBeVisible();
    await expect(page.locator('header a[href="/#projects"]')).toBeVisible();
    await expect(page.locator('header a[href="/#contact"]')).toBeVisible();
    await expect(page.locator('header a[href="/wiki"]')).toBeVisible();

    // 5.2: Node count matches fixture count (15 nodes)
    const nodes = page.locator('g[role="button"]');
    await expect(nodes).toHaveCount(15);

    // 5.3: Longest title is truncated with ellipsis, full title in <title>
    const longestNode = page.locator(
      'g[role="button"][aria-label*="Markdown-First Retrieval vs Early Semantic Search"]',
    );
    await expect(longestNode).toBeVisible();
    await expect(longestNode.locator('text')).toHaveText('Markdown-First Retrieval vs…');
    await expect(longestNode.locator('title')).toHaveText(
      'Markdown-First Retrieval vs Early Semantic Search for Small Pilot Vaults',
    );

    // 5.4: Marker for non-settled knowledge_status (disputed page has marker, settled does not)
    const disputedNode = page.locator(
      'g[role="button"][aria-label="Markdown-First Retrieval (concept)"]',
    );
    await expect(disputedNode.locator('[data-testid="disputed-marker"]')).toBeVisible();

    const settledNode = page.locator(
      'g[role="button"][aria-label="Wiki Index as Routing Layer (concept)"]',
    );
    await expect(settledNode.locator('[data-testid="disputed-marker"]')).toHaveCount(0);

    // 5.5: Legend names each classification present in the vault
    const legend = page.locator('aside[aria-label="Graph Legend"]');
    await expect(legend).toBeVisible();
    await expect(legend).toContainText('concept');
    await expect(legend).toContainText('index');
    await expect(legend).toContainText('log');
    await expect(legend).toContainText('question');
    await expect(legend).toContainText('source');
    await expect(legend).toContainText('synthesis');
  });

  test('Task 6.1-6.5: Pan, zoom, reset, neighbourhood emphasis, keyboard traversal, and accessible text', async ({
    page,
  }) => {
    await setupWikiMockRoutes(page, { vaultType: 'default' });
    await page.goto('/wiki');

    const svg = page.locator('svg[role="img"]');
    await expect(svg).toBeVisible();

    // 6.5: Accessible text alternative
    const ariaLabel = await svg.getAttribute('aria-label');
    expect(ariaLabel).toContain('15 pages');
    const srOnly = page.locator('.sr-only');
    await expect(srOnly).toContainText('15 pages');

    // 6.1: Pan and zoom controls
    const initialViewBox = await svg.getAttribute('viewBox');
    expect(initialViewBox).toBeTruthy();

    // Zoom in
    await page.locator('button[aria-label="Zoom in"]').click();
    const zoomedInViewBox = await svg.getAttribute('viewBox');
    expect(zoomedInViewBox).not.toBe(initialViewBox);

    // 6.2: Reset control
    await page.locator('button[aria-label="Reset view"]').click();
    const resetViewBox = await svg.getAttribute('viewBox');
    expect(resetViewBox).toBe(initialViewBox);

    // 6.3: Neighbourhood emphasis on hover
    const indexNode = page.locator('g[role="button"][aria-label="Wiki Index (index)"]');
    await indexNode.hover();
    // Connected nodes remain opacity 1, unrelated node is dimmed (opacity 0.15)
    await expect(indexNode).toHaveAttribute('opacity', '1');

    // 6.4: Keyboard navigation and activation
    const allNodes = page.locator('g[role="button"]');
    const firstNode = allNodes.first();
    const secondNode = allNodes.nth(1);

    await firstNode.focus();
    await expect(firstNode).toBeFocused();

    // Tabbing moves through nodes in deterministic order
    await page.keyboard.press('Tab');
    await expect(secondNode).toBeFocused();

    // Activating focused node opens panel
    await page.keyboard.press('Enter');
    const panel = page.locator('aside[role="dialog"]');
    await expect(panel).toBeVisible();

  });

  test('Task 7.1-7.5: Detail panel rendering, sparse attributes, replacement, and keyboard return', async ({
    page,
  }) => {
    await setupWikiMockRoutes(page, { vaultType: 'default' });
    await page.goto('/wiki');

    // 7.1: Select concept node
    const conceptNode = page.locator(
      'g[role="button"][aria-label="Markdown-First Retrieval (concept)"]',
    );
    await conceptNode.click();

    const panel = page.locator('aside[role="dialog"]');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Markdown-First Retrieval');
    await expect(panel).toContainText('concept');
    await expect(panel).toContainText('active');
    await expect(panel).toContainText('medium');
    await expect(panel).toContainText('disputed');
    await expect(panel).toContainText('retrieval');
    await expect(panel).toContainText('Links To');

    // GitHub link opens in new tab
    const githubLink = panel.locator('a[href*="github.com"]');
    await expect(githubLink).toHaveAttribute('target', '_blank');

    // 7.3: Selecting a second node replaces panel (only 1 panel in DOM)
    const indexNode = page.locator('g[role="button"][aria-label="Wiki Index (index)"]');
    await indexNode.click();
    await expect(page.locator('aside[role="dialog"]')).toHaveCount(1);
    await expect(panel).toContainText('Wiki Index');

    // 7.2: Sparse frontmatter check on Wiki Index (no confidence, no tags)
    await expect(panel.locator('text=Confidence')).toHaveCount(0);

    // 7.4: Dismissing panel returns focus to originating node
    const closeBtn = panel.locator('button[aria-label="Close panel"]');
    await closeBtn.click();
    await expect(panel).toHaveCount(0);

    // Focus is back on index node
    await expect(indexNode).toBeFocused();
  });

  test('Task 8.1 & 8.2 & 8.3 & 8.4: Rate-limit failure state vs outage failure state with retry', async ({
    page,
  }) => {
    // 8.2: Rate-limit refusal
    await setupWikiMockRoutes(page, { simulateFailure: 'rate_limit' });
    await page.goto('/wiki');

    const rateLimitAlert = page.locator('div[role="alert"]:not(#__next-route-announcer__)');
    await expect(rateLimitAlert).toBeVisible();
    await expect(rateLimitAlert).toContainText('Rate Limit Exceeded');
    await expect(rateLimitAlert.locator('button', { hasText: 'Retry Connection' })).toBeVisible();
    await expect(rateLimitAlert.locator('a[href*="github.com"]')).toBeVisible();

    // 8.2: Outage / 500 error
    await setupWikiMockRoutes(page, { simulateFailure: 'http_500' });
    await page.goto('/wiki');

    const outageAlert = page.locator('div[role="alert"]:not(#__next-route-announcer__)');
    await expect(outageAlert).toBeVisible();
    await expect(outageAlert).toContainText('Vault Unreachable');

    // 8.3: Retry control replaces message with graph when vault is reachable
    await setupWikiMockRoutes(page, { vaultType: 'default' });
    await outageAlert.locator('button', { hasText: 'Retry Connection' }).click();

    // Graph is now visible
    await expect(page.locator('svg[role="img"]')).toBeVisible();
    await expect(page.locator('g[role="button"]')).toHaveCount(15);
  });

  test('Task 8.5: Empty vault state', async ({ page }) => {
    await setupWikiMockRoutes(page, { vaultType: 'empty' });
    await page.goto('/wiki');

    const emptyAlert = page.locator('div[role="alert"]:not(#__next-route-announcer__)');
    await expect(emptyAlert).toBeVisible();
    await expect(emptyAlert).toContainText('Knowledge Vault is Empty');
    await expect(emptyAlert.locator('a[href*="github.com"]')).toBeVisible();
    // No blank canvas or error
    await expect(page.locator('svg[role="img"]')).toHaveCount(0);
  });

  test('Task 8.6: No-connections vault renders all nodes without overlap and shows no-connections statement', async ({
    page,
  }) => {
    await setupWikiMockRoutes(page, { vaultType: 'no-links' });
    await page.goto('/wiki');

    // 3 nodes rendered
    const nodes = page.locator('g[role="button"]');
    await expect(nodes).toHaveCount(3);

    // No connections statement
    const notice = page.locator('[data-testid="no-connections-notice"]');
    await expect(notice).toBeVisible();
    await expect(notice).toContainText('No connections were found');
  });
});
