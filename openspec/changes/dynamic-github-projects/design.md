# Design

## Context

The portfolio's Featured Projects are currently statically imported from `@/constant/projects_list.ts` into `@/components/sections/projects.tsx`. The section component is a client component (`"use client"`) because it manages dialog open state and registers demo video URLs with `LoadingProvider` to coordinate the site's initial loading screen.

The provided Python script (`github_api.py`) demonstrates querying the GitHub REST API (`https://api.github.com/user/repos?affiliation=owner`) using `GITHUB_TOKEN` and fetching `.github/project-demo.yml` for each repository via the GitHub contents API.

Environment variables `GITHUB_TOKEN` and `MY_GITHUB_USERNAME` are already defined in the local `.env`. See `proposal.md` for the motivation and requirements.

## Goals / Non-Goals

**Goals:**
- Implement a server-side module (`src/lib/github.ts`) that fetches user repositories, inspects `.github/project-demo.yml`, decodes base64 content, and parses YAML metadata.
- Expose an API route (`src/app/api/projects/route.ts`) and server helper functions for retrieving discovered projects on demand.
- Pass projects from the server component `src/app/page.tsx` into `<Projects initialProjects={projects} />` to enable instant render and preserve `LoadingProvider` video registration timing, while also performing a client-side fetch in `projects.tsx` to maintain live freshness.
- Validate and normalize project entries flexibly to conform to the `Project` type (`title`, `description`, `tags`, `githubLink`, `video`, `demo`), supporting both camelCase and snake_case keys and varied tag formatting.
- Ensure live on-demand fetching (`cache: "no-store"` and `dynamic = "force-dynamic"`) so newly added or modified `.github/project-demo.yml` files are reflected immediately without stale cache locks.
- Gracefully fall back to `src/constant/projects_list.ts` whenever the token is absent, rate-limited, or network requests fail.

**Non-Goals:**
- Exposing `GITHUB_TOKEN` or `MY_GITHUB_USERNAME` in client-side bundles (no `NEXT_PUBLIC_GITHUB_TOKEN`).
- Modifying project card styling, video aspect ratios, or modal dialog markup.
- Writing back or creating repositories/files on GitHub.

## Decisions

### Decision 1: Server-side fetching with Server Component hydration & dynamic client sync
- **Choice**: Perform GitHub API calls on the server within `src/lib/github.ts`. The Server Component `src/app/page.tsx` awaits `getFeaturedProjects()` with `dynamic = "force-dynamic"` and passes the result to `<Projects initialProjects={projects} />`. In addition, create `src/app/api/projects/route.ts` as a public API route, and have `projects.tsx` fetch `/api/projects` on the client if `initialProjects` is not passed or to keep data in sync.
- **Rationale**: Keeps `GITHUB_TOKEN` secure on the server while ensuring video URLs are present during the first render for `LoadingProvider`. On-demand fetching ensures that updating or pushing `.github/project-demo.yml` on GitHub takes effect immediately.
- **Alternatives considered**:
  - *Hardcoded 1-hour ISR cache (`revalidate: 3600`)*: Caused stale build artifacts that failed to reflect live repository edits.
  - *Direct client-side GitHub API calls*: Exposes secret personal access tokens in client JavaScript.

### Decision 2: YAML parsing with `js-yaml`
- **Choice**: Use `js-yaml` (`import { load } from "js-yaml"`) to parse `.github/project-demo.yml` content.
- **Rationale**: `js-yaml` is robust and standard for Node.js / Next.js.
- **Alternatives considered**:
  - *Regular expressions*: Brittle for YAML syntax.
  - *Default export `import yaml from "js-yaml"`*: Incompatible with ESM/Turbopack named exports in Next.js 16.

### Decision 3: Resilient live retrieval and fallback architecture
- **Choice**: Use `cache: "no-store"` for GitHub API calls. If `GITHUB_TOKEN` is missing, or if any GitHub API call fails with status 401, 403, 429, 5xx, or network failure, catch the error, log a server warning, and return the static `projects` array from `src/constant/projects_list.ts`.
- **Rationale**: Guarantees zero downtime or broken layouts for visitors even if GitHub experiences outages or API rate limit exhaustion.
- **Alternatives considered**:
  - *Throwing errors / 500*: Degrades user experience if third-party API is temporarily unavailable.

### Decision 4: Per-repository inclusion without shared-link discarding
- **Choice**: Every repository owned by the user that contains `.github/project-demo.yml` is parsed as its own project card entry. Deduplication does not discard repositories that happen to share a common link destination.
- **Rationale**: Each repository represents a distinct codebase or showcase item.
- **Alternatives considered**:
  - *Deduplicating on `githubLink` + `title`*: Silently dropped distinct repositories that had shared or template URLs.

### Decision 5: Flexible metadata normalizer
- **Choice**: Support camelCase and snake_case property names (`githubLink` / `github_link`, `video` / `video_link`, `demo` / `demo_link`), string or array tags, and default to the repository name if title is omitted.
- **Rationale**: Prevents minor formatting variations in user repositories from breaking discovery.

## Risks / Trade-offs

- **[Risk] GitHub API rate limiting (60 req/hr unauthenticated, 5,000 req/hr authenticated)**
  → *Mitigation*: Authenticate all requests using `GITHUB_TOKEN` and fall back cleanly to static project list if 403/429 occurs.
- **[Risk] Stale caching in Next.js data cache / ISR**
  → *Mitigation*: Use `cache: "no-store"`, `dynamic = "force-dynamic"`, and `revalidate = 0` on dynamic routes.
- **[Risk] Malformed YAML in repository `.github/project-demo.yml`**
  → *Mitigation*: Wrap parsing in a try/catch block per repository and provide sensible defaults.
- **[Risk] Missing environment variables in deployment environment**
  → *Mitigation*: Check for `GITHUB_TOKEN` presence; if missing, log a descriptive warning and fall back cleanly to static `projects` list.
