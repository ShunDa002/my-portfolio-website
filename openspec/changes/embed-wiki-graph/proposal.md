# Proposal

## Why

Currently, the portfolio site retrieves the raw markdown vault from GitHub at request time and runs a server-side parsing pipeline to construct nodes and edges for in-browser rendering. This approach incurs latency, potential GitHub API rate limiting, and duplicates graph visualization logic already maintained and deployed as an independent graph application.

By embedding the existing deployed knowledge graph (`https://wiki-graph.tay-shon-da1.workers.dev/graph`) via an `<iframe>` within the portfolio's window frame, the application eliminates server-side fetching overhead, ensures visitors always see the fully featured, canonical knowledge graph visualization, and provides seamless deep-linking and fullscreen capabilities.

## What Changes

- **External Graph Configuration & Security**:
  - Configure `NEXT_PUBLIC_WIKI_GRAPH_URL` (defaulting to `https://wiki-graph.tay-shon-da1.workers.dev/graph`) in environment variables.
  - Update Content Security Policy in `next.config.ts` to allow `https://wiki-graph.tay-shon-da1.workers.dev` in `frame-src`.
- **Reusable `<GraphEmbed />` Component**:
  - Create standard TypeScript interfaces in `src/types/graph-embed.ts` for embed options and cross-window events.
  - Implement `<GraphEmbed />` client component with:
    - URL query parameter construction forwarding deep links (e.g. `?note=<id>`).
    - Canvas-only header masking (`cropHeader` mode) to shift and clip the remote navigation bar (56px) so only the canvas is displayed.
    - Themed loading indicator with a 15-second timeout fallback providing retry and direct link options.
    - Host overlay controls (Reload, Fullscreen toggle via browser Fullscreen API, Open in new tab).
- **Dedicated `/embed` Route**:
  - Implement `src/app/embed/page.tsx` to serve a full-viewport standalone embed route that forwards URL search parameters (`?note=...`, `?cropHeader=...`, `?controls=...`).
- **Wiki Section Window Integration**:
  - Update `src/components/sections/wiki-section.tsx` to embed `<GraphEmbed />` inside the existing 70vw framed window instead of executing the server-side GitHub data fetching pipeline and local `WikiGraphView`.
  - Maintain the window frame chrome and aesthetic while displaying the external interactive graph.

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `portfolio-site/wiki-graph`: Replaces live GitHub API vault fetching, local markdown parsing, and client-side graph rendering with embedding an external deployed knowledge graph application via `<iframe>`, supporting deep-link parameters (`?note=...`) and a dedicated `/embed` route.
- `portfolio-site/wiki-section`: Updates the root page wiki window frame to embed the external knowledge graph via `<GraphEmbed />` with header cropping, host controls, and client-side loading resilience instead of relying on server-side data fetching.

## Impact

- **Configuration**:
  - `next.config.ts`: Added `frame-src` directive for `https://wiki-graph.tay-shon-da1.workers.dev`.
  - `.env.local` / `.env.example`: Added `NEXT_PUBLIC_WIKI_GRAPH_URL`.
- **Types**:
  - `src/types/graph-embed.ts`: New interfaces for `GraphEmbedOptions` and `GraphPostMessageEvent`.
- **Components & Routes**:
  - `src/components/wiki/GraphEmbed.tsx`: New embed client component.
  - `src/app/embed/page.tsx`: New dedicated embed route.
  - `src/components/sections/wiki-section.tsx`: Refactored to render `<GraphEmbed />` in the window frame.
- **Dependencies**: Uses native HTML `<iframe>` and browser Fullscreen API; no new npm dependencies required.
- **Tests**:
  - Updates to existing wiki tests to reflect iframe embedding rather than server pipeline data rendering.
  - New Playwright tests verifying iframe URL construction, header crop style, loading spinner, and `/embed` route query parameter handling.
