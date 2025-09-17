import netlify from '@netlify/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), netlify()],
  base: '/', // Ensure root-relative asset references
})
