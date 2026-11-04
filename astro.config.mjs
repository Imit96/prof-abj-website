// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.SITE_URL || 'https://abolaji.vercel.app';

export default defineConfig({
  site,
  // Pages are prerendered (static); only the /keystatic admin and its API run on demand.
  adapter: vercel(),
  integrations: [
    react(),
    keystatic(),
    sitemap({ filter: (page) => !page.includes('/keystatic') }),
  ],
  vite: { plugins: [tailwindcss()] },
  redirects: {
    '/portfolio': '/research',
    '/cooperation': '/research#network',
    '/publications': '/research#publications',
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
