## Why

The portfolio shows finished projects as static cards, but the LLM Wiki project's most interesting property — that an AI agent grows an interlinked knowledge vault over time — is invisible in a screenshot. An interactive graph of the live `wiki/` directory turns that project into something a visitor can explore, and it demonstrates data-fetching, parsing, and visualization work that a card cannot.

## What Changes

- Add a new `/wiki` route hosting a full-viewport, force-directed graph of the LLM Wiki vault at `github.com/ShunDa002/llm-wiki3` (`wiki/` subtree).
- Fetch the vault at request time from the GitHub REST and raw-content APIs, cached with Next.js ISR so the graph reflects agent edits without a redeploy, and so a burst of visitors cannot exhaust the unauthenticated GitHub rate limit.
- Parse each markdown page's YAML frontmatter (`title`, `type`, `status`, `confidence`, `knowledge_status`, `tags`, `aliases`) and its `[[wikilink]]` references to build the graph's nodes and edges. Resolve wikilinks by title and by alias.
- Style nodes by vault section (`concepts`, `sources`, `syntheses`, `questions`) and size them by link degree, so vault structure is readable at a glance.
- Support pan, zoom, hover-highlight of a node's immediate neighborhood, and click-to-select.
- On node click, open a side panel with the page's title, frontmatter badges, a rendered excerpt, and a link to the page on GitHub.
- Degrade gracefully: when the GitHub fetch fails or is rate-limited, the page explains what happened and offers a retry rather than rendering an empty canvas.
- **BREAKING** (spec-level, not user-facing): the page shell's "no separate route for any section" requirement no longer describes the site. `/wiki` becomes a real route, and the persistent navigation gains a link to it.

## Capabilities

### New Capabilities

- `portfolio-site/wiki-graph`: the `/wiki` page — how the vault is retrieved and cached, how markdown frontmatter and wikilinks become nodes and edges, how the graph is rendered and navigated, what the node side panel shows, and how retrieval failures are surfaced.

### Modified Capabilities

- `portfolio-site/page-shell`: the site is no longer strictly single-page. The requirement that any non-root path returns not-found must carve out `/wiki`, and the persistent navigation requirement must account for a fifth link that leaves the root page instead of scrolling within it.

## Impact

- **New code**: `/wiki` route and its graph, side-panel, and error-state components; a wiki-fetch-and-parse module; a graph-data type module.
- **Modified code**: [header.tsx](src/components/ui/header.tsx) gains the `/wiki` link and must distinguish route links from in-page anchors. [layout.tsx](src/app/layout.tsx) and [page.tsx](src/app/page.tsx) are touched only if shared shell metadata moves.
- **New dependencies**: `d3-force` (layout math only — SVG rendering, pan, and zoom are written in-repo to match the existing design system), plus a frontmatter/markdown parser. No canvas or WebGL graph library.
- **External systems**: GitHub REST API (`git/trees`) and `raw.githubusercontent.com`, called unauthenticated. Rate limit is 60 requests/hour/IP, which the caching strategy must respect.
- **Testing**: Playwright coverage for the graph page under [tests/](tests/), including the failure state.
- **Non-goals**: no editing of the vault from the portfolio, no full-page markdown reader route, no search over vault content, no authentication.
