import { defineConfig, loadEnv } from 'vite'
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isStudio = !!env.STUDIO

  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      {
        name: 'studio-plugin',
        configureServer(server) {
          if (isStudio) {
            server.middlewares.use((req, _res, next) => {
              if (req.url === '/' || req.url === '/index.html') {
                req.url = '/studio.html'
              }
              
              next()
            })
          }
        },
      },
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
        input: isStudio
          ? path.resolve(__dirname, "studio.html")
          : {
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
      },
      open: isStudio,
    },

    preview: {
      host: '0.0.0.0',
      allowedHosts: true,
      proxy: proxy,
      
    },
  }
})
