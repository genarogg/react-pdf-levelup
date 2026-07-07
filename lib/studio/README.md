# react-pdf-levelup

CLI que levanta el Studio (al estilo `npx prisma studio`).

## Uso en el proyecto consumidor

```bash
npx react-pdf-levelup studio
```

Busca `react-pdf-levelup-config.(ts|mts|mjs|cjs|js)` en la raíz del
proyecto que lo ejecuta (`process.cwd()`). Si el archivo es `.ts`/`.mts`,
el propio CLI carga un loader de `tsx` empaquetado internamente — no hace
falta que el consumidor lo instale.

```ts
// react-pdf-levelup-config.ts
import type { ReactPdfLevelupConfig } from "react-pdf-levelup/dist/react-pdf-levelup-config"

const config: ReactPdfLevelupConfig = {
  productionPort: 8000,
  templatesDir: "templates",
}

export default config
```

## Generar este paquete desde el monorepo

Este directorio (`lib/studio`) no contiene el build; se genera compilando
`studio/` (cliente + servidor) y copiando los artefactos a
`lib/studio/dist/{server,client}`. Hay dos formas equivalentes de hacerlo:

```bash
# Opción A: desde studio/
cd studio
npm run build:lib

# Opción B: desde lib/studio, igual que el resto de paquetes de lib/*
cd lib/studio
npm run build:lib
```

Ambas ejecutan `studio/scripts/build-lib.mjs`.

## Publicar

Igual que el resto de paquetes en `lib/*`, se puede publicar individualmente:

```bash
cd lib/studio
pnpm install
npm run build:lib
npm publish --access public
```

O como parte del flujo conjunto desde la raíz del monorepo:

```bash
pnpm run publish-all   # ver lib/scripts/index.js
```

Este último bump-ea la versión, compila y publica `studio` junto con
`client`, `qr`, `chart`, `core` e `icons`.
