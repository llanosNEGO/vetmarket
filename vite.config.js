import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/data': {
        target: 'https://ventas.vetmarket.pe',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/data/, '/data')
      }
    }
  }
})