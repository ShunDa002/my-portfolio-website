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

Each project entry SHALL carry a title, a list of technology tags, and a source repository URL, all of which are required. A demonstration video URL (`video`) SHALL be supported. Static preview images SHALL NOT be rendered in the card component, and any image content SHALL be completely removed from the card layout. A description field MAY remain on the data model for documentation purposes, but SHALL NOT be rendered on the card. The entry shape SHALL be declared as an explicit type so that a missing or misspelled required field is rejected at build time rather than surfacing as a rendering fault.

#### Scenario: Entry is missing a preview image
- **WHEN** an entry contains an image reference, omits video, or supplies an empty video reference
- **THEN** no image element is rendered on the card component
- **AND** the card renders a designed fallback panel in place of the video player, sized to the same frame the other cards use
- **AND** no card ever renders an image element, a broken video player, or an empty reserved frame

#### Scenario: Entry field set is validated
- **WHEN** the project list is edited
- **THEN** an entry missing any required field fails the build, so the error surfaces before deployment rather than in front of a visitor
- **AND** omitting only the optional video reference does not fail the build

#### Scenario: Fallback panel is recognisably deliberate
- **WHEN** a card renders its fallback panel
- **THEN** the panel reads as an intentional part of the design rather than as a missing video or failed media element, and stays consistent with the site's glass and accent treatment

### Requirement: Baseline project set

The baseline SHALL feature three projects: a Deepfake Detector combining a fine-tuned vision model with a fact-verification chatbot, a Malaysian SPM History (Sejarah) retrieval-augmented education app with textbook citations, and a Yahoo Finance MCP server exposing market data as agent tools. Together they SHALL demonstrate Computer Vision, LLM retrieval, and agentic tooling.

#### Scenario: Engineering manager reviews the grid

- **WHEN** the section renders
- **THEN** all three projects are present, each with a description stating the problem it addresses and the approach taken

### Requirement: Card content

Each card SHALL display, in this order: the embedded demonstration video (or fallback panel when no video is provided) occupying the dominant surface area of the card, followed by a compact bottom metadata strip with the project title and technology tags. The card SHALL maintain a horizontal orientation where card width exceeds card height. The entire card component SHALL act as an interactive click target that triggers the project details dialog upon click or keyboard activation. Tags SHALL render as small accent-tinted chips. The card frame and title SHALL shift to the cyan accent on hover.

#### Scenario: Visitor hovers a card
- **WHEN** a visitor hovers a project card
- **THEN** the card fill and border brighten, and the title shifts to the accent color
- **AND** no image-specific scaling effects or image elements are rendered

### Requirement: Project details dialog

The site SHALL provide an accessible modal dialog using Shadcn Dialog primitives when a project card is activated. The dialog SHALL present a horizontal, video-dominant layout with an enlarged 16:9 demonstration video player (or fallback panel), the project title, full project description, technology tags, and a GitHub repository button. The dialog SHALL support keyboard navigation, focus containment, and Escape-key or close-button dismissal.

#### Scenario: Visitor opens dialog on tablet or desktop
- **WHEN** a visitor activates a project card on a tablet or desktop viewport
- **THEN** a wide modal dialog opens with a horizontal layout where the enlarged video occupies the dominant area alongside project details, description, tags, and repository link

#### Scenario: Visitor views project without video in dialog
- **WHEN** a visitor opens the details dialog for a project with no demonstration video
- **THEN** the dialog displays an enlarged styled fallback panel matching the card's terminal aesthetic

#### Scenario: Visitor dismisses details dialog
- **WHEN** a visitor presses the Escape key, clicks the close button, or clicks outside the modal
- **THEN** the dialog closes and focus returns cleanly to the triggering card

### Requirement: Responsive card grid

The grid SHALL render one column on mobile viewports and two columns by default on tablet and desktop viewports (`grid-cols-1 md:grid-cols-2`). Cards SHALL adopt a horizontal orientation where card width exceeds card height, allowing the embedded demonstration video to occupy the dominant surface area of the card (~75–80%) with a streamlined metadata strip along the bottom.

#### Scenario: Visitor views projects on a tablet
- **WHEN** the viewport is at or above the tablet threshold
- **THEN** cards render two per row by default with a horizontal landscape aspect ratio

#### Scenario: Descriptions differ in length
- **WHEN** cards in the same row render with differing title lengths
- **THEN** cards maintain uniform proportions with the embedded video occupying the largest portion of the card

### Requirement: YouTube video embed resolution

The card component SHALL extract the YouTube video identifier from standard YouTube URL formats (including `youtu.be/<id>` short links and `youtube.com/watch?v=<id>` watch URLs) and render a responsive 16:9 embedded iframe player pointing to `https://www.youtube-nocookie.com/embed/<id>` configured with query parameters (`autoplay=1&mute=1&loop=1&playlist=<id>&playsinline=1&controls=0&disablekb=1&modestbranding=1&rel=0&iv_load_policy=3`) and styling (`pointer-events-none scale-125 origin-center`) to automatically play as a clean, overlay-free preview upon page load.

#### Scenario: Entry provides a youtu.be short link
- **WHEN** `project.video` is provided as a short URL (e.g. `https://youtu.be/kswDfgziS9I?si=...`)
- **THEN** the player resolves the video identifier and embeds the video with autoplay preview parameters via `youtube-nocookie.com/embed/kswDfgziS9I?autoplay=1&mute=1&loop=1&playlist=kswDfgziS9I&playsinline=1`

#### Scenario: Entry provides a full watch URL
- **WHEN** `project.video` is provided as a full watch URL (e.g. `https://www.youtube.com/watch?v=kswDfgziS9I`)
- **THEN** the player resolves the video identifier and embeds the video with autoplay preview parameters via `youtube-nocookie.com/embed/kswDfgziS9I?autoplay=1&mute=1&loop=1&playlist=kswDfgziS9I&playsinline=1`

#### Scenario: Preview video autoplays on page load
- **WHEN** the embedded video player loads on the page
- **THEN** it starts playback automatically in muted preview mode with continuous looping enabled, player controls disabled, and hover overlays clipped outside the frame

#### Scenario: Responsive aspect ratio and accessibility
- **WHEN** the video player renders
- **THEN** it maintains a 16:9 aspect ratio (`aspect-video`), includes a descriptive `title` attribute for screen readers, and specifies `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"`
