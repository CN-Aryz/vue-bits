import type { PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import autoImportPlugin from "./autoImport";
import dtsPlugin from "./dts";

const plugins: PluginOption[] = [
  vue({
    script: {
      propsDestructure: true,
    },
  }),
  ...autoImportPlugin,
  dtsPlugin,
  libInjectCss(),
];

export default plugins;
