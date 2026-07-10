import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function traverseAndClean(currentDir) {
  const items = fs.readdirSync(currentDir);

  for (const item of items) {
    const fullPath = path.join(currentDir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (item === 'node_modules') {
        try {
            fs.rmSync(fullPath, { recursive: true, force: true });
            console.log(`Deleted: ${fullPath}`);
        } catch (e) {
            console.error(`Failed to delete ${fullPath}:`, e.message);
        }
      } else if (!item.startsWith('.')) { 
        traverseAndClean(fullPath);
      }
    } else if (item === 'package-lock.json') {
       try {
        fs.unlinkSync(fullPath);
        console.log(`Deleted: ${fullPath}`);
       } catch (e) {
         console.error(`Failed to delete ${fullPath}:`, e.message);
       }
    }
  }
}

console.log('Starting cleanup...');
traverseAndClean(rootDir);
console.log('Cleanup complete.');
