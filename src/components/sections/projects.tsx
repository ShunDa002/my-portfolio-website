"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowUpRight, Terminal } from "lucide-react";
import type { Project } from "@/types/project";
import { getYouTubeEmbedUrl } from "@/lib/video";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/components/providers/loading-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface ProjectsProps {
  initialProjects?: Project[];
}

export const Projects = ({ initialProjects }: ProjectsProps = {}) => {
  const [dynamicProjects, setDynamicProjects] = useState<Project[] | null>(
    null,
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { registerVideo, notifyVideoLoaded } = useLoading();

  useEffect(() => {
    let isMounted = true;
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (
          isMounted &&
          Array.isArray(data.projects) &&
          data.projects.length > 0
        ) {
          setDynamicProjects(data.projects);
        }
      })
      .catch((err) => {
        console.warn(
          "Failed to fetch dynamic projects from /api/projects:",
          err,
        );
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const projectItems = useMemo(
    () =>
      dynamicProjects && dynamicProjects.length > 0
        ? dynamicProjects
        : initialProjects ?? [],
    [dynamicProjects, initialProjects]
  );

  useEffect(() => {
    projectItems.forEach((project) => {
      if (project.video && getYouTubeEmbedUrl(project.video)) {
        registerVideo(project.title);
      }
    });
  }, [projectItems, registerVideo]);

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 w-full relative z-10">
      <div className="w-[70vw] max-w-[70vw] mx-auto mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">
          Featured Projects
        </h2>
        <p className="text-slate-400">
          Bridging the gap between research and reality.
        </p>
      </div>

      <div className="w-[70vw] max-w-[70vw] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {projectItems.map((project, idx) => {
          const embedUrl = getYouTubeEmbedUrl(project.video);

          return (
            <Card
              key={idx}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${project.title}`}
              onClick={() => setSelectedProject(project)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedProject(project);
                }
              }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl p-0 border border-slate-800/80 bg-slate-900/50 backdrop-blur-md hover:bg-slate-800/40 hover:border-cyan-glow/40 transition-all duration-300 shadow-xl shadow-black/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60 focus-visible:border-cyan-glow/60"
            >
              <AspectRatio
                ratio={16 / 9}
                className="relative w-full overflow-hidden bg-slate-950 border-b border-slate-800/70 group-hover:border-cyan-glow/30 transition-colors shadow-inner"
              >
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={`${project.title} demonstration video`}
                    className="w-full h-full border-0 pointer-events-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    onLoad={() => notifyVideoLoaded(project.title)}
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-slate-900 via-midnight to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                    <div className="p-4 rounded-full bg-cyan-950/50 border border-cyan-800/50 mb-3 shadow-lg shadow-cyan-950/30">
                      <Terminal className="w-10 h-10 text-cyan-glow/80 group-hover:text-cyan-glow transition-colors" />
                    </div>
                    <span className="text-sm font-mono text-slate-300">
                      Demo in Repository
                    </span>
                  </div>
                )}
              </AspectRatio>

              <CardContent className="p-4 sm:p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl font-bold tracking-wide text-slate-100 group-hover:text-cyan-glow transition-colors">
                    {project.title}
                  </CardTitle>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="cyan"
                      className="text-xs px-2.5 py-0.5 sm:py-1 rounded-md"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProject(null);
          }
        }}
      >
        <DialogContent className="max-w-5xl w-[94vw] max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-slate-900/95 backdrop-blur-2xl border-slate-700/60 shadow-2xl shadow-black/80">
          {selectedProject &&
            (() => {
              const dialogEmbedUrl = selectedProject.video
                ? getYouTubeEmbedUrl(selectedProject.video, {
                    autoplay: true,
                    mute: true,
                    loop: false,
                    controls: true,
                    disablekb: false,
                    modestbranding: true,
                    rel: false,
                  })
                : null;

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pt-2">
                  {/* Dominant 16:9 Video Column */}
                  <div className="lg:col-span-7 w-full flex flex-col space-y-3">
                    <AspectRatio
                      ratio={16 / 9}
                      className="relative w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-700/70 shadow-2xl"
                    >
                      {dialogEmbedUrl ? (
                        <iframe
                          src={dialogEmbedUrl}
                          title={`${selectedProject.title} demonstration video player`}
                          className="w-full h-full border-0"
                          tabIndex={-1}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-slate-900 via-midnight to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                          <div className="p-4 rounded-full bg-cyan-950/60 border border-cyan-800/60 mb-3 shadow-lg shadow-cyan-950/40">
                            <Terminal className="w-12 h-12 text-cyan-glow" />
                          </div>
                          <span className="text-sm font-mono text-slate-300">
                            Demonstration available in repository
                          </span>
                        </div>
                      )}
                    </AspectRatio>
                  </div>

                  {/* Narrative & Details Column */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-6 h-full">
                    <div className="space-y-4">
                      <DialogHeader className="text-left space-y-2">
                        <DialogTitle className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                          {selectedProject.title}
                        </DialogTitle>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {selectedProject.tags.map((tag) => (
                            <Badge key={tag} variant="cyan">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </DialogHeader>

                      <DialogDescription className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
                        {selectedProject.description}
                      </DialogDescription>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between sm:justify-start gap-4">
                      {selectedProject.demo && (
                        <Button
                          asChild
                          variant="primary"
                          size="default"
                          className="group inline-flex items-center gap-2"
                        >
                          <a
                            href={selectedProject.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>View demo</span>
                            <ArrowUpRight className="w-4 h-4 text-midnight group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </a>
                        </Button>
                      )}
                      <Button
                        asChild
                        variant={selectedProject.demo ? "secondary" : "primary"}
                        size="default"
                        className="group inline-flex items-center gap-2"
                      >
                        <a
                          href={selectedProject.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>View on GitHub</span>
                          <ArrowUpRight
                            className={
                              selectedProject.demo
                                ? "w-4 h-4 text-slate-400 group-hover:text-cyan-glow group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                                : "w-4 h-4 text-midnight group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                            }
                          />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>
    </section>
  );
};
