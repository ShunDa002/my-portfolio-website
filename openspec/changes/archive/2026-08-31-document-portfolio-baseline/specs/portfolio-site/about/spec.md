## Purpose

Gives a recruiter or engineering manager the human and academic context behind the projects: who the owner is, where they study, what they are driven by, and a face to attach to the work.

## ADDED Requirements

### Requirement: About section is anchor-addressable

The about section SHALL be reachable by the navigation's "About" link and SHALL carry a stable anchor identifier that does not change when surrounding sections are reordered.

#### Scenario: Visitor jumps to About

- **WHEN** a visitor activates the "About" navigation link
- **THEN** the viewport moves to the about section

### Requirement: Narrative content

The about narrative SHALL state that the owner is a final-year Software Engineering student at Universiti Malaysia Pahang Al-Sultan Abdullah, SHALL name Agentic AI and FinTech as the owner's driving interests, and SHALL cite concrete work — fine-tuning Computer Vision models for deepfake detection and enabling LLMs to analyze real-time stock market data — as evidence. The narrative SHALL close on the product-minded framing of turning theoretical AI into practical solutions.

#### Scenario: Engineering manager reads the about section

- **WHEN** an engineering manager reads the narrative
- **THEN** degree level, institution, the Agentic AI and FinTech interests, and at least two concrete technical examples are all present

#### Scenario: Key terms are emphasized

- **WHEN** the narrative renders
- **THEN** the discipline, the institution, and the named AI specializations are visually emphasized within the running text so the passage stays scannable

### Requirement: Narrative sits on a glass panel

The narrative SHALL render inside a glass panel so it remains readable over the background image, and the panel SHALL respond to hover with the shared border-brightening treatment.

#### Scenario: Visitor reads the narrative over the backdrop

- **WHEN** the about section renders over the background image
- **THEN** the narrative panel supplies enough contrast for comfortable reading at body size

### Requirement: Profile image

The about section SHALL display a photograph of the owner in a square glass-framed container with an accent border and surrounding glow. The image SHALL carry alt text that identifies it as a photograph of the owner, and its intensity of glow SHALL increase on hover.

#### Scenario: Screen reader encounters the profile image

- **WHEN** a screen reader reaches the profile image
- **THEN** it announces alt text identifying the person pictured

#### Scenario: Current alt text is inaccurate

- **WHEN** the baseline is audited against this requirement
- **THEN** the shipped alt text reads "Hero Image", which does not describe the photograph, and is recorded as a known deviation

### Requirement: Two-column layout collapses on mobile

From the tablet threshold upward the narrative and profile image SHALL sit in two columns of equal weight, vertically centered relative to each other. Below that threshold they SHALL stack in a single column with the narrative first.

#### Scenario: Visitor views About on desktop

- **WHEN** the viewport is at or above the tablet threshold
- **THEN** the narrative and the profile image render side by side

#### Scenario: Visitor views About on a phone

- **WHEN** the viewport is below the tablet threshold
- **THEN** the narrative and the profile image stack vertically and both remain fully visible
