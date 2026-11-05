import { defineConfig } from '@playwright/test';

const PORT = process.env.PORT || 4173;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: `http://localhost:${PORT}`, serviceWorkers: 'block' },
  webServer: {
    command: 'node tests/server.mjs',
    url: `http://localhost:${PORT}/index.html`,
    reuseExistingServer: false,
    env: { SITE_ROOT: process.env.SITE_ROOT || 'docs', PORT: String(PORT) },
  },
});
