/**
 * Description : node-global.d.ts - 📌 node 환경 설정 타입 정의
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
declare namespace NodeJS {
  interface Global {
    // CI 환경 여부
    isCI?: boolean;
    // test 플랫폼
    currentTestPlatform?: string;
    // 현재 POC
    currentPOC?: POCType;
    // 디버깅 모드
    isDebugMode?: boolean;
    // 각 테스트 런 고유 ID
    testRunId?: string;
  }
}
