import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { WikiSection } from "@/components/sections/wiki-section";
import { Contact } from "@/components/sections/contact";
import { getFeaturedProjects } from "@/lib/github";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const projects = await getFeaturedProjects();

  return (
    <div className="w-full flex flex-col gap-24 pb-24">
      <Hero />
      <About />
      <Skills />
      <Projects initialProjects={projects} />
      <WikiSection />
      <Contact />
    </div>
  );
}
