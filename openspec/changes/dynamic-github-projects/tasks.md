# Tasks

## 1. Dependencies and Types Setup

- [x] 1.1 Add or verify `js-yaml` and `@types/js-yaml` in `package.json` and confirm module imports resolve cleanly in TypeScript.
- [x] 1.2 Define GitHub repository metadata schema and TypeScript interfaces in `src/types/project.ts` (or `src/lib/github.ts`) aligned with `Project` in `src/constant/projects_list.ts`.

## 2. GitHub Service Implementation

- [x] 2.1 Implement repository listing function in `src/lib/github.ts` querying `https://api.github.com/user/repos` with authentication headers and verify repository list retrieval.
- [x] 2.2 Implement `.github/project-demo.yml` retrieval, base64 decoding, and YAML parsing with field validation in `src/lib/github.ts`, verifying correct parsing of sample metadata.
- [x] 2.3 Implement composite `getFeaturedProjects` function in `src/lib/github.ts` with live on-demand fetching (`cache: "no-store"`), error handling, and fallback to `src/constant/projects_list.ts`. Verify fallback behavior when token or API is unavailable.

## 3. Section Component and App Integration

- [x] 3.1 Create API route handler `src/app/api/projects/route.ts` exporting GET that returns discovered projects as JSON, verifying endpoint with a request test.
- [x] 3.2 Update `src/components/sections/projects.tsx` to accept `initialProjects?: Project[]` prop and dynamically fetch from `/api/projects` while preserving `useLoading()` video registration and dialog functionality.
- [x] 3.3 Update `src/app/page.tsx` to call `getFeaturedProjects()` server-side and pass retrieved projects into `<Projects initialProjects={projects} />`.

## 4. Verification and Integration Checks

- [x] 4.1 Execute `npm run build` and `npm run lint` to confirm zero type errors and clean production build.
- [x] 4.2 Verify the Featured Projects grid in browser renders dynamic repositories with functional dialog modal and video playback.

