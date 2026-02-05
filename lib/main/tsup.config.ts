import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["index.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  platform: "node",
  target: "esnext",
  clean: true,
  sourcemap: true,
  minify: true,
  splitting: false,
  treeshake: true,
  skipNodeModulesBundle: true,
  dts: true,
})
