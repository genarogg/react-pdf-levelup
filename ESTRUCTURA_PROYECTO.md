# Estructura del Proyecto React PDF LevelUp

```
react-pdf-levelup/
├── .github/
│   └── FUNDING.yml
├── api/                             # Backend API (Fastify)
│   ├── public/
│   │   └── img/
│   │       └── logo/
│   │           ├── fastify.svg
│   │           ├── isotipo.svg
│   │           ├── react.svg
│   │           └── vite.svg
│   ├── scripts/
│   │   └── add-js-ext.js
│   ├── src/
│   │   ├── config/
│   │   │   ├── caching.ts
│   │   │   ├── compressFastify.ts
│   │   │   ├── corsFastify.ts
│   │   │   ├── helmet.ts
│   │   │   ├── index.ts
│   │   │   ├── multipar.ts
│   │   │   ├── rateLimit.ts
│   │   │   ├── slowDownFastify.ts
│   │   │   └── underPressureFastify.ts
│   │   ├── controllers/
│   │   │   └── index.ts
│   │   ├── func/
│   │   │   ├── index.ts
│   │   │   ├── log.ts
│   │   │   └── response.ts
│   │   ├── routers/
│   │   │   └── index.ts
│   │   └── useExample/
│   │       ├── Template.tsx
│   │       ├── example.pdf
│   │       └── index.ts
│   ├── Dockerfile
│   ├── README.md
│   ├── README_es.md
│   ├── example.env
│   ├── index.ts
│   ├── package.json
│   └── tsconfig.json
├── docs/                            # Documentación (Astro Starlight)
│   ├── public/
│   │   ├── iconos/
│   │   │   ├── android-chrome-512x512.png
│   │   │   ├── favicon-192x192.png
│   │   │   └── favicon-32x32.png
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── houston.webp
│   │   ├── content/
│   │   │   └── docs/
│   │   │       ├── en/                    # Documentación en inglés
│   │   │       │   ├── components/
│   │   │       │   ├── functions/
│   │   │       │   ├── guides/
│   │   │       │   ├── plugin/
│   │   │       │   ├── get-started.mdx
│   │   │       │   ├── index.mdx
│   │   │       │   └── playground.mdx
│   │   │       └── es/                    # Documentación en español
│   │   │           ├── components/
│   │   │           ├── functions/
│   │   │           ├── guides/
│   │   │           ├── plugin/
│   │   │           ├── get-started.mdx
│   │   │           ├── index.mdx
│   │   │           └── playground.mdx
│   │   ├── styles/
│   │   │   └── custom.css
│   │   ├── content.config.ts
│   │   ├── middleware.ts
│   │   └── starlightRouteData.ts
│   ├── .gitignore
│   ├── README.md
│   ├── astro.config.mjs
│   ├── package.json
│   └── tsconfig.json
├── frontend/                        # Frontend principal (React + Vite)
│   ├── public/
│   │   ├── asset/
│   │   │   ├── certificado.png
│   │   │   ├── wallpaper.png
│   │   │   └── wallpaper.webp
│   │   ├── iconos/
│   │   ├── imgTemplates/
│   │   ├── templates/
│   │   │   ├── facturas/
│   │   │   ├── Charts.tsx
│   │   │   ├── Default.tsx
│   │   │   ├── Etiquetas.tsx
│   │   │   ├── QR.tsx
│   │   │   ├── certificate.tsx
│   │   │   ├── index.json
│   │   │   └── tablasTemplateBasico.tsx
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── core/                  # Componentes core para PDFs
│   │   │   │   ├── basic/
│   │   │   │   ├── charts/
│   │   │   │   ├── icono/
│   │   │   │   ├── qr/
│   │   │   │   └── index.tsx
│   │   │   ├── ui/                    # Componentes de UI (shadcn/ui style)
│   │   │   └── viewer/
│   │   │       ├── home/              # Página de inicio
│   │   │       ├── layout/            # Componentes de layout (Header, etc.)
│   │   │       ├── pdfViewer/
│   │   │       └── playground/        # Playground para editar PDFs
│   │   │           ├── hooks/
│   │   │           ├── toolbar/
│   │   │           ├── utils/
│   │   │           ├── CodeEditor.tsx
│   │   │           ├── PDFPreview.tsx
│   │   │           ├── StudioSidebar.tsx
│   │   │           └── index.tsx
│   │   ├── functions/                 # Funciones utilitarias
│   │   ├── i18n/                      # Internacionalización
│   │   ├── lib/
│   │   ├── pdf/
│   │   ├── styles/
│   │   ├── main.tsx                   # Entrada app principal
│   │   └── main-studio.tsx            # Entrada modo Studio
│   ├── index.html
│   ├── studio.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── global/                          # Scripts globales
│   ├── clean-build.js
│   ├── clean.js
│   └── zip-api.js
├── lib/                             # Paquetes publicables (npm)
│   ├── chart/                       # Paquete de gráficos para PDFs
│   ├── cli/                         # CLI con modo Studio
│   │   ├── public/                  # Build del frontend para el CLI
│   │   ├── scripts/
│   │   │   └── copy-frontend.js
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   │   └── estudio.ts
│   │   │   ├── bin.ts
│   │   │   └── index.ts
│   │   └── package.json
│   ├── client/                      # Cliente npm
│   ├── core/                        # Core del paquete
│   ├── icons/                       # Paquete de íconos
│   ├── qr/                          # Paquete de QR
│   ├── scripts/
│   ├── types/
│   └── package.json
├── public/
│   └── font/
├── .gitignore
├── .npmrc
├── README.md
├── README_es.md
├── license
├── nixpacks.toml
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json
```

## Descripción de las carpetas principales:

1. **api/**: Backend REST API construido con Fastify.
2. **docs/**: Documentación del proyecto usando Astro Starlight.
3. **frontend/**: Interfaz de usuario principal con el playground.
4. **lib/**: Conjunto de paquetes npm publicables.
5. **global/**: Scripts globales para manejo del proyecto.
