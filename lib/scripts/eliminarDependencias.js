import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const publicar = () => {
  const cwd = process.cwd();
  const packageJsonPath = path.join(cwd, "package.json");
  const backupPath = path.join(cwd, "package.json.bak");

  // 1. Si no existe package.json, créalo vacío
  if (!fs.existsSync(packageJsonPath)) {
    fs.writeFileSync(packageJsonPath, JSON.stringify({}, null, 2), "utf8");
  }

  // 2. Crear copia de seguridad
  fs.copyFileSync(packageJsonPath, backupPath);

  // 3. Leer package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  // Lista blanca: solo estas dependencias se mantendrán
  const depsToKeep = [
    "canvas",
    "jsdom",
    "qr-code-styling",
    "react",
    "react-dom",
    "react-pdf",
    "@react-pdf/renderer"
  ];

  // Crear un Set para búsqueda más eficiente
  const keepSet = new Set(depsToKeep);

  // Función para filtrar dependencias
  const filterDeps = (deps) => {
    if (!deps) return undefined;
    const filtered = {};
    for (const [key, value] of Object.entries(deps)) {
      if (keepSet.has(key)) {
        filtered[key] = value;
      }
    }
    return Object.keys(filtered).length > 0 ? filtered : undefined;
  };

  // 4. Filtrar todas las secciones de dependencias
  packageJson.dependencies = filterDeps(packageJson.dependencies);
  packageJson.devDependencies = filterDeps(packageJson.devDependencies);
  packageJson.peerDependencies = filterDeps(packageJson.peerDependencies);

  // 5. Guardar cambios
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8");

  try {
    // 6. Compilar y publicar
    execSync("npm run build", { stdio: "inherit" });
    execSync("npm publish", { stdio: "inherit" });

    // 7. Restaurar package.json original
    fs.copyFileSync(backupPath, packageJsonPath);
    fs.unlinkSync(backupPath);

    console.log("Publicación exitosa y package.json restaurado.");
  } catch (error) {
    // Si hay error, restaurar el backup
    fs.copyFileSync(backupPath, packageJsonPath);
    fs.unlinkSync(backupPath);
    console.error("Error en el proceso. Se restauró el package.json original.");
    console.log(error)
    process.exit(1);
  }
};

export default publicar;