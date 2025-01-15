import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Using import.meta.url to get the current directory
const dirname = new URL('.', import.meta.url).pathname;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/vite-react-deploy",
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src/"),
      "@assets": path.resolve(dirname, "./src/assets"),
    },
  },
});
