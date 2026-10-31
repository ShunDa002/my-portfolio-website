# Tasks

## 1. Project Model and YouTube Embed Utilities

- [x] 1.1 Verify `Project` type in `src/constant/projects_list.ts` to ensure `video?: string` is defined and all projects conform to the schema; verify with `npx tsc --noEmit`
- [x] 1.2 Implement a YouTube URL parsing helper (`getYouTubeEmbedUrl`) to extract the YouTube video ID from `youtu.be` and `youtube.com/watch` formats and generate `https://www.youtube-nocookie.com/embed/<id>` configured with autoplay preview query parameters (`autoplay=1&mute=1&loop=1&playlist=<id>&playsinline=1`); verify with unit test cases

## 2. Card Redesign and Video Display in Projects Section

- [x] 2.1 Refactor the project card structure in `src/components/sections/projects.tsx` from an outer `<Link>` component to a card container (`<article>`), providing dedicated links to `project.githubLink` via the project title and outbound arrow affordance
- [x] 2.2 Completely remove all static image rendering, `Image` component imports from `next/image`, and image hover transforms from `src/components/sections/projects.tsx`
- [x] 2.3 Implement the responsive 16:9 YouTube video player iframe (`aspect-video`, screen-reader `title`, autoplay permissions) configured to autoplay upon website load, and render a styled fallback panel when `project.video` is missing or invalid
- [x] 2.4 Remove the project description paragraph from the rendered card markup in `src/components/sections/projects.tsx`
- [x] 2.5 Re-design grid to 2 cards per row default, horizontal card proportions with dominant video (~75–80% of card surface), and compact metadata strip with dark slate and cyan styling

## 3. Verification and Visual Validation

- [x] 3.1 Run `npm run build` or `npx tsc --noEmit` and `npm run lint` to verify that the build succeeds without TypeScript or ESLint errors
- [x] 3.2 Verify rendered project cards in the running development server, ensuring no static image elements exist, embedded preview videos play automatically without triggering link navigation, descriptions are absent, and fallback displays correctly for projects without video
