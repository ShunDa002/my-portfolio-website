import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { WikiSection } from "@/components/sections/wiki-section";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <div className="w-full flex flex-col gap-24 pb-24">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <WikiSection />
      <Contact />
    </div>
  );
}
