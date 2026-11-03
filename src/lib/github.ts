import { load } from "js-yaml";
import { projects as fallbackProjects } from "@/constant/projects_list";
import type { Project } from "@/types/project";

interface GitHubRepoItem {
  name: string;
  html_url: string;
  owner: {
    login: string;
  };
  fork: boolean;
  pushed_at?: string;
  updated_at?: string;
}

interface GitHubContentResponse {
  type: string;
  encoding: string;
  content: string;
}

function getGitHubConfig() {
  const rawToken = process.env.GITHUB_TOKEN?.trim();
  const token = rawToken ? rawToken.replace(/^["']|["']$/g, "") : undefined;

  const rawUsername = process.env.MY_GITHUB_USERNAME?.trim();
  const username = rawUsername
    ? rawUsername.replace(/^["']|["']$/g, "")
    : undefined;

  return { token, username };
}

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "my-portfolio-app",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Fetch all repositories owned by the user.
 */
export async function fetchUserRepositories(): Promise<GitHubRepoItem[]> {
  const { token, username } = getGitHubConfig();
  const repos: GitHubRepoItem[] = [];
  let page = 1;

  while (true) {
    const url = token
      ? `https://api.github.com/user/repos?affiliation=owner&per_page=100&page=${page}`
      : username
        ? `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`
        : null;

    if (!url) {
      console.warn("No GitHub token or username configured.");
      break;
    }

    const response = await fetch(url, {
      headers: getHeaders(token),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch repositories: ${response.status} ${response.statusText}`
      );
    }

    const batch = (await response.json()) as GitHubRepoItem[];
    if (!Array.isArray(batch) || batch.length === 0) {
      break;
    }

    repos.push(...batch);

    if (batch.length < 100) {
      break;
    }

    page += 1;
  }

  return repos;
}

/**
 * Fetch and parse .github/project-demo.yml for a given repository.
 * Returns null if the file does not exist (404) or is invalid.
 */
export async function fetchProjectDemoYaml(
  owner: string,
  repo: string,
  defaultGithubUrl: string
): Promise<Project | null> {
  const { token } = getGitHubConfig();
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/.github/project-demo.yml`;

  try {
    const response = await fetch(url, {
      headers: getHeaders(token),
      cache: "no-store",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.warn(
        `Failed to fetch project-demo.yml for ${owner}/${repo}: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = (await response.json()) as GitHubContentResponse;
    if (!data.content) {
      return null;
    }

    const cleanedContent = data.content.replace(/\r?\n/g, "");
    const decodedYaml = Buffer.from(cleanedContent, "base64").toString("utf-8");
    const parsedData = load(decodedYaml) as Record<string, unknown> | null;

    if (!parsedData || typeof parsedData !== "object") {
      return null;
    }

    const rawTitle = (parsedData.title ?? parsedData.name ?? repo) as string;
    const rawDesc = (parsedData.description ?? parsedData.desc ?? "") as string;
    const rawTags = (parsedData.tags ??
      parsedData.tech ??
      parsedData.technologies ??
      []) as string[] | string;
    const tags = Array.isArray(rawTags)
      ? rawTags.map((t) => String(t).trim())
      : typeof rawTags === "string"
      ? rawTags.split(",").map((t) => t.trim())
      : [];

    const githubLink = (parsedData.githubLink ??
      parsedData.github_link ??
      parsedData.github ??
      parsedData.repo ??
      defaultGithubUrl) as string;

    const video = (parsedData.video ??
      parsedData.videoLink ??
      parsedData.video_link ??
      parsedData.youtube ??
      undefined) as string | undefined;

    const demo = (parsedData.demo ??
      parsedData.demoLink ??
      parsedData.demo_link ??
      parsedData.live ??
      undefined) as string | undefined;

    return {
      title: String(rawTitle).trim(),
      description: String(rawDesc).trim(),
      tags,
      githubLink: String(githubLink).trim(),
      video: video ? String(video).trim() : undefined,
      demo: demo ? String(demo).trim() : undefined,
    };
  } catch (error) {
    console.warn(`Error reading project demo for ${owner}/${repo}:`, error);
    return null;
  }
}

/**
 * Composite function to fetch all featured projects from GitHub repositories.
 * Inspects .github/project-demo.yml in each repo owned by the user.
 * Falls back to static fallbackProjects if GitHub API fails or yields no projects.
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const repos = await fetchUserRepositories();
    if (repos.length === 0) {
      return fallbackProjects;
    }

    const projectPromises = repos.map((repo) =>
      fetchProjectDemoYaml(repo.owner.login, repo.name, repo.html_url)
    );

    const settledResults = await Promise.allSettled(projectPromises);

    const discoveredProjects: Project[] = [];

    for (const res of settledResults) {
      if (res.status === "fulfilled" && res.value) {
        discoveredProjects.push(res.value);
      }
    }

    if (discoveredProjects.length === 0) {
      console.info(
        "No repository with valid .github/project-demo.yml found; falling back to static list."
      );
      return fallbackProjects;
    }

    return discoveredProjects;
  } catch (error) {
    console.warn(
      "Error fetching projects from GitHub API; using fallback list:",
      error
    );
    return fallbackProjects;
  }
}
