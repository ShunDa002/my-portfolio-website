# Tasks

## 1. Section Component and Window Shell

- [x] 1.1 Create `src/components/sections/wiki-section.tsx` with section anchor `id="wiki"`, section heading, and subtitle matching the design system of existing sections. Verify the component exports cleanly and renders expected markup.
- [x] 1.2 Implement the framed window container within `wiki-section.tsx` occupying 70% of screen width (`w-[70vw] max-w-[70vw] mx-auto`) with macOS-style window dots, title ("LLM Wiki Knowledge Vault"), status indicator, and top-right expand icon button (`Maximize2`) linking to `/wiki` with an accessible `aria-label`. Verify the window width matches 70% screen width and the link destination is `/wiki`.
- [x] 1.3 Add inline fallback handling in `wiki-section.tsx` for error or empty responses from `getWikiGraph()`, rendering an informative message and GitHub link without blocking the rest of the page. Verify fallback state displays properly when upstream retrieval fails.

## 2. Embedded Graph Display and Zoomability

- [x] 2.1 Adjust `src/components/wiki/WikiGraphView.tsx` with an optional `isEmbedded` prop or embedded styling so controls, legend, and graph canvas stay neatly contained inside the framed window without overflowing. Verify the graph renders nodes and edges correctly within container bounds.
- [x] 2.2 Embed `WikiGraphView` inside the window in `wiki-section.tsx` and verify zoom controls, mouse wheel zoom, and drag/pan interactions smoothly scale and translate the graph within the window frame without scrolling the webpage.
- [x] 2.3 Verify node hover, focus, and keyboard navigation within the embedded window maintain neighborhood emphasis and accessibility.

## 3. Page Integration & Navigation

- [x] 3.1 Mount `WikiSection` in `src/app/page.tsx` between `Projects` and `Contact`. Verify root page renders sections in order: Hero, About, Skills, Projects, Wiki Graph, Contact.
- [x] 3.2 Update existing page-shell scenario tests in `tests/page-shell-scenarios.spec.ts` to account for the new wiki graph section in the root page scrolling flow. Verify updated scenarios pass.

## 4. End-to-End Verification & Build Checks

- [x] 4.1 Create Playwright E2E tests in `tests/wiki-section.spec.ts` covering section rendering on the root page, window header and expand icon click redirecting to `/wiki`, graph zoomability, and error containment. Verify `npx playwright test` passes.
- [x] 4.2 Run `npm run build`, `npm run lint`, and `npx tsc --noEmit` to confirm zero TypeScript, ESLint, or Turbopack build errors.
