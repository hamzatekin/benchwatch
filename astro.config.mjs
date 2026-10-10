// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solid from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";

// Pages are prerendered by default and served as static assets from the edge.
// Add `export const prerender = false` to any route that needs the Worker at request time.
export default defineConfig({
  // "compile" optimises images at build time, so no Cloudflare Images binding is needed.
  adapter: cloudflare({ imageService: "compile" }),
  // Nothing uses Astro sessions. Leaving them on makes the adapter add a SESSION KV binding with no id,
  // which only `wrangler deploy` can auto-create, so preview builds (`wrangler versions upload`) failed.
  session: false,
  integrations: [solid()],
  vite: {
    plugins: [tailwindcss()],
  },
});
