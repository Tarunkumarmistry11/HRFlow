import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Change the port if needed
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Change to your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
