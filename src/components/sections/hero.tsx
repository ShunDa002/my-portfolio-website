import React from "react";
import { MousePointerClick, FileDown } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
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
          <h1 className="text-6xl md:text-8xl font-mono italic font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-cyan-glow to-blue-600">
            TAY SHON DA
          </h1>
        </div>
        <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto font-normal opacity-0 animate-[fade-in-up_0.8s_ease-out_0.3s_forwards]">
          Software Engineering Student from Universiti Malaysia Pahang Al-Sultan
          Abdullah, who is currently{" "}
          <span className="text-indigo-400">seeking for internship</span> in
          related to <span className="text-cyan-200">AI, LLMs</span>, and{" "}
          <span className="text-cyan-200">Computer Vision</span>.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[fade-in-up_0.8s_ease-out_0.4s_forwards]">
        <Link
          href="#projects"
          className="group relative px-8 py-3 rounded-full bg-cyan-glow text-midnight font-semibold shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all flex items-center gap-2 overflow-hidden"
        >
          <span className="relative z-10">View Projects</span>
          <MousePointerClick className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </Link>

        <Link
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="group px-8 py-3 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50 text-slate-200 hover:bg-slate-800/50 hover:border-cyan-glow/30 transition-all flex items-center gap-2"
        >
          <span>Download Resume</span>
          <FileDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
