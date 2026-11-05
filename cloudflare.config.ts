import { bindings, defineConfig, defineWorker } from "cf/config";
import { loadEnv } from "vite";

const env = loadEnv("production", process.cwd(), "");

export default defineConfig({
  worker: defineWorker({
    name: "my-portfolio",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-30",
    compatibilityFlags: ["nodejs_compat"],

    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },

    env: {
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),

      VINEXT_KV_CACHE: bindings.kv(),

      MY_GITHUB_USERNAME: bindings.text(
        env.MY_GITHUB_USERNAME || process.env.MY_GITHUB_USERNAME || "ShunDa002"
      ),
      GITHUB_TOKEN: bindings.text(
        env.GITHUB_TOKEN || process.env.GITHUB_TOKEN || ""
      ),
    },
  }),
});
