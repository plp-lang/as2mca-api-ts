import { defineConfig } from "bunup";
import { exports, unused } from "bunup/plugins";

export default defineConfig({
  entry: "src/index.ts",
  format: ["esm", "cjs"],
  sourcemap: "linked",
  dts: true,
  target: "node",
  plugins: [exports(), unused()],
});
