# Design

## Context

The portfolio is built on Next.js 16 (App Router), React 19, and Tailwind CSS v4. The visual language follows a strict dark cinematic aesthetic inspired by Makoto Shinkai's artistry: deep midnight background (`#020617`), vibrant cyan glow accent (`#22d3ee`), translucent glass surface treatments (`backdrop-blur`, slate borders), and authored `:focus-visible` outlines.

Presently, interactive and visual elements across the sections (`hero.tsx`, `about.tsx`, `skills.tsx`, `projects.tsx`, `contact.tsx`, `wiki-section.tsx`) and wiki features (`WikiDetailPanel.tsx`, `WikiFailureState.tsx`, `WikiGraphView.tsx`) are implemented using custom inline HTML elements (`<button>`, `<a>`, `<div>`, `<article>`). There is no centralized UI primitive library or unified Radix/WAI-ARIA foundation.

See `proposal.md` for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Establish Shadcn UI component primitives (`button.tsx`, `badge.tsx`, `card.tsx`, `aspect-ratio.tsx`, `separator.tsx`, `scroll-area.tsx`, `alert.tsx`, `tooltip.tsx`) under `src/components/ui/` with `src/lib/utils.ts` (`cn`).
- Configure `components.json` compatible with Tailwind CSS v4 and the Next.js App Router structure.
- Refactor all existing component implementations to replace ad-hoc markup with Shadcn primitives wherever applicable.
- Preserve the exact Makoto Shinkai aesthetic, two button forms (cyan glow pill and secondary glass pill), responsive breakpoints, and animations.
- Preserve all existing DOM selectors, test IDs (`data-testid`), and accessibility attributes so all Playwright test suites pass.

**Non-Goals:**
- Adding a theme toggle or light mode (the site commits to a single dark theme).
- Refactoring the particle/canvas engine in `hybrid-background.tsx` or force simulation SVG nodes in `WikiGraphView.tsx`.
- Modifying wiki data fetch pipelines, parsing, or markdown structures.

## Decisions

### Decision 1: Tailwind CSS v4 & Shadcn Primitives Setup
- **Choice**: Create `components.json` declaring Next.js App Router path aliases (`@/components/ui` and `@/lib/utils`) with Tailwind CSS v4 integration. Provide `cn()` helper in `src/lib/utils.ts` using `clsx` and `tailwind-merge`. Install `@radix-ui/react-slot`, `class-variance-authority`, and needed Radix primitives.
- **Rationale**: Keeps the codebase aligned with modern shadcn/ui patterns while leveraging Tailwind CSS v4's CSS `@theme` tokens.
- **Alternatives considered**: Manually hand-rolling classes without CVA (rejected: defeats standardizing on shadcn/ui).

### Decision 2: Button Component Variants and `asChild` Pattern
- **Choice**: In `src/components/ui/button.tsx`, extend CVA variants with:
  - `primary`: Filled cyan glow pill (`rounded-full bg-cyan-glow text-midnight font-semibold shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]`).
  - `secondary` / `glass`: Glass pill (`rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50 text-slate-200 hover:bg-slate-800/50 hover:border-cyan-glow/30`).
  - `ghost`, `outline`, `icon`: Sleek dark slate variants for social links, window actions, and graph controls.
  - Support `asChild` using `@radix-ui/react-slot` so `<Button asChild><Link href="...">...</Link></Button>` renders a clean, accessible `<a>` tag without nested buttons.
- **Rationale**: Implements the site's "Two button forms" design system requirement via standard Shadcn components.
- **Alternatives considered**: Default Shadcn button styling (square corners, neutral colors) - rejected because it violates the site's design system.

### Decision 3: Glass Surface Architecture via `Card`
- **Choice**: Implement `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, and `CardDescription` in `src/components/ui/card.tsx` with default translucent dark glass styles (`bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl`).
- **Rationale**: Standardizes content panels in `about.tsx`, `projects.tsx`, `wiki-section.tsx`, and `WikiDetailPanel.tsx` under a unified component hierarchy.
- **Alternatives considered**: Multiple independent panel abstractions (rejected: duplicates markup).

### Decision 4: Badge Component for Skills, Tags, and Status
- **Choice**: Implement `Badge` in `src/components/ui/badge.tsx` with variants for chips (project tech tags), rounded-full pills (skill badges and wiki classification badges), and alert status badges.
- **Rationale**: Unifies small chip elements with consistent padding, borders, and hover effects.

### Decision 5: AspectRatio for Project Demonstration Videos
- **Choice**: Use `@/components/ui/aspect-ratio` (`@radix-ui/react-aspect-ratio`) with `ratio={16 / 9}` for video iframe wrappers in `src/components/sections/projects.tsx`.
- **Rationale**: Ensures guaranteed 16:9 aspect ratio and prevents cumulative layout shifts while preserving iframe parameters.

### Decision 6: Wiki Section, Detail Panel, and Graph View Refactoring
- **Choice**:
  - `wiki-section.tsx`: Window frame container refactored to `Card`; header badge to `Badge`; expand button to `Button asChild`.
  - `WikiDetailPanel.tsx`: Container uses `Card` / overlay frame; scroll area uses `ScrollArea`; actions use `Button`; metadata tags use `Badge`; dividers use `Separator`.
  - `WikiFailureState.tsx`: Container uses `Alert` / `Card`; action links use `Button`.
  - `WikiGraphView.tsx`: Zoom controls use `Button variant="ghost" size="icon"`; zoom divider uses `Separator`; legend uses `Card`.

## Risks / Trade-offs

- **[Risk] Nested Interactive Elements**: Wrapping `<Link>` inside `<Button>` without `asChild` creates invalid HTML (`<button><a>...</a></button>`) and causes hydration errors.
  → *Mitigation*: Always use `<Button asChild><Link ...>...</Link></Button>` across all navigation and outbound link call sites.
- **[Risk] Selector and Test Breakage**: Existing Playwright tests check for `#hero`, `#about`, `#skills`, `#projects`, `#wiki`, `#contact`, `[data-testid="wiki-window-frame"]`, `button[aria-label="Zoom in"]`, etc.
  → *Mitigation*: Retain all existing IDs, data-testid attributes, and aria-labels on migrated Shadcn components.
- **[Risk] Style/Aesthetic Degradation**: Generic Shadcn components typically have light/neutral themes.
  → *Mitigation*: Ensure all Shadcn primitives in `src/components/ui/` are tuned to the dark midnight ground, cyan glow accents, and translucent slate glass borders.
