## 1. Verify recorded behavior against source

- [x] 1.1 Audit `page-shell` and `design-system` specs against `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, and `src/components/ui/header.tsx`; verify every scenario describes behavior the code actually produces, and correct any scenario that does not
- [x] 1.2 Audit `cinematic-background` spec against `src/components/ui/hybrid-background.tsx`; verify the fixed backdrop, gradient overlay, upward star drift, opacity twinkle, and both accent glows are all present as described
- [x] 1.3 Audit `hero`, `about`, and `skills` specs against their section files; verify all thirteen skill entries, the three group labels, the four hero content facts, and the about narrative claims match the rendered copy verbatim
- [x] 1.4 Audit `featured-projects` and `contact` specs against `src/components/sections/projects.tsx`, `src/constant/projects_list.ts`, and `src/components/sections/contact.tsx`; verify the three baseline projects, the five entry fields, and the three contact actions match
- [x] 1.5 Reproduce each of the five known deviations at the file and line stated in design.md; confirm the line references are still accurate and update any that have shifted

## 2. Verify the documented architecture

- [x] 2.1 Verify the D1 stacking table against the prerendered production output: backdrop root at `-z-30`, all three non-content layers carrying `pointer-events-none`, `main` at `z-20`, sections at `z-10`, header at `z-50` — all confirmed present in `.next/server/app/index.html`. A live-browser click test was not run (no browser automation available in this environment); the pointer-events invariant is verified structurally rather than interactively
- [x] 2.2 Verify the D2 token claims by confirming `--color-midnight`, `--color-cyan-glow`, `--animate-fade-in-up`, and the `fade-in-up` keyframes are all declared inside the `@theme` block of `globals.css` and that no `tailwind.config.*` file exists in the repo
- [x] 2.3 Verify the D3 client boundary by grepping for `"use client"` across `src/`; confirm exactly two matches and confirm `contact.tsx` uses no hook, event handler, or browser API
- [x] 2.4 Verify the D7 unused-dependency claim by grepping for `clsx` and `tailwind-merge` imports across `src/`; confirm zero matches
- [x] 2.5 Verify the D9 coupling by confirming `next.config.ts` declares `images.qualities: [75, 90]` and that `quality={90}` in `hybrid-background.tsx` is the only non-default quality request in the codebase

## 3. Record the baseline build state

- [x] 3.1 Run `npm run lint` and record the exact result in design.md under a new "Baseline build state" subsection, including any warning about the `icon: any` annotation
- [x] 3.2 Run `npm run build` and record the exact result in the same subsection; if deviation 2 (empty image `src`) causes the build or prerender to fail, record the failure output verbatim and reclassify that deviation as build-breaking rather than render-breaking
- [x] 3.3 (not applicable — the build passes; see "Baseline build state" in design.md) If the build fails, verify the failure is caused solely by deviation 2 by temporarily supplying a placeholder image path locally, confirming the build passes, then reverting the change so no source file is modified by this change

## 4. Close out the change

- [x] 4.1 Answer the three Open Questions in design.md — unused `clsx` and `tailwind-merge`, the footer attribution wording, and whether `bg-main2.png` and `bg-main3.png` are still needed — replacing each with a recorded decision, or state explicitly that it remains deferred and why
- [x] 4.2 Confirm the eight capability paths in the proposal's Capabilities section each have a matching `specs/portfolio-site/<capability>/spec.md` file and that no spec file exists without a proposal entry
- [x] 4.3 Run `openspec validate document-portfolio-baseline --strict` and confirm it reports the change valid
- [x] 4.4 Create the follow-up change that fixes the five known deviations plus the two implementation findings from design.md, so the fix work is tracked before this change is archived; verify it appears in `openspec list`
- [x] 4.5 Confirm `git status` shows no modifications under `src/`, `public/`, or `package.json`, proving this change delivered documentation only
