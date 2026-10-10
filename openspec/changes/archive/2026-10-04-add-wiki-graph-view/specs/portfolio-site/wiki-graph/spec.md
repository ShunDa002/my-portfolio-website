## Purpose

Defines the `/wiki` page: an interactive graph of the LLM Wiki vault, read live from its public GitHub repository, that lets a visitor see how an AI agent's knowledge base is structured and inspect any single page without leaving the portfolio.

## ADDED Requirements

### Requirement: Wiki graph route

The site SHALL serve a wiki graph page at `/wiki`. The page SHALL present the graph as its primary content, occupying the available viewport below the site navigation, and SHALL carry a document title and description identifying it as the LLM Wiki knowledge graph.

#### Scenario: Visitor opens the wiki page

- **WHEN** a visitor requests `/wiki`
- **THEN** the site returns the wiki graph page
- **AND** the graph is the page's primary content within the initial viewport, with no scrolling required to see it

#### Scenario: Crawler reads the wiki page metadata

- **WHEN** a crawler reads the wiki page's document head
- **THEN** a non-empty title and description identifying the LLM Wiki knowledge graph are present

### Requirement: Live vault retrieval with bounded staleness

The page SHALL derive its graph from the current contents of the `wiki/` directory of the public repository at `github.com/ShunDa002/llm-wiki3`, retrieved over the network rather than from a copy stored in this project. Retrieved vault content SHALL be cached and served to subsequent visitors, and the cached graph SHALL be no more than 60 minutes stale. The number of outbound requests made to serve the page SHALL be bounded by the number of vault pages plus one directory listing, and SHALL NOT scale with the number of visitors within a cache window.

#### Scenario: Agent adds a page to the vault

- **WHEN** the vault gains a new page and a visitor loads `/wiki` after the cache window has elapsed
- **THEN** the new page appears as a node in the graph without the site being rebuilt or redeployed

#### Scenario: Many visitors load the page in one cache window

- **WHEN** repeated requests for `/wiki` arrive within the same cache window
- **THEN** they are served from the cached graph
- **AND** no additional requests are made to the vault's host for those visitors

#### Scenario: Vault content is not vendored

- **WHEN** this project's source tree is inspected for vault markdown
- **THEN** no copy of the vault's pages is present, because the page reads them from the repository at request time

### Requirement: Nodes derived from vault pages

The graph SHALL contain one node per Markdown page under the vault's `wiki/` directory, at any depth. Non-Markdown files, including placeholder files such as `.gitkeep`, SHALL NOT produce nodes. Each node SHALL take its display label from the page's frontmatter `title` when present, and otherwise from the page's filename without its extension. Each node SHALL record the page's classification, taken from the frontmatter `type` field when present and otherwise from the name of the vault subdirectory containing the page.

#### Scenario: Vault page becomes a node

- **WHEN** the vault contains `wiki/concepts/Markdown-First Retrieval.md` with frontmatter `title: Markdown-First Retrieval` and `type: concept`
- **THEN** the graph contains one node labelled "Markdown-First Retrieval" classified as a concept

#### Scenario: Placeholder files are ignored

- **WHEN** the vault contains `.gitkeep` files inside its subdirectories
- **THEN** no node is created for them

#### Scenario: Page without a frontmatter title

- **WHEN** a vault page has no `title` in its frontmatter
- **THEN** its node is labelled with the filename minus its extension, rather than being unlabelled or omitted

#### Scenario: Page without a frontmatter type

- **WHEN** a vault page under `wiki/questions/` has no `type` in its frontmatter
- **THEN** its node is classified using its containing directory name

### Requirement: Edges derived from wikilinks

The graph SHALL contain an edge for each `[[wikilink]]` reference found in a vault page that resolves to another vault page, whether the reference appears in the page body or in a frontmatter field such as `sources`. A wikilink SHALL resolve against page titles and against the values of a page's frontmatter `aliases` list, ignoring case and surrounding whitespace. A wikilink written as `[[Target|display text]]` SHALL resolve on its target portion. Repeated links between the same pair of pages SHALL produce one edge, not one per occurrence. A page's link to itself SHALL NOT produce an edge. A wikilink that resolves to no vault page SHALL be omitted from the graph without failing the page render.

