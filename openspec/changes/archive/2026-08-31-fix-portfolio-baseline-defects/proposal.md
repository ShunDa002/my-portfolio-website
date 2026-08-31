## Why

`document-portfolio-baseline` documented the shipped portfolio as specs and, in doing so, found twelve deviations between the specs and the code plus four implementation-level findings and five lint failures. Two of the deviations are visitor-facing breakage on the paths that matter most to the site's purpose: the LinkedIn contact link 404s, and one of three project cards renders an empty image frame. Neither fails the build, so nothing will surface them except a recruiter noticing. The documentation change deliberately fixed nothing; this change fixes all of it.

## What Changes

**Visitor-facing defects**

- Add the missing `https://` scheme to the LinkedIn URL so the contact link resolves (deviation 1).
- Supply a preview image for the Yahoo Finance MCP project, or handle a missing image so the card renders without a dead frame (deviation 2).
- Replace the profile image's `alt="Hero Image"` with text describing the photograph (deviation 3).
- Make the whole project card one consistent link target rather than a link that covers image, title, and description but not the tag row (deviations 4 and 9), and give card links `target="_blank"` with `rel="noopener noreferrer"` so a repository no longer replaces the portfolio in the recruiter's tab.
- Add the owner's name to the metadata title (deviation 6).
- Add accessible names to the LinkedIn and GitHub contact actions, matching the email action that already has one (deviation 11).
- Add `rel="noopener noreferrer"` to the three existing `target="_blank"` links (deviation 10).

**Accessibility and performance gaps**

- Honor `prefers-reduced-motion` in the starfield (deviation 5).
- Reduce particle density on small viewports (deviation 12).
- Author visible focus styles tuned for the dark palette instead of relying on the browser default (deviation 8).
- Either apply the loaded monospace family or stop loading it — currently it is downloaded on every visit and never used (deviation 7).

**Code quality and cleanup**

- Replace `icon: any` with `IconType` from `react-icons` (lint error).
- Escape the three raw apostrophes in JSX text (lint errors).
- Remove the unused `Container` import from `hybrid-background.tsx` (lint warning).
- Remove `"use client"` from `contact.tsx`, which uses no client-only API.
- Declare an explicit `Project` type for the project list so a missing field is caught at build time — this is the root-cause fix for deviation 2, not just the symptom.
- Remove the dead `--foreground` custom property, which is outranked by `body`'s own utility class and never paints.
- Give the profile image a width utility so its 600px intrinsic size stops relying on the frame's `overflow-hidden` to crop it.
- Uninstall `clsx` and `tailwind-merge`, which nothing imports.
- Delete the unreferenced `public/bg-main2.png` and `public/bg-main3.png`.
- Add a note at the top of `portfolio_website_prd.md` pointing to `openspec/specs/portfolio-site/` as the source of truth for current behavior, as planned in the baseline change's migration plan.

Goal for the change: `npm run lint` and `npm run build` both pass clean.

## Capabilities

### Modified Capabilities

Every capability below already has a spec carrying a scenario that describes the defective behavior and marks it a known deviation. Each delta replaces that scenario with the corrected behavior.

- `portfolio-site/contact`: LinkedIn URL resolves; profile links carry accessible names and the safe-external-link attributes.
- `portfolio-site/featured-projects`: every entry renders a preview image; the card is one consistent link target opening in a new tab; entry fields are validated at build time.
- `portfolio-site/about`: profile image alt text describes the photograph.
- `portfolio-site/page-shell`: metadata title identifies the owner; monospace display text resolves to an intentional family.
- `portfolio-site/cinematic-background`: starfield respects reduced-motion and lowers density on small viewports.
- `portfolio-site/design-system`: focus indication is authored rather than inherited from the browser.

### New Capabilities

None. This change corrects behavior already specified by `document-portfolio-baseline`.

## Impact

- **Source files:** `src/components/sections/{contact,about,projects,hero}.tsx`, `src/components/sections/skills.tsx`, `src/components/ui/hybrid-background.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/constant/projects_list.ts`.
- **Assets:** one project preview image added under `public/images/projects/`; `public/bg-main2.png` and `public/bg-main3.png` deleted.
- **Dependencies:** `clsx` and `tailwind-merge` removed. Nothing added.
- **Docs:** pointer note added to `portfolio_website_prd.md`.
- **Prerequisite:** `document-portfolio-baseline` should be archived first so its specs are the baseline these deltas modify.
- **Not included:** the deferred PRD divergences (MDX pipeline, project case-study pages, shadcn UI, clipboard copy with toast, framer-motion scroll reveals) and the unrun Lighthouse audit. Each is its own change with its own trigger condition, recorded in that change's `design.md`.
