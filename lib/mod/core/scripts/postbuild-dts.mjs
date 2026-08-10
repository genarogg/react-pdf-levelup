import { copyFileSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

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