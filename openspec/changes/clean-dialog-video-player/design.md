# Design: Clean Dialog Video Player Controls

## Context

In the project details modal (`src/components/sections/projects.tsx`), embedded YouTube demonstration videos currently use a standard `<iframe>` embed with `controls: true`. Standard YouTube embeds include native overlays that cannot be removed through URL parameters alone:
- YouTube permanently deprecated `showinfo=0` in September 2018, enforcing the display of channel avatar, title, and share buttons.
- `controls=1` enforces the presence of captions (CC), settings gear, watch later/share, link icons, and YouTube branding watermarks.
- Cross-origin security policies (Same-Origin Policy) prevent the host application from inspecting or styling the DOM inside `youtube-nocookie.com` or `youtube.com`.

To deliver the clean, distraction-free playback requested by the user, the application must manage playback using the YouTube IFrame Player API (`window.YT.Player`) with `controls: 0`, replacing native YouTube chrome with custom, lightweight React controls.

See [proposal.md](file:///c/Data/ide-sbx-isolation/my-portfolio/openspec/changes/clean-dialog-video-player/proposal.md) for motivation and problem statement.

## Goals / Non-Goals

**Goals:**
- Provide a clean, custom video player component (`DialogVideoPlayer`) for the project details dialog.
- Discard all clutter: Top bar (channel avatar, title, audio icon, CC, settings gear), center outward-arrow fullscreen icon, hover thumbnail preview, bottom-left link icon, and bottom-right YouTube logo.
- Render only the requested controls:
  1. **Center Playback Control**: Center Play/Pause button with smooth hover fade and cyber-glow styling.
  2. **Timeline & Bottom Controls**: Interactive Progress Bar / Scrubber and Time Counter (`current / total`).
- Dynamically load the YouTube IFrame API without introducing bulky external dependencies.
- Ensure responsive 16:9 aspect ratio and seamless integration with the existing Shadcn dialog styling.

**Non-Goals:**
- Modifying the project card preview videos in the main grid (which already use muted loop previews with `pointer-events-none`).
- Supporting self-hosted HTML5 `<video>` or non-YouTube video hosts at this time (the project data schema strictly models YouTube links).
- Re-adding secondary features like caption toggling, playback rate selection, or resolution settings.

## Decisions

### Decision 1: YouTube IFrame Player API with `controls: 0` + Custom React Overlay
- **Rationale**: This is the only technically reliable and policy-compliant way to remove YouTube's native top bar, branding watermark, settings gear, and external links while retaining full playback control (play, pause, seek, current time, duration).
- **Alternatives Considered**:
  - *URL Parameter tweaking*: Setting `controls=0` in a standard iframe hides all controls with no way to play, pause, or seek. Setting `controls=1` forces all YouTube chrome to appear.
  - *CSS overflow clipping / scaling*: Scaling up the iframe pushes top and bottom bars outside the frame, but also eliminates native progress bars and breaks 16:9 framing on mobile/tablet screens.
  - *Heavy video player libraries (e.g. video.js, react-player)*: Adds unnecessary bundle size and abstraction overhead for a straightforward dialog player.

### Decision 2: Lightweight Dynamic YouTube API Loader
- **Rationale**: Implement a small utility or hook (`useYouTubeIframeApi` or dynamic script loader) that appends `https://www.youtube.com/iframe_api` to `<head>` once and resolves when `window.YT` is available.
- **Alternatives Considered**: Installing `@types/youtube` or third-party wrappers. A minimal TypeScript declaration file or type definition suffices without runtime bundle overhead.

### Decision 3: Custom Overlay Layout & Aesthetic
- **Rationale**:
  - **Center Play Button**: Positioned in the dead center with glassmorphism (`bg-slate-900/80 backdrop-blur-md border border-cyan-500/40 text-cyan-glow`), scaling up slightly on hover. Toggles playback on click or `Space`/`Enter` keypress.
  - **Bottom Timeline Bar**: Positioned at the bottom of the video frame over a subtle gradient shadow (`bg-gradient-to-t from-black/80 via-black/40 to-transparent`).
  - **Time Counter**: Left-aligned or right-aligned formatted time string (e.g., `01:24 / 03:50`) in monospace font (`font-mono text-xs text-slate-300`).
  - **Progress Bar / Scrubber**: Custom range slider or interactive bar with cyan fill (`bg-cyan-glow`) indicating elapsed time and a smooth hover seeker.
  - **Autoplay & Audio Behavior**: The video autoplays muted (adhering to browser autoplay restrictions). When the visitor clicks the center play button or interacts with the video, audio is unmuted.

## Risks / Trade-offs

- **[Risk] Browser autoplay restrictions prevent unmuted playback on load**
  → *Mitigation*: Start playback muted (`player.mute()`) upon dialog mount. Unmute automatically when user clicks the center Play button.
- **[Risk] YouTube API script blocked or failed to load (e.g., aggressive network filtering)**
  → *Mitigation*: Detect API load timeout (e.g. 5 seconds) and fall back to the standard iframe player as a resilience fallback.
- **[Risk] Timer polling overhead for scrubber progress**
  → *Mitigation*: Run a lightweight 250ms interval only while `playerState === YT.PlayerState.PLAYING`. Clear interval immediately on pause, seek end, or modal unmount.
