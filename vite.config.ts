import { defineConfig, loadEnv } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import { kvDataAdapter } from "@vinext/cloudflare/cache/kv-data-adapter";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const username = env.MY_GITHUB_USERNAME || process.env.MY_GITHUB_USERNAME || "ShunDa002";
  const token = env.GITHUB_TOKEN || process.env.GITHUB_TOKEN || "";

  return {
    cacheDir: "/tmp/my-portfolio-vite-cache",
    define: {
      "process.env.MY_GITHUB_USERNAME": JSON.stringify(username),
      "process.env.GITHUB_TOKEN": JSON.stringify(token),
    },
    plugins: [
      vinext({
        images: { optimizer: imagesOptimizer() },
        cache: {
          data: kvDataAdapter(),
        },
      }),
      cloudflare({
        viteEnvironment: {
          name: "rsc",
          childEnvironments: ["ssr"],
        },
      }),
    ],
  };
});
