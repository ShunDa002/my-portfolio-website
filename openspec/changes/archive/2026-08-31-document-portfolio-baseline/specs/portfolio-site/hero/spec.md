## Purpose

Defines the first screen a recruiter sees: who the owner is, what they specialize in, that they are seeking an internship, and the two actions that turn interest into either a project review or a resume download.

## ADDED Requirements

### Requirement: Hero occupies the first screen

The hero SHALL fill at least the full height of the initial viewport with its content vertically and horizontally centered, so that a visitor who has not scrolled sees only the positioning message and its calls to action.

#### Scenario: Visitor lands on the site

- **WHEN** the site first renders and the visitor has not scrolled
- **THEN** the hero fills the viewport
- **AND** no other section is visible above the fold

### Requirement: Positioning message

The hero SHALL communicate, in a single scannable block, four facts: that this is the owner's portfolio, the owner's full name, the owner's status as a Software Engineering student at Universiti Malaysia Pahang Al-Sultan Abdullah, and that the owner is seeking an internship in AI, LLMs, and Computer Vision. The name SHALL be the most visually prominent element on the page.

#### Scenario: Recruiter scans the hero

- **WHEN** a recruiter reads the hero for five seconds
- **THEN** the owner's name, field of study, institution, internship intent, and the AI, LLM, and Computer Vision specialization are all readable without scrolling

#### Scenario: Internship intent is emphasized

- **WHEN** the positioning sentence renders
- **THEN** the internship intent and the three specialization areas are visually distinguished from surrounding text by accent color

### Requirement: Primary action scrolls to projects

The hero SHALL present a primary call to action labelled "View Projects" that moves the visitor to the projects section on the same page. It SHALL be styled as the primary button form and SHALL give visual feedback on hover.

#### Scenario: Visitor activates View Projects

- **WHEN** a visitor clicks or presses Enter on "View Projects"
- **THEN** the viewport moves to the projects section
- **AND** no page navigation or reload occurs

#### Scenario: Visitor hovers View Projects

- **WHEN** a visitor hovers the primary action
- **THEN** its glow intensifies and its trailing icon shifts to signal direction

### Requirement: Secondary action opens the resume

The hero SHALL present a secondary call to action labelled "Download Resume" that opens the owner's resume PDF in a new browsing context, leaving the portfolio page open behind it. It SHALL be styled as the secondary glass button form.

#### Scenario: Recruiter opens the resume

- **WHEN** a recruiter activates "Download Resume"
- **THEN** the resume PDF opens in a new tab
- **AND** the portfolio page remains open and unchanged

#### Scenario: Resume asset is missing

- **WHEN** the resume file is absent from the deployed build
- **THEN** the action resolves to the site not-found response rather than a broken download, and the missing asset is treated as a release blocker

### Requirement: Hero actions adapt to viewport width

The two hero actions SHALL sit side by side from the tablet threshold upward and SHALL stack vertically below it, remaining fully tappable at 320px width.

#### Scenario: Visitor views the hero on a phone

- **WHEN** the viewport is under the tablet threshold
- **THEN** the two actions stack vertically, centered, with visible spacing between them

### Requirement: Hero enters with staggered animation

Hero elements SHALL use the shared entrance animation, staggered so that the eyebrow, name block, positioning sentence, and action row arrive in that order.

#### Scenario: Visitor loads the site

- **WHEN** the hero first paints
- **THEN** its four element groups fade and rise in reading order
- **AND** all four end fully visible
