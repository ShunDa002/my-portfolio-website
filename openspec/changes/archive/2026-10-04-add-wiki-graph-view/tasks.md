## 1. Dependencies and fixtures

- [x] 1.1 Add `d3-force`, `@types/d3-force`, and `gray-matter` to package.json and verify `npm install` succeeds and `npx tsc --noEmit` still passes
- [x] 1.2 Capture the live vault into `tests/fixtures/wiki/` — the tree-listing JSON response plus each Markdown page's raw body — and verify the fixture set contains one file per Markdown page listed in the tree
- [x] 1.3 Add hand-written edge-case fixtures alongside the captured ones: a page with no frontmatter `title`, a page with no `type`, a page with an `aliases` entry that another page links to, a page linking to a non-existent target, a page linking to itself, a page linking the same target four times, a page with unparseable frontmatter, an empty vault, and a vault whose pages contain no wikilinks. Verify each fixture file exists and is loadable as text

## 2. Vault retrieval and parsing

- [x] 2.1 Define the graph data types (page node with id, path, label, classification, frontmatter attributes, excerpt, GitHub URL; edge with source and target) in a types module and verify `npx tsc --noEmit` passes
- [x] 2.2 Implement the vault fetch: one call to the GitHub tree endpoint, then one `raw.githubusercontent.com` call per Markdown page, each with `next: { revalidate: 3600, tags: ["wiki-vault"] }`. Filter to `.md` files under `wiki/` at any depth. Verify by logging the fetched page count against the live vault and confirming it matches the Markdown page count
- [x] 2.3 Implement page parsing with `gray-matter`: label from frontmatter `title` falling back to the filename stem, classification from frontmatter `type` falling back to the containing directory name, and a plain-text prose excerpt taken after the leading heading. Verify against the fixtures from 1.2 and 1.3 that every page yields a non-empty label and classification
- [x] 2.4 Implement wikilink extraction over the whole file text including the frontmatter block, capturing the target portion of `[[Target|display]]`. Verify the extractor finds the `sources:` frontmatter links on a captured concept page as well as its body links
- [x] 2.5 Implement link resolution: build one normalised (lowercased, trimmed) index from each page's title, filename stem, and `aliases` entries, first-writer-wins on collision. Verify against fixtures that an alias link resolves, a dangling link is dropped, a self-link produces no edge, and four links to the same target collapse to one edge
- [x] 2.6 Make a single unparseable page drop out of the result while the remaining pages still parse, and verify against the unparseable-frontmatter fixture that the page count is N-1 with no thrown error
- [x] 2.7 Add a self-checking test that runs the whole parse pipeline over `tests/fixtures/wiki/` and asserts the resulting node and edge counts, so the parsing rules are verifiable without network access, and verify it passes

## 3. Layout computation

- [x] 3.1 Compute node radius as a clamped square-root function of degree and verify against the captured fixtures that the `index` hub renders larger than every leaf node but does not exceed the clamp
- [x] 3.2 Run `d3-force` server-side with a seeded initial placement and a fixed tick count, emitting x/y per node, and verify the same fixture input produces identical coordinates across two consecutive runs
- [x] 3.3 Ensure the layout leaves no node overlapping another when the vault has no edges, and verify against the no-links fixture that all node bounding circles are disjoint
- [x] 3.4 Emit nodes in a deterministic order — classification, then title — so downstream tab order is stable, and verify the emitted order is unchanged across runs

## 4. Route and page shell

- [x] 4.1 Create the `/wiki` route as a server component that calls the pipeline and renders a full-viewport surface (`w-full h-[100svh]`) on a `bg-midnight/80 backdrop-blur` panel, inset below the fixed header. Declare no route-level `revalidate`. Verify `npm run dev` serves `/wiki` and the graph area fills the viewport without page scrolling
- [x] 4.2 Add page metadata (title and description identifying the LLM Wiki knowledge graph) and verify the rendered document head contains both non-empty
- [x] 4.3 Change the four header links from `#about`-style to `/#about`-style and add a `/wiki` link styled to read as a route rather than an in-page anchor. Verify from `/wiki` that each section link navigates to the root page and reaches its section
- [x] 4.4 Confirm the header still renders on `/wiki` via the root layout with no layout change, and verify the navigation is visible at the top of `/wiki` and does not obscure the graph's controls or legend

## 5. Graph rendering

