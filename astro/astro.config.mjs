// @ts-check
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import netlify from '@astrojs/netlify'

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
  output: 'server',
  adapter: netlify(),
})
