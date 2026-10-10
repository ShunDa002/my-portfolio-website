## Context

See [proposal.md](proposal.md) — Why. Constraints that shape the approach:

- **The site is currently one route.** [layout.tsx](../../../src/app/layout.tsx) renders `Header` and `HybridBackground` globally, then wraps children in `<main className="relative z-20 flex flex-col items-center justify-center min-h-screen">`. Because the header lives in the root layout it will appear on `/wiki` for free, but the centering `main` and the fixed header overlay both affect how a full-viewport graph can be laid out.
- **Header links are bare fragments.** Every link in [header.tsx](../../../src/components/ui/header.tsx) is `href="#about"`-style. From `/wiki` those resolve against `/wiki` and scroll nowhere, so the page-shell delta's "visitor returns to the root page" scenario cannot pass without changing them.
- **Design tokens are minimal.** [globals.css](../../../src/app/globals.css) defines `--color-midnight` and `--color-cyan-glow` only, plus a global `:focus-visible` outline the graph's keyboard affordance can inherit rather than reinvent.
- **The vault is small and stays small for now.** The live `wiki/` tree holds 23 entries, of which 15 are Markdown pages. Frontmatter is plain YAML with scalars and lists (`aliases`, `tags`, `sources`); bodies use `[[wikilink]]` references, and `sources` lists carry wikilinks too. `index.md` links to roughly seven pages, making it the graph's one real hub.
- **GitHub's unauthenticated REST limit is 60 requests/hour/IP.** `raw.githubusercontent.com` is CDN-served and is not metered against that limit.
- **Playwright is configured but essentially empty** — `testDir: ./tests` with only `example.spec.ts`.

## Goals / Non-Goals

**Goals:**

- One code path from "GitHub tree listing" to "positioned nodes and edges", running entirely on the server, so the client receives plain JSON and no graph-layout code.
- Bounded, predictable GitHub API usage that a burst of visitors cannot exhaust, without introducing a token or any server-side storage.
- A failure path that is genuinely retryable — a failed retrieval must not be cached as though it were content.
- Vault-parsing rules kept in one pure module that can be exercised against fixtures without network access.

**Non-Goals:**

- No client-side force simulation, node dragging, or physics animation. Positions are computed once, server-side, and are static for a given vault revision.
- No Markdown-to-HTML rendering. The detail panel shows plain-text prose, which removes a renderer dependency and the sanitisation question that comes with it.
- No incremental or streaming graph loading. 15 pages is one payload.
- No authenticated GitHub access in this change (see Open Questions).

## Decisions

### Fetch strategy: one metered API call, N unmetered raw calls

Use the GitHub REST tree endpoint once — `GET /repos/ShunDa002/llm-wiki3/git/trees/main?recursive=1` — to enumerate the vault, then fetch each Markdown page's content from `raw.githubusercontent.com/ShunDa002/llm-wiki3/main/<path>`.

*Why:* it puts exactly **one** request per cache window against the 60/hour metered limit. The per-page fetches go to the CDN, which is not counted against it.

*Alternatives considered:* the Contents API per file (15 metered requests per fill — four fills would exhaust the hour); a single tarball download via codeload (one request, but adds tar decompression for no real gain at this size); the GraphQL API (requires a token).

### Caching: per-fetch revalidation, no route-level `revalidate`

Every outbound fetch carries `next: { revalidate: 3600, tags: ["wiki-vault"] }`. The `/wiki` page itself declares no route-level `revalidate` and stays dynamic.

*Why:* this is what makes the failure path work. With a route-level `revalidate`, a render that produced the failure UI would be cached and served as the page for the next hour. With per-fetch revalidation only, Next caches *successful* fetch responses for an hour and does not cache failed ones — so a visitor arriving after an outage triggers a real re-fetch, while a visitor arriving during normal operation costs zero outbound requests. The satisfies-the-spec property ("no more than 60 minutes stale", "does not scale with visitors") comes from the data cache, not from page caching.

