## MODIFIED Requirements

### Requirement: Document metadata

The site SHALL declare a page title and description that identify the owner and state the specialization in AI, LLMs, and Computer Vision, so that a search result or shared link communicates positioning without the page being opened. The title SHALL carry the owner's name.

#### Scenario: Search engine indexes the page

- **WHEN** a crawler reads the document head
- **THEN** a non-empty title and a description naming the AI, LLM, and Computer Vision specialization are present

#### Scenario: Title omits the owner name

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

#### Scenario: Monospace display text falls back to a generic stack

- **WHEN** monospace display text such as the hero name renders
- **THEN** it resolves to the site's own loaded monospace family rather than the platform's generic stack

#### Scenario: No font is loaded without being used

- **WHEN** the fonts the site requests are compared against the families its styles actually apply
- **THEN** every requested font is applied to at least one element, so no visitor pays a download that changes nothing on screen
