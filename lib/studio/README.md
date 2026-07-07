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

Este directorio (`lib/studio`) no contiene el build; se genera desde
`studio/` corriendo:

```bash
cd studio
npm run build:lib
```

Eso compila `studio/` (cliente + servidor) y copia los artefactos a
`lib/studio/dist/{server,client}`.

## Publicar

```bash
cd lib/studio
npm install   # instala fastify, @fastify/*, tsx (dependencias runtime)
npm publish
```
