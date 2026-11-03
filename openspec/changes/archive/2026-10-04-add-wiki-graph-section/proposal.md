# Proposal

## Why

Visitors currently have to discover and click the header badge to experience the LLM Wiki knowledge graph on `/wiki`. Showcasing the interactive graph directly as a dedicated section on the portfolio's home page immediately introduces visitors to Tay Shon Da's research in Agentic AI and knowledge vaults. An expandable window provides quick, zoomable interactivity in-place while letting visitors easily jump into the full-screen canvas on `/wiki`.

## What Changes

- Add a new `WikiSection` component in `src/components/sections/` matching the visual style, typography, and container padding of existing portfolio sections (`about`, `skills`, `projects`, `contact`).
- Integrate the section into `src/app/page.tsx` with anchor `id="wiki"`, placed after `Projects` and before `Contact`.
- Provide an interactive window container styled with sleek terminal/window chrome (title, status indicator, action buttons).
- Display the zoomable, pannable knowledge graph inside the window powered by `getWikiGraph()` and `WikiGraphView`.
- Provide an expand icon button (`Maximize2` or `ExternalLink`) in the top-right corner of the window that redirects/navigates to `/wiki`.
- Handle graceful fallback inside the window if retrieval encounters rate limits, network outages, or an empty vault without breaking the rest of the home page.

## Capabilities

### New Capabilities
- `portfolio-site/wiki-section`: Embeds an interactive, zoomable knowledge graph window into the portfolio's root page with an expand control linking to the full `/wiki` route.

### Modified Capabilities
- `portfolio-site/page-shell`: Updates the single-page section order to include the wiki graph section between featured projects and contact on the root page.

## Impact

- Code:
  - `src/components/sections/wiki-section.tsx` (new section component)
  - `src/app/page.tsx` (mount new section)
  - `src/components/wiki/WikiGraphView.tsx` (ensure styling and layout cleanly adapt when embedded in a framed window)
- Dependencies: None (reuses existing `d3-force`, `lucide-react`, `gray-matter`).
- Tests: Add unit/E2E test scenarios validating section existence, anchor jumping, zoomability, expand navigation to `/wiki`, and fallback handling.
