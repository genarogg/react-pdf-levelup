import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Estructura asumida (hermanos en la raíz del monorepo):
//   raiz/
//   ├── frontend/        (Vite: genera dist/index.html + dist/studio.html)
//   └── studio/
//       ├── scripts/copy-playground.js   <- este archivo
//       └── playground/                  <- destino final
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
const studioPlayground = path.resolve(__dirname, '../playground');

console.log('📦 Copiando build del playground a studio/playground...');
console.log(`   origen:  ${frontendDist}`);
console.log(`   destino: ${studioPlayground}`);

// Carpetas a excluir del build de Studio (no son necesarias para el modo estudio)
const excludedDirs = ['templates', 'imgTemplates', 'asset'];
// Archivos a excluir del build de Studio
const excludedFiles = ['index.html', 'robots.txt'];

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    // Saltar carpetas excluidas
    if (entry.isDirectory() && excludedDirs.includes(entry.name)) {
      console.log(`   ⏭️  Excluyendo carpeta: ${entry.name}`);
      continue;
    }
    
    // Saltar archivos excluidos
    if (entry.isFile() && excludedFiles.includes(entry.name)) {
      console.log(`   ⏭️  Excluyendo archivo: ${entry.name}`);
      continue;
    }
    
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  if (!fs.existsSync(frontendDist)) {
    console.error(`❌ No existe ${frontendDist}.`);
    console.error('   Corré primero "npm run build:playground" (build de Vite) antes de copiar.');
    process.exit(1);
  }

  // Verificación explícita: si no está studio.html, el build de Vite
  // no generó lo que este CLI necesita para servir el estudio.
  const studioHtmlPath = path.join(frontendDist, 'studio.html');
  if (!fs.existsSync(studioHtmlPath)) {
    console.error(`❌ No se encontró studio.html en ${frontendDist}.`);
    console.error('   Revisá que vite.config.ts incluya "studio.html" en rollupOptions.input.');
    process.exit(1);
  }

  // Limpiar destino existente
  if (fs.existsSync(studioPlayground)) {
    fs.rmSync(studioPlayground, { recursive: true, force: true });
  }

  copyDirSync(frontendDist, studioPlayground);

  console.log('✅ Playground copiado correctamente a studio/playground');
  console.log('   Excluidas: templates/, imgTemplates/, asset/, index.html, robots.txt');
} catch (err) {
  console.error('❌ Error copiando el playground:', err);
  process.exit(1);
}
