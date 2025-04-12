/**
 * Description : stealth-context.ts - 📌 StealthContext 옵션 타입 정의
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import type { Platform } from '@common/types/platform-types';

/**
 * StealthContext에서 사용할 옵션 타입
 */
export interface StealthContextOptions {
  // platform 구분
  platform?: Platform;
  // headless 모드 여부
  headless?: boolean;
  // PC 웹 환경 여부 (크롬/사파리/엣지)
  isPc?: boolean;
  // Android/iOS 여부
  isDevice?: boolean;
  // 모바일 웹 환경 여부 (브라우저 기반 모바일 UI 테스트)
  isMobileWeb?: boolean;
  // 브라우저 locale
  locale?: string;
  // 시간대 설정
  timezoneId?: string;
  // 사용자 에이전트 문자열 지정
  userAgent?: string;
  // 뷰포트 크기 설정
  viewport?: { width: number; height: number };
  // 디바이스 스케일 팩터
  deviceScaleFactor?: number;
  // 터치 지원 여부
  hasTouch?: boolean;
  // Playwright 내부용 isMobile
  isMobile?: boolean;
  // 인증 상태 저장 파일 경로
  storageStatePath?: string;
}
