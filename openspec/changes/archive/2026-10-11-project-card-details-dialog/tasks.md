# Tasks

## 1. Dialog Primitive Foundation

- [x] 1.1 Install `@radix-ui/react-dialog` dependency and verify clean installation in `package.json`
- [x] 1.2 Implement `src/components/ui/dialog.tsx` with Shadcn Dialog primitives (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`) styled with translucent dark glass styling and verify compilation via `npx tsc --noEmit`

## 2. Project Card & Details Dialog Implementation

- [x] 2.1 Refactor `src/components/sections/projects.tsx` to remove direct GitHub redirection from the card title, enable full-card click and keyboard activation, and manage active dialog state
- [x] 2.2 Implement the horizontal, video-dominant project details dialog displaying enlarged 16:9 demonstration video (or fallback panel), title, full narrative description, tags, and GitHub action button
- [x] 2.3 Verify dialog accessibility (focus trapping, Escape key dismissal, and close button) and responsive styling across mobile and desktop viewports

## 3. Verification & Testing

- [x] 3.1 Run TypeScript type check (`npx tsc --noEmit`) and ESLint (`npm run lint`) and verify zero errors
- [x] 3.2 Run Playwright test suite (`npx playwright test`) and verify all tests pass without regression
