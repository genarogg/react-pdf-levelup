import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/docs': {
        target: 'http://172.18.0.3:4321/',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/docs/_astro': {
        target: 'http://172.18.0.3:4321/',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/_astro': {
        target: 'http://172.18.0.3:4321/',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/@id': {
        target: 'http://172.18.0.3:4321/',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/@fs': {
        target: 'http://172.18.0.3:4321/',
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
      '/docs': {
        target: 'http://172.18.0.3:4321/',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/docs/_astro': {
        target: 'http://172.18.0.3:4321/',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/_astro': {
        target: 'http://172.18.0.3:4321/',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/@id': {
        target: 'http://172.18.0.3:4321/',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/@fs': {
        target: 'http://172.18.0.3:4321/',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    }
  }
})
