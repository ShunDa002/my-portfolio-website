import React from 'react';
import Link from 'next/link';
import { Maximize2 } from 'lucide-react';
import { getWikiGraph } from '@/lib/wiki/pipeline';
import { WikiGraphView } from '@/components/wiki/WikiGraphView';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export async function WikiSection() {
  const result = await getWikiGraph();

  return (
    <section id="wiki" className="py-20 px-4 sm:px-6 w-full relative z-10">
      {/* Section Header */}
      <div className="w-[70vw] max-w-[70vw] mx-auto mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="block w-2 h-8 bg-cyan-glow rounded-full" />
          LLM Wiki Knowledge Graph
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Interactive visualization of notes, architectures, and syntheses from my personal AI vault.
        </p>
      </div>

      {/* Framed Window Container occupying 70% screen width */}
      <Card
        data-testid="wiki-window-frame"
        className="w-[70vw] max-w-[70vw] mx-auto rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/70 backdrop-blur-md shadow-2xl relative flex flex-col p-0"
      >
        {/* Window Chrome Titlebar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 select-none z-20">
          {/* Window control dots + title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/40" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/40" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/40" />
            </div>

            <span className="font-mono text-xs text-slate-400 font-medium pl-1 sm:pl-2 hidden sm:inline-block">
              vault://llm-wiki3/graph
            </span>
            <span className="font-mono text-xs text-slate-300 font-medium sm:hidden">
              Wiki Graph
            </span>

            {result.status === 'success' && (
              <Badge variant="glow" className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                {result.data.nodes.length} nodes
              </Badge>
            )}
          </div>

          {/* Expand Icon Button linking to /wiki */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="p-1.5 h-auto rounded-lg text-slate-400 hover:text-cyan-glow hover:bg-slate-800/60 transition-colors flex items-center gap-1.5 text-xs"
            >
              <Link
                href="/wiki"
                aria-label="Expand to full wiki page"
                title="Expand to full page"
              >
                <span className="hidden md:inline font-mono text-[11px] text-slate-400 hover:text-slate-200">
                  Expand
                </span>
                <Maximize2 className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Window Body */}
        <div className="relative w-full h-[70vh] bg-midnight/60 overscroll-contain">
          {result.status === 'success' && (
            <WikiGraphView initialData={result.data} isEmbedded={true} />
          )}

          {result.status === 'empty' && (
            <div
              data-testid="wiki-window-empty"
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
            >
              <p className="text-slate-300 text-sm max-w-md mb-4">{result.message}</p>
              {result.githubUrl && (
                <a
                  href={result.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-glow hover:underline"
                >
                  View repository on GitHub →
                </a>
              )}
            </div>
          )}

          {result.status === 'error' && (
            <div
              data-testid="wiki-window-error"
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
            >
              <p className="text-slate-300 text-sm max-w-md mb-4">{result.message}</p>
              <Button
                asChild
                variant="outline"
                className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs hover:bg-cyan-500/30 transition-colors"
              >
                <Link href="/wiki">
                  Open Wiki Page →
                </Link>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}
