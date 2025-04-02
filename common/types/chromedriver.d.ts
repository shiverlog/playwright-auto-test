/**
 * Description : chromedriver.d.ts - 📌 'chromedriver' 패키지를 TypeScript에서 사용할 수 있도록 모듈 선언
 * Author : Shiwoo Min
 * Date : 2025-04-02
 */
declare module 'chromedriver' {
  // chromedriver 실행 파일 경로
  const path: string;
  // chromedriver의 pnpm 패키지 버전
  export const version: string;
  // 실제 크롬 드라이버의 바이너리 버전
  export const chromeDriverVersion: string;
  // chromedriver 바이너리가 위치한 폴더
  export const folder: string;
  // 시스템 아키텍처
  export const arch: string;
  // 실행 환경 플랫폼 (예: 'darwin', 'win32', 'linux')
  export const platform: string;
  // chromedriver 다운로드 URL
  export const url: string;
  // 기본 export는 바이너리 경로
  export default path;
}
