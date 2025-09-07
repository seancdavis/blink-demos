import netlify from '@astrojs/netlify'
import react from '@astrojs/react'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        '@components': '/src/components',
      },
    },
  },
})
