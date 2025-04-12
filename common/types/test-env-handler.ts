/**
 * Description : test-env-handler.ts - 각 테스트 환경 클래스에서 구현해야 할 공통 인터페이스
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */

export interface TestEnvHandler {
  setup(): Promise<void>;
  teardown(): Promise<void>;
}
