# Tasks

## 1. Setup & UI Primitive Foundation

- [x] 1.1 Install dependencies (`clsx`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/react-slot`, `@radix-ui/react-aspect-ratio`, `@radix-ui/react-separator`, `@radix-ui/react-scroll-area`) and verify installation succeeds in `package.json`
- [x] 1.2 Create `components.json` and `src/lib/utils.ts` with `cn()` helper and verify TypeScript resolves the helper cleanly
- [x] 1.3 Implement `src/components/ui/button.tsx` with `primary` (cyan glow pill), `secondary` (glass pill), `ghost`, `outline`, and `icon` variants supporting `asChild`, and verify module exports
- [x] 1.4 Implement `src/components/ui/card.tsx` (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) styled with translucent glass surfaces, and verify module exports
- [x] 1.5 Implement `src/components/ui/badge.tsx` with chip and rounded-full pill variants, and verify module exports
- [x] 1.6 Implement `src/components/ui/aspect-ratio.tsx`, `separator.tsx`, `scroll-area.tsx`, and `alert.tsx`, and verify all primitive exports compile

## 2. Page Sections Migration

- [x] 2.1 Migrate Hero section calls-to-action in `src/components/sections/hero.tsx` to Shadcn `Button` (`asChild`) and verify primary glow and secondary glass buttons render with link targets
- [x] 2.2 Migrate About section bio panel in `src/components/sections/about.tsx` to Shadcn `Card` and verify glass surface presentation
- [x] 2.3 Migrate Skills section `SkillPill` items in `src/components/sections/skills.tsx` to Shadcn `Badge` and verify icon alignment and hover styling
- [x] 2.4 Migrate Featured Projects in `src/components/sections/projects.tsx` (card container to `Card`, tags to `Badge`, video player to `AspectRatio`, and title link to `Button`/link primitive) and verify video playback and link navigation
- [x] 2.5 Migrate Contact action buttons in `src/components/sections/contact.tsx` to Shadcn `Button` (`size="icon"`, `asChild`) and verify Mail, LinkedIn, and GitHub links
- [x] 2.6 Migrate Header navigation and Wiki Graph badge in `src/components/ui/header.tsx` to Shadcn `Button` / `Badge` and verify fixed navbar layout

## 3. Wiki Features Migration

- [x] 3.1 Migrate Wiki Section window frame, node counter, and action buttons in `src/components/sections/wiki-section.tsx` to Shadcn `Card`, `Badge`, and `Button` and verify frame width and expand navigation
- [x] 3.2 Migrate Wiki Detail Panel in `src/components/wiki/WikiDetailPanel.tsx` to Shadcn `Card`, `ScrollArea`, `Badge`, `Button`, and `Separator` and verify attribute rendering and Escape key dismissal
- [x] 3.3 Migrate Wiki Failure State in `src/components/wiki/WikiFailureState.tsx` to Shadcn `Alert` / `Card` and `Button` and verify error/rate-limit rendering
- [x] 3.4 Migrate Wiki Graph View floating controls and legend in `src/components/wiki/WikiGraphView.tsx` to Shadcn `Button`, `Separator`, and `Card` and verify zoom/pan controls

## 4. Verification & Testing

- [x] 4.1 Run TypeScript type check (`npx tsc --noEmit`) and ESLint (`npm run lint`) and verify clean output with zero warnings or errors
- [x] 4.2 Run Playwright test suite (`npx playwright test`) and verify all tests in `tests/page-shell-scenarios.spec.ts` and `tests/wiki-section.spec.ts` pass
