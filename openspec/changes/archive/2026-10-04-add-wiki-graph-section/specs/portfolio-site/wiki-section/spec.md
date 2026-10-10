# Spec Delta

## Purpose

Provides a dedicated home-page section presenting an interactive, zoomable preview window of the LLM Wiki knowledge graph with direct expansion to the dedicated `/wiki` page.

## ADDED Requirements

### Requirement: Wiki graph section presentation on root page

The root page SHALL display a dedicated wiki graph section anchored with `id="wiki"` following the portfolio's visual hierarchy, typography, section header styling (title and descriptive subtitle), and spacing rhythm.

#### Scenario: Visitor scrolls to wiki graph section
- **WHEN** a visitor scrolls to or jumps to `#wiki` on the root page
- **THEN** the section renders with a title and subtitle introducing the LLM Wiki knowledge graph
- **AND** the section content aligns with the vertical spacing rhythm of neighboring sections

### Requirement: Interactive window frame with expand control

The wiki graph section SHALL render a framed window container occupying 70% of the viewport width, featuring a titlebar with window indicators, title, and an expand icon control located at the top-right corner that redirects the visitor to the full `/wiki` route.

#### Scenario: Window occupies 70% screen width
- **WHEN** a visitor views the wiki graph section
- **THEN** the framed window occupies 70% of the viewport width (`w-[70vw]` / 70% width centered) to provide an expansive interactive canvas

#### Scenario: Visitor clicks the expand icon
- **WHEN** a visitor clicks or activates the expand control in the top-right corner of the window
- **THEN** the browser navigates to `/wiki`

#### Scenario: Expand control accessibility
- **WHEN** a visitor inspects or navigates the expand control with keyboard or assistive technology
- **THEN** the control provides an accessible label indicating that it expands to the full wiki page

### Requirement: Embedded zoomable knowledge graph visualization

The framed window SHALL display an interactive graph visualization of the LLM Wiki vault showing nodes and connection edges, supporting zoom in, zoom out, reset, and pan interactions. When the cursor is inside the window, wheel scrolling SHALL zoom the graph only and prevent webpage scrolling; when the cursor is outside, wheel scrolling SHALL scroll the webpage and leave graph zoom unchanged.

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

### Requirement: Non-blocking retrieval and error containment

The wiki graph section SHALL fetch vault data on the server and render an inline failure or empty state inside the window if retrieval is unsuccessful or empty, without failing or blocking the rest of the root page.

#### Scenario: Upstream retrieval fails
- **WHEN** the wiki vault data cannot be retrieved due to network or rate limit issues
- **THEN** the window displays an explanatory fallback message and link to GitHub rather than an unhandled error
- **AND** all other sections on the root page render normally
