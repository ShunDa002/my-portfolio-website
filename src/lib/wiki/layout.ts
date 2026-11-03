import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from 'd3-force';
import type {
  WikiGraphData,
  WikiNode,
  WikiPositionedNode,
  WikiPositionedGraphData,
  WikiClassification,
} from '@/types/wiki';

export const MIN_NODE_RADIUS = 16;
export const MAX_NODE_RADIUS = 36;
export const RADIUS_K = 6;
export const VIEW_WIDTH = 1000;
export const VIEW_HEIGHT = 800;
export const SIMULATION_TICKS = 300;

/**
 * Computes node radius as a clamped square-root function of degree:
 * r = clamp(minR, minR + k * sqrt(degree), maxR)
 */
export function computeNodeRadius(
  degree: number,
  minR = MIN_NODE_RADIUS,
  maxR = MAX_NODE_RADIUS,
  k = RADIUS_K,
): number {
  const raw = minR + k * Math.sqrt(degree);
  return Math.max(minR, Math.min(raw, maxR));
}

interface SimNode extends SimulationNodeDatum {
  id: string;
  r: number;
  node: WikiNode;
  degree: number;
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
}

/**
 * Computes static server-side force layout using d3-force with seeded initial placement.
 * Emits nodes sorted deterministically: classification, then title.
 */
export function computeGraphLayout(graph: WikiGraphData): WikiPositionedGraphData {
  const { nodes, edges } = graph;

  if (nodes.length === 0) {
    return {
      nodes: [],
      edges: [],
      classifications: [],
      hasNoConnections: true,
    };
  }

  // Calculate degree for each node
  const degreeMap = new Map<string, number>();
  for (const node of nodes) {
    degreeMap.set(node.id, 0);
  }
  for (const edge of edges) {
    degreeMap.set(edge.source, (degreeMap.get(edge.source) || 0) + 1);
    degreeMap.set(edge.target, (degreeMap.get(edge.target) || 0) + 1);
  }

  // Deterministically sort incoming nodes before simulation
  const sortedInputNodes = [...nodes].sort((a, b) => a.id.localeCompare(b.id));

  // Seeded circular placement around center
  const centerX = VIEW_WIDTH / 2;
  const centerY = VIEW_HEIGHT / 2;
  const initialRadius = Math.min(VIEW_WIDTH, VIEW_HEIGHT) * 0.35;

  const simNodes: SimNode[] = sortedInputNodes.map((node, i) => {
    const angle = (2 * Math.PI * i) / sortedInputNodes.length;
    const deg = degreeMap.get(node.id) || 0;
    const r = computeNodeRadius(deg);
    return {
      id: node.id,
      x: centerX + initialRadius * Math.cos(angle),
      y: centerY + initialRadius * Math.sin(angle),
      vx: 0,
      vy: 0,
      r,
      degree: deg,
      node,
    };
  });

  const simLinks: SimLink[] = edges.map((e) => ({
    source: e.source,
    target: e.target,
  }));

  // Force simulation with fixed tick count
  const simulation = forceSimulation(simNodes)
    .force(
      'link',
      forceLink<SimNode, SimLink>(simLinks)
        .id((d) => d.id)
        .distance(110)
        .strength(0.7),
    )
    .force('charge', forceManyBody().strength(edges.length === 0 ? -450 : -350))
    .force('center', forceCenter(centerX, centerY))
    .force(
      'collide',
      forceCollide<SimNode>()
        .radius((d) => d.r + 24)
        .strength(1.0)
        .iterations(2),
    )
    .stop();

  for (let i = 0; i < SIMULATION_TICKS; i++) {
    simulation.tick();
  }

  // Create positioned nodes
  const positionedNodes: WikiPositionedNode[] = simNodes.map((sn) => ({
    ...sn.node,
    x: Number(sn.x!.toFixed(2)),
    y: Number(sn.y!.toFixed(2)),
    r: Number(sn.r.toFixed(2)),
    degree: sn.degree,
    linksTo: sn.node.linksTo || [],
  }));

  // Emit nodes in deterministic order: classification, then title (label)
  positionedNodes.sort((a, b) => {
    const classComp = a.classification.localeCompare(b.classification);
    if (classComp !== 0) return classComp;
    return a.label.localeCompare(b.label);
  });

  // Extract unique classifications present in nodes
  const classificationsSet = new Set<WikiClassification>();
  for (const n of positionedNodes) {
    classificationsSet.add(n.classification);
  }
  const classifications = Array.from(classificationsSet).sort();

  return {
    nodes: positionedNodes,
    edges,
    classifications,
    hasNoConnections: edges.length === 0,
  };
}
