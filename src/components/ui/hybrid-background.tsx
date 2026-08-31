"use client";

import React, { useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribeToReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

// Framer Motion's useReducedMotion snapshots the preference and never updates,
// so a mid-session change left the starfield running. Subscribing to the media
// query keeps the layer in sync in both directions. The server snapshot is
// false so the hydration render matches the markup the server produced; React
// then reads the real preference and drops the layer if it is set.
const usePrefersReducedMotion = () =>
  useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );

export const HybridBackground = () => {
  const shouldReduceMotion = usePrefersReducedMotion();

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="fixed inset-0 -z-30 h-full w-full overflow-hidden bg-midnight">
      {/* Z-0: Static Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-main.png"
          alt="Shinkai Night Sky"
          fill
          className="object-cover opacity-90"
          priority
          quality={90}
        />
        {/* Base Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-b from-midnight/80 via-midnight/40 to-black/60" />
      </div>

      {/* Z-10: Particles (Starfield). Skipped entirely under a reduced-motion
          preference - the static image, gradient and glows still read as a night sky. */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
              fpsLimit: 120,
              fullScreen: { enable: false },
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
                  speed: 0.2, // Slow vertical drift
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 100,
                },
                opacity: {
                  value: { min: 0.1, max: 0.8 },
                  animation: {
                    enable: true,
                    speed: 1, // Twinkle effect
                    sync: false,
                    minimumValue: 0.1,
                  },
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 1, max: 2 },
                },
              },
              // Lower density below the tablet threshold so a phone spends less
              // of its frame budget on ambient motion.
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
            className="w-full h-full"
          />
        </div>
      )}

      {/* Decorative Glows (Keeping these for extra atmosphere, placed between layers or on top of particles) */}
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-200 h-200 bg-cyan-glow/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-10" />
      <div className="absolute bottom-0 right-0 w-150 h-150 bg-indigo-900/20 blur-[100px] rounded-full pointer-events-none z-10" />
    </div>
  );
};
