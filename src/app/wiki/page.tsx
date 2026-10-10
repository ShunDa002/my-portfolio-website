import React from 'react';
import type { Metadata } from 'next';
import { getWikiGraph } from '@/lib/wiki/pipeline';
import { WikiGraphView } from '@/components/wiki/WikiGraphView';
import { WikiFailureState } from '@/components/wiki/WikiFailureState';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'LLM Wiki Knowledge Graph | Tay Shon Da',
  description:
    'Interactive knowledge graph of the LLM Wiki vault exploring AI agent architecture, indexing, and retrieval.',
};

export default async function WikiPage() {
  const result = await getWikiGraph();

  return (
    <div className="relative w-full h-[100svh] pt-20 pb-2 px-2 sm:px-6 flex flex-col items-center justify-center bg-midnight/80 backdrop-blur-md overflow-hidden">
      {result.status === 'success' && <WikiGraphView initialData={result.data} />}

      {result.status === 'empty' && (
        <WikiFailureState
          type="empty"
          message={result.message}
          githubUrl={result.githubUrl}
        />
      )}

      {result.status === 'error' && (
        <WikiFailureState
          type={result.reason}
          message={result.message}
        />
      )}
    </div>
  );
}
