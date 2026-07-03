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
      "@": path.resolve(__dirname, "../frontend/src"),
    },
  },
  optimizeDeps: {
    include: ["@monaco-editor/react"],
  },

  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    hmr: {
      overlay: false
    }
  },

  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
    
  },
})
