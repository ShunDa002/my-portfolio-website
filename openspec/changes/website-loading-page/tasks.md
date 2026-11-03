# Tasks

## 1. Foundation & Loading Overlay UI

- [x] 1.1 Create `src/components/ui/loading-screen.tsx` rendering `public/loader.gif` centered on a full-screen themed backdrop with `z-50`, accessible status attributes, `data-testid="site-loader"`, and smooth opacity transition handling. Verify that the component compiles and renders the loader image.
- [x] 1.2 Create `src/components/providers/loading-provider.tsx` and `useLoading` hook managing loading state, document readiness, iframe video readiness counters, route navigation state, and bounded safety timeout fallback. Verify provider exports and type contracts.

## 2. Integration & Video Readiness Synchronization

- [x] 2.1 Update `src/app/layout.tsx` to wrap the page tree with `LoadingProvider` and render `LoadingScreen`. Verify that the application boots and displays the loading screen on initial visit.
- [x] 2.2 Update `src/components/sections/projects.tsx` to register preview video iframes with the loading coordinator and report completion via iframe `onLoad`. Verify iframe load notifications fire for each project card with an embedded video.
- [x] 2.3 Add client-side route transition detection in `LoadingProvider` using `usePathname` to activate the loading screen during navigation between `/` and `/wiki` until the destination view mounts. Verify route navigation activates the loader.

## 3. Automated Verification & Regression Testing

- [x] 3.1 Create Playwright E2E test `tests/loading-screen.spec.ts` validating initial startup loader visibility, dismissal after readiness/timeout, non-blocking interaction after dismiss, and route transition display. Verify with `npx playwright test tests/loading-screen.spec.ts`.
- [x] 3.2 Run the complete test suite and linter (`npm run lint` and `npx playwright test`) to verify zero regressions in existing page shell and dialog behavior.
