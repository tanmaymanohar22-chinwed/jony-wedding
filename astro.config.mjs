import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.CI ? 'https://username.github.io' : 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  build: {
    assets: 'assets'
  }
});
