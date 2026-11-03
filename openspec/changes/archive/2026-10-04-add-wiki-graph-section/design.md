# Design

## Context

The portfolio site root (`src/app/page.tsx`) renders sections (`Hero`, `About`, `Skills`, `Projects`, `Contact`) on a single scrolling page. A dedicated `/wiki` route was built with a server-side force-directed layout pipeline (`src/lib/wiki/pipeline.ts`) and client-side SVG renderer (`src/components/wiki/WikiGraphView.tsx`). This change introduces a dedicated `WikiSection` on the root page that displays an interactive, zoomable preview inside an expandable window occupying 70% of screen width, linking directly to `/wiki`.

## Goals / Non-Goals

**Goals:**
- Provide a `WikiSection` component in `src/components/sections/wiki-section.tsx` with anchor `id="wiki"`.
- Integrate `WikiSection` into `src/app/page.tsx` between `Projects` and `Contact`.
- Render a themed window container occupying 70% of viewport width (`w-[70vw] max-w-[70vw] mx-auto`) with titlebar, macOS-style window dots, status badge, and top-right expand control (`Maximize2` / `ExternalLink` icon linking to `/wiki`).
- Render the interactive graph view inside the window with zoom, pan, and hover/focus neighborhood emphasis.
- Handle failure/empty vault states gracefully within the window frame without degrading the rest of the home page.

**Non-Goals:**
- Altering the core layout algorithm (`src/lib/wiki/layout.ts`) or parsing logic (`src/lib/wiki/parse.ts`).
- Creating a separate client-side API endpoint for graph data; server components fetch directly.

## Decisions

### 1. Server Component for Section Data Fetching
- **Decision:** Make `WikiSection` an async React Server Component that calls `await getWikiGraph()`.
- **Rationale:** Leverages existing Next.js ISR caching (`revalidate: 3600`, tag `wiki-vault`) and keeps client bundle lightweight.
- **Alternatives considered:** Client-side fetching via an API route. Rejected due to extra network hops, loading spinners on home page, and duplicate logic.

### 2. Window Container Structure, 70% Width, and Expand Control
- **Decision:** Build a window chrome container:
  - Width & Position: `w-[70vw] max-w-[70vw] mx-auto` to occupy 70% of full screen width, giving the knowledge graph a prominent canvas while maintaining comfortable page gutters.
  - Header: 3 colored dot accents (`bg-rose-500/80`, `bg-amber-500/80`, `bg-emerald-500/80`), title ("LLM Wiki Knowledge Vault"), active node count badge, and a top-right expand button using Next.js `Link href="/wiki"`.
  - Body: Height `h-[70vh]`, glassmorphism dark aesthetic (`bg-slate-950/70 border border-slate-800/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl`).
- **Rationale:** The 70% viewport width honors the user requirement, balancing readability with page layout aesthetics.

### 3. Graph View Adaptation for Window Frame
- **Decision:** Reuse `WikiGraphView` inside the window body with an `isEmbedded` prop (or embedded styling) to ensure controls and legend sit harmoniously within the framed window boundaries without overlapping window chrome.
- **Rationale:** Avoids code duplication while keeping interactive features (wheel zoom, pan, zoom controls, hover neighborhood highlights) completely consistent between the home page window and `/wiki`.

### 4. Inline Error and Fallback Containment
- **Decision:** When `getWikiGraph()` returns `empty` or `error`, render a compact fallback state card inside the window with an explanation and link to GitHub.
- **Rationale:** Guarantees that any external GitHub API issue or rate limit never crashes or blanks the portfolio's root page.

## Risks / Trade-offs

- **[Wheel Zoom vs Page Scroll]**: Scrolling the mouse wheel over the graph window could inadvertently scroll the webpage.
  - *Mitigation*: Registered a native non-passive wheel event listener (`{ passive: false }`) on the SVG element calling `e.preventDefault()`, which prevents the browser webpage from scrolling when the cursor is inside the graph canvas, while preserving standard vertical scrolling when the cursor is outside.
- **[Component Reusability]**: Future changes to `WikiGraphView` could unintentionally break either `/wiki` or the embedded section.
  - *Mitigation*: Add comprehensive Playwright E2E and component tests covering both full-page `/wiki` and the home page section window.
