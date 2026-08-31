## Context

See `proposal.md` — Why for motivation. The architecture this change edits is recorded in the archived `document-portfolio-baseline` change's `design.md`; its nine decisions (D1–D9) are referenced by number below rather than restated.

Three constraints shape every decision here:

- **The site has no tests.** There is no harness to add a regression test to, and adding one is out of scope. Verification is therefore `npm run lint`, `npm run build`, and named manual checks. Every fix below is chosen partly for how cheaply it can be verified by eye or by the compiler.
- **Almost everything is a server component** (D3). A fix that forces a section to become a client component costs client JavaScript on a page that currently ships almost none, so that is the last resort, not the first.
- **Two dependencies are already installed and unused.** `framer-motion` is in `package.json` and imported nowhere. Reaching for it costs no new dependency; hand-rolling what it already does costs code.

The archived baseline's deviation table is the input list: 12 deviations, 4 implementation findings, 5 lint failures. This design groups them by mechanism rather than by severity, because several share one fix.

## Goals / Non-Goals

**Goals:**

- `npm run lint` and `npm run build` both pass clean, so CI can start catching what it currently cannot.
- Fix each defect at the layer where all its callers route through, not at the site the baseline audit happened to name.
- Add no new runtime dependency, and no new client component.
- Keep every fix small enough to verify without a test harness.

**Non-Goals:**

- The deferred PRD divergences: MDX pipeline, project case-study pages, shadcn UI, clipboard copy with toast, framer-motion scroll reveals. Each has a trigger condition recorded in the baseline design; none has fired.
- A Lighthouse audit. Several fixes here (deviations 5, 7, 8, 11, 12) move accessibility and performance numbers, so measuring before them is wasted work. Measurement is its own follow-up.
- Adding a test framework.
- Redesigning anything. Where a fix has a visual consequence, it matches the existing treatment rather than introducing a new one.

## Decisions

### D1: Optional preview image with a designed fallback, not a fabricated screenshot

Decided with the owner. The Yahoo Finance MCP project is a server with no interface, so there is no honest screenshot to take. `image` becomes optional in the `Project` type, and the card renders a fallback panel — the existing slate-to-midnight gradient, an accent-tinted icon, at the same aspect ratio as a real preview — when the field is absent or empty.

This fixes deviation 2 at the layer all cards route through rather than at the one entry that exposed it, and it removes the need for any empty-string validation: an empty reference is no longer a defect, it is the fallback path. Future non-visual projects (a library, a CLI, another MCP server) get correct rendering for free.

*Alternatives considered.* Fabricating a graphic for the MCP server — rejected as misleading on a portfolio whose whole purpose is credible evidence. Dropping the project — rejected: it is the only agentic-AI example in the grid, and the baseline spec relies on the three projects together covering Computer Vision, LLM retrieval, and agentic tooling.

### D2: A declared `Project` type is the root-cause fix

Deviation 2's symptom was one empty string. Its cause is that `src/constant/projects_list.ts` exports an array with no type annotation, so nothing checks any entry (baseline D4). Declaring the type and annotating the export makes every required field — title, description, tags, repository URL — a compile error when missing or misspelled.

Note what this deliberately does not cover: with `image?: string`, an empty-string image still type-checks. That is intentional given D1 — the renderer handles it, so there is nothing left to catch. Reaching for a branded non-empty-string type to close a gap the fallback already covers would be machinery for its own sake.

### D3: `useSyncExternalStore` over the media query, after framer-motion's hook failed the test

Deviations 5 and 12 both need the starfield to know something about the environment.

This decision was originally made in favor of `framer-motion`'s `useReducedMotion`: the package was already installed and unused, and the hook was documented as subscribing to the media query. Browser verification of task 5.2 disproved that. Under framer-motion 12.34.0 the hook snapshots the preference once and never updates it, so enabling reduced motion mid-session left the starfield running, and disabling it again did not bring the starfield back. The media query itself was fine — a listener attached in the page received `change` events in both directions — so the hook, not the environment, was the fault. The same hook also caused a hydration mismatch, because it reported the real preference on the client's first render while the server had rendered the particles layer.

