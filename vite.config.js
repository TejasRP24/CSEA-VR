import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'vr_zones',
    rollupOptions: {
      input: {
        main: './index.html',
        showcase: './showcase.html',
        vr: './vr.html',
        event: './event.html'
      }
    }
  }
})
