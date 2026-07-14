import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

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
  server: {
    port: 5175,
    strictPort: true,
    // Local API target: README "API target" — override via .env VITE_TL_API_BASE or src/studio.config.js.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
});
