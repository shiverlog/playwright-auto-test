/**
 * Description : constants.ts - 📌 POC 타입 정의와 경로 매핑, 파일명 관련 로직 정의
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { BASE_PATH } from '@common/config/CommonConfig';
import { getCurrentTimestamp } from '@common/formatters/formatters';

// POC 키 값 (각 환경별 식별자)
export type POCType = 'pc' | 'mw' | 'aos' | 'ios' | 'api' | '';

// POC 별 폴더 이름 매핑 함수
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

// logs 경로 설정
export const LOG_PATH = `${POC_PATH}/logs`;
// test-results 경로 설정
export const TEST_RESULT_PATH = `${POC_PATH}/test-results`;
// allure-results 경로 설정
export const ALLURE_RESULT_PATH = `${POC_PATH}/allure-results`;
// screenshot 경로 설정
export const SCREENSHOT_PATH = `${POC_PATH}/screenshots`;
// video 경로 설정
export const VIDEO_PATH = `${POC_PATH}/videos`;
// trace 경로 설정
export const TRACE_PATH = `${POC_PATH}/traces`;

export const POC_RESULT_PATHS = (base: string) => ({
  log: `${base}/logs`,
  testResult: `${base}/test-results`,
  allureResult: `${base}/allure-results`,
  screenshots: `${base}/screenshots`,
  videos: `${base}/videos`,
  traces: `${base}/traces`,
});

// 컴포넌트 경로 설정
export const COMPONENT_PATH = `${POC_PATH}/src/components`;
// 컨스턴트 경로 설정
export const CONSTANTS_PATH = `${POC_PATH}/src/constants`;
// 픽스쳐 경로 설정
export const FIXTURE_PATH = `${POC_PATH}/src/fixtures`;
// 로케이터 경로 설정
export const LOCATOR_PATH = `${POC_PATH}/src/locators`;
// 페이지 경로 설정
export const PAGE_PATH = `${POC_PATH}/src/pages`;
// BDD STEP 경로 설정
export const STEP_PATH = `${POC_PATH}/src/steps`;
// 도커 설정파일 경로 설정
export const DOCKER_PATH = `${POC_PATH}/src/Dockerfile`;

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
export const LOG_FILE_NAME = (poc: POCType): string =>
  `${LOG_PATH}/${poc}_${getCurrentTimestamp()}.json`;
export const TEST_RESULT_FILE_NAME = (poc: POCType): string =>
  `${TEST_RESULT_PATH}/${poc}_test-result_${getCurrentTimestamp()}.json`;
export const ALLURE_RESULT_FILE_NAME = (poc: POCType): string =>
  `${ALLURE_RESULT_PATH}/${poc}_test-result_${getCurrentTimestamp()}.json`;
export const SCREENSHOT_FILE_NAME = (poc: POCType): string =>
  `${SCREENSHOT_PATH}/${poc}_screenshot_${getCurrentTimestamp()}.png`;
export const VIDEO_FILE_NAME = (poc: POCType): string =>
  `${VIDEO_PATH}/${poc}_video_${getCurrentTimestamp()}.mp4`;
export const TRACE_FILE_NAME = (poc: POCType): string =>
  `${TRACE_PATH}/${poc}_trace_${getCurrentTimestamp()}.zip`;
