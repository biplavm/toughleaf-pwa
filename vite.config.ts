import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

const dir = path.dirname(fileURLToPath(import.meta.url));
const sdkAlias = path.resolve(dir, 'vendor/@toughleaf/platform-sdk/index.js');

export default defineConfig({
  resolve: {
    alias: {
      '@toughleaf/platform-sdk': sdkAlias,
    },
  },
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Tough Leaf',
        short_name: 'Tough Leaf',
        start_url: '/pwa.html?source=pwa',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2491eb',
        scope: '/',
        shortcuts: [
          { name: 'Projects', short_name: 'Projects', url: '/pwa.html#/projects?source=pwa' },
          { name: 'Lookup', short_name: 'Lookup', url: '/pwa.html#/lookup?source=pwa' },
          { name: 'Profile', short_name: 'Profile', url: '/pwa.html#/profile?source=pwa' },
        ],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^\/api\/v1\/(?!auth\/)/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'tl-api',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(dir, 'index.html'),
        pwa: path.resolve(dir, 'pwa.html'),
      },
    },
  },
  server: {
    port: 5175,
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.PUBLIC_TOUGHLEAF_BACKEND ?? 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
