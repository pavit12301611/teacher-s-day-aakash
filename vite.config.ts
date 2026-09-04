import { defineConfig, type UserConfig } from "vite";

const previewHosts = [".e2b.app", ".localhost", "localhost"];

export default defineConfig({
  server: {
    host: true,
    allowedHosts: previewHosts
  },
  preview: {
    host: true,
    allowedHosts: previewHosts
  }
} satisfies UserConfig);
