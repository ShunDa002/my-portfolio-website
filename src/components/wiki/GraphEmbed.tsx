'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GraphEmbedOptions } from '@/types/graph-embed';
import { GraphFrame } from './GraphFrame';

const DEFAULT_GRAPH_URL =
  process.env.NEXT_PUBLIC_WIKI_GRAPH_URL ||
  'https://wiki-graph.tay-shon-da1.workers.dev/graph';

// Height of the remote graph application's top navigation bar (3.5rem / 56px)
export const REMOTE_HEADER_HEIGHT_PX = 56;

export function GraphEmbed({
  baseUrl = DEFAULT_GRAPH_URL,
  note = null,
  showChat = false,
  queryParams,
  cropHeader = false,
  height = '640px',
  className = '',
  showHostControls = true,
  title = 'Interactive Knowledge Graph',
  loading = 'eager',
  onLoad,
}: GraphEmbedOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const iframeSrc = useMemo(() => {
    try {
      const url = new URL(baseUrl);

      if (!showChat) {
        url.searchParams.set('chat', 'false');
      }

      if (note?.trim()) {
        url.searchParams.set('note', note.trim());
      }

      if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, String(value));
          }
        });
      }

      return url.toString();
    } catch {
      return baseUrl;
    }
  }, [baseUrl, note, showChat, queryParams]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleReload = useCallback(() => {
    setReloadKey((previousKey) => previousKey + 1);
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen toggle failed:', error);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="graph-embed-container"
      style={{ height: isFullscreen ? '100vh' : height }}
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#060b18] shadow-2xl ${className}`}
    >
      {showHostControls && (
        <div
          data-testid="graph-embed-controls"
          className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-xl border border-slate-800/80 bg-slate-950/80 px-2.5 py-1.5 text-xs text-slate-300 shadow-lg backdrop-blur-md"
        >
          <button
            type="button"
            onClick={handleReload}
            className="cursor-pointer rounded-lg px-2 py-1 transition hover:bg-slate-800 hover:text-white"
            title="Reload Graph"
          >
            Reload
          </button>
          <span aria-hidden="true" className="text-slate-700">
            |
          </span>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="cursor-pointer rounded-lg px-2 py-1 transition hover:bg-slate-800 hover:text-white"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
          <span aria-hidden="true" className="text-slate-700">
            |
          </span>
          <a
            href={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-2 py-1 transition hover:bg-slate-800 hover:text-white"
            title="Open full graph in a new tab"
          >
            Open ↗
          </a>
        </div>
      )}

      <GraphFrame
        key={`${iframeSrc}:${reloadKey}`}
        iframeSrc={iframeSrc}
        title={title}
        loading={loading}
        cropHeader={cropHeader}
        remoteHeaderHeightPx={REMOTE_HEADER_HEIGHT_PX}
        onLoad={onLoad}
        onRetry={handleReload}
      />
    </div>
  );
}

export default GraphEmbed;
