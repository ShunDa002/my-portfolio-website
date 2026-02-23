"use client";

import { SiLinkedin, SiGithub } from "react-icons/si";
import { Mail } from "lucide-react";
import Link from "next/link";

export const Contact = () => {
  const email = "tayshunda@gmail.com"; // Placeholder email

  return (
    <section
      id="contact"
      className="py-24 px-6 max-w-4xl mx-auto relative z-10 text-center"
    >
      <h2 className="text-3xl font-bold text-white mb-6">
        Let's Build Something Extraordinary
      </h2>
      <p className="text-slate-400 mb-10 max-w-xl mx-auto">
        Whether you have a question, a project idea, or just want to say hi,
        feel free to reach out.
      </p>

      <div className="flex items-center justify-center gap-6">
        <Link
          href={`mailto:${email}`}
          className="group relative p-3 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 hover:scale-110 transition-all"
          aria-label="Email"
        >
          <Mail className="w-6 h-6" />
        </Link>

        <Link
          href="www.linkedin.com/in/tay-shon-da-74b208335"
          target="_blank"
          className="p-3 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 hover:scale-110 transition-all"
        >
          <SiLinkedin className="w-6 h-6" />
        </Link>
        <Link
          href="https://github.com/ShunDa002"
          target="_blank"
          className="p-3 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 hover:scale-110 transition-all"
        >
          <SiGithub className="w-6 h-6" />
        </Link>
      </div>

      <footer className="mt-20 text-slate-600 text-sm">
        © 2026 Portfolio. Inspired by Makoto Shinkai's Artistry.
      </footer>
    </section>
  );
};
