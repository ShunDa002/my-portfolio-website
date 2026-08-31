## 1. Data layer and project type

- [x] 1.1 Declare a `Project` type in `src/constant/projects_list.ts` — `title`, `description`, `tags`, `githubLink` required, `image` optional — and annotate the exported array as `Project[]`; verify `npx tsc --noEmit` passes
- [x] 1.2 Confirm the type actually catches a bad entry by temporarily deleting `title` from one entry, observing the compile error names it, then restoring the field; verify `npx tsc --noEmit` passes again afterward
- [x] 1.3 Change the Yahoo Finance MCP entry to omit `image` entirely rather than carrying an empty string; verify `npx tsc --noEmit` still passes, proving the field is genuinely optional

## 2. Project card rendering

- [x] 2.1 Add the fallback panel branch in `src/components/sections/projects.tsx`: render the designed panel when `project.image` is absent or empty, reusing the existing slate-to-midnight gradient with an accent-tinted icon at the same aspect ratio as a real preview; verify no `<img>` in `.next/server/app/index.html` lacks a `src` after a build
- [x] 2.2 Confirm the fallback reads as deliberate rather than as a failed image by viewing the projects section in a browser at desktop width; verify the third card's panel sits flush in the same frame as the two real previews and matches the site's glass and accent treatment
- [x] 2.3 Move the card's `Link` to wrap the entire card body including the tag row, so the whole card is one link target; verify in a browser that clicking a technology tag opens the repository
- [x] 2.4 Add `target="_blank"` and `rel="noopener noreferrer"` to the card link; verify every card link in the prerendered HTML carries both attributes and that following a card leaves the portfolio open in the original tab
- [x] 2.5 Confirm the `ArrowUpRight` affordance is decoration inside the single link rather than a competing control; verify it carries `aria-hidden` in the prerendered HTML and that clicking it opens the same repository

## 3. Contact, metadata, and about fixes

- [x] 3.1 Add the missing `https://` scheme to the LinkedIn URL in `src/components/sections/contact.tsx`; verify the prerendered HTML shows an absolute URL and that the link opens the profile rather than a site 404
- [x] 3.2 Add `aria-label` to the LinkedIn and GitHub contact actions matching the email action's pattern; verify all three actions in the prerendered HTML carry an accessible name
- [x] 3.3 Add `rel="noopener noreferrer"` to the two contact profile links and the hero resume link; verify all three `target="_blank"` links in the prerendered HTML carry the attribute
- [x] 3.4 Add the owner's name to the metadata title in `src/app/layout.tsx`; verify the `<title>` in the prerendered HTML contains it while the description still names the AI, LLM, and Computer Vision specialization
- [x] 3.5 Replace the profile image `alt="Hero Image"` in `src/components/sections/about.tsx` with text naming the owner and identifying it as their photograph; verify the prerendered HTML carries the new alt text
- [x] 3.6 Add a width utility to the profile image so its 600px intrinsic width no longer relies on the frame's `overflow-hidden` to crop it; verify in a browser at 320px, tablet, and desktop widths that the photograph fills its square frame with the subject visible

## 4. Cross-cutting styles

- [x] 4.1 Add a `--font-mono` token to the `@theme` block in `src/app/globals.css` pointing at the existing `--font-geist-mono` variable; verify in browser devtools that the hero name's computed `font-family` resolves to the loaded Geist Mono rather than a generic monospace stack
- [x] 4.1a Move the two `next/font` variable classes from `body` to `html` in `src/app/layout.tsx` so the font variables share a scope with the `:root` theme token that references them; verify the hero name's computed `font-family` is Geist Mono and that at least one other element resolves to it
- [x] 4.2 Add one global `:focus-visible` rule in `globals.css` using an outline with an offset, tuned for contrast against the dark palette; verify by tabbing the whole page that every focusable element shows the indicator, including the filled cyan hero pill, a glass project card, and a navigation link
- [x] 4.3 Confirm the focus indicator does not appear on pointer interaction; verify that clicking a hero button with the mouse draws no indicator while tabbing to it does
- [x] 4.4 Delete the dead `--foreground` custom property and the `body` rule that consumes it from `globals.css`; verify body text still renders slate-200 in devtools, proving the utility class was the effective source all along

## 5. Background behavior

- [x] 5.1 Subscribe to the `prefers-reduced-motion` media query in `src/components/ui/hybrid-background.tsx` via `useSyncExternalStore` and skip rendering the particles layer when it reports true; verify with the browser's reduced-motion emulation that no starfield canvas is present while the static image, gradient, and accent glows still render
- [x] 5.1a Uninstall `framer-motion` once nothing imports it, and confirm the browser reports no hydration mismatch on a reduced-motion load
- [x] 5.2 Confirm the preference is honored without a reload by toggling reduced-motion emulation while the page is open; verify the starfield stops animating in response
- [x] 5.3 Add a `responsive` entry to the tsparticles options that lowers the particle count below the tablet threshold; verify at a mobile viewport that fewer points render than at desktop width

## 6. Lint and cleanup

- [x] 6.1 Replace `icon: any` in `src/components/sections/skills.tsx` with `IconType` from `react-icons`; verify `npm run lint` no longer reports the `no-explicit-any` error and `npx tsc --noEmit` passes
- [x] 6.2 Escape the three raw apostrophes in `contact.tsx` and `hero.tsx` as `&apos;`; verify `npm run lint` reports no `no-unescaped-entities` errors and the rendered text is unchanged in the browser
- [x] 6.3 Remove the unused `Container` import from `hybrid-background.tsx`; verify `npm run lint` reports no unused-vars warning
- [x] 6.4 Remove `"use client"` from `contact.tsx`; verify the build succeeds, the contact section still renders, and the `mailto:` and profile links still work
- [x] 6.5 Uninstall `clsx` and `tailwind-merge`; verify neither appears in `package.json` and `npm run build` still passes
- [x] 6.6 Delete `public/bg-main2.png` and `public/bg-main3.png`; verify `grep -r "bg-main2\|bg-main3" src/` returns nothing and the backdrop still renders from `bg-main.png`
- [x] 6.7 Add a note at the top of `portfolio_website_prd.md` stating that `openspec/specs/portfolio-site/` is the source of truth for current behavior and that the PRD is retained as historical intent; verify the note is the first content in the file

## 7. Final verification

- [x] 7.1 Run `npm run lint` and verify it exits clean with zero errors and zero warnings
- [x] 7.2 Run `npm run build` and verify it passes with both routes still prerendered as static content
- [x] 7.3 Walk the six modified capability specs scenario by scenario against the running site and verify each now describes actual behavior, with particular attention to the scenarios that were regression guards for deviations 1 through 12
- [x] 7.4 Run `openspec validate fix-portfolio-baseline-defects --strict` and verify it reports the change valid
