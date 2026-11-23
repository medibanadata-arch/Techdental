import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import path from 'node:path';

const appDir = path.resolve('./src/app');

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  // Trust the incoming Host header so `Astro.url.origin` matches the address the
  // browser used (e.g. http://127.0.0.1:4322 or https://techdentalcare.com).
  // Without this, Astro falls back to `http://localhost` and rejects every
  // form-like POST (multipart uploads) as cross-origin.
  security: {
    allowedDomains: [{}],
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    resolve: {
      alias: [
        // The Laravel app imports some components with a lowercase folder name.
        { find: /^@\/components(?=\/|$)/, replacement: appDir + '/Components' },
        { find: /^@\//, replacement: appDir + '/' },
        { find: /^@inertiajs\/react$/, replacement: path.resolve('./src/lib/inertia.tsx') },
        { find: /^@inertiajs\/core$/, replacement: path.resolve('./src/lib/inertia-core.ts') },
      ],
    },
    ssr: {
      noExternal: ['@fortawesome/fontawesome-free'],
    },
  },
});
