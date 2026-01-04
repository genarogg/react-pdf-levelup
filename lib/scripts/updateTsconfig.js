import fs from "fs"

const updateTsconfig = () => {
    const tsconfigPath = "./tsconfig.json"
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"))

    tsconfig.compilerOptions.jsx = "react-jsx"

    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), "utf8")

    console.log("tsconfig.json actualizado correctamente")
}

export default updateTsconfig
