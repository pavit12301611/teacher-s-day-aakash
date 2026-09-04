import { defineConfig, type UserConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));

const previewHosts = [".e2b.app", ".localhost", "localhost"];

export default defineConfig({
  server: {
    host: true,
    allowedHosts: previewHosts
  },
  preview: {
    host: true,
    allowedHosts: previewHosts
  },
  build: {
    rollupOptions: {
      // True multi-page app: every HTML file below becomes its own page.
      // Each teacher's dedication lives at /teacher.html?id=<teacher-id>
      // and is linked as a real page (back button, shareable URL, SEO title).
      input: {
        home: resolve(here, "index.html"),
        teachers: resolve(here, "teachers.html"),
        teacher: resolve(here, "teacher.html"),
        category: resolve(here, "category.html"),
        memories: resolve(here, "memories.html"),
        about: resolve(here, "about.html"),
        design: resolve(here, "design.html")
      }
    }
  }
} satisfies UserConfig);
