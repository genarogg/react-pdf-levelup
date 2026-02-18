import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const root = process.cwd();
const apiDir = path.join(root, 'api');
const publicDir = path.join(root, 'public');
const outZip = path.join(publicDir, 'api.zip');

const items = [
  'public',
  'scripts',
  'src',
  'example.env',
  'Dockerfile',
  'package.json',
  'tsconfig.json',
  'index.tsx',
  'index.ts',
];

function ensureNoExistingZip(file) {
  if (fs.existsSync(file)) {
    fs.rmSync(file, { force: true });
  }
}

function createZip() {
  if (!fs.existsSync(apiDir)) {
    throw new Error('No se encontró la carpeta api');
  }

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  ensureNoExistingZip(outZip);

  const output = fs.createWriteStream(outZip);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve(archive.pointer()));
    output.on('error', reject);
    archive.on('error', reject);

    archive.pipe(output);

    const existing = items
      .map((p) => ({ name: p, full: path.join(apiDir, p) }))
      .filter((x) => fs.existsSync(x.full));

    if (existing.length === 0) {
      reject(new Error('No hay elementos existentes para comprimir en api'));
      return;
    }

    for (const x of existing) {
      const stat = fs.statSync(x.full);
      if (stat.isDirectory()) {
        archive.directory(x.full, x.name);
      } else {
        archive.file(x.full, { name: x.name });
      }
    }

    archive.finalize();
  });
}

createZip()
  .then((bytes) => {
    console.log(`Zip creado: ${outZip} (${bytes} bytes)`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error al crear el zip:', err.message || err);
    process.exit(1);
  });
