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
      // @react-pdf-levelup/core es el paquete que este mismo proyecto va a
      // publicar en npm; hasta que exista en el registro, se resuelve al
      // código fuente local (autocontenido, sin depender de rutas internas
      // del cliente del Studio) para que el import sea idéntico al de
      // producción el día que se publique de verdad.
      '@react-pdf-levelup/core': path.resolve(__dirname, './client/components/core'),
      // "canvas" solo se importa dinámicamente en la rama server-side de
      // QRGenerator.ts, dentro de un try/catch que nunca se ejecuta en el
      // navegador. Se apunta a un módulo vacío para que ni Vite en dev ni
      // Rollup en build intenten resolver el paquete nativo real.
      'canvas': path.resolve(__dirname, './client/lib/emptyModule.ts')
    }
  },

  optimizeDeps: {
    include: ['@monaco-editor/react']
  },

  server: {
    port: 8500,
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
