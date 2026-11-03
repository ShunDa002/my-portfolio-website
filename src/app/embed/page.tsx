import React from 'react';
import { GraphEmbed } from '@/components/wiki/GraphEmbed';

interface EmbedPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmbedPage({ searchParams }: EmbedPageProps) {
  const resolvedParams = await searchParams;

  const note =
    typeof resolvedParams.note === 'string' ? resolvedParams.note : null;
  const cropHeader = resolvedParams.cropHeader === 'true';
  const showControls = resolvedParams.controls !== 'false';
  const showChat = resolvedParams.chat === 'true';

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#060b18]">
      <GraphEmbed
        note={note}
        cropHeader={cropHeader}
        showHostControls={showControls}
        showChat={showChat}
        height="100vh"
        className="rounded-none border-0"
      />
    </main>
  );
}
