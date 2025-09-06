import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5122
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
})