The implemented version subscribes to `window.matchMedia("(prefers-reduced-motion: reduce)")` through React's own `useSyncExternalStore`. It is the same size as the rejected `useState` plus `useEffect` shape, but it has no state-set inside an effect (which `react-hooks/set-state-in-effect` reports as an error) and its third argument gives the server a `false` snapshot, so the hydration render matches the markup the server produced and React corrects it immediately afterward. With nothing left importing `framer-motion`, the package was uninstalled — it was already unused at the baseline commit, so this is the same cleanup the `clsx` and `tailwind-merge` removals performed.

`hybrid-background.tsx` is already a client component (baseline D3), so the subscription adds no new client boundary. When reduced motion is on, the particles layer is not rendered at all — the static image, readability gradient, and accent glows remain, so the backdrop still reads as a night sky, which is what the spec asks for.

*Alternatives considered.* A CSS-only `@media (prefers-reduced-motion)` rule cannot help: the starfield is canvas-drawn, so CSS cannot stop its animation loop. Installing a dedicated media-query hook package — rejected, React ships the primitive this needs.

### D4: tsparticles' own `responsive` option for mobile density

Deviation 12 is a platform feature, not a coding problem. tsparticles accepts a `responsive` array that overrides options below a given width, so the particle count drops on small viewports through configuration rather than through a resize listener and a re-render.

This keeps the fix inside the options object that already describes the starfield, next to the values it modifies.

*Alternatives considered.* Deriving the count from a width hook — more code, and it re-renders the canvas on resize.

### D5: Wire the loaded monospace family into the theme rather than dropping it

Deviation 7 has two valid resolutions: apply `Geist_Mono` or stop loading it. Applying it wins, because the hero name's `font-mono italic` is a deliberate design choice (baseline D2) and currently renders in whatever generic monospace the platform supplies — so the design intent is already there and simply not being honored.

The fix is a `--font-mono` token in the `@theme` block pointing at the existing `--font-geist-mono` variable, which makes Tailwind's `font-mono` utility resolve to the loaded family everywhere it is used.

That token alone was not enough, and static inspection of the built CSS did not reveal why. The compiled stylesheet contained both `--font-mono: var(--font-geist-mono), ui-monospace, monospace` and `.font-mono { font-family: var(--font-mono) }`, yet in the browser the hero name still computed to the sans family and no element on the page resolved to Geist Mono. The cause is variable scope: `@theme` emits its tokens on `:root`, which is the `html` element, while `next/font`'s generated class — the only thing that defines `--font-geist-mono` — was applied to `body`. A custom property whose `var()` reference is not in scope is invalid at computed-value time, so `--font-mono` inherited down as an empty value and every `font-mono` utility silently fell back to the inherited sans face.

Moving the two `next/font` variable classes from `body` to `html` in `layout.tsx` puts the font variables in the same scope as the token that consumes them. The presentational classes stay on `body`. This is the kind of defect only a running browser surfaces — the CSS is present and correct in the bundle, and it is the cascade, not the stylesheet, that drops it.

### D6: One global `:focus-visible` rule, not per-component focus classes

Deviation 8 is absent behavior across every interactive element, so fixing it per component means touching every component and leaving the next one to be added uncovered. A single `:focus-visible` rule in `globals.css` covers links, buttons, and anything focusable added later.

`:focus-visible` rather than `:focus` is what gives the spec's "keyboard yes, pointer no" behavior — the browser decides based on input modality, which is why the spec can require it without the site tracking input types itself.

The indicator needs to stay visible on both the filled cyan primary pill and dark glass surfaces. An outline with an offset satisfies both: offset separates it from the element's own edge on the glass panels, and an outline outside the fill stays visible against the cyan pill where a border or ring-inside would be swallowed.

*Alternatives considered.* Per-component `focus-visible:` utilities — rejected, since it is the same rule repeated 20 times with a gap for every future element. A `ring` utility — works, but Tailwind's ring renders as a box-shadow that the glass panels' own shadows compete with.

### D7: Wrap the whole card in one link; the arrow becomes decoration

Deviations 4 and 9 are one defect: the card is not a single coherent target. The `Link` currently opens inside the card and closes before the tag row, and the `ArrowUpRight` sits in a nested layout that reads as its own control.

Moving the `Link` to wrap the entire card body fixes both — every click inside the card follows one destination — and adding `target="_blank"` with `rel="noopener noreferrer"` stops a repository from replacing the portfolio in the recruiter's tab.

