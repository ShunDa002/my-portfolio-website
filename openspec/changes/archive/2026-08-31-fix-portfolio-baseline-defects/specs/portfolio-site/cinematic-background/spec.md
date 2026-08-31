## MODIFIED Requirements

### Requirement: Drifting starfield

The backdrop SHALL include small light points that drift slowly upward and vary in opacity over time, producing a twinkling night-sky effect. The motion SHALL be slow enough that it reads as ambient atmosphere and does not draw the eye away from content. Point density SHALL be reduced on small viewports, and the animation SHALL be suppressed entirely when the visitor has requested reduced motion.

#### Scenario: Visitor watches the hero for several seconds

- **WHEN** a visitor rests on the hero section
- **THEN** star points drift upward at a barely perceptible rate and individually fade in and out
- **AND** points that leave the top of the viewport are replaced so density stays constant

#### Scenario: Visitor interacts with content over the starfield

- **WHEN** a visitor clicks or selects content positioned over the starfield
- **THEN** the starfield ignores the pointer entirely and the content receives the input

#### Scenario: Visitor has requested reduced motion

- **WHEN** the operating system reports a reduced-motion preference
- **THEN** the starfield does not drift or twinkle
- **AND** the backdrop still reads as a night sky, with its static image, readability gradient, and accent glows unaffected

#### Scenario: Visitor loads the site on a phone

- **WHEN** the viewport is below the tablet threshold
- **THEN** the starfield renders proportionally fewer points than on desktop, so a mobile device spends less of its frame budget on ambient motion

#### Scenario: Reduced-motion preference changes while the page is open

- **WHEN** a visitor enables reduced motion without reloading
- **THEN** the starfield stops animating without requiring a reload
