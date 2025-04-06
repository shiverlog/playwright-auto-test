/**
 * Description : playwright-config.ts - 📌 Playwright 런타임 설정 관련 타입
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import type { POCKey, POCType } from '@common/types/platform-types';
import type { BrowserContextOptions, LaunchOptions } from '@playwright/test';

// 전체 POC 배열 타입
export type AllPOCs = POCKey[];

// POC 별 매핑 폴더 타입 (단일 또는 다중 경로 지원)
export type POCFolderMap = Record<POCKey, string | string[]>;

/**
 * E2E 테스트 프로젝트 타입 정의
 */
export type E2EProjectConfig = {
  // 프로젝트 이름
  name: string;
  // 테스트 경로
  path: string;
  // Playwright 제공 디바이스 키
  device: keyof typeof import('@playwright/test').devices;
  // 뷰포트 크기
  viewport?: { width: number; height: number } | null;
  // 브라우저 실행 옵션
  launchOptions?: LaunchOptions;
  // contextOptions 추가 설정
  contextOptions?: BrowserContextOptions;
  // 사용자 에이전트 설정
  userAgent?: string;
  // 플랫폼 제약 조건
  platform?: NodeJS.Platform[];
  // 리포트/로그 저장용 키
  outputKey: string;
};

/**
 * LaunchOptions  커스텀 -> @playwright/test 사용
 */
// export interface LaunchOptions {
//   // 동작을 느리게 실행할 시간(ms)
//   slowMo: number;
//   // 개발자 도구 열기 여부
//   devtools: boolean;
//   // 최대화면 크기 설정
//   args: string[];
// }

/**
 * 브라우저 매트릭스 타입 정의 (POC 별 사용 브라우저 목록)
 */
export type BrowserMatrix = Record<Exclude<POCType, ''>, string[]>;

/**
 * 테스트 전역(Global)에 등록될 수 있는 변수 타입 정의
 */
declare global {
  namespace NodeJS {
    interface Global {
      // CI 환경 여부
      isCI?: boolean;
      // 디버깅 모드 활성화 여부
      isDebugMode?: boolean;
      // 테스트 대상 플랫폼
      currentTestPlatform?: string;
      // 현재 실행 중인 POC
      currentPOC?: POCType;
      // 현재 디바이스 이름
      currentDeviceName?: string;
      // OS 버전 정보
      currentOSVersion?: string;
      // 에뮬레이터 여부
      isEmulator?: boolean;
      // 테스트 실행 고유 ID
      testRunId?: string;
      // pnpm 워크스페이스 루트
      pnpmWorkspaceRoot?: string;
      envConfig?: {
        // 실행 환경 변수 설정
        baseUrl: string;
        apiUrl?: string;
        headless?: boolean;
        locale?: string;
        timezone?: string;
      };
    }
  }
}
export {};
