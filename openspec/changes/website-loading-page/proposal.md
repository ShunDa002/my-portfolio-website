# Proposal

## Why

When visitors open or navigate the portfolio website, asynchronous assets—especially third-party embedded YouTube iframe videos in the Featured Projects section—take time to initialize and establish connections. Without a coordinated loading state, visitors may see layout shifts, unstyled flashes, or empty video frames before media elements are interactive. Displaying a branded loading page featuring the project's loader animation (`public/loader.gif`) ensures a polished, cohesive presentation during site startup and page transitions until the page and embedded project videos have fully loaded.

## What Changes

- **Loading Page Overlay Component**:
  - Implement a dedicated, full-screen loading page overlay component that presents the animated graphic from `public/loader.gif` centered against a themed dark background (`bg-slate-950`/`bg-midnight`).
  - Style the loading page to match the portfolio's cyberpunk/terminal aesthetic with smooth fade-in and fade-out transitions.
- **Site Startup & Lifecycle Synchronization**:
  - Display the loading screen immediately upon initial application mount / startup.
  - Track readiness of the page shell and wait for embedded project preview videos in the Featured Projects section to signal completion (iframe `onLoad` events).
  - Include a safe, defensive timeout threshold (e.g. 3–5 seconds) to prevent visitors from being indefinitely blocked if external video sources experience network degradation or are blocked.
  - Smoothly fade out and unmount or disable pointer interactions once readiness conditions are met.
- **Navigation & Page Transition Triggering**:
  - Trigger the loading screen during route transitions (e.g., navigating to and from the `/wiki` page) until the target page is mounted and ready.
- **Project Section Video Integration**:
  - Wire project preview iframes in `src/components/sections/projects.tsx` into the loading state coordination context or event bus so the loader knows when all preview videos on the page have loaded.

## Capabilities

### New Capabilities

- `portfolio-site/loading-screen`: Defines requirements for the full-screen loading screen overlay, display of `public/loader.gif`, synchronization with page and embedded video readiness, route transition loading states, and smooth exit transitions with fallback safety timeouts.

### Modified Capabilities

<!-- None -->

## Impact

- **UI Components**:
  - `src/components/ui/loading-screen.tsx`: New loading screen overlay component rendering `public/loader.gif`.
  - `src/components/providers/loading-provider.tsx` (or loading context hook): State coordinator managing loading status, video readiness counters, and route navigation states.
  - `src/app/layout.tsx`: Root layout integration to ensure the loading screen wraps and covers initial site startup and route transitions.
  - `src/components/sections/projects.tsx`: Attach iframe load handlers to notify the loading coordinator when embedded project videos finish loading.
- **Assets**: Uses existing asset `public/loader.gif`.
- **Performance & UX**: Eliminates jarring iframe loading pop-in; maintains smooth transitions with fallback safety timers to prevent hanging.
- **Tests**: Playwright tests to verify loading screen presentation on initial load, transition handling, dismissal after video readiness, and navigation behavior.
