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
import dotenv from 'dotenv';
import path from 'path';

// 환경 변수 로드
dotenv.config({ path: path.resolve(__dirname, '.env') });

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
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000',
    /**
     * 브라우저 실행 모드 설정:
     * - process.env.HEADLESS=true - 브라우저 headless 모드
     * - process.env.HEADLESS=false - 브라우저 UI 표시
     */
    headless: process.env.HEADLESS === 'false' ? false : true,
    // 기본 화면 크기 설정
    viewport: { width: 1280, height: 720 }, // null
    // 테스트 실패 시만 스크린샷 저장
    screenshot: 'only-on-failure',
    // 실패한 테스트의 경우에만 비디오 녹화 유지
    video: 'retain-on-failure',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // 첫 번째 재시도에서 trace 파일 저장
    trace: 'on-first-retry',

    /* 브라우저 실행 시 추가 옵션 설정 */
    launchOptions: {
      /**
       * 브라우저 실행 시 추가 옵션 (arguments)
       * - `--start-maximized`         : 브라우저를 최대화하여 실행
       * - `--disable-extensions`      : 브라우저 확장 프로그램(Extensions) 비활성화
       * - `--disable-plugins`         : 브라우저 플러그인 비활성화
       * - `--disable-dev-shm-usage`   : 공유 메모리(/dev/shm) 사용 비활성화 (Docker 등에서 필요)
       * - `--no-sandbox`              : 샌드박스 비활성화 (일부 CI/CD 환경에서 필수)
       * - `--disable-gpu`             : GPU 가속 비활성화 (CI 환경에서 렌더링 최적화)
       * - `--disable-blink-features=AutomationControlled` : Selenium 등 자동화 탐지를 피하기 위한 설정
       */
      args: [
        '--start-maximized',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-blink-features=AutomationControlled',
      ],

      // 브라우저 실행 타임아웃 설정 (기본값: 60초)
      // timeout: Number.parseInt(process.env.BROWSER_LAUNCH_TIMEOUT, 10) || 60000,

      // 브라우저의 동작을 느리게 실행 (디버깅 시 유용)
      // slowMo: Number.parseInt(process.env.SLOW_MO, 10) || 100,

      // 파일 다운로드 경로 지정
      // downloadsPath: './test-results/downloads',

      // 개발자 도구(DevTools) 활성화 여부 (디버깅 시 유용)
      devtools: process.env.DEVTOOLS === 'true' ? true : false,

      // Chromium 기반 브라우저에서 콘솔 로그 캡처
      // logger: {
      //   isEnabled: (name, severity) => severity === 'error' || severity === 'warning',
      //   log: (name, severity, message) => console.log(`[${severity}] ${name}: ${message}`),
      // },
    },

    // HTTPS 인증서 오류 무시 (보안 경고 무시)
    ignoreHTTPSErrors: true,

    // 파일 다운로드 허용 여부
    acceptDownloads: true,

    // 단일 액션 (예: 클릭, 입력)의 최대 수행 시간 (기본값: 30초)
    //actionTimeout: Number.parseInt(process.env.ACTION_TIMEOUT, 10) * 1000 || 30000,

    // 네비게이션(페이지 이동) 최대 수행 시간 (기본값: 60초)
    //navigationTimeout: Number.parseInt(process.env.NAVIGATION_TIMEOUT, 10) * 1000 || 60000,
  },
  /* Configure projects for major browsers */
  // 테스트 프로젝트별 설정 (Test Project Configuration)
  projects: [
    // pc-web에서 테스트 실행
    {
      name: 'PC - Chrome',
      testMatch: ['**/pc-web/**/*.spec.ts'],
      use: {
        ...devices['Desktop Firefox'],
        headless: process.env.HEADLESS === 'false' ? false : true,
      },
    },
    {
      name: 'PC - firefox',
      testMatch: ['**/pc-web/**/*.spec.ts'],
      use: {
        ...devices['Desktop firefox'],
        headless: process.env.HEADLESS === 'false' ? false : true,
      },
    },
    {
      name: 'PC - webkit',
      testMatch: ['**/pc-web/**/*.spec.ts'],
      use: {
        ...devices['Desktop Safari'],
        headless: process.env.HEADLESS === 'false' ? false : true,
      },
    },
    /* Test against mobile viewports. */
    // mobile-web에서 테스트 실행
    {
      name: 'MW - Chrome (PC)',
      testMatch: ['**/mobile-web/**/*.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        headless: process.env.HEADLESS === 'false' ? false : true,
      },
    },
    {
      name: 'MW - Mobile Chrome',
      testMatch: ['**/mobile-web/**/*.spec.ts'],
      use: {
        ...devices['Pixel 5'],
        headless: process.env.HEADLESS === 'false' ? false : true,
      },
    },
    {
      name: 'MW - Mobile Safari',
      testMatch: ['**/mobile-web/**/*.spec.ts'],
      use: {
        ...devices['iPhone 12'],
        headless: process.env.HEADLESS === 'false' ? false : true,
      },
    },
    // android에서 테스트 실행 (Appium + Playwright)
    {
      name: 'Android - lguplus APP',
      testMatch: ['**/android/**/*.spec.ts'],
      use: {
        ...devices['galaxy note 20 ultra'],
        headless: process.env.HEADLESS === 'false' ? false : true,
      },
    },
    // ios에서 테스트 실행 (Appium + Playwright)
    {
      name: 'iOS - lguplus APP',
      testMatch: ['**/ios/**/*.spec.ts'],
      use: {
        ...devices['iPhone 12'],
        headless: process.env.HEADLESS === 'false' ? false : true,
      },
    },
    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        headless: process.env.HEADLESS === 'false' ? false : true,
      },
    },
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: process.env.HEADLESS === 'false' ? false : true,
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});
