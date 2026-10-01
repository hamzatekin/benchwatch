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
  integrations: [solid()],
  vite: {
    plugins: [tailwindcss()],
  },
});
