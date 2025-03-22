import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4000', // 필요에 따라 변경
    headless: true,
  },
  reporter: [['list'], ['html']],
});
