import { getCurrentTimestamp } from '@common/formatters/formatters';
import dotenv from 'dotenv';
import path from 'path';

// 환경 변수 로드 (.env 파일 지원)
dotenv.config();

// Playwright 브라우저 설정
const BROWSERS = ['chromium', 'firefox', 'webkit'];
const HEADLESS = process.env.HEADLESS === 'true';
const TIMEOUT = 20 * 1000;

// Android & iOS 디바이스 설정
const ANDROID_DEVICE = process.env.ANDROID_DEVICE || 'Pixel 5';
const IOS_DEVICE = process.env.IOS_DEVICE || 'iPhone 13';
const USE_PROXY = process.env.USE_PROXY == 'true';

// 네트워크 설정
const API_TIMEOUT = 20 * 1000; // API 요청 타임아웃 (20초)
const RESPONSE_TIMEOUT = 10 * 1000; // 응답 타임아웃 (10초)

// Appium 대기 설정
const IMPLICIT_WAIT = 10; // 암묵적 대기 시간 (10초)
const EXPLICIT_WAIT = 20; // 명시적 대기 시간 (20초)

// 환경별 테스트 URL 설정
const ENV = process.env.ENV || 'staging';
const BASE_URLS: Record<string, string> = {
  development: 'http://localhost:3000',
  staging: 'https://www.lguplus.com',
  production: 'https://www.lguplus.com',
};
const BASE_URL = BASE_URLS[ENV];

// 프로젝트 기본 경로 설정
const BASE_PATH = path.resolve(__dirname, '..');

// POC 키 값 (각 환경별 식별자)
type POCType = 'pc' | 'mw' | 'aos' | 'ios' | 'api';

// POC 별 폴더 이름 매핑 함수
const getFolderName = (poc: POCType): string => {
  switch (poc) {
    case 'pc':
      return 'pc-web';
    case 'mw':
      return 'mobile-web';
    case 'aos':
      return 'android';
    case 'ios':
      return 'ios';
    case 'api':
      return 'api';
    default:
      throw new Error(`Unknown POC type: ${poc}`);
  }
};

// Playwright 실행 설정
const WORKERS = parseInt(process.env.WORKERS || '4', 10);
const RETRY_COUNT = Math.min(parseInt(process.env.RETRY_COUNT || '2', 10), 3);

// Playwright Launch Options
const LAUNCH_OPTIONS = {
  slowMo: parseInt(process.env.SLOW_MO || '0', 10),
  devtools: process.env.DEVTOOLS === 'true',
};

// 현재 장치가 모바일인지 확인
const IS_MOBILE = ['aos', 'ios'].includes(process.env.TEST_PLATFORM || '');

// Playwright 장치 설정 (데스크톱 & 모바일 구분)
const DEVICE_SETTINGS = IS_MOBILE
  ? {
      userAgent: IS_MOBILE ? 'Mozilla/5.0 (Mobile; rv:40.0) Gecko/40.0 Firefox/40.0' : '',
      viewport: IS_MOBILE ? { width: 375, height: 667 } : { width: 1280, height: 720 },
    }
  : {};

/**
 * POC 별 폴더 경로 - 소스
 * components / constants / fixture / locators / pages / steps
 */
const POC_SORCE_PATH = (poc: POCType): string => `${BASE_PATH}/e2e-${getFolderName(poc)}/src`;
// 컴포넌트 경로 설정
const COMPONENT_PATH = `${POC_SORCE_PATH}/components`;
// 컨스턴트 경로 설정
const CONSTANTS_PATH = `${POC_SORCE_PATH}/constants`;
// 픽스쳐 경로 설정
const FIXTURE_PATH = `${POC_SORCE_PATH}/fixtures`;
// 로케이터 경로 설정
const LOCATOR_PATH = `${POC_SORCE_PATH}/locators`;
// 페이지 경로 설정
const PAGE_PATH = `${POC_SORCE_PATH}/pages`;
// BDD STEP 경로 설정
const STEP_PATH = `${POC_SORCE_PATH}/steps`;
// 도커 설정파일 경로 설정
const DOCKER_PATH = `${POC_SORCE_PATH}/Dockerfile`;

