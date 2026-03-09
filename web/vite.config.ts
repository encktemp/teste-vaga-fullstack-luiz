import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // necessário para funcionar corretamente no Firebase Hosting
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
