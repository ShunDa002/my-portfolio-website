# Design

## Context

The portfolio currently implements server-side fetching and parsing of vault markdown from GitHub (`src/lib/wiki/pipeline.ts`), feeding parsed nodes into `WikiGraphView.tsx`. This causes cold-start latency, GitHub rate limit risks, and duplicates graph visualization logic. A standalone knowledge graph application is deployed at `https://wiki-graph.tay-shon-da1.workers.dev/graph`.

See `proposal.md` for motivation and `docs/graph_embed_implementation_plan.md` for technical reference.

## Goals / Non-Goals

**Goals:**
- Provide a standardized, reusable `<GraphEmbed />` client component supporting URL query construction, loading overlay, timeout fallback, and fullscreen controls.
- Embed the remote knowledge graph seamlessly inside the existing 70vw wiki window on the home page with header cropping (`cropHeader={true}`) so it feels native.
- Provide a dedicated, standalone `/embed` route (`src/app/embed/page.tsx`) that forwards query parameters (`?note=...`, `?cropHeader=...`, `?controls=...`).
- Configure Content Security Policy in `next.config.ts` to allow `https://wiki-graph.tay-shon-da1.workers.dev` in `frame-src`.
- Provide robust loading and offline resilience with a 15-second timeout fallback.

**Non-Goals:**
- Modifying the remote Cloudflare Worker application or its deployed source code.
- Modifying the underlying GitHub vault markdown repository (`ShunDa002/llm-wiki3`).
- Re-implementing graph rendering logic (D3/Canvas) within this codebase.

## Decisions

### Decision 1: Embed via `<iframe>` with Host Wrapper Component

**Choice:** Implement `<GraphEmbed />` as a client component wrapping an HTML `<iframe>`.

**Rationale:** The remote graph application already provides optimized force-directed graph rendering, node exploration, and search. Embedding avoids duplicating thousands of lines of layout and rendering logic and guarantees automatic parity whenever the remote service updates.

**Alternatives considered:**
- *Vendoring/porting the remote graph codebase into this repo*: High maintenance cost, double dependencies, diverging codebases.
- *Simple raw iframe tag without a wrapper*: Lacks loading state, timeout handling, and fullscreen controls.

### Decision 2: Canvas-Only Header Masking (`cropHeader` Mode)

**Choice:** Mask the remote 56px (`3.5rem`) navigation header via CSS positioning within an `overflow: hidden` wrapper container:
```css
margin-top: -56px;
height: calc(100% + 56px);
```

**Rationale:** The remote graph page renders its own top navigation bar. In the portfolio's framed window or inside article embeds, this header is redundant and visually clashes with the host window titlebar. Cross-origin security prevents directly removing DOM nodes inside the iframe; negative margin offset visually clips the top 56px cleanly without requiring cross-origin script communication.

**Alternatives considered:**
- *Cross-origin postMessage requesting remote page to hide header*: Requires changes and deployments to the external service.
- *Leaving the remote header visible*: Creates visual clutter with nested navigation bars.

### Decision 3: Native Browser Fullscreen API on Container Wrapper

**Choice:** Invoke `containerRef.current.requestFullscreen()` on the outer wrapper `<div>` rather than on the `<iframe>` element itself.

**Rationale:** Requesting fullscreen on the wrapper keeps the host overlay controls (reload, exit fullscreen, open external) and background styling visible and interactive while in fullscreen mode.

**Alternatives considered:**
- *Requesting fullscreen on the `<iframe>` element*: Hides host overlay controls and browser styling during fullscreen.

### Decision 4: Loading State and Timeout Fallback (15 Seconds)

**Choice:** Track `isLoaded` state via iframe `onLoad` event, with a 15-second `setTimeout` fallback revealing `Retry` and `Open Directly ↗` controls if the connection times out.

**Rationale:** If network connectivity is slow or an ad-blocker blocks the iframe, the user is never trapped in an endless spinner. Standard iframe `onError` events are unreliable across origins; a timeout ensures deterministic fallback behavior.

**Alternatives considered:**
- *No timeout (spinner only)*: Risk of indefinite hang on network disruption.

### Decision 5: Content Security Policy Configuration

**Choice:** Update `next.config.ts` headers to include:
```ts
frame-src 'self' https://wiki-graph.tay-shon-da1.workers.dev;
```

**Rationale:** Ensures browsers enforcing strict CSP directives do not block the embedded graph iframe from loading.

## Risks / Trade-offs

- **[Risk] Remote service cold-start or temporary downtime**
  → *Mitigation*: Themed loading spinner and 15-second timeout fallback with explicit retry and external link buttons.
- **[Risk] Header height change in remote application**
  → *Mitigation*: The header offset is centralized as `REMOTE_HEADER_HEIGHT_PX = 56` and can be overridden if the remote styling changes.
- **[Risk] Mobile touch and scroll trapping**
  → *Mitigation*: The embed container uses standard iframe scrolling and provides fullscreen mode for dedicated touch navigation on smaller viewports.

## Migration Plan

1. Add `frame-src` to `next.config.ts`.
2. Add `NEXT_PUBLIC_WIKI_GRAPH_URL` to `.env.local` (with fallback to default URL).
3. Create `src/types/graph-embed.ts`.
4. Create `src/components/wiki/GraphEmbed.tsx`.
5. Create `src/app/embed/page.tsx`.
6. Update `src/components/sections/wiki-section.tsx` to render `<GraphEmbed />` in the window frame.
7. Update Playwright tests to verify the iframe integration and embed route.
