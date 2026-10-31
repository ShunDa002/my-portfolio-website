# Spec Delta

## MODIFIED Requirements

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

### Requirement: Card content

Each card SHALL display, in this order: the embedded demonstration video (or fallback panel when no video is provided) occupying the dominant surface area of the card, followed by a compact bottom metadata strip with the project title accompanied by a directional outbound affordance linking to the source repository, and technology tags. The card SHALL maintain a horizontal orientation where card width exceeds card height. The card SHALL NOT display any static preview image element or project description text. Tags SHALL render as small accent-tinted chips. The card frame and title SHALL shift to the cyan accent on hover.

#### Scenario: Visitor hovers a card
- **WHEN** a visitor hovers a project card
- **THEN** the card fill and border brighten, and the title shifts to the accent color
- **AND** no image-specific scaling effects or image elements are rendered

### Requirement: Card links to its repository

The card SHALL provide access to the project's source repository via the project title and directional outbound affordance without encapsulating the embedded video player in an anchor tag. Interacting with the video player (play, pause, seek, volume) SHALL NOT trigger repository navigation. Clicks on the repository links SHALL open in a new browsing context with the safe-external-link attributes applied, leaving the portfolio open in the visitor's original tab.

#### Scenario: Visitor opens a project
- **WHEN** a visitor clicks the project title
- **THEN** the project's repository is opened

#### Scenario: Tag row is part of the link target
- **WHEN** a visitor views the technology tags
- **THEN** the tags render with distinct chip styling and do not interfere with video controls or repository navigation

#### Scenario: Repository opens in a new tab
- **WHEN** a visitor activates a card repository link
- **THEN** the repository opens in a new tab instead of replacing the portfolio in the current one
- **AND** the portfolio remains open at the same scroll position for the visitor to return to

#### Scenario: Directional affordance is not a separate target
- **WHEN** a visitor clicks the card's outbound arrow affordance
- **THEN** the same repository is opened as the title link

#### Scenario: Card link declares its safety attributes
- **WHEN** a repository link is inspected
- **THEN** it declares `rel="noopener noreferrer"` alongside its `target="_blank"` attribute

### Requirement: Responsive card grid

The grid SHALL render one column on mobile viewports and two columns by default on tablet and desktop viewports (`grid-cols-1 md:grid-cols-2`). Cards SHALL adopt a horizontal orientation where card width exceeds card height, allowing the embedded demonstration video to occupy the dominant surface area of the card (~75–80%) with a streamlined metadata strip along the bottom.

#### Scenario: Visitor views projects on a tablet
- **WHEN** the viewport is at or above the tablet threshold
- **THEN** cards render two per row by default with a horizontal landscape aspect ratio

#### Scenario: Descriptions differ in length
- **WHEN** cards in the same row render with differing title lengths
- **THEN** cards maintain uniform proportions with the embedded video occupying the largest portion of the card

## ADDED Requirements

### Requirement: YouTube video embed resolution

The card component SHALL extract the YouTube video identifier from standard YouTube URL formats (including `youtu.be/<id>` short links and `youtube.com/watch?v=<id>` watch URLs) and render a responsive 16:9 embedded iframe player pointing to `https://www.youtube-nocookie.com/embed/<id>` configured with query parameters (`autoplay=1&mute=1&loop=1&playlist=<id>&playsinline=1`) to automatically play in muted preview mode upon page load.

#### Scenario: Entry provides a youtu.be short link
- **WHEN** `project.video` is provided as a short URL (e.g. `https://youtu.be/kswDfgziS9I?si=...`)
- **THEN** the player resolves the video identifier and embeds the video with autoplay preview parameters via `youtube-nocookie.com/embed/kswDfgziS9I?autoplay=1&mute=1&loop=1&playlist=kswDfgziS9I&playsinline=1`

#### Scenario: Entry provides a full watch URL
- **WHEN** `project.video` is provided as a full watch URL (e.g. `https://www.youtube.com/watch?v=kswDfgziS9I`)
- **THEN** the player resolves the video identifier and embeds the video with autoplay preview parameters via `youtube-nocookie.com/embed/kswDfgziS9I?autoplay=1&mute=1&loop=1&playlist=kswDfgziS9I&playsinline=1`

#### Scenario: Preview video autoplays on page load
- **WHEN** the embedded video player loads on the page
- **THEN** it starts playback automatically in muted preview mode with continuous looping enabled

#### Scenario: Responsive aspect ratio and accessibility
- **WHEN** the video player renders
- **THEN** it maintains a 16:9 aspect ratio (`aspect-video`), includes a descriptive `title` attribute for screen readers, and specifies `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"`
