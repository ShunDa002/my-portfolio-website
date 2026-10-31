'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface GraphFrameProps {
  iframeSrc: string;
  title: string;
  loading: 'eager' | 'lazy';
  cropHeader: boolean;
  remoteHeaderHeightPx: number;
  onLoad?: () => void;
  onRetry: () => void;
}

const LOAD_TIMEOUT_MS = 15_000;

export function GraphFrame({
  iframeSrc,
  title,
  loading,
  cropHeader,
  remoteHeaderHeightPx,
  onLoad,
  onRetry,
}: GraphFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      setIsTimedOut(true);
    }, LOAD_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const handleIframeLoad = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsLoaded(true);
    setIsTimedOut(false);
    onLoad?.();
  }, [onLoad]);

  return (
    <>
      {!isLoaded && (
        <div
          data-testid="graph-embed-loading"
          role="status"
          aria-live="polite"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#060b18] text-slate-200"
        >
          <div
            aria-hidden="true"
            className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"
          />
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
                  onClick={onRetry}
                  className="cursor-pointer rounded-lg border border-cyan-500/40 bg-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/30"
                >
                  Retry
                </button>
                <a
                  href={iframeSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
                >
                  Open Directly ↗
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      <div
        data-testid="graph-embed-viewport"
        style={
          cropHeader
            ? {
                marginTop: `-${remoteHeaderHeightPx}px`,
                height: `calc(100% + ${remoteHeaderHeightPx}px)`,
              }
            : { height: '100%' }
        }
        className="w-full"
      >
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          title={title}
          onLoad={handleIframeLoad}
          className="block h-full w-full border-0"
          loading={loading}
          allow="fullscreen; clipboard-read; clipboard-write"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </>
  );
}

export default GraphFrame;
