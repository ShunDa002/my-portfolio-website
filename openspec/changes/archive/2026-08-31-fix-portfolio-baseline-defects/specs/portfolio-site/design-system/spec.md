## MODIFIED Requirements

### Requirement: Two button forms

The site SHALL offer exactly two call-to-action forms. The primary form SHALL be a filled cyan pill with a surrounding glow that intensifies on hover. The secondary form SHALL be a glass pill with a light border and no heavy fill. Both SHALL be fully rounded and SHALL indicate hover and keyboard focus.

#### Scenario: Visitor compares the hero calls to action

- **WHEN** the hero renders
- **THEN** the primary action appears as a filled glowing cyan pill and the secondary action as a bordered glass pill

#### Scenario: Visitor focuses a button by keyboard

- **WHEN** a visitor tabs to a call to action
- **THEN** a visible focus indicator distinguishes it from its resting state

#### Scenario: Focus indication is left to the browser

- **WHEN** the site's styles are checked for authored focus treatment
- **THEN** it is present, so no interactive element depends on the browser's own default ring

## ADDED Requirements

### Requirement: Authored focus indication

Every interactive element — calls to action, navigation links, project cards, skill pills, and contact actions — SHALL carry a focus indicator authored by the site rather than inherited from the browser default. The indicator SHALL be tuned for contrast against the dark palette, SHALL be visible on every interactive surface including glass panels and the filled cyan pill, and SHALL appear for keyboard navigation without appearing on pointer interaction.

#### Scenario: Visitor tabs through the whole page

- **WHEN** a visitor navigates from the top of the page to the footer using only the keyboard
- **THEN** every focusable element shows a clearly visible focus indicator at each stop

#### Scenario: Focus indicator is visible on every surface

- **WHEN** focus lands on the filled cyan primary action, a glass card, and a navigation link in turn
- **THEN** the indicator remains clearly visible against each of those backgrounds

#### Scenario: Visitor clicks a button with a pointer

- **WHEN** a visitor activates a control by mouse or touch
- **THEN** no focus indicator is drawn, so the treatment serves keyboard navigation without adding pointer-interaction noise

#### Scenario: Focus order follows reading order

- **WHEN** a visitor tabs through the page
- **THEN** focus moves through the navigation, then the hero actions, then each section's interactive elements in the order they are read
