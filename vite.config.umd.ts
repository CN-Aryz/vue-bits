import { resolve } from "node:path";
import { defineConfig } from "vite";
import plugins from "./build/plugins";

// https://vite.dev/config/
export default defineConfig({
  plugins,
  build: {
    lib: {
      name: "VueBits",
      entry: resolve(__dirname, "./src/index.ts"),
      formats: ["umd"],
      fileName: (format) => {
        return `${format}/index.js`;
      },
      cssFileName: "styles.css",
    },
    rollupOptions: {
      external: ["vue", "vue/jsx-runtime"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
    emptyOutDir: false,
    sourcemap: true,
    minify: "terser",
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      "@": "/src",
      "@utils": resolve(__dirname, "src/utils"),
    },
  },
});
