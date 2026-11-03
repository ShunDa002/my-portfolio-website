# Spec Delta

## MODIFIED Requirements

### Requirement: Projects are driven by a single data list

Project entries SHALL be populated dynamically from GitHub repository discovery, falling back to a static project dataset if the GitHub API is unreachable, unauthenticated, or rate-limited. Adding, updating, or removing a `.github/project-demo.yml` file in an owned GitHub repository SHALL update the rendered projects list on demand without requiring manual layout code changes. Card order SHALL follow list order.

#### Scenario: Owner adds a project
- **WHEN** the owner adds a project demo metadata configuration to an owned repository or static fallback list
- **THEN** a new card appears in the grid with that entry's content
- **AND** no layout or card code is edited

#### Scenario: Owner reorders projects
- **WHEN** the owner reorders projects or adjusts repository display criteria
- **THEN** its card renders in accordance with the resolved list order

#### Scenario: GitHub API request fails or is rate-limited
- **WHEN** the GitHub API request encounters a network error, rate limit, or authentication error
- **THEN** the system falls back gracefully to the static project dataset
- **AND** the featured projects grid remains fully functional without displaying broken states

## ADDED Requirements

### Requirement: Dynamic GitHub repository project discovery

The system SHALL query the GitHub API to discover repositories owned by the configured user and inspect each repository for `.github/project-demo.yml`. Every repository containing valid project demo YAML metadata SHALL be included as a featured project card, with live on-demand fetching and flexible metadata field handling.

#### Scenario: Repository with valid project demo YAML is mapped
- **WHEN** a repository contains `.github/project-demo.yml` with valid metadata
- **THEN** the system decodes the base64 content, parses the YAML fields, and maps them to a Project entry with title, description, tags, githubLink, video, and demo

#### Scenario: Repository without project demo YAML is skipped
- **WHEN** a repository returns a 404 for `.github/project-demo.yml`
- **THEN** the repository is excluded from the featured projects list

#### Scenario: Live on-demand project data retrieval
- **WHEN** a visitor loads the portfolio or requests the projects API
- **THEN** the system evaluates repository demo metadata without returning stale disk-cached snapshots

#### Scenario: Each repository with project demo metadata is retained
- **WHEN** multiple repositories possess valid `.github/project-demo.yml` files
- **THEN** each repository is mapped into its own project card without being discarded due to shared destination URLs

#### Scenario: Flexible metadata key parsing
- **WHEN** a project-demo.yml file uses snake_case, camelCase, or comma-separated tags
- **THEN** the system normalizes the fields to match the Project interface
