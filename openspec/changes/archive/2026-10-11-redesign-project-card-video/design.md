# Design

## Context

The previous `Projects` component in `src/components/sections/projects.tsx` rendered project entries inside a 3-column grid, wrapping each card inside a single Next.js `<Link>` component. Each card held a static screenshot image, title with outbound arrow, multi-line description, and technology tags.

In `src/constant/projects_list.ts`, project entries have been updated with `video` URLs linking to YouTube demonstrations (e.g., Deepfake Detector and SPM History RAG). A project without a video demonstration (e.g., Yahoo Finance MCP) remains supported and requires an intentional fallback panel matching the video frame.

## Goals / Non-Goals

**Goals:**
- Transition the section grid to two cards per row by default on tablet and desktop viewports (`grid-cols-1 md:grid-cols-2`).
- Re-design the card view into a horizontal landscape aspect ratio where card width significantly exceeds card height.
- Ensure the embedded demonstration video occupies the dominant portion (~75–80%) of the card surface area.
- Configure embedded YouTube videos to autoplay automatically upon website load in muted, looped preview mode.
- Completely remove static image elements (`<Image>` component from `next/image`), image zoom transitions, and image assets from the project card component.
- Remove the text description from the card component to create a clean, modern, visual-first presentation.
- Decouple the video player from repository navigation by converting the outer card to an `<article>` container so visitors can interact with video controls without navigating away.
- Provide a robust YouTube URL parser supporting shortlinks (`youtu.be`) and standard watch links (`youtube.com/watch?v=...`), embedding via privacy-enhanced `youtube-nocookie.com`.
- Provide an intentional, aesthetic fallback panel when `project.video` is not present.

**Non-Goals:**
- Removing the `description` field from `src/constant/projects_list.ts` data model (it will remain in the data for metadata/SEO/documentation, but will not be rendered on the card).
- Building custom video player controls (we leverage the native YouTube player API/iframe controls to preserve familiar controls, closed captioning, and quality switching).
- Altering the section header, navigation anchors, or surrounding page sections.

## Decisions

### Decision 1: Removal of Static Image Elements and Imports
- **Choice**: Remove `Image` from `next/image` in `src/components/sections/projects.tsx`, eliminating all static screenshot rendering, fixed image aspect wrappers, and image scale transform hover rules (`group-hover:scale-105`).
- **Rationale**: The card is transitioning entirely to live demonstration videos. Retaining dead image tags or unused Next.js Image components adds layout confusion and unneeded bundle overhead.

### Decision 2: Card Container Element vs Wrapping Link
- **Choice**: Convert the outer card container from a Next.js `<Link>` element to an `<article>` container, placing dedicated repository links on the project title and the outbound icon affordance.
- **Rationale**: Embedding an interactive `<iframe>` (YouTube player) inside an HTML anchor (`<a>` tag) violates HTML specifications and causes click events intended for video controls (play, pause, seek, volume) to bubble or be captured as anchor clicks, abruptly navigating the user to GitHub.
- **Alternative Considered**: Wrapping the card in an anchor with a thumbnail and opening a modal on click. Rejected because the requirement asks to display the demonstration video directly inside the card component.

### Decision 3: YouTube Embed Resolution, Privacy Mode, and Autoplay Preview
- **Choice**: Implement a helper function `getYouTubeEmbedUrl(url?: string, options?: YouTubeEmbedOptions): string | null` in `src/lib/video.ts` that extracts the 11-character video ID from `youtu.be/<id>` or `youtube.com/watch?v=<id>` and returns `https://www.youtube-nocookie.com/embed/${videoId}` configured by default with `autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1`.
- **Rationale**: `youtube-nocookie.com` avoids placing third-party tracking cookies until the user interacts with the video. Muted autoplay (`mute=1`) satisfies modern browser autoplay security policies, while `loop=1` and `playlist` ensure the preview video loops continuously once loaded.
- **Alternative Considered**: Full URL string concatenation without validation. Rejected because differences in YouTube share URLs (query parameters, timestamp params) could break the embed.

### Decision 4: 2-Column Grid and Horizontal Card Design
- **Choice**:
  - **Grid**: Change layout from 3 columns to 2 columns on tablet and desktop (`grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8`).
  - **Card Proportions**: Adopt horizontal card dimensions (card width ~540px, card height ~370px, ratio ~1.43 : 1) where the 16:9 (`aspect-video`) embedded video occupies ~75–80% of the card surface area.
  - **Metadata Strip**: A compact bottom strip featuring the project title with outbound arrow affordance on top, followed by technology tag chips.
  - **Card Frame**: Sleek glassmorphism (`bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-4 sm:p-5 hover:border-cyan-glow/30 hover:bg-slate-800/40 transition-all duration-300 shadow-xl shadow-black/30`).
- **Rationale**: Expanding each card's width in a 2-column grid gives the demonstration video maximum prominence while making the overall card feel expansive and cinematic.

### Decision 5: Fallback Panel for Projects Without Video
- **Choice**: Render an intentional fallback panel matching the 16:9 frame with a linear gradient background (`from-slate-900 via-midnight to-slate-950`), a cyan accent badge with the `Terminal` icon, and clean text ("Demo in Repository").
- **Rationale**: Yahoo Finance MCP is an MCP server with no UI; presenting an intentional fallback panel maintains grid visual consistency and looks deliberate without rendering broken or missing media elements.

## Risks / Trade-offs

- **[Risk] Autoplay blocked by browsers** → **Mitigation**: Standardized `mute=1` parameter alongside `autoplay=1` and verified iframe `allow="autoplay"`, ensuring full compliance with browser autoplay policies.
- **[Risk] YouTube URL formats vary (e.g., query strings like `?si=...`)** → **Mitigation**: Regex parser extracts solely the 11-character alphanumeric video ID, ignoring extraneous parameters like `si` or tracking tags.
- **[Risk] Long project titles wrapping and pushing tags** → **Mitigation**: Arranged the metadata bottom strip into stacked rows (title on top, tag chips below) so varied title lengths never cause awkward wrapping or layout clipping.
