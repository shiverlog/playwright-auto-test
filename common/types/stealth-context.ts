/**
 * Description : stealth-context.ts - 📌 StealthContext 옵션 타입 정의
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */

// StealthContext에서 사용할 옵션 타입
export interface StealthContextOptions {
  // headless 모드 여부
  headless?: boolean;
  // 브라우저 locale
  locale?: string;
  // 시간대 설정
  timezoneId?: string;
  // 사용자 에이전트 문자열 지정
  userAgent?: string;
  // 뷰포트 크기 설정
  viewport?: { width: number; height: number };
  // 인증 상태 저장 파일 경로
  storageStatePath?: string;
}
