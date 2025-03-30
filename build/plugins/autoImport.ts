import type { PluginOption } from "vite";
import AutoImport from "unplugin-auto-import/vite";

const plugins: PluginOption[] = [
  AutoImport({
    imports: ["vue"],
    dts: "src/auto-import.d.ts",
  }),
];

export default plugins;
