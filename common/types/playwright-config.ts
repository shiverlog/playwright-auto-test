/**
 * 타입 정의: playwright-config.ts
 * 설명: Playwright 런타임 설정 관련 타입
 */

/**
 * Playwright 실행 옵션을 정의하는 인터페이스
 */
export interface LaunchOptions {
  // 동작을 느리게 실행할 시간(ms)
  slowMo: number;
  // 개발자 도구 열기 여부
  devtools: boolean;
}

/**
 * Playwright 디바이스 설정 인터페이스
 */
export interface DeviceSettings {
  // 브라우저 사용자 에이전트
  userAgent?: string;
  viewport: {
    // 화면 너비(px)
    width: number;
    // 화면 높이(px)
    height: number;
  };
}
