'use client';

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import type { GraphEmbedOptions } from '@/types/graph-embed';

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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  // 0. Ensure iframe only mounts on client after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Construct the full iframe URL with query parameters
  const iframeSrc = useMemo(() => {
    try {
      const url = new URL(baseUrl);

      if (!showChat) {
        url.searchParams.set('chat', 'false');
      }

      if (note && note.trim()) {
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

  // 2. Reset loading state when URL or reloadKey changes
  useEffect(() => {
    setIsLoaded(false);
    setIsTimedOut(false);

    const timer = window.setTimeout(() => {
      setIsTimedOut(true);
    }, 15000);

    return () => window.clearTimeout(timer);
  }, [iframeSrc, reloadKey]);

  // 3. Synchronize Fullscreen state with browser events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 4. Handlers for load, reload, and fullscreen toggle
  const handleIframeLoad = useCallback(() => {
    setIsLoaded(true);
    setIsTimedOut(false);
    onLoad?.();
  }, [onLoad]);

  const handleReload = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="graph-embed-container"
      style={{ height: isFullscreen ? '100vh' : height }}
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#060b18] shadow-2xl ${className}`}
    >
      {/* Loading Overlay */}
      {!isLoaded && (
        <div
          data-testid="graph-embed-loading"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#060b18] text-slate-200"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="mt-3 text-sm font-medium text-cyan-200">
            Loading interactive knowledge graph...
          </p>

          {isTimedOut && (
            <div
              data-testid="graph-embed-timeout"
              className="mt-4 flex flex-col items-center gap-2 text-center"
            >
              <p className="text-xs text-slate-400">
                Taking longer than expected to reach the graph service.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReload}
                  className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition cursor-pointer"
                >
                  Retry
                </button>
                <a
                  href={iframeSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
                >
                  Open Directly ↗
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Host Action Controls (Floating Overlay) */}
      {showHostControls && (
        <div
          data-testid="graph-embed-controls"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 rounded-xl border border-slate-800/80 bg-slate-950/80 px-2.5 py-1.5 text-xs text-slate-300 backdrop-blur-md shadow-lg"
        >
          <button
            type="button"
            onClick={handleReload}
            className="rounded-lg px-2 py-1 hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Reload Graph"
          >
            Reload
          </button>
          <span className="text-slate-700">|</span>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="rounded-lg px-2 py-1 hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
          <span className="text-slate-700">|</span>
          <a
            href={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-2 py-1 hover:bg-slate-800 hover:text-white transition"
            title="Open full graph in a new tab"
          >
            Open ↗
          </a>
        </div>
      )}

      {/* Iframe Viewport (Supports optional top header cropping) */}
      <div
        data-testid="graph-embed-viewport"
        style={
          cropHeader
            ? {
                marginTop: `-${REMOTE_HEADER_HEIGHT_PX}px`,
                height: `calc(100% + ${REMOTE_HEADER_HEIGHT_PX}px)`,
              }
            : { height: '100%' }
        }
        className="w-full"
      >
        {mounted && (
          <iframe
            key={reloadKey}
            ref={iframeRef}
            src={iframeSrc}
            title={title}
            onLoad={handleIframeLoad}
            className="h-full w-full border-0 block"
            loading={loading}
            allow="fullscreen; clipboard-read; clipboard-write"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>
    </div>
  );
}
export default GraphEmbed;
