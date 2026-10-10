import { test, expect } from '@playwright/test';
import { fetchVaultPages } from '../src/lib/wiki/fetch';

test('task 2.2: fetches vault pages and logs count matching markdown page count', async () => {
  const result = await fetchVaultPages();
  expect(result.status).toBe('success');

  if (result.status === 'success') {
    console.log(`Fetched ${result.pages.length} Markdown pages from live vault:`);
    for (const page of result.pages) {
      console.log(` - ${page.path}`);
      expect(page.path.startsWith('wiki/')).toBe(true);
      expect(page.path.endsWith('.md')).toBe(true);
      expect(page.content.length).toBeGreaterThan(0);
    }
    // Live vault has 15 markdown pages
    expect(result.pages.length).toBe(15);
  }
});
