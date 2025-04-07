/**
 * Description : PathConstants.ts - 📌 POC 타입 정의와 경로 매핑, 파일명 관련 로직 정의
 * Author : Shiwoo Min
 * Date : 2025-04-04
 */
import { getCurrentTimestamp } from '@common/formatters/formatters.js';
import type { POCType } from '@common/types/platform-types.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 루트 경로 설정
export const BASE_PATH = path.resolve(__dirname, '..');
const POC_ALL: POCType = 'ALL';

/**
 * POC 별 폴더 이름 매핑 함수
 * - PC -> 'pc-web'
 * - MW -> ['pc-mobile-web','emulator-mobile-web','device-mobile-web']
 * - AOS -> 'android-app'
 * - IOS -> 'ios-app'
 * - API -> 'api'
 */
export const POC_FOLDER_MAP: Record<Exclude<POCType, 'ALL'>, string | string[]> = {
  PC: 'pc-web',
  // MW는 PC, Emulator, Device 로 테스트 ( 추후 경로 변경)
  MW: ['pc-mobile-web'],
  AOS: ['android-app'],
  IOS: ['ios-app'],
  API: 'api',
};

// 테스트 mw 매핑
export const MW_BROWSER_MAP: Record<string, string> = {
  'pc-mobile-web': 'pc-mobile-chrome',
  'android-mobile-web': 'android-mobile-chrome',
  'ios-mobile-web': 'ios-mobile-safari',
};

// 테스트 and 매핑
export const AND_BROWSER_MAP: Record<string, string> = {
  'android-app': 'android-app',
  'android-emulator-app': 'android-emulator-app',
};
// 테스트 ios 매핑
export const IOS_BROWSER_MAP: Record<string, string> = {
  'ios-app': 'ios-app',
  'ios-emulator-app': 'ios-emulator-app',
};

/**
 * POC 별 폴더 경로 반환 함수
 * - e2e/pc-web
 * - e2e/pc-mobile-web
 * - e2e/emulator-mobile-web
 * - e2e/device-mobile-web
 * - e2e/android-app
 * - e2e/ios-app
 * - e2e/api
 * - POC_PATH('ALL') -> 모든 POC 경로 배열
 */
export const POC_PATH = (poc: POCType): string[] => {
  if (!poc) {
    throw new Error(`[POC_PATH] 유효하지 않은 poc 값: '${poc}'`);
  }
  if (poc === POC_ALL) {
    return Object.values(POC_FOLDER_MAP)
      .flatMap(folder => (Array.isArray(folder) ? folder : [folder]))
      .map(folder => `${BASE_PATH}/e2e/${folder}`);
  }

  const folders = POC_FOLDER_MAP[poc as Exclude<POCType, 'ALL'>];
  if (!folders) {
    throw new Error(`[POC_PATH] '${poc}'에 대한 경로가 POC_FOLDER_MAP에 정의되어 있지 않습니다.`);
  }

  return Array.isArray(folders)
    ? folders.map(f => `${BASE_PATH}/e2e/${f}`)
    : [`${BASE_PATH}/e2e/${folders}`];
};

/**
 * 하위 경로 포함한 POC 경로 생성 (단일 poc만 처리)
 */
export const getPOCPathWithSubdir = (poc: POCType, subPath: string): string[] => {
  return POC_PATH(poc).map(base => `${base}/${subPath}`);
};

/**
 * 특정 경로 배열에 타임스탬프 포함 파일명을 매핑
 */
const mapToTimestampedPath = (basePaths: string[], fileName: string): string[] =>
  basePaths.map(p => `${p}/${fileName}`);

/**
 * 테스트 관련 폴더 경로 (단일 poc 기준)
 * - POC_RESULT_PATHS('PC')
 * - e2e/pc-web/playwright-report
 * - e2e/pc-web/coverage
 * - e2e/pc-web/test-results/logs
 * - e2e/pc-web/test-results/allure-results
 * - e2e/pc-web/test-results/screenshots
 * - e2e/pc-web/test-results/videos
 * - e2e/pc-web/test-results/traces
 */
