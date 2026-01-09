import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
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
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/docs': {
        target: 'http://localhost:4321',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/docs/_astro': {
        target: 'http://localhost:4321',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/_astro': {
        target: 'http://localhost:4321',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/@id': {
        target: 'http://localhost:4321',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/@fs': {
        target: 'http://localhost:4321',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    }
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/docs': {
        target: 'http://localhost:4321',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/docs/_astro': {
        target: 'http://localhost:4321',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/_astro': {
        target: 'http://localhost:4321',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/@id': {
        target: 'http://localhost:4321',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/@fs': {
        target: 'http://localhost:4321',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
})