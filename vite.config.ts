import { dirname, resolve } from "node:path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import buildConfig from "./build/config";
import plugins from "./build/plugins";

// Convert import.meta.url to __dirname equivalent
const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins,
  build: buildConfig,
  resolve: {
    alias: {
      "@": "/src",
      "@utils": resolve(__dirname, "src/utils"),
    },
  },
});
