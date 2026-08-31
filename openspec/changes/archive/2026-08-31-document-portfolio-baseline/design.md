## Context

The site is a shipped Next.js 16.1.6 App Router application: 12 source files, roughly 550 lines, no tests, no CI. It was built from `portfolio_website_prd.md` in two informal phases (static UI, then background animation) and deviates from that PRD in several structural ways. See `proposal.md` — Why for the motivation behind capturing it now.

This design document is unusual in that the architecture already exists. Its job is not to propose an implementation but to record the as-built architecture and the reasoning behind the divergences, so that the eight specs in `specs/portfolio-site/` have a technical counterpart explaining *how* the required behavior is produced. Everything below was derived by reading the source, not the PRD.

Constraints that shaped the existing build:

- Tailwind CSS v4 with the CSS-first `@theme` directive. There is no `tailwind.config.js` — design tokens live in `src/app/globals.css`.
- React 19 with the App Router's server-component default. Client-side JavaScript is a cost the site pays only where an animation library forces it.
- Static hosting target (Vercel). No database, no API routes, no environment variables, no runtime data fetching.
- Single maintainer, occasional edits. Anything that adds a build step or a content pipeline has to justify itself against "edit one TypeScript file and redeploy".

## Goals / Non-Goals

**Goals:**

- Record the layer and stacking architecture, since it is the one part of the site where an incorrect change silently breaks everything (content behind background, or background eating clicks).
- Record where design tokens live and how the animation utility is defined, because Tailwind v4's `@theme` placement is non-obvious and a future contributor will look for a config file that does not exist.
- Record the server/client component boundary and why it falls where it does.
- Record the project data contract and why it is a TypeScript module rather than the MDX pipeline the PRD specified.
- Give each PRD divergence a stated rationale, so a future reader can tell a deliberate simplification from an unfinished task.
- Locate the five known deviations from the specs at file and line, and classify each as defect or gap.

**Non-Goals:**

- Fixing anything. No file under `src/` is touched by this change.
- Re-deciding the divergences. This records the decisions as they stand; revisiting them (adding MDX, adding case-study pages) is a separate change with its own proposal.
- Prescribing a test strategy. The site has no tests; adding them is out of scope here.
- Performance measurement. No Lighthouse run is part of this change; the PRD's 85+/90+ targets remain unverified.

## Decisions

### D1: Three-layer fixed backdrop with an explicit stacking contract

The backdrop is one fixed, full-viewport element at `-z-30` containing three internal layers, mounted once in the root layout rather than per section.

| Layer | Stacking | Content |
|---|---|---|
| Backdrop root | `-z-30`, `fixed inset-0`, `overflow-hidden` | owns the midnight ground color |
| Static image | `z-0` inside backdrop | `/bg-main.png` via `next/image` with `fill`, `priority`, `quality={90}`, plus a top-to-bottom darkening gradient |
| Starfield | `z-10` inside backdrop, `pointer-events-none` | tsparticles-slim canvas |
| Accent glows | `z-10` inside backdrop, `pointer-events-none` | two blurred radial divs (cyan top, indigo bottom-right) |
| Content | `main` at `z-20`, sections at `z-10` within it | every page section |
| Navigation | `z-50`, `fixed` | glass nav pill |

Two invariants hold this together and both are easy to break by accident: the backdrop must stay on a negative z-index so `main`'s positive stacking context always wins, and every non-content layer must keep `pointer-events-none` so clicks reach the content above. `overflow-hidden` on the root is what stops the oversized glow divs from producing scrollbars.

*Alternatives considered.* A CSS `background-image` on `body` would have avoided a client component entirely, but gives up `next/image`'s format negotiation and responsive sizing on the single largest asset on the page. Per-section backgrounds were rejected because the PRD requires one continuous atmosphere across the scroll.

### D2: Tokens and keyframes in `@theme`, not a config file

Tailwind v4's CSS-first configuration means `src/app/globals.css` is the single source of design tokens. Two custom colors are registered — `--color-midnight: #020617` and `--color-cyan-glow: #22d3ee` — which Tailwind exposes as the utility families `bg-midnight`, `text-cyan-glow`, `border-cyan-glow/30`, and so on. The rest of the palette rides on Tailwind's stock `slate`, `cyan`, and `indigo` scales, so only the two brand-specific values needed registering.

