import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const SERVER_PORT = process.env.SERVER_PORT || 3001

export default defineConfig({
  plugins: [react()],

  root: '.',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      // Config del proyecto consumidor (raíz del repo). Sigue vigente
      // porque el Playground legacy (PDFPreview.tsx/CodeEditor.tsx, un
      // modo aparte de un solo archivo) todavía compila en el navegador
      // con compilePlaygroundCode.ts y necesita esta whitelist de
      // npmModules. No se retira sin decidir primero qué pasa con el
      // Playground (ver MIGRACION-STATUS.md).
      '@react-pdf-levelup/user-config': path.resolve(__dirname, './react-pdf-levelup-config.ts'),
      // "canvas" es una dependencia nativa (requiere compilación con
      // cairo/pango) que solo se usa en la rama server-side de
      // @react-pdf-levelup/qr, dentro de un try/catch que nunca se ejecuta
      // en el navegador. Se apunta a un módulo vacío para que ni Vite en
      // dev ni Rollup en build intenten resolver el paquete nativo real.
      'canvas': path.resolve(__dirname, './client/lib/emptyModule.ts')
    }
  },

  optimizeDeps: {
    include: ['@monaco-editor/react']
  },

  server: {
    port: 8000,
    proxy: {
      '/api': {
        target: `http://localhost:${SERVER_PORT}`,
        changeOrigin: true
      }
    }
  },

  preview: {
    host: '0.0.0.0',
    port: 8000,
    proxy: {
      '/api': {
        target: `http://localhost:${SERVER_PORT}`,
        changeOrigin: true
      }
    }
  },

  build: {
    outDir: 'dist/client',
    emptyOutDir: true
  }
})
