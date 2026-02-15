import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
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

  // ✅ GraphQL
  '/graphql': {
    target: 'http://localhost:4000',
    changeOrigin: true,
    secure: false,
    ws: true,
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
    proxy: proxy
  },

  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: proxy
  },
})