#### Scenario: Link between two pages

- **WHEN** a concept page contains `[[Source - Markdown Retrieval for a Small Wiki]]` and a vault page carries that title
- **THEN** the graph contains one edge between the two nodes

#### Scenario: Link resolved through an alias

- **WHEN** a page links to `[[MFR]]` and another page's frontmatter lists `MFR` among its `aliases`
- **THEN** the link resolves to that page and produces an edge

#### Scenario: Same target linked several times

- **WHEN** a page links to the same target page in four different places
- **THEN** the graph contains exactly one edge between that pair of nodes

#### Scenario: Wikilink declared in frontmatter

- **WHEN** a page's frontmatter `sources` list contains wikilink-formatted values
- **THEN** those references produce edges in the same way as body links, so a page's declared sources appear as connections

#### Scenario: Dangling wikilink

- **WHEN** a page links to `[[A Page That Does Not Exist]]`
- **THEN** the graph renders without that edge and without an error state

### Requirement: Structure is legible from visual encoding

The graph SHALL distinguish node classifications from one another by colour, drawn from the site's existing accent palette, and SHALL provide a legend mapping each colour to its classification. Node size SHALL vary with the number of edges attached to the node, so that hub pages read as larger than leaf pages. A node whose page frontmatter reports a disputed or otherwise non-settled `knowledge_status` SHALL carry a visual marker distinguishing it from settled pages.

#### Scenario: Visitor reads the legend

- **WHEN** a visitor looks at the graph page
- **THEN** a legend is visible naming each node classification present in the vault alongside its colour

#### Scenario: Hub page is visually larger

- **WHEN** one page has ten edges and another has one
- **THEN** the ten-edge node renders visibly larger than the one-edge node

#### Scenario: Disputed page is marked

- **WHEN** a page's frontmatter reports `knowledge_status: disputed`
- **THEN** its node carries a marker that settled-status nodes do not

### Requirement: Graph navigation

A visitor SHALL be able to pan and zoom the graph, and to return it to its initial framing with a single control. Zoom SHALL be bounded so that the graph cannot be zoomed into an empty field or out of visibility. On pointer hover or keyboard focus of a node, that node, its directly connected nodes, and the edges between them SHALL be emphasised while unrelated nodes and edges are de-emphasised. Node labels SHALL remain readable at the initial framing without illegibly overlapping one another.

#### Scenario: Visitor pans and zooms

- **WHEN** a visitor drags the graph background and then zooms in
- **THEN** the view translates and scales accordingly, and node labels stay attached to their nodes

#### Scenario: Visitor resets the view

- **WHEN** a visitor has panned and zoomed away from the initial framing and activates the reset control
- **THEN** the graph returns to a framing where every node is within the visible area

#### Scenario: Zoom limits

- **WHEN** a visitor attempts to zoom beyond the permitted range in either direction
- **THEN** the zoom stops at its limit and the graph remains visible on screen

#### Scenario: Visitor hovers a node

- **WHEN** a visitor hovers a node with several connections
- **THEN** that node, its neighbours, and the edges joining them are emphasised
- **AND** nodes not connected to it are de-emphasised

### Requirement: Node detail panel

Selecting a node SHALL open a detail panel for that page without navigating away from the graph. The panel SHALL show the page's title, its classification, the frontmatter attributes the vault records for it — including status, confidence, knowledge status, and tags when present — an excerpt of the page's prose, a list of the pages it links to, and a link to the page on GitHub that opens in a new tab. The panel SHALL be dismissible, and dismissing it SHALL return focus to the node that opened it. Selecting a different node while the panel is open SHALL replace its contents rather than opening a second panel.

#### Scenario: Visitor selects a node

