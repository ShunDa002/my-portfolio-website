'use client';

import React, { useEffect, useRef } from 'react';
import type { WikiPositionedNode } from '@/types/wiki';
import { getClassificationColor } from '@/lib/wiki/colors';
import { ExternalLink, X } from 'lucide-react';

interface WikiDetailPanelProps {
  node: WikiPositionedNode;
  onClose: () => void;
  onSelectNodeByLabel?: (label: string) => void;
}

export const WikiDetailPanel: React.FC<WikiDetailPanelProps> = ({
  node,
  onClose,
  onSelectNodeByLabel,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus close button on open
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, [node.id]);

  const color = getClassificationColor(node.classification);
  const fm = node.frontmatter;

  // Filter present attributes only (omit absent/empty)
  const hasStatus = typeof fm.status === 'string' && fm.status.trim().length > 0;
  const hasConfidence = typeof fm.confidence === 'string' && fm.confidence.trim().length > 0;
  const hasKnowledgeStatus =
    typeof fm.knowledge_status === 'string' && fm.knowledge_status.trim().length > 0;
  const hasTags = Array.isArray(fm.tags) && fm.tags.length > 0;
  const hasCreated = typeof fm.created === 'string' && fm.created.trim().length > 0;
  const hasUpdated = typeof fm.updated === 'string' && fm.updated.trim().length > 0;

  const linksTo = node.linksTo || [];

  return (
    <aside
      ref={panelRef}
      role="dialog"
      aria-label={`Details for ${node.label}`}
      className="absolute top-4 right-4 z-40 w-full max-w-sm sm:max-w-md max-h-[calc(100%-2rem)] flex flex-col rounded-2xl border border-slate-700/60 bg-slate-900/90 backdrop-blur-xl shadow-2xl text-slate-200 overflow-hidden animate-fade-in-up"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-slate-800/80">
        <div className="space-y-1.5 pr-3">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {node.classification}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white leading-snug">{node.label}</h2>
        </div>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close panel"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus-visible:outline-cyan-glow"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="p-5 space-y-5 overflow-y-auto flex-1 text-sm">
        {/* Frontmatter attributes grid - omit absent */}
        <div className="space-y-2">
          {hasStatus && (
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-medium">Status</span>
              <span className="text-slate-200 font-mono">{String(fm.status)}</span>
            </div>
          )}
          {hasConfidence && (
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-medium">Confidence</span>
              <span className="text-slate-200 font-mono capitalize">{String(fm.confidence)}</span>
            </div>
          )}
          {hasKnowledgeStatus && (
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-medium">Knowledge Status</span>
              <span
                className={`font-mono px-2 py-0.5 rounded text-xs ${
                  fm.knowledge_status === 'disputed'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-200'
                }`}
              >
                {String(fm.knowledge_status)}
              </span>
            </div>
          )}
          {hasCreated && (
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-medium">Created</span>
              <span className="text-slate-400 font-mono">{String(fm.created)}</span>
            </div>
          )}
          {hasUpdated && (
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-medium">Updated</span>
              <span className="text-slate-400 font-mono">{String(fm.updated)}</span>
            </div>
          )}
          {hasTags && (
            <div className="pt-1">
              <span className="text-slate-400 text-xs block mb-1.5 font-medium">Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {fm.tags!.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-xs bg-slate-800 border border-slate-700/60 text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Excerpt */}
        {node.excerpt && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Excerpt
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm bg-slate-800/40 p-3 rounded-xl border border-slate-800/60">
              {node.excerpt}
            </p>
          </div>
        )}

        {/* Links to */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Links To ({linksTo.length})
          </h3>
          {linksTo.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No outgoing wikilinks</p>
          ) : (
            <ul className="space-y-1">
              {linksTo.map((targetLabel) => (
                <li key={targetLabel}>
                  {onSelectNodeByLabel ? (
                    <button
                      onClick={() => onSelectNodeByLabel(targetLabel)}
                      className="text-left w-full text-xs text-cyan-300 hover:text-cyan-200 hover:underline transition-colors py-0.5"
                    >
                      [[{targetLabel}]]
                    </button>
                  ) : (
                    <span className="text-xs text-slate-300">[[{targetLabel}]]</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer with GitHub link */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
        <a
          href={node.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors focus-visible:outline-cyan-glow"
        >
          <span>View on GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={onClose}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </aside>
  );
};
