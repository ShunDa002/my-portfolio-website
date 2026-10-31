# Spec Delta

## ADDED Requirements

### Requirement: External knowledge graph iframe embedding

The system SHALL embed the external deployed graph service via an `<iframe>` pointing to `NEXT_PUBLIC_WIKI_GRAPH_URL` (defaulting to `https://wiki-graph.tay-shon-da1.workers.dev/graph`). The application SHALL configure Content Security Policy headers to permit framing from this origin.

#### Scenario: Graph embed renders with configured endpoint
- **WHEN** the embed component renders
- **THEN** it instantiates an `<iframe>` whose `src` points to the deployed graph service endpoint

#### Scenario: Frame-src CSP allows remote graph
- **WHEN** the browser requests a page containing the graph embed
- **THEN** the Content-Security-Policy response headers include `https://wiki-graph.tay-shon-da1.workers.dev` in the `frame-src` directive

### Requirement: Declarative deep-linking and standalone embed route

The system SHALL provide a dedicated `/embed` route at `src/app/embed/page.tsx` that supports query parameters `note`, `cropHeader`, and `controls`. Deep-linking parameter `note` SHALL be forwarded to the iframe query parameters as `?note=<encoded-node-id>` to focus the specified vault node on load.

#### Scenario: Deep-link to specific note
- **WHEN** the embed route receives `?note=index`
- **THEN** the iframe is loaded with `?note=index` appended to the graph URL

#### Scenario: Standalone embed viewport rendering
- **WHEN** a visitor accesses the `/embed` route
- **THEN** the graph is rendered in a full-viewport container without extraneous site chrome

### Requirement: Loading state and timeout fallback

The embed component SHALL display a themed loading overlay until the iframe signals completion via `onLoad`. If the iframe does not load within 15 seconds, the component SHALL present an explanatory timeout fallback with options to retry loading and to open the graph directly in a new tab.

#### Scenario: Loading indicator while loading
- **WHEN** the graph iframe is establishing a connection
- **THEN** a themed loading spinner is displayed and the iframe is visually concealed until load completes

#### Scenario: Loading timeout triggered
- **WHEN** the graph fails to load within 15 seconds
- **THEN** an explanatory timeout message is displayed offering a Retry button and an Open Directly link

### Requirement: Native fullscreen and host controls

The embed component SHALL provide host action controls allowing visitors to reload the iframe, toggle native fullscreen display using the browser Fullscreen API, and open the external graph directly in a new tab.

#### Scenario: Toggle fullscreen mode
- **WHEN** a visitor activates the Fullscreen control
- **THEN** the embed container requests native browser fullscreen and expands to 100vh

#### Scenario: Reload graph iframe
- **WHEN** a visitor activates the Reload control
- **THEN** the iframe reloads its source without refreshing the parent webpage

## REMOVED Requirements

### Requirement: Live vault retrieval with bounded staleness
**Reason**: Replaced by embedding the deployed external graph service.
**Migration**: The graph is served and cached directly by the external graph service at `https://wiki-graph.tay-shon-da1.workers.dev/graph`.

### Requirement: Nodes derived from vault pages
**Reason**: Node derivation and markdown frontmatter parsing are handled by the external graph service.
**Migration**: The host application embeds the pre-rendered graph visualization.

### Requirement: Edges derived from wikilinks
**Reason**: Wikilink resolution and edge generation are handled by the external graph service.
**Migration**: The host application embeds the pre-rendered graph visualization.

### Requirement: Structure is legible from visual encoding
**Reason**: Color encoding, legends, and node sizing are handled by the external graph service.
**Migration**: Visual styling is rendered directly inside the embedded canvas.

### Requirement: Graph navigation
**Reason**: In-canvas pan, zoom, and node highlighting interactions are provided by the embedded graph service.
**Migration**: Use interactive controls rendered within the remote graph canvas.

### Requirement: Node detail panel
**Reason**: Node inspection and detail drawer are provided by the embedded graph service.
**Migration**: Clicking a node inside the embedded graph opens the remote service's detail panel.

### Requirement: Graph is operable without a pointer
**Reason**: Direct keyboard traversal of the canvas is handled within the embedded graph application.
**Migration**: Focus and interact with the embedded iframe directly.

### Requirement: Retrieval failure is explained, not hidden
**Reason**: Replaced by the embed component's loading overlay and 15-second timeout fallback.
**Migration**: Use the embed component's timeout fallback controls (`Retry` and `Open Directly ↗`).

### Requirement: Degenerate vaults render sensibly
**Reason**: Empty vault and disconnected node states are handled by the external graph service.
**Migration**: Handled within the remote graph service.
