## MODIFIED Requirements

### Requirement: Profile image

The about section SHALL display a photograph of the owner in a square glass-framed container with an accent border and surrounding glow. The image SHALL carry alt text naming the owner and identifying the image as their photograph, and its intensity of glow SHALL increase on hover. The image SHALL be sized to its frame explicitly rather than relying on the frame to crop an oversized intrinsic width.

#### Scenario: Screen reader encounters the profile image

- **WHEN** a screen reader reaches the profile image
- **THEN** it announces alt text that names the owner and identifies the image as a photograph of them

#### Scenario: Current alt text is inaccurate

- **WHEN** the profile image's alt text is checked for a layout label such as "Hero Image"
- **THEN** none is found; the alt text describes the person pictured rather than the element it sits in

#### Scenario: Image fills its frame at every viewport width

- **WHEN** the about section renders at any supported width
- **THEN** the photograph fills its square frame with its subject visible, without depending on overflow clipping to hide an oversized rendered width
