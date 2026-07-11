# @react-pdf-levelup/studio

CLI que levanta un Studio local para crear y previsualizar plantillas PDF con react-pdf-levelup, al estilo.

## Instalación

```bash
npm install --save-dev @react-pdf-levelup/studio
```

## Uso básico

### 1. Ejecutar el Studio

Ejecuta el CLI desde la raíz de tu proyecto:

```bash
npx react-pdf-levelup studio
```

Esto levantará un servidor local (por defecto en el puerto 8000) y abrirá el Studio en tu navegador.

### 2. (Opcional) Configuración

Puedes crear un archivo de configuración en la raíz de tu proyecto para personalizar el Studio:

#### TypeScript: `react-pdf-levelup-config.ts`
```ts
import type { ReactPdfLevelupConfig } from "@react-pdf-levelup/studio";

const config: ReactPdfLevelupConfig = {
  productionPort: 8000,
  templatesDir: "templates",
};

export default config;
```

#### JavaScript: `react-pdf-levelup-config.js`
```js
/** @type {import('@react-pdf-levelup/studio').ReactPdfLevelupConfig} */
const config = {
  productionPort: 8000,
  templatesDir: "templates",
};

export default config;
```

Si usas un archivo `.ts` o `.mts`, el CLI buscará y usará `tsx` para cargarlo (primero busca en tu proyecto, luego en el paquete mismo).

## Opciones del CLI

| Opción | Descripción |
|--------|-------------|
| `--runtime <nombre>` | Runtime a usar: `node` (por defecto), `bun`, `tsx`, `ts-node` |
| `--loader <ruta>` | Ruta a un loader ESM personalizado (ej: `ts-node/esm`) |
| `--no-ts-auto` | Omite la auto-detección de TypeScript y ejecuta sin loader |
| `--help` / `-h` | Muestra la ayuda completa |

### Ejemplos de uso

- Usar **bun**:
  ```bash
  npx react-pdf-levelup studio --runtime bun
  ```
- Usar **ts-node**:
  ```bash
  npx react-pdf-levelup studio --runtime ts-node
  ```
- Usar un **loader personalizado**:
  ```bash
  npx react-pdf-levelup studio --loader ts-node/esm
  ```
- Ejecutar directamente (solo config en JS):
  ```bash
  npx react-pdf-levelup studio --no-ts-auto
  ```

## Características

- 🖼 Editor de plantillas en vivo con previsualización
- 🎨 Editor de código con Monaco
- 📥 Descarga automática de PDFs
- 📁 Explorador de archivos
- Compatible con TypeScript y JavaScript
- Soporte para múltiples runtimes (Node.js, Bun, etc.)

## Documentación

Para más información sobre react-pdf-levelup, visita la [documentación oficial](https://react-pdf-levelup.nimbux.cloud/docs).

## Licencia

MIT License
