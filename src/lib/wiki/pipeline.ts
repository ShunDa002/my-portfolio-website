import { fetchVaultPages } from './fetch';
import { parseWikiPage, buildWikiGraph, RawParsedPage } from './parse';
import { computeGraphLayout } from './layout';
import type { WikiPipelineResult } from '@/types/wiki';
import { GITHUB_REPO_URL } from './constants';

/**
 * End-to-end pipeline: fetch -> parse -> layout -> positioned graph data.
 * Pure server-side execution. Returns a discriminated result.
 */
export async function getWikiGraph(): Promise<WikiPipelineResult> {
  const fetchResult = await fetchVaultPages();

  if (fetchResult.status === 'error') {
    return fetchResult;
  }

  if (fetchResult.status === 'empty') {
    return fetchResult;
  }

  // Parse each fetched page with gray-matter
  const parsedPages: RawParsedPage[] = [];
  for (const pageItem of fetchResult.pages) {
    const parsed = parseWikiPage(pageItem.path, pageItem.content);
    if (parsed) {
      parsedPages.push(parsed);
    }
  }

  // If all pages were unparseable
  if (parsedPages.length === 0) {
    return {
      status: 'empty',
      message: 'The vault currently holds no pages.',
      githubUrl: GITHUB_REPO_URL,
    };
  }

  // Build graph with link resolution and deduplication
  const graph = buildWikiGraph(parsedPages);

  // Compute deterministic layout
  const positionedGraph = computeGraphLayout(graph);

  return {
    status: 'success',
    data: positionedGraph,
  };
}
