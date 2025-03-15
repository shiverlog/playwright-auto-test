/**
 * Description : LocatorEnum.ts - 📌 사용할 요소 locators를 Enum 형태로 정리
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
// PLatform 구분 ( POC: PC | MW | AND | IOS )
export enum Platform {
  PC_WEB = 'PC',
  MOBILE_WEB = 'MW',
  APP_WEB = 'MW',
  APP = 'APP',
  ANDROID = 'AND',
  IOS = 'IOS',
}

// 화면 UI 구분 ( PC | MOBILE | APP )
export enum UI {
  PC = 'PC',
  MOBILE = 'MW',
  APP = 'APP',
}