- [x] 5.1 Add per-classification colour tokens to `globals.css` alongside `--color-cyan-glow`, covering every classification the live vault produces (concept, source, synthesis, question, index, log), each legible on `--color-midnight`. Verify each token renders distinguishably against the background and against the others
- [x] 5.2 Render the SVG from the server-computed coordinates: edges beneath nodes, one `<circle>` per node coloured by classification and sized by its computed radius. Verify the rendered node count matches the fixture page count
- [x] 5.3 Render node labels truncated to roughly 28 characters with an ellipsis, with the full title in an SVG `<title>`. Verify with the longest captured vault title that the label stays within its allotted width and the full text is present in the `<title>`
- [x] 5.4 Add the marker for a non-settled `knowledge_status` and verify the disputed captured page carries it while a settled page does not
- [x] 5.5 Render a legend naming each classification present in the vault with its colour, and verify the legend entries match the classifications actually present rather than a hardcoded list

## 6. Interaction

- [x] 6.1 Implement pan and zoom by mutating the SVG `viewBox` in a client component, with zoom clamped at both ends. Verify dragging translates the view, wheel or control zoom scales it, labels stay attached to their nodes, and zooming past either limit stops at the limit with the graph still on screen
- [x] 6.2 Add a reset control that restores the initial framing, and verify after panning and zooming away that activating it brings every node back inside the visible area
- [x] 6.3 Implement neighbourhood emphasis on hover and on focus through one shared code path: emphasise the node, its directly connected nodes, and the joining edges; de-emphasise the rest. Verify hovering a multi-edge node emphasises exactly its closed neighbourhood
- [x] 6.4 Make each node a `<g tabindex="0" role="button">` with an `aria-label`, relying on the existing global `:focus-visible` outline. Verify tabbing moves through nodes in the deterministic order from 3.4 with a visible focus indicator, and that activating a focused node opens its panel
- [x] 6.5 Add the accessible text alternative: `role="img"` with an `aria-label` stating page count and classification breakdown, plus the same summary in a visually-hidden block. Verify the announced text reports counts matching the rendered graph

## 7. Detail panel

- [x] 7.1 Build the panel showing title, classification, the frontmatter attributes present (status, confidence, knowledge status, tags), the prose excerpt, the list of pages the page links to, and a GitHub link opening in a new tab. Verify against a captured concept page that every listed field renders with the vault's actual values
- [x] 7.2 Omit absent frontmatter attributes rather than rendering empty or placeholder values, and verify with a sparse-frontmatter page that no empty attribute rows appear
- [x] 7.3 Make selecting a different node replace the open panel's contents, and verify only one panel exists in the DOM after selecting three nodes in sequence
- [x] 7.4 Return keyboard focus to the originating node on dismissal, and verify after opening a panel from a focused node and dismissing it that focus is back on that node
- [x] 7.5 Verify the panel's own controls and links are reachable by continued keyboard navigation once the panel is open

## 8. Failure and degenerate states

- [x] 8.1 Have the pipeline return a discriminated failure result distinguishing network failure or timeout, an HTTP error status, and a rate-limit refusal, rather than throwing. Verify each case is produced by intercepting the outbound request in a test
- [x] 8.2 Render the failure state: an explanation that the live vault could not be reached, a retry control, and a GitHub link — with rate limiting worded distinctly from an outage. Verify no empty canvas and no unresolved loading state appears in either case
- [x] 8.3 Wire the retry control to re-run retrieval, and verify that after a simulated failure followed by a reachable vault, retrying replaces the message with the graph
- [x] 8.4 Confirm a failed retrieval is not cached as page content: verify a request following a failed one performs a fresh outbound fetch rather than re-serving the failure state
- [x] 8.5 Render the empty-vault state with a stated message and the same GitHub link, and verify against the empty-vault fixture that no blank canvas or error appears
- [x] 8.6 Render the no-connections case with all nodes and a statement that no connections were found, and verify against the no-links fixture

## 9. Tests and final verification

- [x] 9.1 Add a Playwright helper that intercepts `api.github.com` and `raw.githubusercontent.com` via `page.route()` and serves the fixtures, and verify a spec using it renders the graph with no network access
- [x] 9.2 Add fixture-backed specs covering the graph render, the legend, the detail panel, keyboard traversal and activation, the reset control, the rate-limit and outage failure states, the empty vault, and the no-links vault. Verify `npx playwright test` passes
- [x] 9.3 Add one separately-tagged spec that hits the live vault to catch upstream shape changes, and verify it passes and is excluded from the default run
- [x] 9.4 Verify `npm run build`, `npm run lint`, and `npx tsc --noEmit` all pass
- [x] 9.5 Verify GitHub API usage in practice: load `/wiki` several times inside one cache window and confirm only the first load issues outbound requests, and that only the tree listing hits the metered API
- [x] 9.6 Walk every scenario in `specs/portfolio-site/wiki-graph/spec.md` and `specs/portfolio-site/page-shell/spec.md` against the running app and confirm each one holds