One consequence to get right: the arrow must be marked as decoration rather than left looking interactive, since it is now inside the link rather than beside it. It stays as a visual affordance on the card link, not a second target.

### D8: `rel="noopener noreferrer"` on all four `target="_blank"` links

Deviation 10 covers three existing links (LinkedIn, GitHub, the hero resume) and D7 adds a fourth. Current browsers imply `noopener` for `target="_blank"`, so the practical exposure is low — but the PRD requires both attributes explicitly, it is one attribute per link, and relying on an implied default is a worse contract than stating it.

The hero resume link is included even though no hero spec requirement changed: the spec never specified link attributes there, so this is implementation work tracked in tasks rather than a spec delta.

### D9: Accessible names on the two contact icons that lack them

Deviation 11: the email action carries `aria-label`, its two neighbours do not, so one row of three identical-looking controls announces inconsistently. Two `aria-label` attributes, matching the pattern already established one element over.

### D10: Cleanup items, and why each is safe

| Item | Fix | Why it is safe |
|---|---|---|
| `icon: any` (lint error) | `IconType` from `react-icons` | The library's own type for exactly this value |
| 3 unescaped apostrophes (lint errors) | `&apos;` in JSX text | Rendered output is identical |
| Unused `Container` import (lint warning) | Delete | Never referenced |
| `"use client"` in `contact.tsx` | Delete | No hook, handler, or browser API in the file (baseline D3); makes it a server component and drops its client bundle |
| Dead `--foreground` property | Delete | Outranked by `body`'s own utility class, so it never painted |
| Profile image 600px intrinsic in a 384px frame | Add a width utility | Currently correct only because `overflow-hidden` crops it |
| `clsx`, `tailwind-merge` | Uninstall | Zero imports; owner confirmed |
| `bg-main2.png`, `bg-main3.png` | Delete | Unreferenced; owner confirmed dead |
| PRD pointer note | Add note at top of `portfolio_website_prd.md` | Planned in the baseline migration plan |

## Risks / Trade-offs

- **No test catches a regression in any of this** → Inherent to a repo with no harness. Mitigated by choosing fixes the compiler or linter can verify (D2, D10) and by leaving named manual checks in tasks for the rest. The specs' scenarios are written so each is checkable by hand.
- **The reduced-motion subscription is verified only by media-query emulation** → Emulation drives the same code path a real preference change drives, and the check confirmed both directions plus a fresh load. A real operating-system toggle was not exercised.
- **The fallback panel could read as a broken image** → The spec makes "recognisably deliberate" a requirement rather than leaving it to taste. It reuses the existing gradient and accent treatment, so it looks like the site rather than like a failure.
- **A global `:focus-visible` rule may collide with a future component's own focus styling** → Acceptable: a component that needs different focus treatment can override one rule, which is easier than discovering that 20 components each need the rule added.
- **Deviation 2's fix removes the pressure to add real screenshots** → The fallback is correct for genuinely non-visual projects, but it should not become the default for projects that do have a UI. Worth a note in the project list rather than a mechanism.
- **Uninstalling three dependencies touches the lockfile** → Trivially reversible, and nothing imports them. `framer-motion` joined `clsx` and `tailwind-merge` once D3's implementation stopped using it; all three were already unused at the baseline commit.

## Migration Plan

No data migration, no deployment gate. The change is a set of independent edits to a statically generated site.

1. Fix in the order tasks specify: type and data layer first (D1, D2), then the components that consume it (D7), then the cross-cutting styles (D5, D6), then cleanup (D10). The type change surfaces any entry problem before component work starts.
2. Verify with `npm run lint` and `npm run build`, both of which must pass clean — the stated goal of the change. Then verify the rendering, focus, and reduced-motion scenarios in a browser against `npm run dev`; two defects in this change were invisible to both the compiler and the bundle and only appeared there.
3. Rollback is `git revert`. Every edit is source-local; the only non-source changes are two deleted PNGs and three removed dependencies, all restored by the same revert plus `npm install`.
4. Archive after verification so the six delta specs sync into `openspec/specs/portfolio-site/`, replacing the deviation scenarios with their regression-guard forms.
