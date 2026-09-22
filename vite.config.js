import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      "/wikidata-api": {
        target: "https://query.wikidata.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wikidata-api/, "/sparql"),
      },
    },
  },
});
