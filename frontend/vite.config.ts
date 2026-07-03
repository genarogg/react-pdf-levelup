import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from "url"
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
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        studio: path.resolve(__dirname, "studio.html"),
      },
    },
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