The entrance animation is also declared inside `@theme`: `--animate-fade-in-up` plus its `@keyframes fade-in-up` block. This is what makes both `animate-fade-in-up` (the nav) and the arbitrary-value form `animate-[fade-in-up_0.8s_ease-out_0.2s_forwards]` (the hero's staggered elements) resolve.

The staggering pattern deserves a warning: an animated element is authored with `opacity-0` and relies on the keyframe's `forwards` fill to end visible. If the animation name is ever misspelled or the keyframe is removed, the element stays permanently invisible with no error anywhere. That fragility is the price of hand-rolled CSS staggering and is the strongest argument for eventually moving to the already-installed `framer-motion`.

*Alternatives considered.* A `tailwind.config.ts` with a `theme.extend` block is the v3 idiom and would work via the compat layer, but splitting tokens across two files for no gain is worse. Inline `style` objects for the stagger delays were rejected as less legible than the arbitrary-value utility.

### D3: Server components by default; exactly two client components

`src/app/page.tsx` and four of the five sections are server components and ship no JavaScript. Only two files carry `"use client"`:

- `hybrid-background.tsx` — genuinely required. `react-tsparticles` needs `useCallback` and a browser canvas.
- `contact.tsx` — **not** required. It declares `"use client"` but uses no hook, no event handler, and no browser API; its email address is a plain `const` and its actions are `mailto:` and external `Link`s. This is a leftover from the PRD's copy-to-clipboard design (see D5) and can be removed with no behavior change.

The header, hero, about, skills, and projects sections are all static markup with CSS-only hover and entrance effects, which is why the interactive-feeling site still ships almost no client JavaScript.

### D4: Project data as a typed-by-inference TypeScript module, not MDX

`src/constant/projects_list.ts` exports a plain array. `projects.tsx` maps over it. Adding a project means appending an object and dropping an image in `public/images/projects/`.

The PRD specified an MDX pipeline with frontmatter, a `lib/mdx.ts` reader, and `/projects/[slug]` case-study pages. That was not built, and for the current content volume — three projects, each already documented in its own repository README — the pipeline would add a content directory, an MDX toolchain, a frontmatter parser, and a dynamic route to serve three cards whose only outbound link is to GitHub. The array is the smaller thing that satisfies the spec requirement that adding a project must not require touching layout code.

Two consequences are worth stating plainly. First, the array has no explicit type annotation, so its shape is inferred per entry and nothing catches a missing or misspelled field — the empty `image: ""` on the third entry is exactly the class of error a declared `Project` type would have caught at build time. Second, the PRD's `category`, `featured`, `demoUrl`, and `order` fields do not exist; `featured` in particular is meaningless while every entry in the list is rendered.

*Alternatives considered.* MDX as specified — deferred, not rejected; it becomes the right call once a project needs a genuine case-study page with architecture diagrams and results, which is the point at which a card's 40-word description stops being enough. A JSON file was rejected because it loses the option of a compile-time type.

### D5: `mailto:` instead of copy-to-clipboard with a toast

The PRD required a Copy Email button firing a toast reading "Email copied to clipboard!". The shipped site uses a `mailto:` link.

`mailto:` takes one line, needs no client JavaScript, no clipboard permission, no toast component, and no toast provider in the layout — and it takes the recruiter further along: their mail client opens with the address already filled in, rather than handing them a string to paste somewhere themselves. The clipboard version's real advantage is narrow: it serves a visitor with no configured mail client. That is a genuine gap, just a small one, and the honest fix if it ever matters is to show the address as selectable text next to the icon so it can be read and copied manually — still no toast infrastructure required.

### D6: Icon sourcing split across two libraries

`react-icons/si` (Simple Icons) supplies technology brand marks in the skills section and the LinkedIn and GitHub glyphs in contact. `lucide-react` supplies generic UI icons: `MousePointerClick`, `FileDown`, `ArrowUpRight`, `Mail`.

The split is deliberate — Simple Icons has the brand marks Lucide does not carry, and Lucide's generic set is better drawn than Simple Icons' equivalents — but it does mean two icon dependencies. Both tree-shake per-import, so the bundle cost is proportional to the 17 icons actually used rather than to either library's full set.

The `SkillPill` helper in `skills.tsx` types its icon prop as `any`, which defeats strict mode at the one place a wrong value would be caught. `react-icons`' own `IconType` is the correct annotation and is a one-word fix.

### D7: No shadcn UI

The PRD named shadcn UI for buttons, cards, badges, and toast. None was installed. What the site actually needs from those four primitives is a rounded pill with a border and a hover transition — reachable in a single Tailwind class string. shadcn's value is its accessibility wiring for genuinely stateful components: dialogs, popovers, select menus, toasts. The site has none of those. Installing the CLI, the Radix peer dependencies, and a `components/ui` tree to reskin four static elements into transparency would have been more code to own, not less.

`clsx` and `tailwind-merge` are installed — they arrive as shadcn's usual companions and are conventionally wrapped in a `cn()` helper — but no such helper exists and neither package is imported anywhere. They are unused dependencies.

*Alternatives considered.* Installing shadcn purely for the toast, had the clipboard feature been built. D5 removed the need.

### D8: Fixed dark theme, no theme switching

`<html className="dark">` is set statically and never toggled. There is no `next-themes`, no toggle control, and no light palette. The `dark` class is effectively decorative: nothing in the codebase uses a `dark:` variant, because the single palette is applied unconditionally. The PRD lists a theme toggle as out of scope, so this is aligned; the class is simply a no-op worth knowing about before someone adds a `dark:`-prefixed utility and wonders why it always applies.

### D9: `images.qualities` whitelisting in `next.config.ts`

Next.js 16 requires image `quality` values to be declared in config before a component may request them. `next.config.ts` lists `[75, 90]` so that the backdrop's `quality={90}` is permitted; 75 is the framework default and is kept for every other image. Without the entry, the backdrop request fails rather than silently downgrading — which is the kind of coupling between a config array and a component prop that is invisible at the call site, so it is recorded here.

## Known deviations from the specs

The specs record these as scenarios describing current behavior; this table locates them and classifies severity. Fixing them is out of scope for this change.

Line references were re-verified against the working tree during the apply phase; deviations 1 through 4 had drifted from their originally recorded lines and are corrected below.

| # | Location | Deviation | Class |
|---|---|---|---|
| 1 | `src/components/sections/contact.tsx:33` | LinkedIn `href` is `"www.linkedin.com/in/tay-shon-da-74b208335"` with no scheme, so it resolves relative to the site origin and 404s | Defect — visitor-facing broken link on a primary contact path |
| 2 | `src/constant/projects_list.ts:24` → `src/components/sections/projects.tsx:31` | Third project has `image: ""`. Neither the build nor prerender fails: Next emits the `<img>` with no `src` and no `srcSet` at all, so the browser reserves the declared 1900×946 aspect box and paints nothing in it | Defect — a large empty frame on one of three cards, and it fails silently in CI |
| 3 | `src/components/sections/about.tsx:43` | Profile image `alt="Hero Image"` does not describe the photograph | Defect — accessibility, and the PRD names descriptive alt text explicitly |
| 4 | `src/components/sections/projects.tsx:26-53` | Card `Link` wraps image, title, and description but not the tag row; the `ArrowUpRight` affordance sits inside the link yet reads as a separate target | Inconsistency — confusing affordance, not a functional break |
| 5 | `src/components/ui/hybrid-background.tsx:39-83` | No `prefers-reduced-motion` branch; the starfield animates unconditionally | Gap — PRD requirement not implemented |
| 6 | `src/app/layout.tsx:18` | Metadata title is `"Portfolio | Engineering the Future"` and names no person; the PRD specifies a title carrying the owner's name | Defect — a search result or shared link cannot be attributed to the owner |
| 7 | `src/app/layout.tsx:13` + `src/app/globals.css:29` | `Geist_Mono` is loaded and its CSS variable is attached to `body`, but no rule ever consumes `--font-geist-mono`; the two `font-mono` usages resolve to the generic stack | Defect — a font is downloaded on every visit and changes nothing on screen |
| 8 | none — absent across `src/` | No focus styling is authored anywhere; every focus ring is the browser default, untuned for the dark palette | Gap — the PRD requires visible focus states |
| 9 | `src/components/sections/projects.tsx:26` | Card `Link` declares neither `target="_blank"` nor `rel`, so a repository replaces the portfolio in the current tab | Defect — navigates a recruiter away mid-review |
| 10 | `src/components/sections/contact.tsx:32,40`; `src/components/sections/hero.tsx:41` | Three links use `target="_blank"` with no `rel="noopener noreferrer"`; the PRD requires both attributes | Minor — current browsers imply the protection, so practical exposure is low |
| 11 | `src/components/sections/contact.tsx:31-45` | LinkedIn and GitHub actions carry no accessible name, so each is announced as an unlabelled link; the adjacent email action does carry `aria-label` | Defect — accessibility, and inconsistent within one row of three controls |
| 12 | `src/components/ui/hybrid-background.tsx:52-57` | Particle count is a flat 100 with no viewport-based reduction; the PRD requires lower density on mobile | Gap — PRD requirement not implemented |

Four implementation-level findings that are not spec deviations, since no externally visible behavior depends on them:

- `skills.tsx:18` — `icon: any` defeats strict mode at the one place a wrong value would be caught (see D6).
- `contact.tsx:1` — `"use client"` with no client-only API in the file (see D3).
- `globals.css:25` — `--foreground: #ededed` is dead. `body { color: var(--foreground) }` is an element-selector rule, and `body`'s own `text-slate-200` utility class outranks it on specificity, so the variable never paints.
- `about.tsx:44-46` — the profile image declares intrinsic dimensions of 600×600 inside a `max-w-sm` (384px) square frame with no width utility, so it renders oversized and is cropped by the frame's `overflow-hidden`. The result looks correct but is incidental rather than intended.

## Baseline build state

Recorded during the apply phase of this change against the working tree at the time of writing.

**`npm run build` — passes.** Next.js 16.1.6 with Turbopack, compiled in 5.9s, TypeScript clean, four static pages generated (`/` and `/_not-found`, each with its RSC payload). Both routes are prerendered as static content, confirming D4's claim that the site has no runtime data dependency.

Deviation 2 does not fail the build, which is worth stating plainly because it was the expected failure. Next resolves the empty `src` by emitting the third card's `<img>` with no `src` and no `srcSet` attribute at all:

```html
<img alt="Yahoo Finance MCP" width="1900" height="946" decoding="async" data-nimg="1" class="w-full h-auto object-cover ..."/>
```

The element keeps its declared 1900×946 dimensions, so the card reserves a full-width empty frame. This is the worst kind of defect for a portfolio: invisible to CI, visible to every recruiter.

**`npm run lint` — fails: 4 errors, 1 warning.**

| Location | Rule | Detail |
|---|---|---|
| `contact.tsx:16:12`, `contact.tsx:49:53`, `hero.tsx:10:14` | `react/no-unescaped-entities` | error — raw `'` in JSX text ("Let's Build Something Extraordinary", "Makoto Shinkai's Artistry", "Tay's Portfolio") |
| `skills.tsx:18:50` | `@typescript-eslint/no-explicit-any` | error — the `icon: any` annotation from D6 |
| `hybrid-background.tsx:7:15` | `@typescript-eslint/no-unused-vars` | warning — `Container` imported from `tsparticles-engine` and never used |

Two things follow from this. First, `next build` in Next.js 16 does not run ESLint, so a green build says nothing about lint state — the two commands must both be run. Second, the `icon: any` finding is an ESLint *error*, not the soft typing nit it was recorded as in D6; it fails `npm run lint` today.

The three unescaped-apostrophe errors and the unused `Container` import are new findings from this run. They are lint-only — no runtime behavior depends on them, so they are not spec deviations — and they belong in the follow-up change alongside the `icon: any` fix.

## Risks / Trade-offs

- **Specs record a defective baseline as fact** → Each deviation scenario says explicitly that the behavior is a known deviation rather than intent, so a fix updates the scenario rather than contradicting the spec. The table above is the tracked list.
- **The untyped project array will admit another bad entry** → Deviation 2 already happened. Declaring a `Project` type is the one-line prevention, deferred to the follow-up change (D4).
- **The hand-rolled stagger can hide content permanently** → An element authored `opacity-0` that never receives a working animation is invisible with no error. The design-system spec requires that an animated element's final state be fully visible; `framer-motion` is already installed if this needs to become structural (D2).
- **Documentation drifts from code** → Inherent to this change. Mitigated by keeping specs behavior-only, since observable behavior changes far less often than implementation. Line references in this document will go stale first, so they name the symbol alongside the line.
- **Deferred divergences read as permanent decisions** → Each is stated as deferred with its trigger condition: MDX when a project needs a real case-study page, shadcn when a stateful component appears, clipboard when a mail-client-less visitor matters.
- **Performance targets are unverified** → No Lighthouse run has been done, so the PRD's 85+ performance and 90+ accessibility targets are aspirational. Deviations 3 and 5 both count against accessibility. Measurement is a follow-up.

## Migration Plan

No deployment and no rollback. This change writes documentation only.

1. This change's delta specs are synced into `openspec/specs/portfolio-site/` at archive, making them the source of truth for current behavior.
2. `portfolio_website_prd.md` stays in the repo as historical intent. It is not deleted and not updated — the specs supersede it for anything about current behavior. A pointer note at its top saying so would prevent future confusion and is worth adding when the follow-up change lands.
3. A follow-up change addresses the five deviations plus the two implementation findings. It is small enough to be one change, and every item in it already has a spec scenario to verify against.

## Resolved Questions

All three questions raised while writing this document were answered by the owner during the apply phase. None affected the specs.

- **Unused `clsx` and `tailwind-merge` (D7)** → Remove both from `package.json` in the follow-up change. Nothing imports them, and the `cn()` helper they exist to support is a one-line write if it is ever needed.
- **Footer credit line** → Keep the wording as shipped. The follow-up escapes its apostrophe to clear the lint error and changes nothing else.
- **Unreferenced `public/bg-main2.png` and `bg-main3.png`** → Dead assets. Delete both in the follow-up change; only `bg-main.png` is referenced.
