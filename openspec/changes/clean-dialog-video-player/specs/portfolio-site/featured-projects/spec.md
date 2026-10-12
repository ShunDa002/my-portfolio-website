# Spec Delta

## MODIFIED Requirements

### Requirement: Project details dialog

The site SHALL provide an accessible modal dialog using Shadcn Dialog primitives when a project card is activated. The dialog SHALL present a horizontal, video-dominant layout with an enlarged 16:9 demonstration video player (or fallback panel), the project title, full project description, technology tags, and a GitHub repository button. The embedded video player in the dialog SHALL feature a clean, succinct interface retaining only the center Play/Pause control, bottom progress bar scrubber, and time counter, with top-bar channel metadata, gear, captions, external link icons, and YouTube branding removed. The dialog SHALL support keyboard navigation, focus containment, and Escape-key or close-button dismissal.

#### Scenario: Visitor opens dialog on tablet or desktop
- **WHEN** a visitor activates a project card on a tablet or desktop viewport
- **THEN** a wide modal dialog opens with a horizontal layout where the enlarged video occupies the dominant area alongside project details, description, tags, and repository link

#### Scenario: Visitor views demonstration video with clean controls
- **WHEN** a visitor opens the details dialog for a project with an embedded demonstration video
- **THEN** the video player presents only the center Play/Pause control and the bottom timeline scrubber with time counter
- **AND** the top bar (channel avatar/title, audio icon, closed captions icon, settings gear), center outward-arrow fullscreen icon, hover thumbnail preview, bottom-left link icon, and bottom-right YouTube logo are not displayed

#### Scenario: Visitor seeks or toggles playback
- **WHEN** a visitor clicks the center play button or interacts with the timeline scrubber
- **THEN** video playback toggles or seeks to the selected timestamp accordingly, and the time counter updates accurately in real time

#### Scenario: Visitor views project without video in dialog
- **WHEN** a visitor opens the details dialog for a project with no demonstration video
- **THEN** the dialog displays an enlarged styled fallback panel matching the card's terminal aesthetic

#### Scenario: Visitor dismisses details dialog
- **WHEN** a visitor presses the Escape key, clicks the close button, or clicks outside the modal
- **THEN** the dialog closes and focus returns cleanly to the triggering card
