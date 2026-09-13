import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://healthnest-api.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/hubs': {
        target: 'https://healthnest-api.onrender.com',
        changeOrigin: true,
        ws: true,
        secure: false
      }
    }
  }
})
