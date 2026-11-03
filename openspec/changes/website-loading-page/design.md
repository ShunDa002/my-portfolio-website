# Design

## Context

The portfolio is a Next.js (App Router) single-page application with an additional `/wiki` route. The root page contains multiple heavy visual sections, including the Featured Projects section which embeds YouTube iframe preview players (`youtube-nocookie.com/embed/...`).

Presently, on initial page load, these external iframe elements connect and stream preview data asynchronously, causing temporary empty frames or loading artifacts. Furthermore, navigations between the root page and `/wiki` switch layouts without a unified loading indicator. The workspace includes `public/loader.gif`, which should serve as the visual centerpiece of a cohesive loading experience.

## Goals / Non-Goals

**Goals:**
- Provide a centralized loading coordinator that oversees site startup and page transitions.
- Render a full-screen, branded loading overlay featuring `public/loader.gif` centered on a dark canvas.
- Keep the loading screen active on initial startup until both the core page document has loaded AND the embedded project demonstration videos have completed loading their preview players.
- Provide a resilient fallback safety timeout (3.5–4.0 seconds) to ensure visitors are never blocked if third-party YouTube embeds stall or fail due to network restrictions.
- Re-trigger the loading overlay seamlessly during client-side route transitions (e.g., navigating between `/` and `/wiki`) until the new page mounts.
- Ensure smooth visual transitions (fade-out) with zero pointer blocking once dismissed.

**Non-Goals:**
- Replacing YouTube video embeds with native `<video>` files or self-hosted media.
- Blocking navigation indefinitely on slow networks or stalled third-party scripts.
- Modifying modal dialog video behavior (the dialog only loads its video on explicit user demand when a card is clicked).

## Decisions

### Decision 1: Coordinated Loading State via React Context (`LoadingProvider`)
- **Choice**: Implement a client-side `LoadingProvider` and custom hook (`useLoading`) wrapped in the root layout (`src/app/layout.tsx`).
- **Rationale**: The root layout is a Server Component, but can host a Client Component provider. Centralizing loading state in a React Context allows the `Projects` section to register and report iframe load events without prop drilling through intermediate section components.
- **Alternatives Considered**:
  - *DOM Mutation Observer or global window polling*: Fragile, tightly coupled to specific DOM selectors, and prone to race conditions in React 19.
  - *Static timer (e.g. fixed 2-second sleep)*: Degrades UX on fast connections and fails to actually synchronize with YouTube iframe completion on slower connections.

### Decision 2: Multi-Factor Readiness with Bounded Safety Timeout
- **Choice**: Mark initial startup complete only when:
  1. Window/document has completed initial mounting (`document.readyState === 'complete'` or initial effect pass).
  2. All registered project video iframes have fired their `onLoad` handler.
  3. OR a safety timeout (3.5s) expires.
- **Rationale**: YouTube iframes load third-party scripts that can be delayed by ad blockers, regional network restrictions, or firewalls. A bounded timeout guarantees the portfolio always opens smoothly even under adverse network conditions.
- **Alternatives Considered**:
  - *Unbounded waiting*: High risk of permanent blank screen if YouTube iframe requests fail.

### Decision 3: Next.js App Router Route Navigation Handling
- **Choice**: Use Next.js client hooks (`usePathname`, `useSearchParams`) inside `LoadingProvider` to detect route transitions between `/` and `/wiki`. When a pathname transition begins or changes, set route loading to active and dismiss with a brief minimum display (e.g. 300–500ms) to ensure smooth visual continuity.
- **Rationale**: App Router does not provide the legacy `Router.events` (`routeChangeStart`). Tracking pathname changes alongside navigation link clicks provides consistent loading states without modifying Next.js internal router mechanisms.
- **Alternatives Considered**:
  - *Overriding all `<a>` tags with global click listener*: Could interfere with anchor hash links (e.g., `/#about`, `/#projects`) on the home page which do not require a full page reload.

### Decision 4: Smooth Fade Transition and Inert Layering
- **Choice**: Maintain the loading overlay at `z-50` with Tailwind transition utilities (`transition-opacity duration-500 ease-in-out`). When loading resolves, transition `opacity-100` to `opacity-0` and set `pointer-events-none`. Once the fade completes, unmount or render null until the next loading cycle.
- **Rationale**: Immediate unmounting feels jarring; a 500ms fade provides a sleek, polished feel consistent with the site's dark aesthetic.

## Risks / Trade-offs

- **[Risk]** YouTube iframe `onLoad` triggers before player is fully interactive.
  - **Mitigation**: The iframe `onLoad` fires when the YouTube document frame finishes loading its initial document. Combined with document ready and autoplay preview parameters, this synchronizes the reveal closely with visual playback.
- **[Risk]** Hash anchor navigation (e.g. clicking `#about` from the header) could accidentally trigger a page loading screen.
  - **Mitigation**: Route transition detection will specifically check for distinct pathname changes (e.g. `/` vs `/wiki`), ignoring hash-only in-page anchor scrolling.
- **[Risk]** E2E Playwright tests waiting for elements on `/` could time out if blocked by loader.
  - **Mitigation**: Loader has an explicit test-id (`data-testid="site-loader"`), auto-dismisses upon load or max timeout, and Playwright tests can either await its disappearance or observe it explicitly.

## Migration Plan

1. Create `src/components/providers/loading-provider.tsx` and `src/components/ui/loading-screen.tsx`.
2. Update `src/app/layout.tsx` to wrap content with `LoadingProvider` and render `LoadingScreen`.
3. Update `src/components/sections/projects.tsx` to register preview video iframes with the loading coordinator and report `onLoad`.
4. Validate with existing test suite and add new Playwright test verifying the loading screen lifecycle.
