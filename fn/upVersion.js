import fs from "fs"

const packageJsonPath = "./package.json"
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

const versionParts = packageJson.version.split(".")
versionParts[2] = (Number.parseInt(versionParts[2], 10) + 1).toString()
packageJson.version = versionParts.join(".")

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8")

console.log("package.json actualizado correctamente a la versión", packageJson.version)