*Cost:* the page re-renders per request, which means re-running the parse and the force layout on cached bytes. At 15 pages and ~23 nodes that is sub-millisecond work, so it is not worth caching separately yet.

*Alternatives considered:* `export const revalidate = 3600` on the page (breaks retryability, as above); a route handler at `/api/wiki-graph` plus a client-side fetch (restores retryability but pushes the graph behind a loading state and adds a public endpoint to maintain); `unstable_cache` around the parse (premature at this size — reach for it only if profiling says so).

### Force layout runs on the server; the client renders static SVG

Use `d3-force` server-side, run the simulation to convergence with a fixed tick count and a seeded initial placement, and serialise `{ id, x, y, r, type, label, ... }` per node. The client component renders an SVG from those coordinates and implements pan and zoom by mutating `viewBox`.

*Why:* three benefits at once. `d3-force` never enters the client bundle. The layout is deterministic, so screenshots and Playwright assertions are stable. And there is no simulation jitter or settling animation on load — the graph is correct on first paint.

*Cost:* nodes cannot be dragged. No spec scenario requires dragging.

*Alternatives considered:* `react-force-graph-2d` (drag and zoom for free, but pulls a large canvas dependency tree, renders to canvas — which forfeits per-node DOM focus and therefore the keyboard requirement — and resists styling with the site's tokens); running `d3-force` in the client (ships the dependency, adds load-time jitter, makes tests timing-dependent); a hand-rolled spring simulation (more code than the dependency, worse layouts).

### Parsing: `gray-matter` for frontmatter, hand-rolled wikilink extraction

`gray-matter` splits frontmatter from body and parses the YAML. Wikilink extraction is a small regex over both the raw frontmatter block and the body, capturing the target portion of `[[Target|display]]`.

*Why:* the frontmatter is real YAML with quoted strings and lists — hand-parsing it invites exactly the silent-wrong-data bug that is hardest to notice in a visualisation. `gray-matter` is server-only here, so its size is irrelevant. Wikilink syntax, by contrast, is a two-token format that does not justify a dependency.

*Note:* the extraction deliberately scans the frontmatter text as well as the body, because `sources:` lists hold wikilinks that the spec requires as edges. Running the regex over the whole file, frontmatter included, is simpler than merging body matches with a walk of parsed YAML values.

### Link resolution: one index, three key sources

Build a `Map<normalisedKey, pageId>` from each page's title, its filename stem, and every entry in its `aliases`. Normalisation lowercases and trims. Resolution is a single lookup; a miss drops the link.

*Why:* titles, filenames, and aliases all appear as link targets in the live vault, and one map handles all three at equal cost. A miss must be silent per spec — a vault the portfolio does not control will always have some dangling links, and they are not this page's problem to report.

*Collision handling:* first writer wins and later collisions are ignored, so a page's own title cannot be shadowed by another page's alias.

### Node radius: square-root of degree, clamped

`r = clamp(minR, minR + k * sqrt(degree), maxR)`.

*Why:* `index.md` has roughly seven times the degree of a leaf page. Linear scaling would make it a blob that swallows its neighbours; square-root scaling keeps the hub visibly larger while staying on-screen, and the clamp bounds the worst case as the vault grows.

### Labels: truncated in the graph, full everywhere else

Render at most ~28 characters with an ellipsis under each node, with the full title in an SVG `<title>` and in the detail panel.

*Why:* real vault titles run to 60 characters ("Source - Markdown-First Retrieval for Small Knowledge Vaults"). Untruncated labels at the initial framing overlap into illegibility, which the spec forbids.

### Keyboard access: real focusable DOM nodes in the SVG

Each node is a `<g tabindex="0" role="button">` with an `aria-label`, emitted in a deterministic order (classification, then title) so tab order is stable and predictable. Hover emphasis and focus emphasis share one code path. The site's existing global `:focus-visible` outline provides the focus indicator. The `<svg>` carries `role="img"` with an `aria-label` stating page count and classification breakdown, and the same summary is repeated in a visually-hidden block.

*Why:* SVG-in-DOM is the reason canvas rendering was rejected. Focusable elements per node satisfy the keyboard requirement with no parallel "accessible list" implementation to keep in sync.

### Page shell: a self-contained surface, and fragment links become root-relative

The `/wiki` route renders a full-viewport surface (`w-full h-[100svh]`) with the graph inset below the fixed header, on a `bg-midnight/80 backdrop-blur` panel. `HybridBackground` is left in place globally and reads as faint texture behind that panel.

Separately, the header's four links change from `#about` to `/#about`.

*Why:* the panel avoids touching the root layout's centering `main` — a `w-full` child of a `flex-col items-center` container fills correctly, so no layout change is needed. Root-relative fragments are a two-character change per link that make the header work identically from both routes, which the page-shell delta requires. Keeping the shared background avoids a conditional-rendering branch keyed on pathname in the root layout.

*Alternative considered:* suppressing `HybridBackground` on `/wiki` to avoid two animated surfaces. Deferred — it needs a client-side pathname check in the layout, and the translucent panel already damps the particles. Revisit if the graph feels visually busy in review.

### Tests: fixtures by default, one live smoke test

Playwright specs intercept `api.github.com` and `raw.githubusercontent.com` via `page.route()` and serve fixtures committed under `tests/fixtures/wiki/`, covering the graph, the detail panel, keyboard traversal, the rate-limit and outage failure states, the empty vault, and the no-links vault. One separately-tagged test hits the live vault to catch upstream shape changes.

*Why:* asserting node counts against a vault an AI agent is actively editing guarantees a flaky suite, and a CI run hitting GitHub repeatedly walks into the rate limit. Fixtures make the parsing and rendering rules — the actual subject of the spec — deterministically testable. The failure-state scenarios are only reachable with interception.

## Risks / Trade-offs

- **GitHub rate limit is shared per IP, and serverless egress IPs are shared** → one metered call per hour per cache window keeps the site's own usage negligible; the failure path already treats a 403/429 with a rate-limit signal as a distinct, explained state rather than an outage.
- **Local development refills the cache often and can burn requests** → only the tree listing is metered, so even aggressive hot-reloading stays far under 60/hour. If it becomes a nuisance, point development at the committed fixtures.
- **The vault is not ours; the agent can change its conventions** (rename `type` values, drop `title`, restructure directories) → every derived field has a documented fallback (title→filename, type→directory), unparseable pages are dropped individually rather than failing the page, and the live smoke test surfaces shape drift.
- **Page re-renders run parse plus layout per request** → measured cost is negligible at ~15 pages; `unstable_cache` around the pure pipeline is the upgrade path if the vault grows an order of magnitude.
- **Label overlap and hub crowding worsen as the vault grows** → truncation, sqrt radius scaling, and a clamped maximum bound the current worst case; beyond roughly 100 nodes this design needs a different treatment (label decluttering or level-of-detail), which is out of scope here.
- **Static positions mean a visitor cannot untangle a cluster by hand** → hover and focus neighbourhood emphasis is the substitute, and it also serves keyboard and screen-reader users, which dragging never would.
- **The prose excerpt is plain text, so a page whose value is in tables or code blocks reads poorly in the panel** → the panel links to the GitHub source for the full rendering; adding a Markdown renderer later does not change any spec.

## Migration Plan

Additive change, no data migration. Deploy order does not matter: the header link and the `/wiki` route can ship in either order, though shipping the route first avoids a link to a 404.

Rollback is removing the `/wiki` route and reverting the header link. The root-relative fragment change (`#about` → `/#about`) is behaviour-preserving on the root page and can stay either way.

## Open Questions

- **Exact colour per classification.** The palette has one accent (`--color-cyan-glow`); four to six distinguishable, accessible hues on `--color-midnight` need to be chosen and added as tokens. Deferrable — the spec requires only that classifications be distinguishable and legended.
- **Whether to add an authenticated `GITHUB_TOKEN` later.** Unnecessary at one metered request per hour, and it would add a secret to deployment. Revisit only if the vault grows past what one tree listing returns, or if shared-IP rate limiting proves to be a real problem in production.
