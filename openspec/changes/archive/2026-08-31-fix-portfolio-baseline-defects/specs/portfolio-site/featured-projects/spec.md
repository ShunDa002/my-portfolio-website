## MODIFIED Requirements

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

### Requirement: Card links to its repository

Each card SHALL link to its project's source repository. The whole card SHALL be one uniform link target, so that a click anywhere within it — image, title, description, or tag row — follows the same destination, and no element inside the card SHALL present a competing or dead affordance. The link SHALL open in a new browsing context with the safe-external-link attributes applied, leaving the portfolio open in the visitor's original tab.

#### Scenario: Visitor opens a project

- **WHEN** a visitor clicks a card's image, title, or description
- **THEN** the project's repository is opened

#### Scenario: Tag row is not part of the link target

- **WHEN** a visitor clicks a technology tag or the space around it
- **THEN** the same repository is opened, because the tag row is now inside the card's single link target

#### Scenario: Repository opens in the same tab

- **WHEN** a recruiter activates a card link
- **THEN** the repository opens in a new tab instead of replacing the portfolio in the current one
- **AND** the portfolio remains open at the same scroll position for the recruiter to return to

#### Scenario: Directional affordance is not a separate target

- **WHEN** a visitor clicks the card's outbound arrow affordance
- **THEN** the same repository is opened, and the arrow is presented as decoration on the card link rather than as an independent control

#### Scenario: Card link declares its safety attributes

- **WHEN** a card link is inspected
- **THEN** it declares `rel="noopener noreferrer"` alongside its new-context target
