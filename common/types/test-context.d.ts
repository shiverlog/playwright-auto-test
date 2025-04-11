/**
 * Description : test-context.d.ts - 📌 테스트 실행 환경 및 사용자 정보를 담는 공통 컨텍스트 인터페이스
 * Author : Shiwoo Min
 * Date : 2025-04-04
 */
import type { Platform, UIType } from '@common/types/platform-types';

export interface TestContext {
  // 테스트 대상 플랫폼
  platform: PlatformValue;
  // 플랫폼에 대응하는 UI 타입 (PC, MOBILE, APP)
  uiType?: keyof typeof UIType;
  // 실행 환경 구분 (개발/스테이징/운영)
  env: 'development' | 'staging' | 'production';
  // 테스트 대상 유저의 식별자
  userId?: string;
  // 테스트 세션 ID 또는 랜덤 고유 식별자 (로깅, 디버깅, 세션 트래킹 등에 사용)
  sessionId?: string;
  // 테스트 시작 시간 (UTC 타임스탬프)
  startTime?: string;
  // 현재 테스트 케이스 이름 (로깅 및 추적용)
  testName?: string;
}
