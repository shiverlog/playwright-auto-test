/**
 * Description : import-meta-env.d.ts - 📌 import.meta.env 환경 전용 타입 정의
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
interface ImportMetaEnv extends Readonly<Record<string, string>> {
  // U+ 테스트 계정 아이디
  readonly UPLUS_ID: string;
  // U+ 테스트 계정 비밀번호
  readonly UPLUS_PW: string;
  // 현재 환경 구분 (로컬/스테이징/운영)
  readonly ENV: 'development' | 'staging' | 'production';
  // 브라우저 headless 모드 여부
  readonly HEADLESS: 'true' | 'false';
}
