import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const proxy = {
  '/api': {
    target: 'http://localhost:4000',
    changeOrigin: true,
    secure: false,
    ws: true,
    rewrite: (path: any) => path.replace(/^\/api/, ''),
  },


  '/docs': {
    target: 'http://localhost:4500',
    changeOrigin: true,
    secure: false,
    ws: true,
  },
}

export default defineConfig({
  plugins: [
    // mdx() debe ir antes que react(): transforma los .mdx en JSX, y el
    // plugin de React necesita recibir ese JSX ya transformado para poder
    // procesarlo (JSX -> JS) en el mismo pipeline de transformación.
    //
    // NOTA: `providerImportSource` era la forma de conectar MDXProvider en
    // MDX v1. En MDX v2+ esa opción ya no existe/no hace nada: el mecanismo
    // correcto es que el runtime de MDX importe automáticamente
    // `useMDXComponents` desde "@mdx-js/react" (esto ya sucede por defecto
    // en @mdx-js/rollup v2+, sin necesidad de configurarlo acá). Si tu
    // versión de @mdx-js/rollup es v2 o v3, quitar esta opción es lo que
    // permite que <MDXProvider> en MdxRenderer.tsx efectivamente conecte
    // mdxComponents con lo que compila cada .mdx.
    mdx(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["@monaco-editor/react"],
  },

  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: proxy,
    hmr: {
      overlay: false
    }
  },

  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: proxy,
    
  },
})