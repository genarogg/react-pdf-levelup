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
    exclude: ["canvas", "chartjs-node-canvas"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-scroll-area', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-tooltip'],
          'pdf': ['@react-pdf/renderer', 'react-pdf'],
          'charts': ['chart.js'],
          'qr': ['qr-code-styling', 'qrcode'],
        }
      }
    },
    target: 'ES2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    },
    // Optimizar compresión de assets
    assetsInlineLimit: 4096,
    // Reportar tamaños de chunks
    reportCompressedSize: false,
    // Configurar sourcemaps solo en desarrollo
    sourcemap: false,
    // Chunksize warning
    chunkSizeWarningLimit: 1000,
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
        target: 'http://localhost:4500',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/docs/_astro': {
        target: 'http://localhost:4500',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/_astro': {
        target: 'http://localhost:4500',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/@id': {
        target: 'http://localhost:4500',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/@fs': {
        target: 'http://localhost:4500',
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
        target: 'http://localhost:4500',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/docs/_astro': {
        target: 'http://localhost:4500',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/_astro': {
        target: 'http://localhost:4500',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/@id': {
        target: 'http://localhost:4500',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/@fs': {
        target: 'http://localhost:4500',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
})