export const POC_RESULT_PATHS = (poc: POCType) => ({
  playwrightReport: getPOCPathWithSubdir(poc, 'playwright-report'),
  coverage: getPOCPathWithSubdir(poc, 'coverage'),
  log: getPOCPathWithSubdir(poc, 'test-results/logs'),
  allureResult: getPOCPathWithSubdir(poc, 'test-results/allure-results'),
  screenshots: getPOCPathWithSubdir(poc, 'test-results/screenshots'),
  videos: getPOCPathWithSubdir(poc, 'test-results/videos'),
  traces: getPOCPathWithSubdir(poc, 'test-results/traces'),
});

/**
 * 코드 관련 폴더 경로 (단일 poc 기준)
 * - common/locators
 * - e2e/pc-web/src/pages
 * - e2e/pc-web/src/steps
 * - e2e/pc-web/src/Dockerfile
 * - e2e/pc-web/tests
 * - e2e/pc-web/test-results/screenshots
 * - e2e/pc-web/test-results/videos
 * - e2e/pc-web/test-results/traces
 */
export const FOLDER_PATHS = (poc: POCType) => ({
  locators: '/common/locators',
  components: getPOCPathWithSubdir(poc, 'src/components'),
  constants: getPOCPathWithSubdir(poc, 'src/constants'),
  fixtures: getPOCPathWithSubdir(poc, 'src/fixtures'),
  tests: getPOCPathWithSubdir(poc, 'tests'),
  pages: getPOCPathWithSubdir(poc, 'src/pages'),
  steps: getPOCPathWithSubdir(poc, 'src/steps'),
  docker: getPOCPathWithSubdir(poc, 'src/Dockerfile'),
});

/**
 * 테스트 결과 파일명 생성 함수 (병렬 저장용)
 * - TEST_RESULT_FILE_NAME('MW') →
 * {
 *   playwrightReport: [
 *     '/e2e/pc-mobile-web/playwright-report/MW_report_20240404T142200.html',
 *     '/e2e/emulator-mobile-web/playwright-report/MW_report_20240404T142200.html',
 *     '/e2e/device-mobile-web/playwright-report/MW_report_20240404T142200.html'
 *   ],
 *   log: [
 *     '/e2e/pc-mobile-web/test-results/logs/MW_20240404T142200.json',
 *     '/e2e/emulator-mobile-web/test-results/logs/MW_20240404T142200.json',
 *     '/e2e/device-mobile-web/test-results/logs/MW_20240404T142200.json'
 *   ],
 *   allureResult: [...],
 *   screenshots: [...],
 *   videos: [...],
 *   traces: [...],
 *   coverage: [...]
 * }
 */
export const TEST_RESULT_FILE_NAME = (
  poc: POCType,
): Record<keyof ReturnType<typeof POC_RESULT_PATHS>, string[]> => {
  const timestamp = getCurrentTimestamp();
  const paths = POC_RESULT_PATHS(poc);

  return {
    playwrightReport: mapToTimestampedPath(
      paths.playwrightReport,
      `${poc}_report_${timestamp}.html`,
    ),
    log: mapToTimestampedPath(paths.log, `${poc}_${timestamp}.json`),
    allureResult: mapToTimestampedPath(paths.allureResult, `${poc}_test-result_${timestamp}.json`),
    screenshots: mapToTimestampedPath(paths.screenshots, `${poc}_screenshot_${timestamp}.png`),
    videos: mapToTimestampedPath(paths.videos, `${poc}_video_${timestamp}.mp4`),
    traces: mapToTimestampedPath(paths.traces, `${poc}_trace_${timestamp}.zip`),
    coverage: mapToTimestampedPath(paths.coverage, `${poc}_coverage_${timestamp}.json`),
  };
};
