import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Contact = () => {
  const email = "tayshunda@gmail.com";

  return (
    <section
      id="contact"
      className="py-24 px-6 max-w-4xl mx-auto relative z-10 text-center"
    >
      <h2 className="text-3xl font-bold text-white mb-6">
        Let&apos;s Build Something Extraordinary
      </h2>
      <p className="text-slate-400 mb-10 max-w-xl mx-auto">
        Whether you have a question, a project idea, or just want to say hi,
        feel free to reach out.
      </p>

      <div className="flex items-center justify-center gap-6">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 hover:scale-110 transition-all"
        >
          <Link
            href={`mailto:${email}`}
            aria-label="Email"
          >
            <Mail className="w-6 h-6" />
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 hover:scale-110 transition-all"
        >
          <Link
            href="https://www.linkedin.com/in/tay-shon-da-74b208335"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            <FaLinkedin className="w-6 h-6" />
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 hover:scale-110 transition-all"
        >
          <Link
            href="https://github.com/ShunDa002"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
          >
            <SiGithub className="w-6 h-6" />
          </Link>
        </Button>
      </div>

      <footer className="mt-20 text-slate-600 text-sm">
        © 2026 Portfolio. Inspired by Makoto Shinkai&apos;s Artistry.
      </footer>
    </section>
  );
};
