import { defineConfig } from '@playwright/test';

const port = Number(process.env.TL_STUDIO_PORT ?? 5176);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 180_000,
  use: { baseURL, trace: 'retain-on-failure' },
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${port}`,
    env: { VITE_TL_API_BASE: process.env.TL_E2E_API_BASE ?? '/api/v1' },
    url: baseURL,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
