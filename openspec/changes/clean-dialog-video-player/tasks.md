# Tasks

## 1. YouTube Player API Infrastructure

- [x] 1.1 Create YouTube IFrame Player API loader and TypeScript interface definitions in `src/lib/video.ts` (or `src/lib/youtube.ts`), verifying type-checking passes with `npm run build`.
- [x] 1.2 Implement time formatting utilities (`mm:ss`) and playback state handlers, verifying output accuracy for minutes and seconds calculations.

## 2. Dialog Video Player Component

- [x] 2.1 Create `DialogVideoPlayer` in `src/components/sections/dialog-video-player.tsx` embedding the video with `controls: 0` via YouTube IFrame API, verifying it mounts and autoplays muted.
- [x] 2.2 Implement the Center Playback Control with a prominent Play/Pause button styled in cyan-glow glassmorphism, verifying click and keyboard interactions toggle video playback and unmute audio.
- [x] 2.3 Implement the Timeline & Bottom Controls with an interactive progress scrubber bar and monospace time counter (`00:00 / 00:00`), verifying seeking updates playback position and the timer tracks elapsed time.
- [x] 2.4 Confirm the complete absence of top-bar metadata (channel avatar, title, CC, settings gear), center outward-arrow fullscreen icon, hover thumbnail preview, bottom link icons, and YouTube logos on the player surface.

## 3. Modal Integration & Verification

- [x] 3.1 Replace the native dialog iframe in `src/components/sections/projects.tsx` with `DialogVideoPlayer`, verifying project details modal opens and renders the clean player seamlessly.
- [x] 3.2 Verify lifecycle teardown on dialog dismissal (Escape key, close button, or backdrop click), confirming playback halts and intervals/event listeners are cleaned up without memory leaks.
- [x] 3.3 Run `npm run build` to verify there are zero TypeScript, ESLint, or Next.js build errors.
