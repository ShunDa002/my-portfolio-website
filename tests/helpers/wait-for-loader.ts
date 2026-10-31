import type { Page } from '@playwright/test';

/**
 * Waits for the site-wide loading screen overlay to finish its fade-out
 * transition (opacity → 0, pointer-events → none).  Call this after
 * `page.goto()` in any test that needs to interact with elements beneath
 * the loading overlay.
 */
export async function waitForLoaderDismiss(page: Page): Promise<void> {
  const loader = page.locator('[data-testid="site-loader"]');
  await loader.waitFor({ state: 'attached', timeout: 8000 });
  // Wait until the loader has faded out (the class list includes opacity-0)
  await loader.evaluate(
    (el) =>
      new Promise<void>((resolve) => {
        const check = () => {
          if (el.classList.contains('opacity-0')) {
            resolve();
            return;
          }
          requestAnimationFrame(check);
        };
        check();
      }),
    { timeout: 8000 },
  );
}
