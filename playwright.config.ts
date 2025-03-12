/**
 * Description : playwright.config.ts - 📌 Playwright Config 테스트 실행 환경 정의 파일
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // 공통 테스트 폴더 경로
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  // 테스트 실행 시 동시 실행할 워커(worker) 수 설정
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // 테스트 리포트 설정 (Reporter Configuration)
  reporter: [
    // 기본 콘솔 출력
    ['list'],
    // HTML 리포트 생성
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    // JSON 리포트 생성
    ['json', { outputFile: 'playwright-report/results.json' }],
    // allure 리포트 생성
    ['allure-playwright'],
  ],
  // 타임아웃 설정 (Timeouts)
  timeout: 30 * 1000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  // 기본 환경 설정 (Global Configuration)
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://127.0.0.1:3000',
    // 브라우저를 headless 모드(화면 없이 실행)로 실행
    headless: true,
    // 기본 화면 크기 설정
    viewport: { width: 1280, height: 720 },
    // 테스트 실패 시만 스크린샷 저장
    screenshot: 'only-on-failure',
    // 실패한 테스트의 경우에만 비디오 녹화 유지
    video: 'retain-on-failure',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // 첫 번째 재시도에서 trace 파일 저장
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  // 테스트 프로젝트별 설정 (Test Project Configuration)
  projects: [
    // pc-web에서 테스트 실행
    {
      name: 'PC - Chrome',
      testMatch: ['**/pc-web/**/*.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'PC - firefox',
      testMatch: ['**/pc-web/**/*.spec.ts'],
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'PC - webkit',
      testMatch: ['**/pc-web/**/*.spec.ts'],
      use: { ...devices['Desktop Safari'] },
    },
    /* Test against mobile viewports. */
    // mobile-web에서 테스트 실행
    {
      name: 'MW - Chrome (PC)',
      testMatch: ['**/mobile-web/**/*.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'MW - Mobile Chrome',
      testMatch: ['**/mobile-web/**/*.spec.ts'],
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'MW - Mobile Safari',
      testMatch: ['**/mobile-web/**/*.spec.ts'],
      use: { ...devices['iPhone 12'] },
    },
    // android에서 테스트 실행 (Appium + Playwright)
    {
      name: 'Android - lguplus APP',
      testMatch: ['**/android/**/*.spec.ts'],
      use: { ...devices['galaxy note 20 ultra'] },
    },
    // ios에서 테스트 실행 (Appium + Playwright)
    {
      name: 'iOS - lguplus APP',
      testMatch: ['**/ios/**/*.spec.ts'],
      use: { ...devices['iPhone 12'] },
    },
    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});
