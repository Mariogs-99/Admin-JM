import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5174, // ⬅️ Cambia aquí el puerto que desees
    open: true  // (opcional) abre automáticamente el navegador
  }
})
