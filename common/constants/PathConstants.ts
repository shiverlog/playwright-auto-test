/**
 * Description : constants.ts - 📌 POC 타입 정의와 경로 매핑, 파일명 관련 로직 정의
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { BASE_PATH } from '@common/config/onfig';
import { getCurrentTimestamp } from '@common/formatters/formatters';

// POC 키 값 (각 환경별 식별자) '' 는 모든 POC 실행을 의미
export type POCType = 'pc' | 'mw' | 'aos' | 'ios' | 'api' | '';

// 전체 POC 리스트
export const ALL_POCS: Exclude<POCType, ''>[] = ['pc', 'mw', 'aos', 'ios', 'api'];

// POC 별 폴더 이름 매핑 함수s
export const POC_FOLDER_MAP: Record<Exclude<POCType, ''>, string> = {
  pc: 'pc-web',
  mw: 'mobile-web',
  aos: 'android',
  ios: 'ios',
  api: 'api',
};

/**
 * POC 별 폴더 경로
 * 소스 : components / constants / fixture / locators / pages / steps
 * 테스트 결과 : logs / test-results / allure-results / screenshots / videos / traces
 */
export const POC_PATH = (poc: POCType): string | string[] => {
  if (poc === '') {
    // 전체 POC 폴더 경로 배열 반환
    return Object.values(POC_FOLDER_MAP).map(folder => `${BASE_PATH}/e2e/${folder}`);
  }
  return `${BASE_PATH}/e2e/${POC_FOLDER_MAP[poc]}`;
};

// test-results 경로 설정
export const PLAYWRIGHT_REPORT_PATH = `${POC_PATH}/playwright-report`;
// coverage 경로 설정
export const COVERAGE_PATH = `${POC_PATH}/coverage`;
// logs 경로 설정
export const LOG_PATH = `${POC_PATH}/test-results/logs`;
// allure-results 경로 설정
export const ALLURE_RESULT_PATH = `${POC_PATH}/test-results/allure-results`;
// screenshot 경로 설정
export const SCREENSHOT_PATH = `${POC_PATH}/test-results/screenshots`;
// video 경로 설정
export const VIDEO_PATH = `${POC_PATH}/test-results/videos`;
// trace 경로 설정
export const TRACE_PATH = `${POC_PATH}/test-results/traces`;

export const POC_RESULT_PATHS = (base: string) => ({
  playwrightReport: `${base}/playwright-report`,
  coverage: `${base}/coverage`,
  log: `${base}/test-results/logs`,
  allureResult: `${base}/test-results/allure-results`,
  screenshots: `${base}/test-results/screenshots`,
  videos: `${base}/test-results/videos`,
  traces: `${base}/test-results/traces`,
});

// 로케이터 경로 설정
export const LOCATOR_PATH = `${BASE_PATH}/common/locators`;
// 컴포넌트 경로 설정
export const COMPONENT_PATH = `${POC_PATH}/src/components`;
// 컨스턴트 경로 설정
export const CONSTANTS_PATH = `${POC_PATH}/src/constants`;
// 픽스쳐 경로 설정
export const FIXTURE_PATH = `${POC_PATH}/src/fixtures`;
// 페이지 경로 설정
export const PAGE_PATH = `${POC_PATH}/src/pages`;
// BDD STEP 경로 설정
export const STEP_PATH = `${POC_PATH}/src/steps`;
// 테스트 코드 경로
export const TESTS_PATH = `${POC_PATH}/tests`;
// 도커 설정파일 경로 설정
export const DOCKER_PATH = `${POC_PATH}/src/Dockerfile`;

export const FOLDER_PATHS = (base: string) => ({
  locators: `/common/locators`,
  components: `${base}/src/components`,
  constants: `${base}/src/constants`,
  fixtures: `${base}/src/fixtures`,
  test: `${POC_PATH}/tests`,
  pages: `${base}/src/pages`,
  steps: `${base}/src/steps`,
  docker: `${base}/src/Dockerfile`,
});

/**
 * 배치 폴더 경로 - 테스트 결과
 * batch_result
 */
// 배치 경로 설정
export const BATCH_RESULT_BASE_PATH = `${BASE_PATH}/batch/batch_result`;
// 배치 로그 파일
export const BATCH_LOG_FILE_NAME = (poc: POCType): string =>
  `${BATCH_RESULT_BASE_PATH}/${poc}_${getCurrentTimestamp()}.log`;

// 개별 결과 파일 (날짜별 저장)
export const PLAYWRIGHT_REPORT_FILE_NAME = (poc: POCType): string =>
  `${PLAYWRIGHT_REPORT_PATH}/${poc}_report_${getCurrentTimestamp()}.html`;
export const LOG_FILE_NAME = (poc: POCType): string =>
  `${LOG_PATH}/${poc}_${getCurrentTimestamp()}.json`;
export const ALLURE_RESULT_FILE_NAME = (poc: POCType): string =>
  `${ALLURE_RESULT_PATH}/${poc}_test-result_${getCurrentTimestamp()}.json`;
export const SCREENSHOT_FILE_NAME = (poc: POCType): string =>
  `${SCREENSHOT_PATH}/${poc}_screenshot_${getCurrentTimestamp()}.png`;
export const VIDEO_FILE_NAME = (poc: POCType): string =>
  `${VIDEO_PATH}/${poc}_video_${getCurrentTimestamp()}.mp4`;
export const TRACE_FILE_NAME = (poc: POCType): string =>
  `${TRACE_PATH}/${poc}_trace_${getCurrentTimestamp()}.zip`;

export const TEST_RESULT_FILE_NAME = (
  base: string,
  poc: POCType,
): Record<keyof ReturnType<typeof POC_RESULT_PATHS>, string> => {
  const paths = POC_RESULT_PATHS(base);
  const timestamp = getCurrentTimestamp();

  return {
    playwrightReport: `${paths.playwrightReport}/${poc}_report_${timestamp}.html`,
    log: `${paths.log}/${poc}_${timestamp}.json`,
    allureResult: `${paths.allureResult}/${poc}_test-result_${timestamp}.json`,
    screenshots: `${paths.screenshots}/${poc}_screenshot_${timestamp}.png`,
    videos: `${paths.videos}/${poc}_video_${timestamp}.mp4`,
    traces: `${paths.traces}/${poc}_trace_${timestamp}.zip`,
    coverage: `${paths.coverage}/${poc}_coverage_${timestamp}.json`,
  };
};
