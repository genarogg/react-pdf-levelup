import { defineConfig } from "tsup"
import { copyFileSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

export default defineConfig([
  {
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
    dts: false,
  },
  {
    entry: ["index.ts"],
    outDir: "dist",
    dts: { only: true },
    clean: false, // clave: no debe borrar lo que acaba de escribir el paso anterior
    onSuccess: async () => {
      const outDir = "dist"
      copyFileSync("assets.d.ts", join(outDir, "assets.d.ts"))

      for (const file of ["index.d.ts", "index.d.cts"]) {
        const filePath = join(outDir, file)
        const reference = `/// <reference path="./assets.d.ts" />\n\n`
        const content = readFileSync(filePath, "utf-8")
        if (!content.includes(reference.trim())) {
          writeFileSync(filePath, reference + content)
        }
      }
    },
  },
])