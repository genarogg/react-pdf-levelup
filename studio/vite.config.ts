import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const SERVER_PORT = process.env.SERVER_PORT || 3001

export default defineConfig({
  plugins: [react()],

  root: '.',

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
