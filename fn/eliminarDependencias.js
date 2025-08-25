
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

  // 3. Leer y modificar package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const depsToRemove = [
    "@babel/standalone",
    "@monaco-editor/react",
    "@radix-ui/react-dialog",
    "@radix-ui/react-icons",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-tabs",
    "@radix-ui/react-tooltip",
    "autoprefixer",
    "class-variance-authority",
    "lucide-react",
    "react-router-dom",
    "rimraf",
    "tailwind-merge",
    "tailwindcss",
    "@eslint/js",
    "@react-pdf/types",
    "@types/jsdom",
    "@types/qrcode",
    "@types/react",
    "@types/react-dom",
    "@vitejs/plugin-react",
    "eslint",
    "eslint-plugin-react-hooks",
    "eslint-plugin-react-refresh",
    "globals",
    "json",
    "ts-node",
    "tsup",
    "tsx",
    "typescript",
    "typescript-eslint",
    "vite"
  ];

  // Eliminar de devDependencies, dependencies y peerDependencies
  for (const dep of depsToRemove) {
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      delete packageJson.devDependencies[dep];
    }
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      delete packageJson.dependencies[dep];
    }
    if (packageJson.peerDependencies && packageJson.peerDependencies[dep]) {
      delete packageJson.peerDependencies[dep];
    }
  }

  // 4. Guardar cambios
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8");

  try {
    // 5. Compilar y publicar
    execSync("npm run build-lib", { stdio: "inherit" });
    execSync("npm publish", { stdio: "inherit" });

    // 6. Restaurar package.json original
    fs.copyFileSync(backupPath, packageJsonPath);
    fs.unlinkSync(backupPath);

    console.log("Publicación exitosa y package.json restaurado.");
  } catch (error) {
    // Si hay error, restaurar el backup
    fs.copyFileSync(backupPath, packageJsonPath);
    fs.unlinkSync(backupPath);
    console.error("Error en el proceso. Se restauró el package.json original.");
    process.exit(1);
  }
}

export default publicar;