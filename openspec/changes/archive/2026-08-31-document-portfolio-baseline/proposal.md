## Why

The portfolio website was built directly from `portfolio_website_prd.md` without spec artifacts, so the only record of intended behavior is a 1459-line PRD that no longer matches the code. The implementation deliberately diverged from the PRD in several places (no MDX pipeline, no shadcn UI, `mailto:` instead of copy-to-clipboard, CSS keyframes instead of framer-motion), and nothing captures which divergences were decisions and which were omissions. This change establishes the as-built behavior as versioned specs so future work has a trustworthy baseline to diff against instead of the stale PRD.

## What Changes

- Document the shipped site as eight capability specs under `openspec/specs/portfolio-site/`, derived from reading the 12 source files in `src/`, not from the PRD.
- Record the design system that actually exists in code: the Tailwind v4 `@theme` tokens (`--color-midnight`, `--color-cyan-glow`), the glass-panel pattern, the `fade-in-up` keyframe with its stagger delays, and the responsive breakpoint behavior per section.
- Record the three-layer background architecture (static image, tsparticles-slim starfield, decorative blur glows) including the particle parameters currently in use.
- Record the project data contract as it exists (`src/constant/projects_list.ts`: a plain untyped array) rather than the MDX frontmatter contract the PRD specified.
- Capture PRD requirements that were **not** implemented as explicit non-goals inside the relevant specs, so a later reader does not mistake them for regressions: MDX pipeline, `/projects/[slug]` case-study pages, shadcn UI primitives, copy-email button with toast, framer-motion scroll reveals, `prefers-reduced-motion` handling, Open Graph image, and the `category` / `featured` / `demoUrl` project fields.
- Record five defects found during the code review as known deviations in the affected specs, each pointing at the offending line. Fixing them is **out of scope** for this change and belongs in a follow-up.

No source code changes. No dependency changes. No breaking changes.

## Capabilities

### New Capabilities

- `portfolio-site/page-shell`: Root layout, global metadata, Geist font loading, the fixed glass nav header with its four anchor links, the single-page section order and vertical rhythm, and the `main` stacking context.
- `portfolio-site/cinematic-background`: The three-layer fixed background — priority-loaded `bg-main.png` with readability gradient, the tsparticles-slim starfield and its parameters, and the two decorative blur glows.
- `portfolio-site/design-system`: Color tokens, glassmorphism surface recipe, typography scale, button and pill variants, the `fade-in-up` animation contract with stagger timing, and responsive breakpoint rules.
- `portfolio-site/hero`: Full-viewport hero, the eyebrow / name / positioning copy hierarchy, and the two CTAs (anchor scroll to projects, resume PDF in a new tab).
- `portfolio-site/about`: Two-column bio and profile-image layout, the narrative content requirements (university, Agentic AI, FinTech, Computer Vision), and mobile stacking.
- `portfolio-site/skills`: Three labeled skill groups (AI & Computer Vision, Full Stack Web, DevOps & Cloud) rendered as icon pills that wrap, and the `react-icons/si` icon source.
- `portfolio-site/featured-projects`: The project data shape and its module location, the responsive 1/2/3-column card grid, and per-card content (image, title, description, tag badges, GitHub link).
- `portfolio-site/contact`: Email, LinkedIn, and GitHub actions, external-link safety attributes, and the page footer.

### Modified Capabilities

None. `openspec/specs/` is currently empty; every capability above is being documented for the first time.

## Impact

- **Artifacts written:** `openspec/specs/portfolio-site/*/spec.md` (8 new spec files) via this change's delta specs. No files under `src/` are touched.
- **Code read to derive the specs:** `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/components/ui/header.tsx`, `src/components/ui/hybrid-background.tsx`, `src/components/sections/{hero,about,skills,projects,contact}.tsx`, `src/constant/projects_list.ts`, `next.config.ts`.
- **Known deviations to be recorded (not fixed here):**
  - `src/components/sections/contact.tsx:39` — LinkedIn `href` is missing the `https://` scheme, so it resolves as a relative path and the link is broken.
  - `src/constant/projects_list.ts:22` — the Yahoo Finance MCP entry has `image: ""`, which `next/image` at `src/components/sections/projects.tsx:34` rejects at runtime.
  - `src/components/sections/about.tsx:47` — profile image `alt` reads "Hero Image", which does not describe the image.
  - `src/components/sections/skills.tsx:18` — `icon: any` bypasses TypeScript strict mode.
  - `src/components/sections/projects.tsx:29-51` — the card's `Link` wraps the image, title, and description but not the tag row, and the `ArrowUpRight` affordance sits inside a nested layout that reads as a second, separate link target.
- **Downstream:** unlocks `specs` and `design` artifacts for this change; the recorded non-goals and deviations become the natural starting point for follow-up changes.
- **Status of the PRD:** `portfolio_website_prd.md` stays in the repo as historical intent. Once these specs land, the specs are the source of truth for current behavior.
