import { fileURLToPath, URL } from "node:url";
import contentCollections from "@content-collections/vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

const deployment =
  process.env.ENVIRONMENT === "development"
    ? nitro()
    : cloudflare({ viteEnvironment: { name: "ssr" } });

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      "#cc": fileURLToPath(
        new URL("./.content-collections/generated", import.meta.url),
      ),
      "#p": fileURLToPath(new URL("./src/paraglide/messages", import.meta.url)),
      "#env": fileURLToPath(new URL("./src/env.ts", import.meta.url)),
      "#flags": fileURLToPath(new URL("./src/lib/flags.ts", import.meta.url)),
      "#c": fileURLToPath(
        new URL("./src/server/convex/_generated/api.d.ts", import.meta.url),
      ),
      "#cs": fileURLToPath(
        new URL("./src/server/convex/_generated/server.d.ts", import.meta.url),
      ),
      "#cdm": fileURLToPath(
        new URL(
          "./src/server/convex/_generated/dataModel.d.ts",
          import.meta.url,
        ),
      ),
      "~s": fileURLToPath(new URL("./src/server", import.meta.url)),
      "~pub": fileURLToPath(new URL("./public", import.meta.url)),
      "~": fileURLToPath(new URL("./src", import.meta.url)),
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  plugins: [
    devtools(),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      strategy: ["url", "baseLocale"],
    }),
    contentCollections(),
    deployment,
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
      sitemap: {
        enabled: true,
        host: "https://prism.djl.foundation",
      },
    }),
    viteReact(),
  ],
  server: {
    proxy: {
      "/ingest": {
        target: "https://eu.i.posthog.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ingest/, ""),
        secure: false,
      },
    },
  },
});

export default config;
