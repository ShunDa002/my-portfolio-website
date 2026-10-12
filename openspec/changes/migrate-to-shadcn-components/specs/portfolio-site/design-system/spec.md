# Spec Delta

## MODIFIED Requirements

### Requirement: Two button forms

The site SHALL offer exactly two primary call-to-action forms alongside accessible icon and action variants implemented via standard Shadcn UI button primitives. The primary form SHALL be a filled cyan pill with a surrounding glow that intensifies on hover. The secondary form SHALL be a glass pill with a light border and no heavy fill. Both SHALL be fully rounded, support polymorphic navigation via `asChild`, and SHALL indicate hover and keyboard focus.

#### Scenario: Visitor compares the hero calls to action

- **WHEN** the hero renders
- **THEN** the primary action appears as a filled glowing cyan pill and the secondary action as a bordered glass pill

#### Scenario: Visitor focuses a button by keyboard

- **WHEN** a visitor tabs to a call to action
- **THEN** a visible focus indicator distinguishes it from its resting state

#### Scenario: Focus indication is authored by the site

- **WHEN** the site's styles are checked for authored focus treatment
- **THEN** it is present, so no interactive element depends on the browser's own default ring

#### Scenario: Polymorphic link navigation via asChild

- **WHEN** a button component wraps a Next.js Link element
- **THEN** it renders valid semantic anchor markup with button variant styling while enabling client-side routing

## ADDED Requirements

### Requirement: Accessible UI component primitives

The site SHALL implement content surfaces, status chips, media frames, and interactive overlays using accessible Shadcn UI component primitives (Card, Badge, AspectRatio, Separator, ScrollArea, and Alert/Dialog). All primitives SHALL inherit the site's dark midnight ground, translucent glass surface styles, and cyan focus treatments without introducing inconsistent light-mode defaults.

#### Scenario: Visitor views cards and badges

- **WHEN** a visitor browses about bio, featured project cards, or technical skills
- **THEN** content panels render as translucent glass cards and skill/tag chips render as dark-tinted badge primitives
- **AND** hover interactions smoothly transition border brightness and glow

#### Scenario: Media aspect ratio stability

- **WHEN** project demonstration videos render in project cards
- **THEN** video frames maintain a responsive 16:9 aspect ratio using standard aspect-ratio primitives preventing layout shifts

#### Scenario: Interactive panels and dialog overlays

- **WHEN** the wiki detail panel or failure state is displayed
- **THEN** the component maintains WAI-ARIA role semantics, keyboard focus containment, and escape-key dismissal
