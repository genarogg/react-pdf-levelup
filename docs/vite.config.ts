import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
   
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
   
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
    
  }
})
