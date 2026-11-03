# Proposal

## Why

Currently, the portfolio's Featured Projects are defined in a hardcoded TypeScript array (`src/constant/projects_list.ts`), requiring manual code edits and redeployments whenever projects are updated or added. Fetching project data dynamically from the GitHub API using repository `.github/project-demo.yml` metadata allows the portfolio to automatically reflect newly showcased repositories and metadata changes without touching the codebase.

## What Changes

- Add server-side GitHub API integration that queries the user's owned repositories via GitHub REST API (`https://api.github.com/user/repos` or user repo listing).
- For each owned repository, inspect and parse the `.github/project-demo.yml` file to extract project metadata (title, description, tags, githubLink, video, demo), supporting flexible field naming (camelCase/snake_case) and varied tag formats.
- Retain every repository that contains `.github/project-demo.yml` as its own distinct featured project card.
- Update the `Projects` section and page shell to ingest dynamically retrieved GitHub project data on demand (`cache: "no-store"`, `dynamic = "force-dynamic"`) with client-side synchronization.
- Implement error handling with a graceful fallback to the existing static project list if GitHub API limits are exceeded or the network request fails.
- Expose an API route (`/api/projects`) to support dynamic retrieval and revalidation.
- Maintain existing visual design, video player ratio, modal dialog details, and loading-screen integration.

## Capabilities

### New Capabilities
<!-- None: Dynamic project retrieval integrates directly into the existing featured-projects capability -->

### Modified Capabilities
- `portfolio-site/featured-projects`: Update data sourcing requirement from a static data list to dynamic GitHub API discovery and `.github/project-demo.yml` metadata parsing with live on-demand fetching and static fallback.

## Impact

- **Affected code**:
  - `src/components/sections/projects.tsx`: Accept dynamic project list / fetch dynamically from API route while maintaining loading provider video registration.
  - `src/app/page.tsx`: Fetch projects dynamically with on-demand server rendering.
  - `src/lib/github.ts`: Service module for GitHub API repository listing, `.github/project-demo.yml` contents retrieval, and YAML parsing.
  - `src/app/api/projects/route.ts`: API route for on-demand dynamic project data retrieval.
  - `src/constant/projects_list.ts`: Retained as fallback dataset.
- **Dependencies**: Added `js-yaml` and `@types/js-yaml` for YAML parsing.
- **Environment**: Uses `GITHUB_TOKEN` and `MY_GITHUB_USERNAME` in `.env`.
