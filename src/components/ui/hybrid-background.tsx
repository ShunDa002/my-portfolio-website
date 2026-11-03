"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import type { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribeToReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);

  query.addEventListener("change", onChange);

  return () => {
    query.removeEventListener("change", onChange);
  };
};

const usePrefersReducedMotion = () =>
  useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );

const initializeParticles = async (engine: Engine): Promise<void> => {
  await loadSlim(engine);
};

export const HybridBackground = () => {
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <div className="fixed inset-0 -z-30 h-full w-full overflow-hidden bg-midnight">
      {/* Z-0: Static background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-main.png"
          alt="Shinkai Night Sky"
          fill
          className="object-cover opacity-90"
          priority
          quality={90}
        />

        {/* Base gradient overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-b from-midnight/80 via-midnight/40 to-black/60" />
      </div>

      {/* Z-10: Starfield */}
      {!shouldReduceMotion && (
        <ParticlesProvider init={initializeParticles}>
          <div className="pointer-events-none absolute inset-0 z-10">
            <Particles
              id="tsparticles"
              className="h-full w-full"
              options={{
                fpsLimit: 120,

                fullScreen: {
                  enable: false,
                },

                particles: {
                  color: {
                    value: "#ffffff",
                  },

                  move: {
                    direction: "top",
                    enable: true,
                    outModes: {
                      default: "out",
                    },
                    random: false,
                    speed: 0.2,
                    straight: false,
                  },

                  number: {
                    density: {
                      enable: true,
                      width: 800,
                      height: 800,
                    },
                    value: 100,
                  },

                  opacity: {
                    value: {
                      min: 0.1,
                      max: 0.8,
                    },
                    animation: {
                      enable: true,
                      speed: 1,
                      sync: false,
                      startValue: "random",
                      destroy: "none",
                    },
                  },

                  shape: {
                    type: "circle",
                  },

                  size: {
                    value: {
                      min: 1,
                      max: 2,
                    },
                  },
                },

                responsive: [
                  {
                    maxWidth: 768,
                    options: {
                      particles: {
                        number: {
                          value: 40,
                        },
                      },
                    },
                  },
                ],

                detectRetina: true,
              }}
            />
          </div>
        </ParticlesProvider>
      )}

      {/* Decorative glows remain visible with reduced motion enabled */}
      <div className="pointer-events-none absolute -top-[20%] left-1/2 z-10 h-200 w-200 -translate-x-1/2 rounded-full bg-cyan-glow/10 blur-[120px] mix-blend-screen" />

      <div className="pointer-events-none absolute right-0 bottom-0 z-10 h-150 w-150 rounded-full bg-indigo-900/20 blur-[100px]" />
    </div>
  );
};

export default HybridBackground;
