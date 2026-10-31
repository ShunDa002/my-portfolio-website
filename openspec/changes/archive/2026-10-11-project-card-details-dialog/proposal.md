# Proposal

## Why

Currently, clicking the project title in a Featured Projects card immediately navigates away to the project's GitHub repository, and the card's description text is omitted from the card surface. Visitors clicking a project card often expect to inspect the project more deeply first—such as viewing an enlarged demonstration video with interactive audio/controls, reading the project's background and description, and exploring technology tags—before deciding to leave the portfolio to view the code repository. Making the entire card interactive and opening a dedicated horizontal, video-dominant details dialog keeps visitors engaged within the portfolio while providing a rich, high-fidelity project preview.

## What Changes

- **Card Click Event & Trigger**:
  - Remove direct repository navigation link (`<Link href={project.githubLink}>`) from the project card title.
  - Transform the entire `<Card>` component into an interactive click target that opens a project details dialog upon click or keyboard activation anywhere on the card surface.
- **Shadcn Dialog Component Foundation**:
  - Install `@radix-ui/react-dialog` if not present and create `src/components/ui/dialog.tsx` with standard Shadcn Dialog primitives (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`), styled with the dark glass translucent surface aesthetic (`bg-slate-900/95`, backdrop blur, cyan focus outlines, and slate borders).
- **Horizontal, Video-Dominant Dialog**:
  - Implement a dedicated project details dialog component / modal layout sized for desktop/tablet viewports (`max-w-4xl` / `max-w-5xl`).
  - Video-dominant presentation:
    - Dominant media column displaying an enlarged 16:9 demonstration video player (or stylized fallback terminal panel for projects without a video) with full player capabilities.
    - Metadata and narrative column displaying the project title, full problem & approach description (`project.description`), technology tags (Shadcn `Badge`), and an outbound call-to-action button linking to the GitHub repository (`target="_blank" rel="noopener noreferrer"`).
- **Accessibility & Keyboard Interaction**:
  - Ensure the card is accessible as an interactive trigger (keyboard Enter/Space opens the dialog, focus-visible outlines).
  - Ensure the dialog traps focus appropriately, supports Escape key dismissal, and includes an accessible close button.

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `portfolio-site/featured-projects`: Modifies card interaction and presentation requirements to remove direct repository redirection from the card title, convert the entire card into a click target, and introduce an accessible horizontal, video-dominant project details dialog displaying enlarged demonstration media, project description, tags, and repository link.

## Impact

- **UI Components**:
  - `src/components/ui/dialog.tsx`: New Shadcn UI Dialog primitive.
  - `src/components/sections/projects.tsx`: Replaces direct anchor links with card-wide dialog triggers and renders the horizontal video-dominant details dialog.
- **Dependencies**: Adds `@radix-ui/react-dialog`.
- **Specs & Tests**: Updates `portfolio-site/featured-projects` specification; verifies existing tests and page shell stability.
