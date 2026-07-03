import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDist = path.resolve(__dirname, '../../../frontend/dist');
const cliPublic = path.resolve(__dirname, '../public');

console.log('📦 Copying frontend build to CLI...');

try {
  // Eliminar el directorio public existente
  if (fs.existsSync(cliPublic)) {
    fs.rmSync(cliPublic, { recursive: true });
  }
  
  // Copiar el frontend dist a cli public
  fs.copySync(frontendDist, cliPublic);
  
  console.log('✅ Frontend copied successfully!');
} catch (err) {
  console.error('❌ Error copying frontend:', err);
  process.exit(1);
}
