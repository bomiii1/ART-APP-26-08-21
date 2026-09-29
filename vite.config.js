import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/ART-APP-26-08-21/",
  predeploy: "npm run build",
  deploy: "gh-pages -d dist",
});
