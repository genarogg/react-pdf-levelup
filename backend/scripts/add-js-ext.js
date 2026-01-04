// scripts/add-js-ext.js
import { promises as fs, existsSync, statSync } from 'fs';
import path from 'path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');

async function walk(dir) {
  for (const name of await fs.readdir(dir)) {
    const fullPath = path.join(dir, name);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      await walk(fullPath);
    } else if (fullPath.endsWith('.js')) {
      const fileDir = path.dirname(fullPath);
      let content = await fs.readFile(fullPath, 'utf8');

      content = content.replace(
        /from\s+(['"])(\.[^'"]*?)(['"])/g,
        (_all, quote1, imp, quote2) => {
          // Sólo procesar imports relativos
          if (!imp.startsWith('.')) {
            return _all;
          }

          // Caso especial: import '.' o './'
          if (imp === '.' || imp === './') {
            return `from ${quote1}./index.js${quote2}`;
          }

          // Normalizar sin slash final
          const impClean = imp.replace(/\/$/, '');
          const absBase  = path.resolve(fileDir, impClean);
          const filePath = absBase + '.js';
          const dirPath  = absBase;

          // 1) Priorizar archivo .js homónimo
          if (existsSync(filePath) && statSync(filePath).isFile()) {
            return `from ${quote1}${impClean}.js${quote2}`;
          }
          // 2) Si hay directorio con index.js
          if (
            existsSync(dirPath) &&
            statSync(dirPath).isDirectory() &&
            existsSync(path.join(dirPath, 'index.js'))
          ) {
            return `from ${quote1}${impClean}/index.js${quote2}`;
          }
          // 3) Si ya acaba en .js (poco probable aquí)
          if (impClean.endsWith('.js')) {
            return `from ${quote1}${impClean}${quote2}`;
          }
          // 4) Fallback: añadir .js
          return `from ${quote1}${impClean}.js${quote2}`;
        }
      );

      await fs.writeFile(fullPath, content, 'utf8');
    }
  }
}

walk(DIST_DIR)
  .then(() => console.log('✅ Extensiones .js añadidas en dist/'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
