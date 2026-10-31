## MODIFIED Requirements

### Requirement: Single-page section order

The site SHALL present all of its section content on one scrolling page at the root route, with sections in this fixed order: hero, about, skills, projects, contact. There SHALL be no separate route for any section. Routes outside that set SHALL exist only where a dedicated capability defines one; at present the only such route is `/wiki`.

#### Scenario: Visitor loads the site

- **WHEN** a visitor opens the site root
- **THEN** the hero section occupies the initial viewport
- **AND** scrolling down reveals about, skills, projects, and contact in that order
- **AND** a consistent vertical gap separates each section from the next

#### Scenario: Visitor requests a section path directly

- **WHEN** a visitor requests a path such as `/about` or `/projects`
- **THEN** the site returns its not-found response, because sections are anchors on the root page rather than routes

#### Scenario: Visitor requests a defined non-section route

- **WHEN** a visitor requests `/wiki`
- **THEN** the site returns that page rather than its not-found response, because it is a capability of its own rather than a section of the root page

### Requirement: Persistent section navigation

The site SHALL display a navigation control that remains visible at all scroll positions. On the root page the navigation SHALL offer direct links to the about, skills, projects, and contact sections, and SHALL NOT link to the hero section, which is reachable by scrolling to the top. The navigation SHALL additionally offer a link to the `/wiki` page, presented so that a visitor can tell it leaves the current page rather than scrolling within it, and SHALL appear on that page too, where it SHALL offer a route back to the root page.

#### Scenario: Visitor jumps to a section

- **WHEN** a visitor activates the "Projects" navigation link
- **THEN** the viewport moves to the projects section
- **AND** the navigation remains visible after the jump

#### Scenario: Visitor navigates by keyboard

- **WHEN** a visitor tabs through the page from the top
- **THEN** the navigation links receive focus in reading order before the hero content
- **AND** each focused link is visually distinguishable from its unfocused state

#### Scenario: Navigation does not obstruct content

- **WHEN** a visitor scrolls to any section
- **THEN** the navigation overlays the background rather than the section's readable text
- **AND** section content beneath the navigation remains legible

#### Scenario: Visitor leaves the root page from the navigation

- **WHEN** a visitor activates the wiki navigation link from the root page
- **THEN** the site navigates to `/wiki` rather than scrolling the root page
- **AND** the navigation remains visible on the destination page

#### Scenario: Visitor returns to the root page

- **WHEN** a visitor on `/wiki` uses the navigation to return to the site's sections
- **THEN** the site navigates to the root page and the requested section is reachable there
