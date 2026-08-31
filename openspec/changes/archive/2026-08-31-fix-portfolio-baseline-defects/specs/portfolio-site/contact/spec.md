## MODIFIED Requirements

### Requirement: Profile links open externally and safely

The LinkedIn and GitHub actions SHALL each resolve to an absolute external profile URL, SHALL open in a new browsing context leaving the portfolio open, and SHALL apply the safe-external-link attributes. Each SHALL carry an accessible name identifying the destination platform.

#### Scenario: Recruiter opens the GitHub profile

- **WHEN** a recruiter activates the GitHub action
- **THEN** the owner's GitHub profile opens in a new tab and the portfolio stays open

#### Scenario: Recruiter opens the LinkedIn profile

- **WHEN** a recruiter activates the LinkedIn action
- **THEN** the owner's LinkedIn profile opens in a new tab and the portfolio stays open

#### Scenario: LinkedIn URL omits its scheme

- **WHEN** any profile URL is inspected for a missing `https://` scheme
- **THEN** none is found; every profile URL is absolute, so no profile link resolves against the site's own origin

#### Scenario: Screen reader reaches a profile link

- **WHEN** a screen reader announces the LinkedIn or GitHub action
- **THEN** it reads an accessible name identifying the platform rather than an unlabelled link

#### Scenario: Profile links carry no accessible name

- **WHEN** the LinkedIn and GitHub actions are inspected for a missing accessible name
- **THEN** none is found; all three contact actions declare one, so the row is consistent

#### Scenario: New-tab links omit the safe-external-link attributes

- **WHEN** the profile links that open a new browsing context are inspected
- **THEN** each declares `rel="noopener noreferrer"` alongside its target, so the protection does not depend on the browser implying it
