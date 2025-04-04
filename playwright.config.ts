/**
 * Description : playwright.config.ts - 📌 Playwright Config 테스트 실행 환경 정의 파일
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import { ALL_DEVICES, MAX_REAL_DEVICES } from '@common/config/BaseConfig.js';
import { BASE_DEVICES } from '@common/config/BaseDeviceConfig.js';
import { MW_BROWSER_MAP } from '@common/constants/PathConstants.js';
import type { POCKey, POCType } from '@common/types/platform-types.js';
import { ALL_POCS } from '@common/types/platform-types.js';
import { defineConfig, devices, type Project } from '@playwright/test';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import os from 'os';
import path from 'path';
import { dirname } from 'path';
import 'tsconfig-paths/register.js';
import { fileURLToPath } from 'url';

// ESM 환경 경로 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env 파일 로드
dotenv.config({ path: path.resolve(__dirname, '.env') });

// 현재 실행 중인 POC 지정
const ACTIVE_POC = (process.env.POC as POCType) || '';

// 단일 or 전체 POC 기준으로 경로 가져오기
const pocList: POCKey[] = ACTIVE_POC === 'ALL' ? ALL_POCS : [ACTIVE_POC as POCKey];

// 브라우저 조합 동적 생성
const browserMatrix: Record<Exclude<POCType, ''>, string[]> = {
  // pc-web: ['chrome', 'firefox', 'safari', 'edge']
  PC: ['pc-chrome'],
  // pc-mobile-web, device-mobile-web, emulate-mobile-web: ['chrome', 'safari']
  MW: Object.values(MW_BROWSER_MAP),
  // android-app
  AOS: ['android-app'],
  // ios-app
  IOS: ['ios-app'],
  API: [],
  ALL: [],
};

// ALL에 나머지 POC의 모든 브라우저/디바이스를 병합해서 넣기
browserMatrix.ALL = [
  ...new Set(
    Object.entries(browserMatrix)
      .filter(([key]) => key !== 'ALL')
      .flatMap(([, value]) => value),
  ),
];

// POC별 테스트 프로젝트 동적 생성
const pocProjects = pocList.flatMap((poc: POCKey) => {
  const matrixKey = poc;
  const basePath = `e2e/${poc}`;
  const resultPaths = {
    log: `logs/${poc}`,
    playwrightReport: `playwright-report/${poc}`,
    allureResult: `allure-results/${poc}`,
  };

  const deviceInfo = BASE_DEVICES[poc as keyof typeof BASE_DEVICES];
  if (!deviceInfo || !('device' in deviceInfo)) return [];

  const browserList = browserMatrix[matrixKey];
  if (!browserList) {
    console.warn(`browserMatrix에 '${matrixKey}'가 정의되어 있지 않음`);
    return [];
  }

  return browserMatrix[matrixKey].map(browser => {
    const browserLabel = browser.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    // 기본 환경 설정 (Global Configuration)
    const useOptions: any = {
      ...(deviceInfo.device ?? {}),
      /**
       * 브라우저 실행 모드 설정:
       * - process.env.HEADLESS=true - 브라우저 headless 모드
       * - process.env.HEADLESS=false - 브라우저 UI 표시
       */
      headless: process.env.HEADLESS !== 'false',
      /* Base URL to use in actions like `await page.goto('/')`. */
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      // 기본 화면 크기 설정
      viewport: deviceInfo.device?.viewport ?? { width: 1920, height: 1080 },
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
      name: `POC - ${poc} - ${browserLabel}`,
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

type E2EProjectConfig = {
  name: string;
  path: string;
  device: keyof typeof devices;
  viewport?: { width: number; height: number };
  userAgent?: string;
  platform?: NodeJS.Platform[];
  outputKey: string;
};

const realDeviceProjects: Project[] = ALL_DEVICES.slice(0, MAX_REAL_DEVICES).map(
  ({ name, platform, config }) => ({
    name: `Real Device - ${platform.toUpperCase()} - ${name}`,
    testMatch: [`e2e/${platform}/**/*.spec.ts`],
    use: {
      headless: false,
      viewport: { width: 390, height: 844 },
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      deviceConfig: config, // Appium 연동 대비
    },
    reporter: [
      ['list'],
      ['json', { outputFile: `logs/${platform}-${name}.json` }],
      ['allure-playwright', { outputFolder: `allure-results/${platform}-${name}` }],
    ],
  }),
);

const E2E_CONFIGS: E2EProjectConfig[] = [
  {
    name: 'PC Web - Chrome',
    path: 'e2e/pc-web',
    device: 'Desktop Chrome',
    viewport: { width: 1920, height: 1080 },
    outputKey: 'pc-web',
  },
  {
    name: 'Mobile Web - PC Chrome (Responsive)',
    path: 'e2e/mobile-web',
    device: 'Desktop Chrome',
    viewport: { width: 390, height: 844 },
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    outputKey: 'mobile-web-pc',
  },
  {
    name: 'Mobile Web - Android (Chrome)',
    path: 'e2e/mobile-web',
    device: 'Pixel 5',
    viewport: { width: 412, height: 915 },
    outputKey: 'mobile-web-android',
  },
  {
    name: 'Mobile Web - iOS (Safari)',
    path: 'e2e/mobile-web',
    device: 'iPhone 12',
    viewport: { width: 390, height: 844 },
    outputKey: 'mobile-web-ios',
  },
  {
    name: 'Android App',
    path: 'e2e/android',
    device: 'Pixel 5',
    outputKey: 'android',
  },
  {
    name: 'iOS App',
    path: 'e2e/ios',
    device: 'iPhone 12',
    platform: ['darwin'],
    outputKey: 'ios',
  },
];

// 정적 E2E 테스트 대상 변환 함수
function generateE2EProjects(): Project[] {
  return E2E_CONFIGS.filter(config => {
    return !config.platform || config.platform.includes(process.platform);
  }).map(config => ({
    name: `E2E - ${config.name}`,
    testMatch: [`**/${config.path}/**/*.spec.ts`],
    use: {
      ...devices[config.device],
      headless: process.env.HEADLESS !== 'false',
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      viewport: config.viewport,
      userAgent: config.userAgent,
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'on-first-retry',
    },
    reporter: [
      ['list'],
      ['html', { outputFolder: `playwright-report/${config.outputKey}`, open: 'never' }],
      ['json', { outputFile: `logs/${config.outputKey}.json` }],
      ['allure-playwright', { outputFolder: `allure-results/${config.outputKey}` }],
    ],
  }));
}

const e2eProjects = generateE2EProjects();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // 초기화 작업
  globalSetup: path.resolve(__dirname, './globalSetup.ts'),
  globalTeardown: path.resolve(__dirname, './globalTeardown.ts'),
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
  // 테스트 실행 시 동시 실행할 워커(worker) 수 설정 : 로컬은 CPU 75% 사용
  workers: process.env.CI ? 1 : Math.max(1, Math.floor(os.cpus().length * 0.75)),

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
    ...e2eProjects,
    ...(pocProjects.length ? pocProjects : []),
    ...realDeviceProjects,
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
  [...e2eProjects, ...pocProjects].map(p => p.name),
);
