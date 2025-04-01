/**
 * 타입 선언: chromedriver.d.ts
 * 설명: 'chromedriver' 패키지를 TypeScript에서 사용할 수 있도록 모듈 선언
 */
declare module 'chromedriver' {
  const path: string;
  export const version: string;
  export const chromeDriverVersion: string;
  export const folder: string;
  export const arch: string;
  export const platform: string;
  export const url: string;
  export default path;
}
