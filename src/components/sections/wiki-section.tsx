import React from 'react';
import { GraphEmbed } from '@/components/wiki/GraphEmbed';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function WikiSection() {
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

            <Badge variant="glow" className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              embedded
            </Badge>
          </div>
        </div>

        {/* Window Body */}
        <div className="relative w-full h-[70vh] bg-midnight/60 overflow-hidden">
          <GraphEmbed
            cropHeader={true}
            showChat={false}
            height="100%"
            className="rounded-none border-0 shadow-none bg-transparent"
          />
        </div>
      </Card>
    </section>
  );
}
export default WikiSection;
