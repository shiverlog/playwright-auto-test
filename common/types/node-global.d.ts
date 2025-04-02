/**
 * Description : node-global.d.ts - 📌 슬랙/이메일/Teams 환경 설정 타입 정의
 * Author : Shiwoo Min
 * Date : 2025-04-02
 */
declare namespace NodeJS {
  interface Global {
    isCI?: boolean;
    currentTestPlatform?: string;
  }
}
