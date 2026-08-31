## Purpose

Defines the shared visual language every section draws on — the palette, the translucent glass surface treatment, the type scale, the two button forms, and the entrance animation — so new sections can be added without inventing new styling and without drifting from the established look.

## ADDED Requirements

### Requirement: Core palette

The site SHALL use one fixed dark palette with no light-mode variant and no theme toggle. The palette SHALL be `#020617` as the page ground, `#22d3ee` as the primary accent used for emphasis and glow, slate tints for surfaces and borders, near-white for headings, and muted slate for body copy.

#### Scenario: A new section is added

- **WHEN** a section is added to the page
- **THEN** it uses the existing palette roles rather than introducing a new hue
- **AND** it renders correctly against the dark ground with no light-mode assumptions

#### Scenario: Visitor system is set to light mode

- **WHEN** the operating system reports a light color scheme preference
- **THEN** the site still renders its dark palette, because the design commits to a single dark treatment

### Requirement: Glass surface treatment

Content panels, cards, pills, and the navigation SHALL share one translucent surface treatment: a semi-transparent slate fill, a blur of the layers behind, a thin low-opacity border, and rounded corners. On hover, an interactive glass surface SHALL brighten its border toward the cyan accent and lighten its fill.

#### Scenario: Visitor hovers an interactive card

- **WHEN** a visitor hovers a project card
- **THEN** the card border shifts toward the cyan accent and its fill lightens
- **AND** the transition is smooth rather than instantaneous

#### Scenario: Panel sits over a busy region of the backdrop

- **WHEN** a glass panel renders over a detailed part of the background image
- **THEN** the blur and fill together keep the panel text readable

### Requirement: Typographic hierarchy

The site SHALL maintain a consistent type hierarchy: an oversized display treatment reserved for the owner name in the hero, one heading size shared by all section headings, one body size for narrative copy, and a small size for pills, tags, and metadata. Hero display type SHALL scale down below the tablet threshold; section headings SHALL be sized to fit the narrowest supported viewport without needing to scale.

#### Scenario: Visitor views section headings

- **WHEN** a visitor scrolls through about, skills, projects, and contact
- **THEN** every section heading renders at the same size and weight
- **AND** only the hero name renders larger

#### Scenario: Visitor views the hero on a 320px viewport

- **WHEN** the viewport is 320px wide
- **THEN** the hero name fits within the viewport without horizontal overflow

### Requirement: Two button forms

The site SHALL offer exactly two call-to-action forms. The primary form SHALL be a filled cyan pill with a surrounding glow that intensifies on hover. The secondary form SHALL be a glass pill with a light border and no heavy fill. Both SHALL be fully rounded and SHALL indicate hover and keyboard focus.

#### Scenario: Visitor compares the hero calls to action

- **WHEN** the hero renders
- **THEN** the primary action appears as a filled glowing cyan pill and the secondary action as a bordered glass pill

#### Scenario: Visitor focuses a button by keyboard

- **WHEN** a visitor tabs to a call to action
- **THEN** a visible focus indicator distinguishes it from its resting state

#### Scenario: Focus indication is left to the browser

- **WHEN** the shipped styles are inspected for focus treatment
- **THEN** no focus styling is authored anywhere on the site and every focus ring is the browser's own default
- **AND** this is recorded as a known deviation, because a default ring is not tuned for contrast against the dark palette and is suppressed outright by some browser and platform combinations

### Requirement: Entrance animation

Elements that animate on first paint SHALL do so with one shared entrance: fading from transparent to opaque while rising a short distance, completing in under one second, and finishing in their resting position. Multiple elements in the same group SHALL stagger their start times so they arrive in reading order.

#### Scenario: Visitor loads the page

- **WHEN** the page first paints
- **THEN** hero elements fade and rise into place one after another in reading order
- **AND** each element ends fully opaque and correctly positioned

#### Scenario: Animated element must not be left hidden

- **WHEN** an element opts into the entrance animation
- **THEN** its final state is fully visible regardless of when the animation started
- **AND** it is never left permanently transparent

### Requirement: Responsive breakpoint behavior

The layout SHALL adapt at three thresholds — small, tablet, and desktop — and SHALL remain usable from 320px to large desktop widths. Below the tablet threshold every multi-column arrangement SHALL collapse to a single column. Horizontal call-to-action rows SHALL stack vertically below the small threshold, which is one step narrower than the column collapse. Section content SHALL be width-capped and horizontally centered on wide viewports, and the page SHALL never scroll horizontally.

#### Scenario: Visitor views the site on a phone

- **WHEN** the viewport is under the small threshold
- **THEN** the about columns stack, the project grid becomes one column, hero actions stack vertically, and no horizontal scrollbar appears

#### Scenario: Visitor views the site at an intermediate width

- **WHEN** the viewport sits between the small and tablet thresholds
- **THEN** multi-column sections have already collapsed to one column while the hero actions remain side by side

#### Scenario: Visitor views the site on a large desktop

- **WHEN** the viewport is 1440px or wider
- **THEN** section content stays within its maximum width and remains centered rather than stretching edge to edge

### Requirement: Section content padding

Every section SHALL apply horizontal padding so that text never touches the viewport edge, and vertical padding so that adjacent sections read as distinct blocks.

#### Scenario: Visitor reads body copy at 320px

- **WHEN** the viewport is 320px wide
- **THEN** a visible gutter separates body copy from both viewport edges
