import { defineConfig, devices } from '@playwright/test';

import baseConfig from './playwright.config';

// local 전용 headless 설정만 덮어쓰기
const localProjects = baseConfig.projects?.map(project => ({
  ...project,
  use: {
    ...devices['Desktop Chrome'],
    ...project.use,
    headless: false,
    slowMo: 200,
  },
}));

export default {
  ...baseConfig,
  use: {
    ...baseConfig.use,
    headless: false,
    slowMo: 200,
  },
  projects: localProjects,
};
