# portfolio-site/contact Specification

## Purpose

Closes the page with the shortest possible path from interest to contact: an email action and links to the owner's professional and code profiles, plus the site footer.

## Requirements

### Requirement: Contact section is anchor-addressable

The contact section SHALL be reachable by the navigation's "Contact" link, SHALL carry a stable anchor identifier, and SHALL be the last section on the page.

#### Scenario: Visitor jumps to Contact

- **WHEN** a visitor activates the "Contact" navigation link
- **THEN** the viewport moves to the contact section
- **AND** no further content section appears below it

### Requirement: Closing invitation

The contact section SHALL open with a centered heading inviting collaboration and a short line stating that questions, project ideas, and casual introductions are all welcome.

#### Scenario: Recruiter reaches the bottom of the page

- **WHEN** the section renders
- **THEN** a heading and a one-line invitation appear above the contact actions

### Requirement: Three contact actions

The section SHALL present exactly three contact actions, centered in one row: email, LinkedIn, and GitHub. Each SHALL render as a circular icon control that lightens and scales up on hover.

#### Scenario: Visitor scans the contact actions

- **WHEN** the section renders
- **THEN** three circular icon controls are visible in a single centered row

#### Scenario: Visitor hovers a contact action

- **WHEN** a visitor hovers any contact action
- **THEN** it scales up and its icon brightens

### Requirement: Email action

The email action SHALL open the visitor's default mail client with the owner's address pre-filled as the recipient. It SHALL carry an accessible name identifying it as the email action, since it presents no visible text label.

#### Scenario: Recruiter clicks the email action

- **WHEN** a recruiter activates the email action
- **THEN** their mail client opens with the owner's address as recipient

#### Scenario: Screen reader reaches the email action

- **WHEN** a screen reader announces the email action
- **THEN** it reads an accessible name identifying the action as email

### Requirement: Profile links open externally and safely

The LinkedIn and GitHub actions SHALL each resolve to an absolute external profile URL, SHALL open in a new browsing context leaving the portfolio open, and SHALL apply the safe-external-link attributes. Each SHALL carry an accessible name identifying the destination platform.

#### Scenario: Recruiter opens the GitHub profile

- **WHEN** a recruiter activates the GitHub action
- **THEN** the owner's GitHub profile opens in a new tab and the portfolio stays open

#### Scenario: Recruiter opens the LinkedIn profile

- **WHEN** a recruiter activates the LinkedIn action
- **THEN** the owner's LinkedIn profile opens in a new tab and the portfolio stays open

#### Scenario: Every profile URL is absolute

- **WHEN** any profile URL is inspected for a missing `https://` scheme
- **THEN** none is found; every profile URL is absolute, so no profile link resolves against the site's own origin

#### Scenario: Screen reader reaches a profile link

- **WHEN** a screen reader announces the LinkedIn or GitHub action
- **THEN** it reads an accessible name identifying the platform rather than an unlabelled link

#### Scenario: Every profile link carries an accessible name

- **WHEN** the LinkedIn and GitHub actions are inspected for a missing accessible name
- **THEN** none is found; all three contact actions declare one, so the row is consistent

#### Scenario: New-tab links declare the safe-external-link attributes

- **WHEN** the profile links that open a new browsing context are inspected
- **THEN** each declares `rel="noopener noreferrer"` alongside its target, so the protection does not depend on the browser implying it

### Requirement: Footer

The page SHALL end with a footer carrying a copyright line and an attribution to the Makoto Shinkai aesthetic that inspired the design. The footer SHALL be visually recessed so it does not compete with the contact actions above it.

#### Scenario: Visitor reaches the end of the page

- **WHEN** the visitor scrolls to the bottom
- **THEN** a low-contrast footer line with copyright and design attribution is the last content on the page
