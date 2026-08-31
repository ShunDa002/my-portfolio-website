import React from "react";
import type { IconType } from "react-icons";
import {
  SiPython,
  SiPytorch,
  SiLangchain,
  SiOpencv,
  SiHuggingface,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiDocker,
  SiGit,
  SiLinux,
  SiSupabase,
} from "react-icons/si";

const SkillPill = ({ icon: Icon, name }: { icon: IconType; name: string }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-800/50 hover:border-cyan-glow/30 transition-all group hover:bg-slate-800/60 duration-300">
    <Icon className="w-5 h-5 text-slate-400 group-hover:text-cyan-glow transition-colors" />
    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
      {name}
    </span>
  </div>
);

export const Skills = () => {
  return (
    <section
      id="skills"
      className="py-20 px-6 max-w-5xl mx-auto relative z-10 space-y-12"
    >
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Technical Skills</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Tools I use to build intelligent, scalable, and beautiful software.
        </p>
      </div>

      <div className="space-y-8">
        {/* AI/ML */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-cyan-glow uppercase tracking-wider border-b border-slate-800 pb-2 mb-4 inline-block">
            AI & Computer Vision
          </h3>
          <div className="flex flex-wrap gap-3">
            <SkillPill icon={SiPython} name="Python" />
            <SkillPill icon={SiPytorch} name="PyTorch" />
            <SkillPill icon={SiLangchain} name="LangChain" />
            <SkillPill icon={SiHuggingface} name="Hugging Face" />
            <SkillPill icon={SiOpencv} name="OpenCV" />
          </div>
        </div>

        {/* Web */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-cyan-glow uppercase tracking-wider border-b border-slate-800 pb-2 mb-4 inline-block">
            Full Stack Web
          </h3>
          <div className="flex flex-wrap gap-3">
            <SkillPill icon={SiNextdotjs} name="Next.js" />
            <SkillPill icon={SiReact} name="React" />
            <SkillPill icon={SiTypescript} name="TypeScript" />
            <SkillPill icon={SiTailwindcss} name="Tailwind CSS" />
          </div>
        </div>

        {/* DevOps */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-cyan-glow uppercase tracking-wider border-b border-slate-800 pb-2 mb-4 inline-block">
            DevOps & Cloud
          </h3>
          <div className="flex flex-wrap gap-3">
            <SkillPill icon={SiDocker} name="Docker" />
            <SkillPill icon={SiGit} name="Git" />
            <SkillPill icon={SiLinux} name="Linux" />
            <SkillPill icon={SiSupabase} name="Supabase" />
          </div>
        </div>
      </div>
    </section>
  );
};
