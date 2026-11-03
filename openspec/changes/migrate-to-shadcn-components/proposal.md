# Proposal

## Why

The portfolio currently implements ad-hoc custom markup for buttons, cards, pills, and dialog panels across various components without a unified accessible component primitive library. Migrating existing components to Shadcn UI provides standardized accessibility (WAI-ARIA semantics, keyboard focus handling, and screen reader affordances), consistent variant management via Class Variance Authority (CVA), and easier long-term maintenance while faithfully preserving the site's signature Makoto Shinkai-inspired dark cinematic glass aesthetic.

## What Changes

- **Shadcn UI Foundation Setup**:
  - Configure `components.json` tailored for Next.js App Router and Tailwind CSS v4.
  - Install core Shadcn dependencies (`clsx`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/react-slot`, Lucide icons).
  - Add utility helper `src/lib/utils.ts` (`cn`).
  - Establish base Shadcn UI components under `src/components/ui/`: `button.tsx`, `badge.tsx`, `card.tsx`, `aspect-ratio.tsx`, `separator.tsx`, `scroll-area.tsx`, `alert.tsx`, `tooltip.tsx`, and `dialog.tsx` / `sheet.tsx`.
- **Align Shadcn Primitives with Design System**:
  - Customize `Button` variants to support the two canonical button forms: `primary` (cyan pill with glowing shadow) and `secondary` (glass pill with border), plus `ghost`, `outline`, and `icon` variants adhering to the `:focus-visible` cyan outline requirement.
  - Customize `Card` components (`Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription`) with translucent glass surface styles (`bg-slate-900/40`, backdrop blur, thin border, hover glow).
  - Customize `Badge` with accent pill and chip variants for technology tags and classification indicators.
- **Component Migration**:
  - **Hero (`src/components/sections/hero.tsx`)**: Replace raw anchor/button tags with Shadcn `Button` (`asChild`), applying primary cyan glow pill and secondary glass pill variants.
  - **About (`src/components/sections/about.tsx`)**: Migrate bio panel container to Shadcn `Card` and `CardContent` with glass styling.
  - **Skills (`src/components/sections/skills.tsx`)**: Migrate `SkillPill` to Shadcn `Badge` (or `Button` variant), preserving icon and label layout and hover transitions.
  - **Featured Projects (`src/components/sections/projects.tsx`)**:
    - Migrate project card container to Shadcn `Card`, `CardHeader`, `CardContent`, and `CardFooter`.
    - Migrate video iframe wrapper to Shadcn `AspectRatio` (`ratio={16 / 9}`).
    - Migrate technology tags to Shadcn `Badge`.
    - Migrate repository outbound link affordances to accessible Shadcn button / link primitives.
  - **Contact (`src/components/sections/contact.tsx`)**: Migrate social and email buttons (Mail, LinkedIn, GitHub) to Shadcn `Button` (`size="icon"`, `variant="ghost" | "outline"`, `asChild`, `rounded-full`).
  - **Header (`src/components/ui/header.tsx`)**: Migrate navigation actions and the "Wiki Graph" indicator to Shadcn `Button` and `Badge` primitives.
  - **Wiki Section (`src/components/sections/wiki-section.tsx`)**:
    - Migrate the window frame container to Shadcn `Card`.
    - Migrate the node counter pill to Shadcn `Badge`.
    - Migrate the expand button and error action links to Shadcn `Button` (`asChild`).
  - **Wiki Detail Panel (`src/components/wiki/WikiDetailPanel.tsx`)**:
    - Migrate panel frame to Shadcn `Card` (or `Sheet` / `Dialog`).
    - Migrate scrollable content area to Shadcn `ScrollArea`.
    - Migrate close button, link buttons, and dismiss button to Shadcn `Button`.
    - Migrate classification, status, knowledge status, and tags to Shadcn `Badge`.
    - Migrate divider lines to Shadcn `Separator`.
  - **Wiki Failure State (`src/components/wiki/WikiFailureState.tsx`)**:
    - Migrate alert container to Shadcn `Alert` / `Card`.
    - Migrate "Retry Connection" and "View on GitHub" actions to Shadcn `Button`.
  - **Wiki Graph View (`src/components/wiki/WikiGraphView.tsx`)**:
    - Migrate floating zoom/pan controls to Shadcn `Button` (`size="icon"`).
    - Migrate control divider to Shadcn `Separator`.
    - Migrate legend container to Shadcn `Card`.
- **Preserve Existing Functionality and Tests**:
  - Ensure all existing DOM IDs (`#hero`, `#about`, `#skills`, `#projects`, `#wiki`, `#contact`), `data-testid` attributes (`wiki-window-frame`, `wiki-window-empty`, `wiki-window-error`, etc.), and `aria-label` attributes are strictly preserved.
  - Verify zero regression in existing Playwright test suites.

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `portfolio-site/design-system`: Updates the design system specification to mandate accessible Shadcn UI component primitives (`Button`, `Card`, `Badge`, `AspectRatio`, `Separator`, `ScrollArea`, `Alert`, `Tooltip`) styled to adhere to the dark midnight palette, translucent glass surface treatments, and cyan focus indicators.

## Impact

- **UI Components**: `src/components/ui/` gains Shadcn primitive components; `src/components/sections/` and `src/components/wiki/` are refactored to consume Shadcn primitives.
- **Dependencies**: Add `clsx`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/react-slot`, and required Radix primitives (e.g. `@radix-ui/react-aspect-ratio`, `@radix-ui/react-separator`, `@radix-ui/react-scroll-area`, `@radix-ui/react-dialog`, `@radix-ui/react-tooltip`).
- **Configuration**: Introduces `components.json` for Shadcn CLI compatibility with Tailwind CSS v4.
- **Testing**: All existing Playwright test suites must pass without regression.
