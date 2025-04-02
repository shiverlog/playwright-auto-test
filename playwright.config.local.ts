/**
 * Description : playwright.config.local.ts - 📌 Playwright Config 로컬 실행 환경 정의 파일
 * Author : Shiwoo Min
 * Date : 2025-04-02
 */
import { defineConfig, devices } from '@playwright/test';

import baseConfig from './playwright.config';

// local 전용 headless 설정 및 slowMo를 launchOptions에 오버라이드
const localProjects = baseConfig.projects?.map(project => ({
  ...project,
  use: {
    ...devices['Desktop Chrome'],
    ...project.use,
    headless: false,
    launchOptions: {
      ...(project.use?.launchOptions ?? {}),
      slowMo: 200,
    },
  },
}));

// baseConfig를 확장하여 로컬 전용 설정으로 export
export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    headless: false,
    launchOptions: {
      ...(baseConfig.use?.launchOptions ?? {}),
      slowMo: 200,
    },
  },
  projects: localProjects,
});
