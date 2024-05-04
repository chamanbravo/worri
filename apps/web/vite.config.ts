import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BACKEND_URL = "http://localhost:8000";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": {
        target: BACKEND_URL,
        changeOrigin: true,
        headers: {
          origin: BACKEND_URL,
        },
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "./runtimeConfig",
        replacement: "./runtimeConfig.browser",
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
      // Reference: https://github.com/vercel/turbo/discussions/620#discussioncomment-2136195
      {
        find: "@ui",
        replacement: path.resolve(__dirname, "../../packages/ui/src"),
      },
    ],
  },
});
