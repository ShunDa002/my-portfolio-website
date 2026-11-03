import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parseWikiPage, buildWikiGraph, RawParsedPage } from '../src/lib/wiki/parse';
import {
  computeNodeRadius,
  computeGraphLayout,
  MIN_NODE_RADIUS,
  MAX_NODE_RADIUS,
} from '../src/lib/wiki/layout';

function loadVaultPages(dirPath: string): RawParsedPage[] {
  const pages: RawParsedPage[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true, recursive: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      const fullPath = path.join(entry.parentPath || dirPath, entry.name);
      const text = fs.readFileSync(fullPath, 'utf-8');
      const relPath = path.relative(dirPath, fullPath).replace(/\\/g, '/');
      const parsed = parseWikiPage(`wiki/${relPath}`, text);
      if (parsed) pages.push(parsed);
    }
  }
  return pages;
}

test.describe('Section 3: Layout computation', () => {
  test('Task 3.1: Node radius is clamped square-root function; index hub is larger than leaf nodes and <= maxR', () => {
    // Math unit check
    expect(computeNodeRadius(0)).toBe(MIN_NODE_RADIUS);
    expect(computeNodeRadius(1)).toBeGreaterThan(MIN_NODE_RADIUS);
    expect(computeNodeRadius(100)).toBe(MAX_NODE_RADIUS);

    // Captured fixture check
    const pages = loadVaultPages(path.resolve('tests/fixtures/wiki/pages'));
    const graph = buildWikiGraph(pages);
    const layout = computeGraphLayout(graph);

    const indexNode = layout.nodes.find((n) => n.id.includes('index.md'));
    expect(indexNode).toBeDefined();

    // Leaf nodes (degree 1 or 0)
    const leafNodes = layout.nodes.filter((n) => n.degree <= 1);
    expect(leafNodes.length).toBeGreaterThan(0);

    for (const leaf of leafNodes) {
      expect(indexNode!.r).toBeGreaterThan(leaf.r);
    }

    expect(indexNode!.r).toBeLessThanOrEqual(MAX_NODE_RADIUS);
  });

  test('Task 3.2: Seeded placement and fixed ticks produce identical coordinates across consecutive runs', () => {
    const pages = loadVaultPages(path.resolve('tests/fixtures/wiki/pages'));
    const graph = buildWikiGraph(pages);

    const run1 = computeGraphLayout(graph);
    const run2 = computeGraphLayout(graph);

    expect(run1.nodes.length).toBe(run2.nodes.length);
    for (let i = 0; i < run1.nodes.length; i++) {
      expect(run1.nodes[i].id).toBe(run2.nodes[i].id);
      expect(run1.nodes[i].x).toBe(run2.nodes[i].x);
      expect(run1.nodes[i].y).toBe(run2.nodes[i].y);
      expect(run1.nodes[i].r).toBe(run2.nodes[i].r);
    }
  });

  test('Task 3.3: No overlapping nodes when vault has no edges (no-links fixture)', () => {
    const pages = loadVaultPages(path.resolve('tests/fixtures/wiki/no-links-vault/pages'));
    const graph = buildWikiGraph(pages);
    const layout = computeGraphLayout(graph);

    expect(layout.nodes.length).toBe(3);
    expect(layout.edges.length).toBe(0);

    // Verify all bounding circles are disjoint: dist >= r1 + r2
    for (let i = 0; i < layout.nodes.length; i++) {
      for (let j = i + 1; j < layout.nodes.length; j++) {
        const n1 = layout.nodes[i];
        const n2 = layout.nodes[j];
        const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        expect(dist).toBeGreaterThanOrEqual(n1.r + n2.r);
      }
    }
  });

  test('Task 3.4: Emits nodes in deterministic order (classification, then title)', () => {
    const pages = loadVaultPages(path.resolve('tests/fixtures/wiki/pages'));
    const graph = buildWikiGraph(pages);
    const layout = computeGraphLayout(graph);

    // Verify order
    for (let i = 0; i < layout.nodes.length - 1; i++) {
      const curr = layout.nodes[i];
      const next = layout.nodes[i + 1];

      const classComp = curr.classification.localeCompare(next.classification);
      if (classComp !== 0) {
        expect(classComp).toBeLessThan(0);
      } else {
        expect(curr.label.localeCompare(next.label)).toBeLessThanOrEqual(0);
      }
    }

    // Verify order is unchanged across runs
    const layout2 = computeGraphLayout(graph);
    expect(layout.nodes.map((n) => n.id)).toEqual(layout2.nodes.map((n) => n.id));
  });
});
