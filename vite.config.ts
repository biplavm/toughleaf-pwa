import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@toughleaf/platform-sdk': path.resolve(
        dir,
        'vendor/@toughleaf/platform-sdk/index.js',
      ),
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
        start_url: '/?source=pwa',
        display: 'standalone',
        display_override: ['standalone', 'fullscreen', 'minimal-ui'],
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#2491eb',
        scope: '/',
        shortcuts: [
          { name: 'Projects', short_name: 'Projects', url: '/#/projects?source=pwa' },
          { name: 'Lookup', short_name: 'Lookup', url: '/#/lookup?source=pwa' },
          { name: 'Dashboard', short_name: 'Dashboard', url: '/?source=pwa' },
        ],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
        navigateFallback: '/index.html',
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
