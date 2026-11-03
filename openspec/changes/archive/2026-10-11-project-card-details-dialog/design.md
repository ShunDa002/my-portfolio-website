# Design

## Context

In `src/components/sections/projects.tsx`, featured project entries (`Project` in `src/constant/projects_list.ts`) are rendered in a 2-column grid of `<Card>` components. Currently, each card displays a muted, looping preview video in an `AspectRatio` frame and a title that links directly to the project's GitHub repository. Project descriptions (`project.description`) are not currently displayed on the card.

See `proposal.md` for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Implement the Shadcn Dialog component primitive (`src/components/ui/dialog.tsx`) using `@radix-ui/react-dialog` with dark glass styling.
- Remove external repository redirection from the project card title.
- Enable the entire `<Card>` component as an interactive click and keyboard trigger (`role="button"`, `tabIndex={0}`) that opens the details dialog.
- Create an expansive horizontal, video-dominant dialog (`max-w-5xl`, `w-[92vw]`) displaying:
  - Dominant 16:9 demonstration video player (or stylized terminal fallback) with full interactive controls.
  - Project title.
  - Full narrative project description.
  - Technology tags (using Shadcn `Badge`).
  - An explicit call-to-action button linking to the GitHub repository.
- Ensure full keyboard accessibility, focus trapping, and Escape-key dismissal.

**Non-Goals:**
- Altering the underlying project data model (`Project` type in `projects_list.ts`).
- Altering other sections of the portfolio.

## Decisions

### Decision 1: Shadcn Dialog Primitive Foundation
- **Choice**: Install `@radix-ui/react-dialog` and create `src/components/ui/dialog.tsx` providing `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, and `DialogClose`.
- **Styling**: Translucent dark glass backdrop (`bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 shadow-2xl`), cyan focus outlines, and animated fade-in/scale transitions.
- **Alternatives considered**: Hand-rolled modal (rejected: lacks WAI-ARIA dialog semantics and focus management).

### Decision 2: State-Driven vs Per-Card Dialog
- **Choice**: Manage a single active project state (`const [selectedProject, setSelectedProject] = useState<Project | null>(null);`) in `Projects` component.
- **Rationale**:
  - Avoids pre-mounting multiple dialog DOM structures and iframes.
  - Ensures video playback in the dialog is cleanly initialized only when opened and stopped when closed.
  - Simplifies keyboard accessibility and clean focus restore to the triggering card element.
- **Alternatives considered**: Wrapping every card in `<Dialog><DialogTrigger asChild>...</DialogTrigger><DialogContent>...</DialogContent></Dialog>` (rejected: renders hidden iframes for every project simultaneously).

### Decision 3: Horizontal, Video-Dominant Dialog Geometry
- **Choice**:
  - Container: `max-w-5xl w-[92vw] p-6 max-h-[90vh] overflow-y-auto`.
  - Desktop layout (`lg:grid lg:grid-cols-12 gap-6 items-start`):
    - Video Column (`lg:col-span-7`): Enlarged 16:9 `AspectRatio` frame with interactive player (or terminal fallback).
    - Details Column (`lg:col-span-5 flex flex-col justify-between space-y-4`): Title (`DialogTitle`), tags, full description (`DialogDescription`), and GitHub action button (`Button`).
  - Mobile layout (`grid-cols-1`): Vertically stacked with the video on top and details below.
- **Rationale**: Meets the user's requirement for a horizontal, video-dominant dialog that highlights project demos while providing ample room for project narrative.

### Decision 4: Interactive Card Affordance
- **Choice**: The card receives `cursor-pointer hover:border-cyan-glow/40 transition-all hover:scale-[1.01]`, `role="button"`, `tabIndex={0}`, and an accessible `aria-label={`View details for ${project.title}`}`.
- **Rationale**: Ensures both mouse users and keyboard/screen reader users can activate the dialog intuitively.

## Risks / Trade-offs

- **[Risk] Nested Interactive Controls**: If the card contained buttons or links, clicking them might conflict with the card-level click handler.
  → *Mitigation*: The title is no longer a link, and tags are non-interactive chips. The entire card cleanly triggers the dialog.
- **[Risk] Video Autoplay in Dialog**: The card preview has autoplay with `mute=1` and `pointer-events-none`.
  → *Mitigation*: In the dialog, the video player iframe does NOT have `pointer-events-none`, allowing visitors to play, pause, seek, and hear audio.
