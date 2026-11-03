# Proposal

## Why

The current Featured Projects card displays a static preview image and text description. For modern AI and full-stack projects, interactive YouTube video demonstrations convey actual capabilities and real-time workflows far more effectively than static screenshots or dense text blocks. Removing the static image content and description creates a cleaner, more visual-forward card design, while embedding YouTube demonstrations directly that autoplay on page load provides immediate proof of work without requiring visitors to navigate away. Furthermore, transitioning from a three-column to a two-column grid creates an expansive, horizontal card format where the demonstration video commands the center of attention.

## What Changes

- **Remove Project Image Content**: Completely remove static project image rendering, including `next/image` imports, image markup, image zoom hover transitions, and image-based thumbnail containers from the card component.
- **Replace Project Image with YouTube Video**: Embed interactive YouTube demonstration videos in project cards using each entry's `video` attribute, converting URLs (e.g., youtu.be, youtube.com/watch) into responsive 16:9 embedded players (`youtube-nocookie.com/embed/...`).
- **Autoplay Preview Mode**: Configure embedded videos to automatically begin playing upon website load in muted, looped preview mode (`autoplay=1&mute=1&loop=1&playlist=<id>&playsinline=1`).
- **Two-Column Default Layout**: Change the grid layout inside the Featured Projects section from three cards per row to two cards per row by default on tablet and desktop viewports (`grid-cols-1 md:grid-cols-2`).
- **Horizontal Card Re-Design**: Re-engineer the card geometry so card width is greater than card height, with the 16:9 demonstration video occupying the dominant portion (~75–80%) of the card surface, paired with a compact bottom metadata strip (title with outbound link and tech tags).
- **Graceful Video Fallback**: If a project has no video attribute (or an invalid URL), render an intentional, stylized fallback panel maintaining the site's dark glass and cyan accent aesthetic in place of the media element.
- **Remove Project Description**: Remove the multi-line text description from the card component to streamline card height and emphasize visual demonstration.
- **Re-design Card Component**:
  - Restructure the card container from a single wrapping `<a>` tag into a structured `<article>` component with distinct interactive boundaries, ensuring iframe video controls function smoothly without inadvertently triggering navigation.
  - Provide dedicated repository links via the project title and outbound arrow affordance.
- **Update Project Data Types & Usages**: Align the `Project` type in `src/constant/projects_list.ts` and `src/components/sections/projects.tsx` with video demonstration requirements.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `portfolio-site/featured-projects`: Updates project entry requirements and card presentation to completely remove static preview images and descriptions, embed interactive YouTube demonstration videos with autoplay preview, establish a two-column default grid layout with horizontal card proportions, and redesign the card structure and link affordances.

## Impact

- **UI Components**: `src/components/sections/projects.tsx` removes `Image` imports and static image handling, refactoring into a two-column responsive grid with a redesigned horizontal card layout and embedded autoplay preview player.
- **Helper Utilities**: `src/lib/video.ts` provides URL extraction and query parameter formatting for privacy-enhanced YouTube embeds with autoplay preview support.
- **Data & Types**: `src/constant/projects_list.ts` standardizes `video` attributes across project records.
- **Dependencies**: Uses standard YouTube embed iframe within React (no external heavy video libraries required).
- **Specs & Verification**: Updates `portfolio-site/featured-projects` specifications and verifies card rendering across viewports.
