import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify({
    dist: new URL('./dist/', import.meta.url),
  }),
  integrations: [],
  server: {
    port: 8888, // Match Netlify Dev default
  },
  vite: {
    define: {
      'process.env': process.env,
    },
  },
  // Copy static assets
  publicDir: new URL('./www/', import.meta.url),
});