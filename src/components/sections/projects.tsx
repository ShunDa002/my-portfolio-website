import { ArrowUpRight } from "lucide-react";
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
          <div
            key={idx}
            className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-800/50 hover:border-cyan-glow/30 transition-all duration-300"
          >
            <div className="flex flex-col h-full justify-between space-y-4">
              <Link href={project.githubLink}>
                <div className="relative w-full mb-4 rounded-lg overflow-hidden bg-slate-800/50 border border-slate-700/50 group-hover:border-cyan-glow/40 transition-colors">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={1900}
                    height={946}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-slate-100 group-hover:text-cyan-glow transition-colors">
                    {project.title}
                  </h3>
                  <div className="text-slate-400 hover:text-white transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
              </Link>
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
