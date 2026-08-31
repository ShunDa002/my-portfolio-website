# portfolio-site/featured-projects Specification

## Purpose

Carries the technical proof of the portfolio: a grid of project cards, each summarising one substantial AI or full-stack build and linking out to its source, driven by a single editable project list so new work can be added without touching layout code.

## Requirements

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

Each project entry SHALL carry a title, a description, a list of technology tags, and a source repository URL, all of which are required. A preview image reference SHALL be optional, since a project without a user interface may have nothing meaningful to screenshot. The entry shape SHALL be declared as an explicit type so that a missing or misspelled required field is rejected at build time rather than surfacing as a rendering fault.

#### Scenario: Entry is missing a preview image

- **WHEN** an entry omits its image reference or supplies an empty one
- **THEN** the card renders a designed fallback panel in place of the image, sized to the same frame the other cards use
- **AND** no card ever renders an image element with no source, and none shows an empty reserved frame

#### Scenario: Entry field set is validated

- **WHEN** the project list is edited
- **THEN** an entry missing any required field fails the build, so the error surfaces before deployment rather than in front of a visitor
- **AND** omitting only the optional image reference does not fail the build

#### Scenario: Fallback panel is recognisably deliberate

- **WHEN** a card renders its fallback panel
- **THEN** the panel reads as an intentional part of the design rather than as a failed image, and stays consistent with the site's glass and accent treatment

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

Each card SHALL link to its project's source repository. The whole card SHALL be one uniform link target, so that a click anywhere within it — image, title, description, or tag row — follows the same destination, and no element inside the card SHALL present a competing or dead affordance. The link SHALL open in a new browsing context with the safe-external-link attributes applied, leaving the portfolio open in the visitor's original tab.

#### Scenario: Visitor opens a project

- **WHEN** a visitor clicks a card's image, title, or description
- **THEN** the project's repository is opened

#### Scenario: Tag row is part of the link target

- **WHEN** a visitor clicks a technology tag or the space around it
- **THEN** the same repository is opened, because the tag row is now inside the card's single link target

#### Scenario: Repository opens in a new tab

- **WHEN** a recruiter activates a card link
- **THEN** the repository opens in a new tab instead of replacing the portfolio in the current one
- **AND** the portfolio remains open at the same scroll position for the recruiter to return to

#### Scenario: Directional affordance is not a separate target

- **WHEN** a visitor clicks the card's outbound arrow affordance
- **THEN** the same repository is opened, and the arrow is presented as decoration on the card link rather than as an independent control

#### Scenario: Card link declares its safety attributes

- **WHEN** a card link is inspected
- **THEN** it declares `rel="noopener noreferrer"` alongside its new-context target

### Requirement: Responsive card grid

The grid SHALL render one column below the tablet threshold, two columns from the tablet threshold, and three columns from the desktop threshold. Cards in the same row SHALL share equal height, and each card's tag row SHALL sit flush to the bottom of the card regardless of description length.

#### Scenario: Visitor views projects on a tablet

- **WHEN** the viewport is at the tablet threshold
- **THEN** cards render two per row with equal heights

#### Scenario: Descriptions differ in length

- **WHEN** two cards in the same row carry descriptions of very different lengths
- **THEN** both cards are the same height and both tag rows align at the bottom
