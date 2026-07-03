import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDist = path.resolve(__dirname, '../../../frontend/dist');
const cliPublic = path.resolve(__dirname, '../public');

console.log('📦 Copying frontend build to CLI...');

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  // Eliminar el directorio public existente
  if (fs.existsSync(cliPublic)) {
    fs.rmSync(cliPublic, { recursive: true, force: true });
  }
  
  // Copiar el frontend dist a cli public
  copyDirSync(frontendDist, cliPublic);
  
  console.log('✅ Frontend copied successfully!');
} catch (err) {
  console.error('❌ Error copying frontend:', err);
  process.exit(1);
}
