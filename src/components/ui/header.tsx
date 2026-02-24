import React from "react";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-6 opacity-0 animate-fade-in-up">
      <nav className="flex items-center gap-6 px-8 py-4 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
        <Link
          href="#about"
          className="text-sm font-medium text-slate-300 hover:text-cyan-glow transition-colors"
        >
          About
        </Link>
        <Link
          href="#skills"
          className="text-sm font-medium text-slate-300 hover:text-cyan-glow transition-colors"
        >
          Skills
        </Link>
        <Link
          href="#projects"
          className="text-sm font-medium text-slate-300 hover:text-cyan-glow transition-colors"
        >
          Projects
        </Link>
        <Link
          href="#contact"
          className="text-sm font-medium text-slate-300 hover:text-cyan-glow transition-colors"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
};
