import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parseWikiPage, buildWikiGraph, RawParsedPage } from '../src/lib/wiki/parse';

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

test.describe('Task 2.7: Self-checking parse pipeline over fixtures', () => {
  test('runs parse pipeline over captured wiki fixtures and asserts resulting node and edge counts', () => {
    const pagesDir = path.resolve('tests/fixtures/wiki/pages');
    const mdFiles = walkDir(pagesDir);

    expect(mdFiles.length).toBe(15);

    const parsedPages: RawParsedPage[] = [];
    for (const filePath of mdFiles) {
      const rawText = fs.readFileSync(filePath, 'utf-8');
      const relPath = path.relative(pagesDir, filePath).replace(/\\/g, '/');
      const vaultPath = `wiki/${relPath}`;
      const page = parseWikiPage(vaultPath, rawText);
      expect(page).not.toBeNull();
      if (page) parsedPages.push(page);
    }

    const graph = buildWikiGraph(parsedPages);

    // Exact node count: 15
    expect(graph.nodes.length).toBe(15);
    // Exact edge count: 29
    expect(graph.edges.length).toBe(29);

    // Verify all nodes have required attributes
    for (const node of graph.nodes) {
      expect(node.id).toBeTruthy();
      expect(node.label).toBeTruthy();
      expect(node.classification).toBeTruthy();
      expect(node.githubUrl).toContain('https://github.com/ShunDa002/llm-wiki3/blob/main/');
    }
  });

  test('runs parse pipeline over no-links vault fixture', () => {
    const noLinksDir = path.resolve('tests/fixtures/wiki/no-links-vault/pages');
    const mdFiles = walkDir(noLinksDir);

    expect(mdFiles.length).toBe(3);

    const parsedPages: RawParsedPage[] = [];
    for (const filePath of mdFiles) {
      const rawText = fs.readFileSync(filePath, 'utf-8');
      const relPath = path.relative(noLinksDir, filePath).replace(/\\/g, '/');
      const vaultPath = `wiki/${relPath}`;
      const page = parseWikiPage(vaultPath, rawText);
      expect(page).not.toBeNull();
      if (page) parsedPages.push(page);
    }

    const graph = buildWikiGraph(parsedPages);

    expect(graph.nodes.length).toBe(3);
    expect(graph.edges.length).toBe(0);
  });
});