/**
 * POC 별 폴더 경로 - 테스트 결과
 * logs / test-results / allure-results / screebshots / videos / traces
 */
const POC_PATH = (poc: POCType): string => `${BASE_PATH}/e2e-${getFolderName(poc)}`;
// logs 경로 설정
const LOG_PATH = `${POC_PATH}/logs`;
// test-results 경로 설정
const TEST_RESULT_PATH = `${POC_PATH}/test-results`;
// allure-results 경로 설정
const ALLURE_RESULT_PATH = `${POC_PATH}/allure-results`;
// screenshot 경로 설정
const SCREENSHOT_PATH = `${POC_PATH}/screenshots`;
// video 경로 설정
const VIDEO_PATH = `${POC_PATH}/videos`;
// trace 경로 설정
const TRACE_PATH = `${POC_PATH}/traces`;

/**
 * 배치 폴더 경로 - 테스트 결과
 * batch_result
 */
// 배치 경로 설정
const BATCH_RESULT_BASE_PATH = `${BASE_PATH}/batch/batch_result`;
// 배치 로그 파일
const BATCH_LOG_FILE = `${BATCH_RESULT_BASE_PATH}/batch_result_${getCurrentTimestamp()}.log`;

// 개별 결과 파일 (날짜별 저장)
const LOG_FILE_NAME = (poc: POCType): string => `${LOG_PATH}/${poc}_${getCurrentTimestamp()}.json`;
const TEST_RESULT_FILE_NAME = (poc: POCType): string =>
  `${TEST_RESULT_PATH}/${poc}_test-result_${getCurrentTimestamp()}.json`;
const ALLURE_RESULT_FILE_NAME = (poc: POCType): string =>
  `${ALLURE_RESULT_PATH}/${poc}_test-result_${getCurrentTimestamp()}.json`;
const SCREENSHOT_FILE_NAME = (poc: POCType): string =>
  `${SCREENSHOT_PATH}/${poc}_screenshot_${getCurrentTimestamp()}.png`;
const VIDEO_FILE_NAME = (poc: POCType): string =>
  `${VIDEO_PATH}/${poc}_video_${getCurrentTimestamp()}.mp4`;
const TRACE_FILE_NAME = (poc: POCType): string =>
  `${TRACE_PATH}/${poc}_trace_${getCurrentTimestamp()}.zip`;

// 파일 보관 주기 (일 단위)
export const FILE_RETENTION_DAYS = {
  log: 14,
  testResult: 14,
  allureResult: 14,
  screenshot: 7,
  video: 7,
  trace: 14,
};

// 테스트 계정
const USERNAME = process.env.UPLUS_ID;
const PASSWORD = process.env.UPLUS_PW;

// 슬랙 API URL
const SLACK_FILES_UPLOAD_URL = 'https://lgdigitalcommerce.slack.com/api/files.upload';

// pubsub 정보
export const PUBSUB = {
  PROJECT_ID: 'gcp-dev-uhdc-id',
  TOPIC_ID: 'qa-test',
  PUBLISHER_AUDIENCE: 'https://pubsub.googleapis.com/google.pubsub.v1.Publisher',
};

// 설정값 내보내기
export {
  BROWSERS,
  HEADLESS,
  TIMEOUT,
  BASE_URL,
  ENV,
  LOCATOR_PATH,
  TEST_RESULT_PATH,
  SCREENSHOT_PATH,
  VIDEO_PATH,
  TRACE_PATH,
  WORKERS,
  RETRY_COUNT,
  API_TIMEOUT,
  RESPONSE_TIMEOUT,
  BASE_PATH,
  BATCH_RESULT_BASE_PATH,
  BATCH_LOG_FILE,
  LOG_PATH,
  getCurrentTimestamp,
  POCType,
  USERNAME,
  PASSWORD,
};
