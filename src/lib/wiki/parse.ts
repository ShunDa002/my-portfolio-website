import matter from 'gray-matter';
import path from 'path';
import type { WikiEdge, WikiGraphData, WikiNode, WikiClassification, WikiFrontmatter } from '@/types/wiki';

export interface RawParsedPage {
  id: string;
  path: string;
  stem: string;
  label: string;
  classification: WikiClassification;
  frontmatter: WikiFrontmatter;
  excerpt: string;
  rawText: string;
}

/**
 * Extracts plain-text prose excerpt taken after the leading heading.
 */
export function extractExcerpt(content: string): string {
  // Remove markdown code blocks
  const cleaned = content.replace(/```[\s\S]*?```/g, '');
  const lines = cleaned.split('\n');

  let foundLeadingHeading = false;
  const proseLines: string[] = [];
  let inProse = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!foundLeadingHeading) {
      if (/^#+\s+/.test(line)) {
        foundLeadingHeading = true;
      }
      continue;
    }

    // After leading heading: skip empty lines and immediate subheadings or horizontal rules
    if (!inProse) {
      if (!line || /^#+\s+/.test(line) || /^[-*_]{3,}$/.test(line)) {
        continue;
      }
      // Found the start of a prose paragraph
      inProse = true;
      proseLines.push(line);
    } else {
      // Collect lines of this prose block until blank line or new section/list/divider
      if (!line || /^#+\s+/.test(line) || /^[-*_]{3,}$/.test(line)) {
        break;
      }
      proseLines.push(line);
    }
  }

  // If no prose was found after leading heading, try finding any non-heading paragraph in content
  if (proseLines.length === 0) {
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || /^#+\s+/.test(line) || /^[-*_]{3,}$/.test(line)) continue;
      proseLines.push(line);
      break;
    }
  }

  const rawExcerpt = proseLines.join(' ');

  // Clean markdown formatting:
  // [[Target|display]] -> display
  // [[Target]] -> Target
  // [text](url) -> text
  // `code` -> code
  // **bold**, *italic* -> text
  const cleanExcerpt = rawExcerpt
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  return cleanExcerpt;
}

/**
 * Extracts wikilink targets from text (including frontmatter).
 * Format: [[Target]] or [[Target|display]]
 */
export function extractWikilinks(text: string): string[] {
  const matches: string[] = [];
  const regex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const target = match[1].trim();
    if (target) {
      matches.push(target);
    }
  }
  return matches;
}

/**
 * Parses a single Markdown page's raw text using gray-matter.
 * Returns null if the page frontmatter or content cannot be parsed.
 */
export function parseWikiPage(filePath: string, rawText: string): RawParsedPage | null {
  try {
    const parsed = matter(rawText);
    const data = (parsed.data || {}) as WikiFrontmatter;

    const normalizedPath = filePath.replace(/\\/g, '/');
    const stem = path.basename(normalizedPath, path.extname(normalizedPath));

    // Label: frontmatter title falling back to filename stem
    const label = (data.title && typeof data.title === 'string' && data.title.trim())
      ? data.title.trim()
      : stem;

    // Classification: frontmatter type falling back to containing directory name
    const parentDir = path.basename(path.dirname(normalizedPath));
    const classification = (data.type && typeof data.type === 'string' && data.type.trim())
      ? data.type.trim()
      : (parentDir && parentDir !== '.' && parentDir !== '/' ? parentDir : 'concept');

    const excerpt = extractExcerpt(parsed.content);

    return {
      id: normalizedPath,
      path: normalizedPath,
      stem,
      label,
      classification,
      frontmatter: data,
      excerpt,
      rawText,
    };
  } catch {
    // Unparseable page drops out of the result
    return null;
  }
}

/**
 * Normalises a key for link resolution: trimmed and lowercased.
 */
export function normalizeLinkKey(key: string): string {
  return key.trim().toLowerCase();
}

/**
 * Builds the graph (nodes and edges) from parsed pages.
 * Handles link resolution, alias lookup, self-link dropping, dangling link dropping,
 * and deduplicating multiple links between the same pair of pages.
 */
export function buildWikiGraph(pages: RawParsedPage[]): WikiGraphData {
  // Sort pages deterministically by path
  const sortedPages = [...pages].sort((a, b) => a.path.localeCompare(b.path));

  // Build normalised index: title, filename stem, aliases
  // First-writer-wins on collision
  const linkIndex = new Map<string, string>();

  for (const page of sortedPages) {
    const candidateKeys: string[] = [page.label, page.stem];
    if (Array.isArray(page.frontmatter.aliases)) {
      for (const alias of page.frontmatter.aliases) {
        if (typeof alias === 'string' && alias.trim()) {
          candidateKeys.push(alias);
        }
      }
    }

    for (const key of candidateKeys) {
      const norm = normalizeLinkKey(key);
      if (norm && !linkIndex.has(norm)) {
        linkIndex.set(norm, page.id);
      }
    }
  }

  // Resolve links for each page
  const pageLinksMap = new Map<string, Set<string>>();
  for (const page of sortedPages) {
    const rawTargets = extractWikilinks(page.rawText);
    const resolvedTargets = new Set<string>();

    for (const target of rawTargets) {
      const norm = normalizeLinkKey(target);
      const targetId = linkIndex.get(norm);

      // Drop dangling links and self-links
      if (targetId && targetId !== page.id) {
        resolvedTargets.add(targetId);
      }
    }

    pageLinksMap.set(page.id, resolvedTargets);
  }

  // Build edges: collapse multiple links between the same pair of pages to one edge
  const edgeMap = new Map<string, WikiEdge>();
  for (const page of sortedPages) {
    const targets = pageLinksMap.get(page.id) || new Set<string>();
    for (const targetId of targets) {
      const edgeKey = page.id < targetId ? `${page.id}---${targetId}` : `${targetId}---${page.id}`;
      if (!edgeMap.has(edgeKey)) {
        edgeMap.set(edgeKey, {
          source: page.id,
          target: targetId,
        });
      }
    }
  }

  const nodes: WikiNode[] = sortedPages.map(p => {
    const outgoingTargets = pageLinksMap.get(p.id) || new Set<string>();
    // For detail panel: list of page titles/labels or IDs the page links to
    const linksTo: string[] = Array.from(outgoingTargets).map(tid => {
      const targetPage = sortedPages.find(sp => sp.id === tid);
      return targetPage ? targetPage.label : tid;
    });

    return {
      id: p.id,
      path: p.path,
      label: p.label,
      classification: p.classification,
      frontmatter: p.frontmatter,
      excerpt: p.excerpt,
      githubUrl: `https://github.com/ShunDa002/llm-wiki3/blob/main/${p.path}`,
      linksTo,
    };
  });

  return {
    nodes,
    edges: Array.from(edgeMap.values()),
  };
}
