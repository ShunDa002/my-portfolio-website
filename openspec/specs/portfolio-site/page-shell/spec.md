# portfolio-site/page-shell Specification

## Purpose

Defines the single-page frame that every section renders inside: the document metadata recruiters see in search results and browser tabs, the persistent navigation that lets a visitor jump between sections, and the vertical order and rhythm of the page.

## Requirements

### Requirement: Single-page section order

The site SHALL present all content on one scrolling page at the root route, with sections in this fixed order: hero, about, skills, projects, contact. There SHALL be no separate route for any section.

#### Scenario: Visitor loads the site

- **WHEN** a visitor opens the site root
- **THEN** the hero section occupies the initial viewport
- **AND** scrolling down reveals about, skills, projects, and contact in that order
- **AND** a consistent vertical gap separates each section from the next

#### Scenario: Visitor requests a section path directly

- **WHEN** a visitor requests a path such as `/about` or `/projects`
- **THEN** the site returns its not-found response, because sections are anchors on the root page rather than routes

### Requirement: Persistent section navigation

The site SHALL display a navigation control that remains visible at all scroll positions and offers direct links to the about, skills, projects, and contact sections. The navigation SHALL NOT link to the hero section, which is reachable by scrolling to the top.

#### Scenario: Visitor jumps to a section

- **WHEN** a visitor activates the "Projects" navigation link
- **THEN** the viewport moves to the projects section
- **AND** the navigation remains visible after the jump

#### Scenario: Visitor navigates by keyboard

- **WHEN** a visitor tabs through the page from the top
- **THEN** the four navigation links receive focus in reading order before the hero content
- **AND** each focused link is visually distinguishable from its unfocused state

#### Scenario: Navigation does not obstruct content

- **WHEN** a visitor scrolls to any section
- **THEN** the navigation overlays the background rather than the section's readable text
- **AND** section content beneath the navigation remains legible

### Requirement: Document metadata

The site SHALL declare a page title and description that identify the owner and state the specialization in AI, LLMs, and Computer Vision, so that a search result or shared link communicates positioning without the page being opened. The title SHALL carry the owner's name.

#### Scenario: Search engine indexes the page

- **WHEN** a crawler reads the document head
- **THEN** a non-empty title and a description naming the AI, LLM, and Computer Vision specialization are present

#### Scenario: Title carries the owner name

- **WHEN** the title is checked for the owner's name
- **THEN** the name is present, so a result list or shared link preview can be attributed to the owner without being opened

#### Scenario: Assistive technology reads the document language

- **WHEN** a screen reader announces the page
- **THEN** the document declares English as its language

### Requirement: Consistent typography and text rendering

The site SHALL apply one sans-serif family to body and heading text and one monospace family to display text throughout the page, and text SHALL render anti-aliased against the dark background. Text selection SHALL use a high-contrast accent highlight rather than the browser default. Every font the site loads SHALL be applied somewhere on the page.

#### Scenario: Visitor selects text

- **WHEN** a visitor selects a passage of body copy
- **THEN** the selection highlight uses the site's cyan accent and the selected text stays readable

#### Scenario: Monospace display text uses the site's own family

- **WHEN** monospace display text such as the hero name renders
- **THEN** it resolves to the site's own loaded monospace family rather than the platform's generic stack

#### Scenario: No font is loaded without being used

- **WHEN** the fonts the site requests are compared against the families its styles actually apply
- **THEN** every requested font is applied to at least one element, so no visitor pays a download that changes nothing on screen

### Requirement: Section content renders above background layers

All section content SHALL render above every background layer, and background layers SHALL NOT intercept pointer input intended for links, buttons, or text selection.

#### Scenario: Visitor clicks a call to action over the background

- **WHEN** a visitor clicks a button positioned over the animated background
- **THEN** the button receives the click and the background does not
