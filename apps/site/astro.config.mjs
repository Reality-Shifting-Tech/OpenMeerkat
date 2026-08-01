import { defineConfig } from "astro/config"

export default defineConfig({
  // Placeholder domain; update when the site is deployed.
  site: "https://openmeerkat.dev",
  output: "static",
  build: {
    // Same zod-v4 defaults regression as image.remotePatterns below: build
    // dirs are left undefined and the manifest plugin crashes on
    // fileURLToPath(undefined). Set them explicitly until astro is bumped.
    client: "./dist/client/",
    server: "./dist/server/",
  },
  // Workaround for a regression in the installed astro 5.18.2 (zod v4): the
  // default for image.remotePatterns is not applied, and the config
  // refinement crashes on undefined.length. An explicit empty array fixes it.
  // Remove once the repo's astro is bumped or pinned to a fixed version.
  image: {
    remotePatterns: [],
  },
})
