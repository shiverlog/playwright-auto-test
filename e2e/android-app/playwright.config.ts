import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],
  use: {
    ...devices['Galaxy Note 20 Ultra'],
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  reporter: [['list'], ['html']],
});
