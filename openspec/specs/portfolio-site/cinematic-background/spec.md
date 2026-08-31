# portfolio-site/cinematic-background Specification

## Purpose

Defines the layered night-sky atmosphere that sits behind the whole page: a static cinematic image, a slow drifting starfield, and soft accent glows, tuned so the visual mood never costs readability or interactivity.

## Requirements

### Requirement: Fixed layered backdrop

The site SHALL render a backdrop that stays fixed to the viewport while content scrolls, so the same night-sky atmosphere is present behind every section. The backdrop SHALL fill the viewport at every supported width without tiling, stretching, or leaving uncovered edges.

#### Scenario: Visitor scrolls the page

- **WHEN** a visitor scrolls from hero to contact
- **THEN** the backdrop stays in place rather than scrolling with content
- **AND** no section is left with a bare or mismatched background

#### Scenario: Visitor resizes to a narrow viewport

- **WHEN** the viewport is 320px wide
- **THEN** the backdrop still covers the full visible area with its focal region visible

### Requirement: Readability overlay

The backdrop SHALL be darkened by a gradient that is strongest at the top and bottom of the viewport, so that body copy and headings placed over the image meet readable contrast without each section needing its own opaque panel.

#### Scenario: Heading sits over a bright region of the image

- **WHEN** a heading renders over a light area of the background image
- **THEN** the overlay reduces the underlying brightness enough for the heading to remain legible

### Requirement: Drifting starfield

The backdrop SHALL include small light points that drift slowly upward and vary in opacity over time, producing a twinkling night-sky effect. The motion SHALL be slow enough that it reads as ambient atmosphere and does not draw the eye away from content. Point density SHALL be reduced on small viewports, and the animation SHALL be suppressed entirely when the visitor has requested reduced motion.

#### Scenario: Visitor watches the hero for several seconds

- **WHEN** a visitor rests on the hero section
- **THEN** star points drift upward at a barely perceptible rate and individually fade in and out
- **AND** points that leave the top of the viewport are replaced so density stays constant

#### Scenario: Visitor interacts with content over the starfield

- **WHEN** a visitor clicks or selects content positioned over the starfield
- **THEN** the starfield ignores the pointer entirely and the content receives the input

#### Scenario: Visitor has requested reduced motion

- **WHEN** the operating system reports a reduced-motion preference
- **THEN** the starfield does not drift or twinkle
- **AND** the backdrop still reads as a night sky, with its static image, readability gradient, and accent glows unaffected

#### Scenario: Visitor loads the site on a phone

- **WHEN** the viewport is below the tablet threshold
- **THEN** the starfield renders proportionally fewer points than on desktop, so a mobile device spends less of its frame budget on ambient motion

#### Scenario: Reduced-motion preference changes while the page is open

- **WHEN** a visitor enables reduced motion without reloading
- **THEN** the starfield stops animating without requiring a reload

### Requirement: Accent glows

The backdrop SHALL include soft out-of-focus color glows — a cyan glow near the top of the page and a deeper indigo glow at the bottom right — that add depth without producing visible edges or banding.

#### Scenario: Visitor views the top of the page

- **WHEN** the hero is in view
- **THEN** a diffuse cyan glow is visible behind the content with no discernible boundary

### Requirement: Background cost stays bounded

The backdrop SHALL be delivered so that it does not delay first paint of hero content or cause layout shift, and its animation SHALL be capped so it cannot monopolise the frame budget on modest hardware.

#### Scenario: First load on a mid-range device

- **WHEN** the page loads for the first time
- **THEN** hero text and calls to action are readable and clickable without waiting for the backdrop image to finish decoding
- **AND** no visible layout shift occurs when the backdrop appears
