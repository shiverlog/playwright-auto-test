import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],
  use: {
    ...devices['Pixel 5'], // 또는 iPhone 등 원하는 디바이스로 변경 가능
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  reporter: [['list'], ['html']],
});
