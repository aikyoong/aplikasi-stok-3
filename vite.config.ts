import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// plugin: [nodePolyfills({exclude: ["fs"],}),fs()]
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
