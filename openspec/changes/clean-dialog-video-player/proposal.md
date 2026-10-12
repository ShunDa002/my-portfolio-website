# Proposal: Clean Dialog Video Player Controls

## Why

When visitors open the project details dialog by clicking a project card, the embedded YouTube demonstration video currently renders default native player overlays. These include the top bar (channel avatar and title, mute/speaker button, closed captions CC, settings gear), center outward-arrow fullscreen button, and bottom bar clutter (hover thumbnail preview, link icon, YouTube logo). These extraneous controls distract from the project presentation, obscure video content, and break the sleek, immersive cyber-aesthetic of the portfolio.

Replacing this noisy default overlay with a succinct, distraction-free control interface—retaining solely the center Play/Pause toggle and the bottom timeline scrubber with time counter—ensures a polished, premium showcase focused entirely on the project demonstration.

## What Changes

- **Streamlined Dialog Video Experience**: In the project details modal, replace the standard clutter-laden YouTube embed with a custom clean player interface powered by the YouTube IFrame API (with native YouTube controls disabled via `controls=0`).
- **Retained Core Playback Controls**:
  - **Center Playback Controls**: A prominent, styled center Play/Pause button that responds to clicks/keyboard activation with smooth hover micro-interactions.
  - **Timeline & Bottom Controls**: An interactive Progress Bar / Scrubber allowing smooth tracking and seeking, paired with an accurate Time Counter (`current / total`).
- **Removed Overlay Elements**:
  - Removed top bar overlay: Channel avatar & title, Speaker icon, CC (Closed Captions) icon, and Gear (Settings) icon.
  - Removed secondary center controls: Fullscreen outward-arrow overlay icon.
  - Removed bottom bar clutter: Hover thumbnail preview, bottom-left link icon, and bottom-right YouTube logo.
- **Audio & Autoplay Handling**: Ensure video autoplays smoothly in compliance with browser autoplay policies (muted by default), unmuting seamlessly upon user activation of the center Play button.
- **Visual Design Alignment**: Style custom player controls using the existing design system tokens (slate-950 backdrop, cyan-glow accents, glassmorphic blur, high-contrast typography).

## Capabilities

### New Capabilities
*(None)*

### Modified Capabilities
- `portfolio-site/featured-projects`: Updates the project details dialog requirements to specify that the embedded video demonstration player presents a streamlined interface retaining only the center play button, progress bar scrubber, and time counter, while eliminating top-bar channel metadata, settings, caption icons, and external branding links.

## Impact

- **Components**: `src/components/sections/projects.tsx` and a new reusable dialog player component `src/components/sections/dialog-video-player.tsx` (or similar within `src/components/`).
- **Helper Utilities**: `src/lib/video.ts` may be extended or leveraged to support YouTube IFrame API initialization and ID extraction.
- **Dependencies**: Uses standard YouTube IFrame API (loaded dynamically or via lightweight embed script); no bulky external player libraries needed.
