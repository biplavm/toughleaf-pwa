import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: { alias: { '@toughleaf/platform-sdk': path.resolve('vendor/platform-sdk/index.js') } },
  server: {
    port: 5180,
    proxy: { '/api': { target: 'http://127.0.0.1:8080', changeOrigin: true } },
  },
});
