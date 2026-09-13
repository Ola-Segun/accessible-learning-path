import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 8080,
    strictPort: true,
    host: "::",
  },
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    // SSR entry is src/server.ts, which wraps the Start handler so an error h3
    // has already swallowed still renders a real page instead of raw JSON.
    tanstackStart({ server: { entry: "server" } }),
    // Preset pinned rather than auto-detected, so a local build targets the
    // same runtime the deploy does. The worker name is pinned too — otherwise
    // nitro derives one from the git remote, and `wrangler deploy` would ignore
    // the project name set in the Cloudflare dashboard.
    nitro({
      preset: "cloudflare-module",
      cloudflare: { wrangler: { name: "learning-library" } },
    }),
    viteReact(),
  ],
});
