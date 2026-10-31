import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {
  parseWikiPage,
  extractWikilinks,
  buildWikiGraph,
  RawParsedPage,
} from '../src/lib/wiki/parse';

function walkDir(dir: string): string[] {
  let files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walkDir(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

test.describe('Task 2.3: Page parsing with gray-matter and fallbacks', () => {
  test('every parseable fixture yields non-empty label and classification', () => {
    const fixturesDir = path.resolve('tests/fixtures/wiki');
    const mdFiles = walkDir(fixturesDir);

    expect(mdFiles.length).toBeGreaterThan(0);

    for (const filePath of mdFiles) {
      if (filePath.endsWith('unparseable.md')) {
        continue;
      }
      const rawText = fs.readFileSync(filePath, 'utf-8');
      const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
      const parsed = parseWikiPage(relPath, rawText);

      expect(parsed).not.toBeNull();
      if (!parsed) continue;

      expect(parsed.label).toBeTruthy();
      expect(parsed.label.trim().length).toBeGreaterThan(0);

      expect(parsed.classification).toBeTruthy();
      expect(parsed.classification.trim().length).toBeGreaterThan(0);

      if (filePath.endsWith('no-title-page.md')) {
        expect(parsed.label).toBe('no-title-page');
      }

      if (filePath.endsWith('no-type-page.md')) {
        expect(parsed.classification).toBe('edge-cases');
      }
    }
  });

  test('extractExcerpt extracts clean plain-text prose after leading heading', () => {
    const conceptPath = path.resolve('tests/fixtures/wiki/pages/concepts/Markdown-First Retrieval.md');
    const text = fs.readFileSync(conceptPath, 'utf-8');
    const parsed = parseWikiPage('wiki/concepts/Markdown-First Retrieval.md', text);

    expect(parsed).not.toBeNull();
    expect(parsed?.excerpt).toContain('For a small vault');
    expect(parsed?.excerpt).not.toContain('## Definition');
    expect(parsed?.excerpt).not.toContain('# Markdown-First Retrieval');
  });
});

test.describe('Task 2.4: Wikilink extraction', () => {
  test('captures target portion of [[Target|display]]', () => {
    const text = 'Here is a piped link: [[Some Page Target|Display Title]] and normal [[Another Target]].';
    const links = extractWikilinks(text);
    expect(links).toEqual(['Some Page Target', 'Another Target']);
  });

  test('extracts sources frontmatter links as well as body links on captured concept page', () => {
    const conceptPath = path.resolve('tests/fixtures/wiki/pages/concepts/Markdown-First Retrieval.md');
    const text = fs.readFileSync(conceptPath, 'utf-8');
    const links = extractWikilinks(text);

    // Frontmatter sources
    expect(links).toContain('Source - Markdown-First Retrieval for Small Knowledge Vaults');
    expect(links).toContain('Source - Markdown Retrieval for a Small Wiki');

    // Body links
    expect(links).toContain('Semantic Search Enablement Timing');
    expect(links).toContain('Wiki Index as Routing Layer');
  });
});

test.describe('Task 2.5: Link resolution', () => {
  test('resolves alias link, drops dangling link, drops self-link, and collapses quad-link to one edge', () => {
    const edgeCasesDir = path.resolve('tests/fixtures/wiki/edge-cases');
    const fileNames = [
      'alias-target.md',
      'alias-linker.md',
      'self-linker.md',
      'quad-linker.md',
    ];

    const parsedPages: RawParsedPage[] = [];
    for (const name of fileNames) {
      const fullPath = path.join(edgeCasesDir, name);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const page = parseWikiPage(`wiki/edge-cases/${name}`, content);
      expect(page).not.toBeNull();
      if (page) parsedPages.push(page);
    }

    const graph = buildWikiGraph(parsedPages);

    // 1. Alias link: alias-linker links to [[ATP]], which is an alias of Alias Target Page
    const aliasEdge = graph.edges.find(
      (e) =>
        (e.source === 'wiki/edge-cases/alias-linker.md' && e.target === 'wiki/edge-cases/alias-target.md') ||
        (e.target === 'wiki/edge-cases/alias-linker.md' && e.source === 'wiki/edge-cases/alias-target.md')
    );
    expect(aliasEdge).toBeDefined();

    // 2. Dangling link: alias-linker links to [[A Page That Does Not Exist]] -> should produce no edge
    const danglingEdge = graph.edges.find(
      (e) =>
        e.source.includes('Does Not Exist') ||
        e.target.includes('Does Not Exist')
    );
    expect(danglingEdge).toBeUndefined();

    // 3. Self-link: self-linker links to [[Self Linker]] -> produces NO edge
    const selfEdge = graph.edges.find(
      (e) => e.source === 'wiki/edge-cases/self-linker.md' || e.target === 'wiki/edge-cases/self-linker.md'
    );
    expect(selfEdge).toBeUndefined();

    // 4. Quad-link: quad-linker links to [[Alias Target Page]] four times -> exactly 1 edge
    const quadEdges = graph.edges.filter(
      (e) =>
        (e.source === 'wiki/edge-cases/quad-linker.md' && e.target === 'wiki/edge-cases/alias-target.md') ||
        (e.target === 'wiki/edge-cases/quad-linker.md' && e.source === 'wiki/edge-cases/alias-target.md')
    );
    expect(quadEdges.length).toBe(1);
  });
});

test.describe('Task 2.6: Unparseable page handling', () => {
  test('unparseable frontmatter drops out while remaining pages still parse (N-1 count, no error)', () => {
    const unparseablePath = path.resolve('tests/fixtures/wiki/edge-cases/unparseable.md');
    const validPath = path.resolve('tests/fixtures/wiki/edge-cases/self-linker.md');

    const unparseableContent = fs.readFileSync(unparseablePath, 'utf-8');
    const validContent = fs.readFileSync(validPath, 'utf-8');

    const inputList = [
      { path: 'wiki/edge-cases/unparseable.md', content: unparseableContent },
      { path: 'wiki/edge-cases/self-linker.md', content: validContent },
    ];

    const parsed: RawParsedPage[] = [];
    for (const item of inputList) {
      const res = parseWikiPage(item.path, item.content);
      if (res) parsed.push(res);
    }

    // N was 2, now N-1 is 1
    expect(parsed.length).toBe(1);
    expect(parsed[0].id).toBe('wiki/edge-cases/self-linker.md');
  });
});
