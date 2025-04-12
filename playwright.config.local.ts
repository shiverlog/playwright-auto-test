/**
 * Description : playwright.config.local.ts - 📌 Playwright Config 로컬
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { defineConfig, devices, type Project } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

import baseConfig from './playwright.config';

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const localProjects: Project[] = (baseConfig.projects ?? []).map(p => {
  const project = p as Project;
  return {
    ...project,
    use: {
      ...devices['Desktop Chrome'],
      ...(project.use || {}),
      headless: false,
      slowMo: 200,
      ignoreHTTPSErrors: true,
      screenshot: 'on',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
    },
  };
});

export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    headless: false,
    ignoreHTTPSErrors: true,
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: localProjects,
  reporter: [['list'], ['html', { open: 'on-failure' }]],
});
