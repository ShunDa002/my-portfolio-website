import fs from 'fs';
import path from 'path';
import type { WikiPipelineFailure, WikiPipelineEmpty } from '@/types/wiki';

import {
  GITHUB_REPO,
  GITHUB_BRANCH,
  GITHUB_TREE_URL,
  GITHUB_RAW_BASE,
  GITHUB_REPO_URL,
} from './constants';

export {
  GITHUB_REPO,
  GITHUB_BRANCH,
  GITHUB_TREE_URL,
  GITHUB_RAW_BASE,
  GITHUB_REPO_URL,
};

export interface RawPageItem {
  path: string;
  content: string;
}

export type FetchVaultResult =
  | { status: 'success'; pages: RawPageItem[] }
  | WikiPipelineFailure
  | WikiPipelineEmpty;

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
}

interface GitHubTreeResponse {
  sha?: string;
  url?: string;
  tree?: GitHubTreeItem[];
  message?: string;
  documentation_url?: string;
}

/**
 * Checks for incoming test headers when running under test suites.
 */
async function getTestHeaders(): Promise<{ vaultType?: string; failureType?: string }> {
  try {
    const { headers } = await import('next/headers');
    const headerList = await headers();
    const vaultType = headerList.get('x-wiki-test-vault') || undefined;
    const failureType = headerList.get('x-wiki-test-failure') || undefined;
    return { vaultType, failureType };
  } catch {
    return {};
  }
}

/**
 * Fetches the vault tree from GitHub and downloads each Markdown page's raw body.
 * Carries next: { revalidate: 3600, tags: ["wiki-vault"] } on every fetch.
 */
export async function fetchVaultPages(): Promise<FetchVaultResult> {
  const { vaultType, failureType } = await getTestHeaders();

  // Test simulation of failure states
  if (failureType === 'rate_limit') {
    return {
      status: 'error',
      reason: 'rate_limited',
      message:
        'GitHub API rate limit exceeded. The graph will be available again once the rate limit resets.',
      statusCode: 403,
    };
  }

  if (failureType === 'http_500') {
    return {
      status: 'error',
      reason: 'http_error',
      message: 'GitHub API returned HTTP 500: Internal Server Error',
      statusCode: 500,
    };
  }

  if (failureType === 'network_error') {
    return {
      status: 'error',
      reason: 'network_error',
      message: 'Failed to connect to the knowledge vault repository: connection timeout',
    };
  }

  // Test simulation of fixture vaults
  if (vaultType) {
    if (vaultType === 'empty') {
      return {
        status: 'empty',
        message: 'The vault currently holds no pages.',
        githubUrl: GITHUB_REPO_URL,
      };
    }

    if (vaultType === 'no-links') {
      const dir = path.resolve(process.cwd(), 'tests/fixtures/wiki/no-links-vault/pages');
      const pages: RawPageItem[] = [];
      const readDir = (currentDir: string) => {
        if (!fs.existsSync(currentDir)) return;
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(currentDir, entry.name);
          if (entry.isDirectory()) {
            readDir(full);
          } else if (entry.isFile() && entry.name.endsWith('.md')) {
            const rel = path.relative(dir, full).replace(/\\/g, '/');
            pages.push({
              path: `wiki/${rel}`,
              content: fs.readFileSync(full, 'utf-8'),
            });
          }
        }
      };
      readDir(dir);
      return { status: 'success', pages };
    }

    if (vaultType === 'default') {
      const dir = path.resolve(process.cwd(), 'tests/fixtures/wiki/pages');
      const pages: RawPageItem[] = [];
      const readDir = (currentDir: string) => {
        if (!fs.existsSync(currentDir)) return;
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(currentDir, entry.name);
          if (entry.isDirectory()) {
            readDir(full);
          } else if (entry.isFile() && entry.name.endsWith('.md')) {
            const rel = path.relative(dir, full).replace(/\\/g, '/');
            pages.push({
              path: `wiki/${rel}`,
              content: fs.readFileSync(full, 'utf-8'),
            });
          }
        }
      };
      readDir(dir);
      return { status: 'success', pages };
    }
  }

  // Real outbound fetch to GitHub
  const fetchOptions: RequestInit & { next?: { revalidate: number; tags: string[] } } = {
    headers: {
      'User-Agent': 'portfolio-wiki-graph',
      Accept: 'application/vnd.github.v3+json',
    },
    next: {
      revalidate: 3600,
      tags: ['wiki-vault'],
    },
  };

  let treeRes: Response;
  try {
    treeRes = await fetch(GITHUB_TREE_URL, fetchOptions);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network failure while reaching GitHub';
    return {
      status: 'error',
      reason: 'network_error',
      message: `Failed to connect to the knowledge vault repository: ${message}`,
    };
  }

  // Check rate limit or HTTP error on tree endpoint
  if (!treeRes.ok) {
    const statusCode = treeRes.status;
    let errorBody = '';
    try {
      errorBody = await treeRes.text();
    } catch {
      // Ignore text read error
    }

    const isRateLimited =
      statusCode === 403 ||
      statusCode === 429 ||
      errorBody.toLowerCase().includes('rate limit');

    if (isRateLimited) {
      return {
        status: 'error',
        reason: 'rate_limited',
        message:
          'GitHub API rate limit exceeded. The graph will be available again once the rate limit resets.',
        statusCode,
      };
    }

    return {
      status: 'error',
      reason: 'http_error',
      message: `GitHub API returned HTTP ${statusCode}: ${treeRes.statusText || 'Unable to retrieve repository tree.'}`,
      statusCode,
    };
  }

  let treeData: GitHubTreeResponse;
  try {
    treeData = (await treeRes.json()) as GitHubTreeResponse;
  } catch {
    return {
      status: 'error',
      reason: 'http_error',
      message: 'Failed to parse repository tree JSON from GitHub API.',
    };
  }

  if (!treeData.tree || !Array.isArray(treeData.tree)) {
    return {
      status: 'error',
      reason: 'http_error',
      message: 'Invalid tree response format from GitHub API.',
    };
  }

  // Filter to .md files under wiki/ at any depth (excluding non-markdown files like .gitkeep)
  const wikiFiles = treeData.tree.filter(
    (item) => item.path.startsWith('wiki/') && item.path.endsWith('.md') && item.type === 'blob',
  );

  if (wikiFiles.length === 0) {
    return {
      status: 'empty',
      message: 'The vault currently holds no pages.',
      githubUrl: GITHUB_REPO_URL,
    };
  }

  // Fetch each page's raw body from raw.githubusercontent.com
  const pagePromises = wikiFiles.map(async (file): Promise<RawPageItem | null> => {
    const rawUrl = `${GITHUB_RAW_BASE}/${file.path}`;
    try {
      const pageRes = await fetch(rawUrl, {
        headers: {
          'User-Agent': 'portfolio-wiki-graph',
        },
        next: {
          revalidate: 3600,
          tags: ['wiki-vault'],
        },
      });

      if (!pageRes.ok) {
        return null;
      }

      const content = await pageRes.text();
      return { path: file.path, content };
    } catch {
      return null;
    }
  });

  const rawPages = await Promise.all(pagePromises);
  const successfulPages = rawPages.filter((p): p is RawPageItem => p !== null);

  if (successfulPages.length === 0) {
    return {
      status: 'error',
      reason: 'network_error',
      message: 'Failed to download page contents from the knowledge vault repository.',
    };
  }

  return {
    status: 'success',
    pages: successfulPages,
  };
}
