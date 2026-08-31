import { ArrowUpRight, Terminal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/constant/projects_list";

export const Projects = () => {
  return (
    <section
      id="projects"
      className="py-20 px-6 max-w-6xl mx-auto relative z-10"
    >
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">
          Featured Projects
        </h2>
        <p className="text-slate-400">
          Bridging the gap between research and reality.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <Link
            key={idx}
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col justify-between space-y-4 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-800/50 hover:border-cyan-glow/30 transition-all duration-300"
          >
            <div>
              <div className="relative w-full mb-4 rounded-lg overflow-hidden bg-slate-800/50 border border-slate-700/50 group-hover:border-cyan-glow/40 transition-colors">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={1900}
                    height={946}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="aspect-[1900/946] w-full bg-linear-to-br from-slate-800 via-midnight to-slate-900 flex items-center justify-center">
                    <Terminal className="w-10 h-10 text-cyan-glow/40 group-hover:text-cyan-glow/60 transition-colors" />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-slate-100 group-hover:text-cyan-glow transition-colors">
                  {project.title}
                </h3>
                <div className="text-slate-400 group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {project.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-cyan-200/80 bg-cyan-900/20 px-2 py-1 rounded-md border border-cyan-900/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
