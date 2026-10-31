"use client";

import React from "react";
import { MousePointerClick, FileDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  const handleScrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const element = document.getElementById("projects");
    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: "smooth" });
      if (window.location.hash !== "#projects") {
        window.history.pushState(null, "", "#projects");
      }
    }
  };

  return (
    <section id="hero" className="relative flex flex-col items-center justify-center min-h-screen max-w-5xl mx-auto px-6 text-center z-10 selection:bg-cyan-glow/30">
      <div className="space-y-6">
        <h2 className="text-cyan-glow tracking-widest text-xs font-semibold uppercase opacity-0 animate-[fade-in-up_0.8s_ease-out_0.1s_forwards]">
          Tay&apos;s Portfolio
        </h2>
        <div className="opacity-0 animate-[fade-in-up_0.8s_ease-out_0.2s_forwards]">
          <p className="text-lg md:text-3xl text-slate-300 font-normal mb-2">
            Hey I am
          </p>
          <h1 className="text-6xl md:text-8xl font-mono italic font-extrabold tracking-tight text-cyan-glow">
            TAY SHON DA
          </h1>
        </div>
        <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto font-normal opacity-0 animate-[fade-in-up_0.8s_ease-out_0.3s_forwards]">
          Software Engineering Student from Universiti Malaysia Pahang Al-Sultan
          Abdullah, who is currently{" "}
          <span className="text-cyan-200">seeking for internship</span> in
          related to <span className="text-cyan-200">AI, LLMs</span>, and{" "}
          <span className="text-cyan-200">Computer Vision</span>.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[fade-in-up_0.8s_ease-out_0.4s_forwards]">
        <Button
          asChild
          variant="primary"
          size="lg"
          className="group relative overflow-hidden flex items-center gap-2"
        >
          <Link href="#projects" onClick={handleScrollToProjects}>
            <span className="relative z-10">View Projects</span>
            <MousePointerClick className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
        </Button>

        <Button
          asChild
          variant="glass"
          size="lg"
          className="group flex items-center gap-2"
        >
          <Link
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Download Resume</span>
            <FileDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </section>
  );
};
