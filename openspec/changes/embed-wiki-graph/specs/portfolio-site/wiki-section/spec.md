# Spec Delta

## MODIFIED Requirements

### Requirement: Interactive window frame

The wiki graph section SHALL render a framed window container occupying 70% of the viewport width, featuring a titlebar with window indicators, title, and address indication (`vault://llm-wiki3/graph`). The section SHALL present the knowledge graph directly within the window without requiring or linking to a separate graph page.

#### Scenario: Window occupies 70% screen width
- **WHEN** a visitor views the wiki graph section
- **THEN** the framed window occupies 70% of the viewport width (`w-[70vw]` / 70% width centered) to provide an expansive interactive canvas

#### Scenario: Window chrome titlebar presentation
- **WHEN** the wiki graph section renders
- **THEN** the titlebar displays macOS-style window control dots and the `vault://llm-wiki3/graph` location text

### Requirement: Embedded zoomable knowledge graph visualization

The framed window SHALL display an interactive embedded graph visualization of the LLM Wiki vault via `<GraphEmbed />` with `cropHeader={true}` to seamlessly mask the remote service's top header and showcase only the interactive canvas. Interactive pan, zoom, node inspection, and controls SHALL be contained within the embedded iframe viewport.

#### Scenario: Visitor zooms the embedded graph
- **WHEN** a visitor interacts with zoom controls or uses the mouse wheel over the graph within the window
- **THEN** the graph canvas scales smoothly while remaining bounded inside the window frame
- **AND** the webpage does not scroll vertically

#### Scenario: Visitor scrolls webpage outside graph window
- **WHEN** a visitor scrolls the mouse wheel while pointing outside the graph window
- **THEN** the webpage scrolls vertically and the graph zoom level remains unchanged

#### Scenario: Visitor inspects graph nodes
- **WHEN** a visitor hovers over or focuses a node in the embedded graph
- **THEN** the node and its immediate connections are emphasized

#### Scenario: Embedded graph renders with cropped header
- **WHEN** the wiki graph section renders on the root page
- **THEN** the `<GraphEmbed />` component renders inside the framed window with `cropHeader` enabled, clipping the remote 56px navigation bar

#### Scenario: Host controls overlay available
- **WHEN** a visitor interacts with the embedded graph in the section window
- **THEN** host overlay controls (Reload, Fullscreen, Open in new tab) are accessible within the framed window

### Requirement: Non-blocking retrieval and error containment

The wiki graph section SHALL render the embedded graph without server-side blocking or data retrieval dependencies. If the remote graph service fails to load or times out, the embedded window SHALL contain the error with a timeout fallback, allowing the rest of the root page to render and operate normally.

#### Scenario: Upstream retrieval fails
- **WHEN** the wiki vault data cannot be retrieved due to network or rate limit issues
- **THEN** the window displays an explanatory fallback message and link to GitHub rather than an unhandled error
- **AND** all other sections on the root page render normally

#### Scenario: Remote graph service timeout containment
- **WHEN** the external graph service is slow or unreachable
- **THEN** a retry control and direct link are shown within the window frame without crashing or blocking other sections on the root page

#### Scenario: Root page renders without server-side wiki dependencies
- **WHEN** the root page is rendered on the server
- **THEN** the wiki section renders its window shell immediately without waiting on external GitHub vault network requests
