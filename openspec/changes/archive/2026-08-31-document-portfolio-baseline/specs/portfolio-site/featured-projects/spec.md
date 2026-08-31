## Purpose

Carries the technical proof of the portfolio: a grid of project cards, each summarising one substantial AI or full-stack build and linking out to its source, driven by a single editable project list so new work can be added without touching layout code.

## ADDED Requirements

### Requirement: Projects section is anchor-addressable

The projects section SHALL be reachable both by the navigation's "Projects" link and by the hero's primary call to action, and SHALL carry a stable anchor identifier shared by both.

#### Scenario: Visitor arrives from the hero

- **WHEN** a visitor activates the hero's "View Projects" action
- **THEN** the viewport moves to the projects section

#### Scenario: Visitor arrives from the navigation

- **WHEN** a visitor activates the "Projects" navigation link
- **THEN** the viewport moves to the same section

### Requirement: Section introduction

The projects section SHALL open with a "Featured Projects" heading and a one-line framing statement about bridging research and reality.

#### Scenario: Visitor reaches the section

- **WHEN** the section renders
- **THEN** the heading and framing line appear above the grid

### Requirement: Projects are driven by a single data list

Project entries SHALL be read from one editable list that is the sole source of project content. Adding, removing, or reordering an entry in that list SHALL change the rendered grid with no change to layout or card markup. Card order SHALL follow list order.

#### Scenario: Owner adds a project

- **WHEN** the owner appends a new entry to the project list
- **THEN** a new card appears as the last card in the grid with that entry's content
- **AND** no layout or card code is edited

#### Scenario: Owner reorders projects

- **WHEN** the owner moves an entry to the front of the list
- **THEN** its card renders first in the grid

### Requirement: Project entry fields

Each project entry SHALL carry a title, a description, a list of technology tags, a source repository URL, and a preview image reference. Every field SHALL be populated for every entry; a rendered card SHALL NOT depend on a field being absent or empty.

#### Scenario: Entry is missing a preview image

- **WHEN** an entry supplies an empty image reference
- **THEN** the card fails to render its image rather than degrading gracefully, and this is recorded as a known deviation affecting the third baseline entry

#### Scenario: Entry field set is validated

- **WHEN** the project list is edited
- **THEN** an entry missing any of the five fields is detectable before the site is deployed

### Requirement: Baseline project set

The baseline SHALL feature three projects: a Deepfake Detector combining a fine-tuned vision model with a fact-verification chatbot, a Malaysian SPM History (Sejarah) retrieval-augmented education app with textbook citations, and a Yahoo Finance MCP server exposing market data as agent tools. Together they SHALL demonstrate Computer Vision, LLM retrieval, and agentic tooling.

#### Scenario: Engineering manager reviews the grid

- **WHEN** the section renders
- **THEN** all three projects are present, each with a description stating the problem it addresses and the approach taken

### Requirement: Card content

Each card SHALL display, in this order: the preview image, the project title, a directional outbound affordance, the description, and the technology tags. Tags SHALL render as small accent-tinted chips. The title SHALL shift to the cyan accent on card hover, and the preview image SHALL scale up slightly within its fixed frame without overflowing it.

#### Scenario: Visitor hovers a card

- **WHEN** a visitor hovers a project card
- **THEN** the card fill and border brighten, the title shifts to the accent color, and the preview image scales within its clipped frame

### Requirement: Card links to its repository

Each card SHALL link to its project's source repository. The entire card region a visitor is likely to click — image, title, and description — SHALL activate that link, and the destination SHALL open without the visitor needing to find a separate small target.

#### Scenario: Visitor opens a project

- **WHEN** a visitor clicks a card's image, title, or description
- **THEN** the project's repository is opened

#### Scenario: Tag row is not part of the link target

- **WHEN** a visitor clicks a technology tag
- **THEN** nothing is activated, because the tag row sits outside the card's link region, and this inconsistency is recorded as a known deviation

#### Scenario: Repository opens in the same tab

- **WHEN** a visitor activates a card link
- **THEN** the repository replaces the portfolio in the current tab, because card links declare neither a new browsing context nor the safe-external-link attributes
- **AND** this is recorded as a known deviation, since it navigates a recruiter away from the portfolio mid-review

### Requirement: Responsive card grid

The grid SHALL render one column below the tablet threshold, two columns from the tablet threshold, and three columns from the desktop threshold. Cards in the same row SHALL share equal height, and each card's tag row SHALL sit flush to the bottom of the card regardless of description length.

#### Scenario: Visitor views projects on a tablet

- **WHEN** the viewport is at the tablet threshold
- **THEN** cards render two per row with equal heights

#### Scenario: Descriptions differ in length

- **WHEN** two cards in the same row carry descriptions of very different lengths
- **THEN** both cards are the same height and both tag rows align at the bottom
