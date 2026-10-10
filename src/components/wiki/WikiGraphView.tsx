'use client';

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import type { WikiPositionedGraphData, WikiPositionedNode } from '@/types/wiki';
import { getClassificationColor } from '@/lib/wiki/colors';
import { WikiDetailPanel } from './WikiDetailPanel';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface WikiGraphViewProps {
  initialData: WikiPositionedGraphData;
  isEmbedded?: boolean;
}

export function getNodeDomId(id: string): string {
  return `wiki-node-${id.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

export const WikiGraphView: React.FC<WikiGraphViewProps> = ({ initialData, isEmbedded = false }) => {
  const { nodes, edges, classifications, hasNoConnections } = initialData;

  // Compute initial viewBox bounds covering all nodes with padding
  const initialViewBox = useMemo(() => {
    if (nodes.length === 0) {
      return { x: 0, y: 0, width: 1000, height: 800 };
    }
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (const n of nodes) {
      if (n.x - n.r < minX) minX = n.x - n.r;
      if (n.x + n.r > maxX) maxX = n.x + n.r;
      if (n.y - n.r < minY) minY = n.y - n.r;
      if (n.y + n.r > maxY) maxY = n.y + n.r;
    }
    const padding = 100;
    const width = Math.max(800, maxX - minX + padding * 2);
    const height = Math.max(600, maxY - minY + padding * 2);
    const x = minX - padding;
    const y = minY - padding;
    return { x, y, width, height };
  }, [nodes]);

  // Current viewBox state for pan and zoom
  const [viewBox, setViewBox] = useState(initialViewBox);
  const [selectedNode, setSelectedNode] = useState<WikiPositionedNode | null>(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  // Ref to track originating node for returning focus on panel dismissal
  const originatingNodeRef = useRef<string | null>(null);

  // Dragging state for pan
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Zoom bounds: clamp min and max zoom factor relative to initial viewBox
  const minZoomFactor = 0.35;
  const maxZoomFactor = 2.8;

  const clampViewBox = useCallback(
    (newW: number, newH: number, newX: number, newY: number) => {
      const minW = initialViewBox.width * minZoomFactor;
      const maxW = initialViewBox.width * maxZoomFactor;
      const minH = initialViewBox.height * minZoomFactor;
      const maxH = initialViewBox.height * maxZoomFactor;

      const clampedW = Math.max(minW, Math.min(newW, maxW));
      const clampedH = Math.max(minH, Math.min(newH, maxH));

      return {
        x: newX,
        y: newY,
        width: clampedW,
        height: clampedH,
      };
    },
    [initialViewBox],
  );

  // Handle Wheel Zoom with a native non-passive listener so e.preventDefault() reliably prevents page scroll
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.9 : 1.1;

      setViewBox((prev) => {
        const rect = svg.getBoundingClientRect();
        const cursorRatioX = (e.clientX - rect.left) / rect.width;
        const cursorRatioY = (e.clientY - rect.top) / rect.height;

        const newWidth = prev.width * zoomFactor;
        const newHeight = prev.height * zoomFactor;

        // Keep cursor position stable during zoom
        const newX = prev.x + (prev.width - newWidth) * cursorRatioX;
        const newY = prev.y + (prev.height - newHeight) * cursorRatioY;

        return clampViewBox(newWidth, newHeight, newX, newY);
      });
    };

    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      svg.removeEventListener('wheel', onWheel);
    };
  }, [clampViewBox]);

  // Handle Drag / Pan
  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    // Only pan if left click and target is background or svg container
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    setViewBox((prev) => {
      const svg = svgRef.current;
      if (!svg) return prev;
      const scaleX = prev.width / svg.clientWidth;
      const scaleY = prev.height / svg.clientHeight;
      return {
        ...prev,
        x: prev.x - dx * scaleX,
        y: prev.y - dy * scaleY,
      };
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Controls: Zoom in, Zoom out, Reset
  const handleZoomIn = () => {
    setViewBox((prev) => {
      const factor = 0.8;
      const newW = prev.width * factor;
      const newH = prev.height * factor;
      const newX = prev.x + (prev.width - newW) / 2;
      const newY = prev.y + (prev.height - newH) / 2;
      return clampViewBox(newW, newH, newX, newY);
    });
  };

  const handleZoomOut = () => {
    setViewBox((prev) => {
      const factor = 1.25;
      const newW = prev.width * factor;
      const newH = prev.height * factor;
      const newX = prev.x + (prev.width - newW) / 2;
      const newY = prev.y + (prev.height - newH) / 2;
      return clampViewBox(newW, newH, newX, newY);
    });
  };

  const handleReset = () => {
    setViewBox(initialViewBox);
  };

  // Node selection & panel opening
  const handleSelectNode = (node: WikiPositionedNode) => {
    originatingNodeRef.current = node.id;
    setSelectedNode(node);
  };

  const handleClosePanel = () => {
    const origId = originatingNodeRef.current;
    setSelectedNode(null);
    if (origId) {
      setTimeout(() => {
        const el = document.getElementById(getNodeDomId(origId));
        el?.focus();
      }, 50);
    }
  };

  // Select node by label (from Links To in panel)
  const handleSelectByLabel = (label: string) => {
    const target = nodes.find(
      (n) => n.label.toLowerCase() === label.toLowerCase() || n.id.includes(label),
    );
    if (target) {
      handleSelectNode(target);
    }
  };

  // Pre-index node positions and neighbours for neighbourhood emphasis
  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const neighbourMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const n of nodes) {
      map.set(n.id, new Set<string>());
    }
    for (const e of edges) {
      map.get(e.source)?.add(e.target);
      map.get(e.target)?.add(e.source);
    }
    return map;
  }, [nodes, edges]);

  // Determine which nodes and edges are emphasized
  const activeNeighbours = useMemo(() => {
    if (!highlightedNodeId) return null;
    const set = new Set<string>(neighbourMap.get(highlightedNodeId) || []);
    set.add(highlightedNodeId);
    return set;
  }, [highlightedNodeId, neighbourMap]);

  // Accessible summary: page count and classification breakdown
  const classificationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const n of nodes) {
      counts[n.classification] = (counts[n.classification] || 0) + 1;
    }
    return counts;
  }, [nodes]);

  const accessibleSummary = useMemo(() => {
    const breakdown = Object.entries(classificationCounts)
      .map(([cls, count]) => `${count} ${cls}${count > 1 ? 's' : ''}`)
      .join(', ');
    return `Interactive knowledge graph with ${nodes.length} pages: ${breakdown}.`;
  }, [nodes.length, classificationCounts]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Visually hidden text alternative for screen readers */}
      <div className="sr-only" aria-live="polite">
        {accessibleSummary}
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        role="img"
        aria-label={accessibleSummary}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <defs>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Edges rendered beneath nodes */}
        <g className="edges" aria-hidden="true">
          {edges.map((edge) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return null;

            const isIncident =
              highlightedNodeId !== null &&
              (edge.source === highlightedNodeId || edge.target === highlightedNodeId);

            const isDimmed = highlightedNodeId !== null && !isIncident;

            return (
              <line
                key={`${edge.source}---${edge.target}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={isIncident ? '#22d3ee' : 'rgba(148, 163, 184, 0.28)'}
                strokeWidth={isIncident ? 2.5 : 1.5}
                strokeOpacity={isDimmed ? 0.08 : isIncident ? 1.0 : 0.6}
                className="transition-all duration-200"
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {nodes.map((node) => {
            const isHighlighted = activeNeighbours === null || activeNeighbours.has(node.id);
            const isSelected = selectedNode?.id === node.id;
            const isFocusedOrHovered = highlightedNodeId === node.id;
            const isDisputed =
              typeof node.frontmatter.knowledge_status === 'string' &&
              node.frontmatter.knowledge_status.toLowerCase() === 'disputed';

            const color = getClassificationColor(node.classification);
            const truncatedLabel =
              node.label.length > 28 ? `${node.label.slice(0, 27)}…` : node.label;

            return (
              <g
                key={node.id}
                id={getNodeDomId(node.id)}
                tabIndex={0}
                role="button"
                aria-label={`${node.label} (${node.classification})`}
                aria-haspopup="dialog"
                transform={`translate(${node.x}, ${node.y})`}
                opacity={isHighlighted ? 1 : 0.15}
                onMouseEnter={() => setHighlightedNodeId(node.id)}
                onMouseLeave={() => setHighlightedNodeId(null)}
                onFocus={() => setHighlightedNodeId(node.id)}
                onBlur={() => setHighlightedNodeId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectNode(node);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectNode(node);
                  }
                }}
                className="cursor-pointer transition-opacity duration-200 outline-none"
              >
                {/* Full title in SVG title tag */}
                <title>{node.label}</title>

                {/* Glow ring for selected or focused node */}
                {(isSelected || isFocusedOrHovered) && (
                  <circle
                    r={node.r + 9}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    strokeOpacity="0.8"
                    className="animate-pulse"
                  />
                )}

                {/* Marker for non-settled knowledge_status (e.g. disputed) */}
                {isDisputed && (
                  <circle
                    data-testid="disputed-marker"
                    r={node.r + 5}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  r={node.r}
                  fill={color}
                  stroke="#020617"
                  strokeWidth="2.5"
                  className="transition-transform duration-150 hover:scale-110"
                />

                {/* Truncated label text beneath node */}
                <text
                  y={node.r + 14}
                  textAnchor="middle"
                  fill={isHighlighted ? '#e2e8f0' : '#64748b'}
                  fontSize="11"
                  fontWeight="500"
                  fontFamily="var(--font-geist-sans), sans-serif"
                  className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                >
                  {truncatedLabel}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Notice for no connections */}
      {hasNoConnections && (
        <div
          data-testid="no-connections-notice"
          className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur text-xs font-medium text-slate-300 shadow-lg"
        >
          No connections were found between pages in this vault.
        </div>
      )}

      {/* Floating Controls (Zoom, Reset) */}
      <div
        className={`absolute z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 shadow-xl ${
          isEmbedded ? 'bottom-3 right-3 sm:bottom-4 sm:right-4' : 'bottom-6 right-6'
        }`}
      >
        <button
          onClick={handleZoomIn}
          aria-label="Zoom in"
          title="Zoom in"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-cyan-glow"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          aria-label="Zoom out"
          title="Zoom out"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-cyan-glow"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-800" />
        <button
          onClick={handleReset}
          aria-label="Reset view"
          title="Reset initial framing"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-cyan-glow"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Legend: dynamic based on classifications present */}
      {classifications.length > 0 && (
        <aside
          aria-label="Graph Legend"
          className={`absolute z-30 p-3.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 shadow-xl text-xs space-y-2 max-w-xs ${
            isEmbedded ? 'bottom-3 left-3 sm:bottom-4 sm:left-4' : 'bottom-6 left-6'
          }`}
        >
          <span className="font-semibold text-slate-400 block uppercase tracking-wider text-[10px]">
            Classifications
          </span>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {classifications.map((cls) => {
              const color = getClassificationColor(cls);
              return (
                <div key={cls} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-slate-300 capitalize">{cls}</span>
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* Detail Panel */}
      {selectedNode && (
        <WikiDetailPanel
          node={selectedNode}
          onClose={handleClosePanel}
          onSelectNodeByLabel={handleSelectByLabel}
        />
      )}
    </div>
  );
};
