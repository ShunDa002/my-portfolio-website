import React from "react";
import Image from "next/image";

export const About = () => {
  return (
    <section id="about" className="py-20 px-6 max-w-6xl mx-auto relative z-10">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Bio Column */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="block w-2 h-8 bg-cyan-glow rounded-full" />
            About Me
          </h2>

          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 p-8 rounded-2xl relative overflow-hidden group hover:border-cyan-glow/20 transition-colors">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-glow/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

            <p className="text-slate-300 leading-relaxed text-lg">
              I am a final year <strong>Software Engineering</strong> student at{" "}
              <span className="text-cyan-200">
                Universiti Malaysia Pahang Al-Sultan Abdullah
              </span>
              , driven by a deep passion for <strong>Agentic AI</strong> and its
              applications in FinTech. My work centers on building intelligent
              systems capable of autonomous reasoning and complex
              problem-solving. Whether I am fine-tuning{" "}
              <strong>Computer Vision</strong> models for deepfake detection or
              enabling LLMs to autonomously analyze real-time stock market data
              , I am dedicated to translating theoretical AI into practical,
              high-impact solutions.
            </p>
          </div>
        </div>

        {/* Photo Column (Placeholder for Phase 1) */}
        <div className="relative group">
          <div className="absolute inset-0 bg-cyan-glow/20 blur-[50px] rounded-full opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
          <div className="relative aspect-square max-w-sm mx-auto overflow-hidden rounded-2xl border-2 border-cyan-glow/30 shadow-[0_0_40px_rgba(34,211,238,0.2)] bg-slate-900/80">
            <div className="w-full h-full bg-linear-to-br from-slate-800 via-midnight to-slate-900 flex items-center justify-center text-slate-600 font-mono">
              <Image
                src="/images/profile.png"
                alt="Hero Image"
                width={600}
                height={600}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
