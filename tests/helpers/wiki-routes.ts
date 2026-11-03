import type { Page, Route } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export interface RouteInterceptorOptions {
  vaultType?: 'default' | 'empty' | 'no-links';
  simulateFailure?: 'rate_limit' | 'http_500' | 'network_error';
}

export async function setupWikiMockRoutes(page: Page, options: RouteInterceptorOptions = {}) {
  const { vaultType = 'default', simulateFailure } = options;

  // Set HTTP headers for Next.js SSR requests
  const extraHeaders: Record<string, string> = {};
  if (simulateFailure) {
    extraHeaders['x-wiki-test-failure'] = simulateFailure;
  } else {
    extraHeaders['x-wiki-test-vault'] = vaultType;
  }
  await page.setExtraHTTPHeaders(extraHeaders);

  // Set browser-level interception via page.route()
  await page.route('https://api.github.com/**', async (route: Route) => {
    const url = route.request().url();

    if (simulateFailure === 'rate_limit') {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'API rate limit exceeded for user',
          documentation_url:
            'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting',
        }),
      });
      return;
    }

    if (simulateFailure === 'http_500') {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });
      return;
    }

    if (simulateFailure === 'network_error') {
      await route.abort('failed');
      return;
    }

    if (url.includes('/git/trees/')) {
      let treeFile = path.resolve('tests/fixtures/wiki/tree.json');
      if (vaultType === 'empty') {
        treeFile = path.resolve('tests/fixtures/wiki/empty-vault/tree.json');
      } else if (vaultType === 'no-links') {
        treeFile = path.resolve('tests/fixtures/wiki/no-links-vault/tree.json');
      }

      if (fs.existsSync(treeFile)) {
        const body = fs.readFileSync(treeFile, 'utf-8');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body,
        });
        return;
      }
    }

    await route.continue();
  });

  await page.route('https://raw.githubusercontent.com/**', async (route: Route) => {
    const url = route.request().url();

    if (simulateFailure === 'network_error') {
      await route.abort('failed');
      return;
    }

    // Extract path after /main/
    const match = url.match(/\/main\/(.+)$/);
    if (match) {
      const relVaultPath = decodeURIComponent(match[1]);

      let localFilePath = '';
      if (vaultType === 'no-links') {
        localFilePath = path.resolve(
          'tests/fixtures/wiki/no-links-vault/pages',
          relVaultPath.replace(/^wiki\//, ''),
        );
      } else {
        localFilePath = path.resolve(
          'tests/fixtures/wiki/pages',
          relVaultPath.replace(/^wiki\//, ''),
        );
      }

      if (fs.existsSync(localFilePath)) {
        const content = fs.readFileSync(localFilePath, 'utf-8');
        await route.fulfill({
          status: 200,
          contentType: 'text/plain',
          body: content,
        });
        return;
      }
    }

    await route.fulfill({
      status: 404,
      body: 'Not found',
    });
  });
}
