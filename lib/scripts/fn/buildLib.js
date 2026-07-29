import path from "path";
import { execSync } from "child_process";
import cleanBarrelFile from "./cleanBarrelFile.js";
import libConfig, { BARRELS } from "../libConfig.js";

/**
 * Compila una lib (mod/<lib>) corriendo "npm run build:lib" adentro de
 * libPath, pero antes poda temporalmente los barrels reales
 * (components/core y functions) para que tsup solo empaquete los símbolos
 * que esa lib realmente usa, evitando arrastrar código de las demás libs
 * al bundle publicado. Restaura ambos barrels al terminar, tanto en
 * éxito como en error (lo maneja cleanBarrelFile internamente).
 *
 * - Si la lib no tiene entrada para un barrel en libConfig, ese barrel
 *   no se toca (no se le pasa una lista vacía de símbolos).
 * - Si la lib no usa NINGÚN barrel (ej. "studio", que no tiene entrada
 *   en libConfig en absoluto), se saltea el enganche de cleanBarrelFile
 *   por completo y se corre el build tal cual.
 *
 * @param {string} lib - nombre de la lib (ej. "core", "qr", "studio")
 * @param {string} libPath - ruta absoluta a mod/<lib>
 * @param {string} basePath - raíz del repo de build (process.cwd())
 */
const buildLib = async (lib, libPath, basePath) => {
  const runBuild = () => {
    execSync("npm run build:lib", { cwd: libPath, stdio: "inherit" });
  };

  const config = libConfig[lib];

  // studio (u otra lib futura sin barrels) -> build directo, sin poda.
  if (!config) {
    console.log(`[${lib}] No usa ningún barrel, build directo (sin poda).`);
    runBuild();
    return;
  }

  const componentsBarrelPath = path.resolve(basePath, BARRELS.components);
  const functionsBarrelPath = path.resolve(basePath, BARRELS.functions);

  const hasComponents = Array.isArray(config.components);
  const hasFunctions = Array.isArray(config.functions);

  // Anidamos: podar components/core -> (dentro) podar functions ->
  // (dentro) correr el build real. cleanBarrelFile restaura cada barrel
  // que tocó, en orden inverso, tanto si el build tiene éxito como si
  // falla.
  const buildWithFunctionsPruned = async () => {
    if (!hasFunctions) {
      runBuild();
      return;
    }
    await cleanBarrelFile(functionsBarrelPath, config.functions, async () => {
      runBuild();
    });
  };

  if (!hasComponents) {
    await buildWithFunctionsPruned();
    return;
  }

  await cleanBarrelFile(componentsBarrelPath, config.components, async () => {
    await buildWithFunctionsPruned();
  });
};

export default buildLib;
