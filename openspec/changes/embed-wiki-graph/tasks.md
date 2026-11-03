# Tasks

## 1. Environment & Configuration Setup

- [x] 1.1 Add `NEXT_PUBLIC_WIKI_GRAPH_URL=https://wiki-graph.tay-shon-da1.workers.dev/graph` to `.env.local` and `.env.example` and verify environment variable availability.
- [x] 1.2 Update Content Security Policy in `next.config.ts` to include `frame-src 'self' https://wiki-graph.tay-shon-da1.workers.dev;` and verify configuration loads cleanly.

## 2. Types & Embed Component Implementation

- [x] 2.1 Create standardized TypeScript interfaces in `src/types/graph-embed.ts` (`GraphEmbedOptions`, `GraphPostMessageEvent`) and verify type compilation with `npx tsc --noEmit`.
- [x] 2.2 Implement the reusable `<GraphEmbed />` client component in `src/components/wiki/GraphEmbed.tsx` supporting URL search params construction, loading overlay, 15-second timeout fallback with retry/direct link, host controls overlay (reload, fullscreen, open external), and `cropHeader` masking. Verify component renders properly without TypeScript errors.

## 3. Dedicated Embed Route

- [x] 3.1 Create `src/app/embed/page.tsx` to serve a full-viewport standalone graph viewer route that forwards URL search parameters (`?note=...`, `?cropHeader=...`, `?controls=...`) to `<GraphEmbed />`. Verify route renders and passes type checks.

## 4. Wiki Section Window Integration

- [x] 4.1 Update `src/components/sections/wiki-section.tsx` to render `<GraphEmbed cropHeader={true} height="100%" />` inside the existing 70vw window frame, removing server-side pipeline fetching dependencies while preserving window chrome and styling. Verify section mounts without runtime errors.

## 5. Verification & Integration Testing

- [x] 5.1 Implement Playwright end-to-end test in `tests/wiki-embed.spec.ts` verifying the wiki window renders the iframe with the correct URL, `cropHeader` styling, loading state, host controls, and that `/embed?note=index` forwards the query parameter properly.
- [x] 5.2 Run project type check (`npx tsc --noEmit`) and full production build (`npm run build`) to verify there are zero build or typing regressions.

## Workflow follow-up

- Archive the change after implementation and verification are complete.
