# Spec Delta

## MODIFIED Requirements

### Requirement: Single-page section order

The site SHALL present all of its section content on one scrolling page at the root route, with sections in this fixed order: hero, about, skills, projects, wiki graph, contact. There SHALL be no separate route for any section. Routes outside that set SHALL exist only where a dedicated capability defines one; at present the only such route is `/wiki`.

#### Scenario: Visitor loads the site

- **WHEN** a visitor opens the site root
- **THEN** the hero section occupies the initial viewport
- **AND** scrolling down reveals about, skills, projects, wiki graph, and contact in that order
- **AND** a consistent vertical gap separates each section from the next

#### Scenario: Visitor requests a section path directly

- **WHEN** a visitor requests a path such as `/about` or `/projects`
- **THEN** the site returns its not-found response, because sections are anchors on the root page rather than routes

#### Scenario: Visitor requests a defined non-section route

- **WHEN** a visitor requests `/wiki`
- **THEN** the site returns that page rather than its not-found response, because it is a capability of its own rather than a section of the root page
