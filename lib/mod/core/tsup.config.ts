import { defineConfig } from "tsup"
import { copyFileSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

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
  onSuccess: async () => {
    // Copiamos assets.d.ts (declaraciones globales de módulos para
    // imágenes: *.jpg, *.png, *.svg, etc.) a dist/ y nos aseguramos de
    // que index.d.ts / index.d.cts lo referencien con una triple-slash
    // reference. Se hace acá "a mano" (en vez de confiar en que el
    // bundler de tipos preserve la referencia) para que quede
    // garantizado en cada build, sin importar cómo procese tsup los
    // comentarios /// <reference> del entry point.
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
})
