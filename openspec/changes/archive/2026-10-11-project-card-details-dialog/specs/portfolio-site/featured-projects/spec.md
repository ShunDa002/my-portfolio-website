# Spec Delta

## MODIFIED Requirements

### Requirement: Card content

Each card SHALL display, in this order: the embedded demonstration video (or fallback panel when no video is provided) occupying the dominant surface area of the card, followed by a compact bottom metadata strip with the project title and technology tags. The card SHALL maintain a horizontal orientation where card width exceeds card height. The entire card component SHALL act as an interactive click target that triggers the project details dialog upon click or keyboard activation. Tags SHALL render as small accent-tinted chips. The card frame and title SHALL shift to the cyan accent on hover.

#### Scenario: Visitor hovers a card
- **WHEN** a visitor hovers a project card
- **THEN** the card fill and border brighten, and the title shifts to the accent color
- **AND** no image-specific scaling effects or image elements are rendered

## REMOVED Requirements

### Requirement: Card links to its repository
**Reason**: Direct repository navigation from the card title and directional outbound affordance is removed in favor of an interactive card that opens a rich project details dialog.
**Migration**: Repository navigation is provided via a dedicated call-to-action button inside the project details dialog.

## ADDED Requirements

### Requirement: Project details dialog

The site SHALL provide an accessible modal dialog using Shadcn Dialog primitives when a project card is activated. The dialog SHALL present a horizontal, video-dominant layout with an enlarged 16:9 demonstration video player (or fallback panel), the project title, full project description, technology tags, and a GitHub repository button. The dialog SHALL support keyboard navigation, focus containment, and Escape-key or close-button dismissal.

#### Scenario: Visitor opens dialog on tablet or desktop
- **WHEN** a visitor activates a project card on a tablet or desktop viewport
- **THEN** a wide modal dialog opens with a horizontal layout where the enlarged video occupies the dominant area alongside project details, description, tags, and repository link

#### Scenario: Visitor views project without video in dialog
- **WHEN** a visitor opens the details dialog for a project with no demonstration video
- **THEN** the dialog displays an enlarged styled fallback panel matching the card's terminal aesthetic

#### Scenario: Visitor dismisses details dialog
- **WHEN** a visitor presses the Escape key, clicks the close button, or clicks outside the modal
- **THEN** the dialog closes and focus returns cleanly to the triggering card
