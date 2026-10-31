"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "About", href: "/#about", targetId: "about" },
  { name: "Skills", href: "/#skills", targetId: "skills" },
  { name: "Projects", href: "/#projects", targetId: "projects" },
  { name: "Wiki Graph", href: "/#wiki", targetId: "wiki" },
  { name: "Contact", href: "/#contact", targetId: "contact" },
];

export const Header = () => {
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    const element = document.getElementById(targetId);
    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: "smooth" });
      const targetHash = `#${targetId}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, "", `/#${targetId}`);
      }
    }
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-6 opacity-0 animate-fade-in-up">
      <nav className="flex items-center gap-6 px-8 py-4 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
        {navItems.map((item) => (
          <Button
            key={item.targetId}
            asChild
            variant="ghost"
            className="h-auto p-0 text-sm font-medium text-slate-300 hover:text-cyan-glow hover:bg-transparent transition-colors"
          >
            <Link
              href={item.href}
              onClick={(e) => handleNavClick(e, item.targetId)}
            >
              {item.name}
            </Link>
          </Button>
        ))}
      </nav>
    </header>
  );
};