- **WHEN** a visitor clicks a node
- **THEN** a detail panel opens showing that page's title, classification, recorded frontmatter attributes, a prose excerpt, its outgoing links, and a GitHub link
- **AND** the graph remains visible and interactive

#### Scenario: Visitor selects a second node

- **WHEN** the detail panel is open for one page and the visitor selects a different node
- **THEN** the panel shows the newly selected page and no second panel appears

#### Scenario: Visitor dismisses the panel

- **WHEN** a visitor dismisses the open panel
- **THEN** the panel closes and keyboard focus returns to the node that opened it

#### Scenario: Panel opens the source page

- **WHEN** a visitor activates the panel's GitHub link
- **THEN** the page's Markdown source on GitHub opens in a new tab, leaving the graph page in place

#### Scenario: Page with sparse frontmatter

- **WHEN** the selected page records no confidence and no tags
- **THEN** the panel omits those attributes rather than showing empty or placeholder values

### Requirement: Graph is operable without a pointer

Every page in the graph SHALL be reachable and inspectable using the keyboard alone. Nodes SHALL be focusable in a deterministic order, activating a focused node SHALL open its detail panel, and the focused node SHALL be visually distinguishable from unfocused nodes. The graph SHALL expose an accessible text alternative conveying the vault's page count and its breakdown by classification, so that a visitor using a screen reader learns what the graph contains without interpreting its geometry.

#### Scenario: Visitor navigates the graph by keyboard

- **WHEN** a visitor tabs into the graph and moves through it using the keyboard
- **THEN** each node receives focus in a deterministic order with a visible focus indicator
- **AND** activating the focused node opens its detail panel

#### Scenario: Screen reader announces the graph

- **WHEN** a screen reader reaches the graph
- **THEN** it announces a text alternative stating how many pages the vault holds and how they break down by classification

#### Scenario: Panel is reachable by keyboard

- **WHEN** a detail panel is opened from a keyboard-focused node
- **THEN** the panel's own controls and links are reachable by continued keyboard navigation

### Requirement: Retrieval failure is explained, not hidden

When the vault cannot be retrieved — the request fails, times out, returns an error status, or is refused for exceeding the host's rate limit — the page SHALL render an explanatory message stating that the live vault could not be reached, SHALL offer a control to retry, and SHALL offer a link to the vault on GitHub. It SHALL NOT render an empty graph canvas, a loading state that never resolves, or an unhandled error page. A single page whose Markdown or frontmatter cannot be parsed SHALL be omitted from the graph while the remaining pages still render.

#### Scenario: Vault host is unreachable

- **WHEN** the request for the vault fails or times out
- **THEN** the page explains that the live vault could not be reached, offers a retry control, and links to the vault on GitHub

#### Scenario: Rate limit reached

- **WHEN** the vault's host refuses the request for exceeding its rate limit
- **THEN** the message distinguishes this from an outage, so a visitor understands the graph will return rather than being permanently broken

#### Scenario: Visitor retries after a failure

- **WHEN** a visitor activates the retry control and the vault is reachable again
- **THEN** the graph renders in place of the failure message

#### Scenario: One page fails to parse

- **WHEN** a single vault page cannot be parsed
- **THEN** the graph renders every other page, and the unparseable page is absent rather than breaking the view

### Requirement: Degenerate vaults render sensibly

The page SHALL render sensibly when the vault holds few pages or no links. A `wiki/` directory with no Markdown pages SHALL produce a stated empty message rather than a blank canvas or an error. A vault whose pages contain no resolvable wikilinks SHALL render its nodes as an unconnected set rather than failing.

#### Scenario: Vault is empty

- **WHEN** the vault's `wiki/` directory contains no Markdown pages
- **THEN** the page states that the vault currently holds no pages, and offers the same GitHub link as the other states

#### Scenario: Vault has no links

- **WHEN** no vault page contains a resolvable wikilink
- **THEN** every page still renders as a node, laid out without overlap, and the graph reports that it found no connections
