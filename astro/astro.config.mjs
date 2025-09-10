// @ts-check
import netlify from '@astrojs/netlify'
import react from '@astrojs/react'
import { defineConfig } from 'astro/config'

export default defineConfig({
  vite: {
    plugins: [],
  },
  integrations: [react()],
  output: 'server',
  adapter: netlify(),
})
