/**
 * Description : playwright.config.ts - 📌 Playwright Config 테스트 실행 환경 정의 파일
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { ALL_POCS, POCType, POC_PATH, POC_RESULT_PATHS } from '@common/constants/PathConstants';
import { defineConfig, devices } from '@playwright/test';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';

// 환경 변수 로드
dotenv.config({ path: path.resolve(__dirname, '.env') });

// 현재 실행 중인 POC 지정
const ACTIVE_POC = (process.env.POC as POCType) || '';

// 단일 or 전체 POC 기준으로 경로 가져오기
const pocList = ACTIVE_POC === '' ? ALL_POCS : [ACTIVE_POC];

// 브라우저 조합 동적 생성
const browserMatrix: Record<Exclude<POCType, ''>, string[]> = {
  pc: ['chrome', 'firefox', 'safari', 'edge'],
  mw: ['chrome', 'mobile-chrome', 'mobile-safari'],
  aos: ['android-app'],
  ios: ['ios-app'],
  api: [],
};

// POC별 프로젝트 동적 생성
const projects = pocList.flatMap(poc => {
  const basePath = POC_PATH(poc) as string;
  const resultPaths = POC_RESULT_PATHS(basePath);

  return browserMatrix[poc as Exclude<POCType, ''>].map(browser => {
    const browserLabel = browser.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // 디바이스 설정
    let device;
    if (browser.includes('android-app')) device = devices['galaxy note 20 ultra'];
    else if (browser.includes('ios-app')) device = devices['iPhone 12'];
    else if (browser === 'mobile-chrome') device = devices['galaxy note 20 ultra'];
    else if (browser === 'mobile-safari') device = devices['iPhone 12'];
    else if (browser === 'firefox') device = devices['Desktop Firefox'];
    else if (browser === 'safari') device = devices['Desktop Safari'];
    else device = devices['Desktop Chrome'];

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    // 기본 환경 설정 (Global Configuration)
    const useOptions: any = {
      ...device,
      /**
       * 브라우저 실행 모드 설정:
       * - process.env.HEADLESS=true - 브라우저 headless 모드
       * - process.env.HEADLESS=false - 브라우저 UI 표시
       */
      headless: process.env.HEADLESS !== 'false',
      /* Base URL to use in actions like `await page.goto('/')`. */
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      // 기본 화면 크기 설정
      viewport: { width: 1280, height: 720 },
      // 테스트 실패 시만 스크린샷 저장
      screenshot: 'only-on-failure',
      // 실패한 테스트의 경우에만 비디오 녹화 유지
      video: 'retain-on-failure',
      /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
      // 첫 번째 재시도에서 trace 파일 저장
      trace: 'on-first-retry',
      ignoreHTTPSErrors: true,
      // HTTPS 인증서 오류 무시 (보안 경고 무시)
      acceptDownloads: true,
      // 브라우저 실행 타임아웃 (기본값: 60000ms)
      timeout: parseInt(process.env.BROWSER_LAUNCH_TIMEOUT ?? '60000', 10),
      // 슬로우 모션 (기본값: 0ms)
      slowMo: parseInt(process.env.SLOW_MO ?? '0', 10),
      // 단일 액션 타임아웃 (초 단위 → ms 변환)
      actionTimeout: parseInt(process.env.ACTION_TIMEOUT ?? '30', 10) * 1000,
      // 페이지 이동 타임아웃 (초 단위 → ms 변환)
      navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT ?? '60', 10) * 1000,
      // 콘솔 로그 캡처
      logger: {
        isEnabled: (name: string, severity: 'error' | 'warning' | string) =>
          severity === 'error' || severity === 'warning',
        log: (name: string, severity: string, message: string) =>
          console.log(`[${severity}] ${name}: ${message}`),
      },
    };

    // Edge일 경우 실행 파일과 args 지정
    if (browser === 'edge') {
      useOptions.browserName = 'chromium';
      useOptions.executablePath = 'C:\\CustomBrowsers\\chromium-playwright.exe';
      useOptions.args = [
        '--no-sandbox',
        '--disable-gpu',
        '--disable-blink-features=AutomationControlled',
        '--window-size=1280,720',
      ];
    } else {
      // 일반 브라우저에 args만 설정
      /**
       * 브라우저 실행 시 추가 옵션 (arguments)
       * - `--start-maximized`         : 브라우저 최대화
       * - `--disable-extensions`      : 브라우저 확장프로그램 비활성화
       * - `--disable-plugins`         : 브라우저 플러그인 비활성화
       * - `--disable-dev-shm-usage`   : 공유 메모리(/dev/shm)사용 비활성화
       * - `--no-sandbox`              : 샌드박스 비활성화(일부 CI/CD 환경에서 필수)
       * - `--disable-gpu`             : GPU 가속 비활성화(CI 환경에서 렌더링 최적화)
       * - `--disable-blink-features=AutomationControlled`: Selenium 등 자동화 탐지를 피하기 위한 설정
       */
      useOptions.args = [
        '--start-maximized',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-blink-features=AutomationControlled',
      ];
    }

    return {
      name: `POC - ${poc.toUpperCase()} - ${browserLabel}`,
      testMatch: [`**/${basePath.split('/').pop()}/src/steps/**/*.spec.ts`],
      /* Reporter to use. See https://playwright.dev/docs/test-reporters */
      // 테스트 리포트 설정 (Reporter Configuration)
      reporter: [
        // 기본 콘솔 출력
        ['list'],
        // HTML 리포트 생성
        ['html', { outputFolder: resultPaths.playwrightReport, open: 'never' }],
        // JSON 리포트 생성
        ['json', { outputFile: `${resultPaths.log}/${poc}_result.json` }],
        // allure 리포트 생성
        ['allure-playwright', { outputFolder: resultPaths.allureResult }],
      ],
      use: useOptions,
    };
  });
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // 공통 테스트 폴더 경로
  testDir: '.',
  testMatch: [
    '**/*.spec.ts',
    '**/src/steps/**/*.ts',
    'tests-examples/**/*.spec.ts',
    'e2e/**/*.spec.ts',
  ],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  // 테스트 실행 시 동시 실행할 워커(worker) 수 설정
  workers: process.env.CI ? 1 : undefined,

  // 타임아웃 설정 (Timeouts)
  timeout: 30 * 1000,

  /* Configure projects for major browsers */
  // 테스트 프로젝트별 설정 (Test Project Configuration)
  projects: [
    {
      name: 'Common Tests',
      testMatch: ['*.spec.ts', 'src/steps/**/*.spec.ts', 'tests-examples/**/*.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        headless: process.env.HEADLESS !== 'false',
      },
    },
    ...(projects.length ? projects : []),
  ],
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
console.log(
  'Generated Projects:',
  projects.map(p => p.name),
);
