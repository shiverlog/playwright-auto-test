import dotenv from "dotenv";
import path from "path";
import winston from "winston";
import { getCurrentTimestamp } from "../formatters/formatters";

// 환경 변수 로드 (.env 파일 지원)
dotenv.config();

// Playwright 브라우저 설정
const BROWSERS = ["chromium", "firefox", "webkit"];
const HEADLESS = process.env.HEADLESS === "true";
const TIMEOUT = 20 * 1000;

// Android & iOS 환경 추가 설정
const ANDROID_DEVICE = process.env.ANDROID_DEVICE || "Pixel 5";
const IOS_DEVICE = process.env.IOS_DEVICE || "iPhone 13";
const USE_PROXY = process.env.USE_PROXY == "true";

// 네트워크 설정
const API_TIMEOUT = 20 * 1000; // API 요청 타임아웃 (20초)
const RESPONSE_TIMEOUT = 10 * 1000; // 응답 타임아웃 (10초)

// 환경별 테스트 URL 설정
const ENV = process.env.ENV || "staging";
const BASE_URLS: Record<string, string> = {
  development: "http://localhost:3000",
  staging: "https://www.lguplus.com",
  production: "https://www.lguplus.com",
};
const BASE_URL = BASE_URLS[ENV];

// 프로젝트 기본 경로 설정
const BASE_PATH = path.resolve(__dirname, "..");

// 배치 결과 폴더 설정
const BATCH_RESULT_BASE_PATH = `${BASE_PATH}/batch/batch_result`;

// POC 키 값 (각 환경별 식별자)
type POCType = "pc" | "mw" | "aos" | "ios";

// Playwright 실행 설정
const WORKERS = parseInt(process.env.WORKERS || "4", 10);
const RETRY_COUNT = Math.min(parseInt(process.env.RETRY_COUNT || "2", 10), 3);

// Playwright Launch Options
const LAUNCH_OPTIONS = {
  slowMo: parseInt(process.env.SLOW_MO || "0", 10),
  devtools: process.env.DEVTOOLS === "true",
};

// 현재 장치가 모바일인지 확인
const IS_MOBILE = ["aos", "ios"].includes(process.env.TEST_PLATFORM || "");

// Playwright 장치 설정 (데스크톱 & 모바일 구분)
const DEVICE_SETTINGS = IS_MOBILE
  ? {
      userAgent: IS_MOBILE ? "Mozilla/5.0 (Mobile; rv:40.0) Gecko/40.0 Firefox/40.0" : "",
      viewport: IS_MOBILE ? { width: 375, height: 667 } : { width: 1280, height: 720 },
    }
  : {};

// 컴포넌트 경로 설정 (POC별 설정)
const COMPONENT_PATH = (poc: POCType): string => `${BASE_PATH}/e2e-${poc}/src/components`;

// 컨스턴트트 경로 설정 (POC별 설정)
const CONSTANTS_PATH = (poc: POCType): string => `${BASE_PATH}/e2e-${poc}/src/components`;

// 픽스쳐 경로 설정 (POC별 설정)
const FIXTURE_PATH = (poc: POCType): string => `${BASE_PATH}/e2e-${poc}/src/fixtures`;

// 로케이터 경로 설정 (POC별 설정)
const LOCATOR_PATH = (poc: POCType): string => `${BASE_PATH}/e2e-${poc}/src/locators`;

// 페이지 경로 설정 (POC별 설정)
const PAGE_PATH = (poc: POCType): string => `${BASE_PATH}/e2e-${poc}/src/pages`;

// BDD STEP 경로 설정 (POC별 설정)
const STEP_PATH = (poc: POCType): string => `${BASE_PATH}/e2e-${poc}/src/steps`;

// 도커설정파일 경로 설정 (POC별 설정)
const DOCKER_PATH = (poc: POCType): string => `${BASE_PATH}/e2e-${poc}/Dockerfile`;

// 테스트 결과 저장 경로 설정 (POC별 설정)
const LOG_PATH = (poc: POCType): string => `${BASE_PATH}/e2e-${poc}/logs`;
const TEST_RESULT_PATH = (poc: POCType): string => `${BASE_PATH}/e2e-${poc}//test-results`;
const SCREENSHOT_PATH = (poc: POCType): string => `${BASE_PATH}/e2e-${poc}//screenshots`;
const VIDEO_PATH = (poc: POCType): string => `${BASE_PATH}/e2e-${poc}//videos`;
const TRACE_PATH = (poc: POCType): string => `${BASE_PATH}/e2e-${poc}//traces`;

// 배치 로그 파일 (날짜별 저장)
const MASTER_LOG_FILE = `${BATCH_RESULT_BASE_PATH}/batch_result_${getCurrentTimestamp()}.log`;

// 개별 결과 파일 (날짜별 저장)
const getLogFile = (poc: POCType): string => `${LOG_PATH(poc)}/${poc}_${getCurrentTimestamp()}.json`;
const getTestResultFile = (poc: POCType): string => `${TEST_RESULT_PATH(poc)}/${poc}_test-result_${getCurrentTimestamp()}.json`;
const getScreenshotFile = (poc: POCType): string => `${SCREENSHOT_PATH(poc)}/${poc}_screenshot_${getCurrentTimestamp()}.png`;
const getVideoFile = (poc: POCType): string => `${VIDEO_PATH(poc)}/${poc}_video_${getCurrentTimestamp()}.mp4`;
const getTraceFile = (poc: POCType): string => `${TRACE_PATH(poc)}/${poc}_trace_${getCurrentTimestamp()}.zip`;

// 파일 보관 주기 (일 단위)
export const FILE_RETENTION_DAYS = {
  masterLog: 30,  // 배치 로그 보관 기간
  testResult: 14, // 테스트 결과 보관 기간
  logFile: 14,    // 개별 로그 보관 기간
  screenshot: 7,  // 스크린샷 보관 기간
  video: 7,       // 비디오 보관 기간
  trace: 14,      // 트레이스 보관 기간
};

// 테스트 계정 정보
const USERNAME = process.env.UPLUS_ID;
const PASSWORD = process.env.UPLUS_PW;

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
  MASTER_LOG_FILE,
  LOG_PATH,
  getLogFile,
  getTestResultFile,
  getScreenshotFile,
  getVideoFile,
  getTraceFile,
  getCurrentTimestamp,
  POCType,
  USERNAME,
  PASSWORD,
};
