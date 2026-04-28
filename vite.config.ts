import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Evita que el navegador sirva JS/CSS viejos al cambiar de rama o tras rediseños
    headers: { 'Cache-Control': 'no-store' },
  },
})
