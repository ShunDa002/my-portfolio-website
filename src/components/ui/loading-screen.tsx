"use client";

import React from "react";
import Image from "next/image";
import { useLoading } from "@/components/providers/loading-provider";

export interface LoadingScreenProps {
  className?: string;
  forceLoading?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  className = "",
  forceLoading,
}) => {
  const { isLoading: contextLoading } = useLoading();
  const isLoading = forceLoading !== undefined ? forceLoading : contextLoading;

  return (
    <aside
      aria-label="Loading indicator"
      aria-live="polite"
      aria-busy={isLoading}
      data-testid="site-loader"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-midnight/95 backdrop-blur-md transition-opacity duration-500 ease-in-out ${isLoading
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
        } ${className}`}
    >
      <div className="relative flex flex-col items-center justify-center gap-4">
        <Image
          src="/loader.gif"
          alt="Loading animation"
          width={128}
          height={128}
          priority
          unoptimized
          className="object-contain drop-shadow-[0_0_25px_rgba(34,211,238,0.35)]"
        />
        <span className="sr-only">Loading content, please wait...</span>
      </div>
    </aside>
  );
};
