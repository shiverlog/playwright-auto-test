/**
 * Description : platform-types.ts - 📌 플랫폼, UI, POC 관련 타입 정의
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */

// 플랫폼 구분
export const Platform = {
  PC_WEB: 'PC_WEB',
  MOBILE_WEB: 'MOBILE_WEB',
  ANDROID_APP: 'ANDROID_APP',
  IOS_APP: 'IOS_APP',
  NATIVE_APP: 'NATIVE_APP',
} as const;

export type Platform = (typeof Platform)[keyof typeof Platform];

// UI 타입 구분
export const UIType = {
  PC: 'PC',
  MOBILE: 'MOBILE',
  APP: 'APP',
} as const;

export type UIType = keyof typeof UIType;

// 플랫폼 → UI 타입 매핑
export const PlatformToUIType: Record<Platform, UIType> = {
  PC_WEB: 'PC',
  MOBILE_WEB: 'MOBILE',
  ANDROID_APP: 'APP',
  IOS_APP: 'APP',
  NATIVE_APP: 'APP',
};

// POC 정의 (value는 환경변수 값으로 사용되는 소문자)
export const POC = {
  PC: 'pc',
  MW: 'mw',
  AOS: 'aos',
  IOS: 'ios',
  API: 'api',
  // 병렬실행
  ALL: 'all',
} as const;

export type POCType = keyof typeof POC;
export type ValidPOCValue = Exclude<(typeof POC)[POCType], 'all'>;
export type POCUpper = Exclude<POCType, 'ALL'>;

// 전체 병렬 실행용 상수 (POCUpper 기반)
export const ALL_POCS = ['PC', 'MW', 'AOS', 'IOS', 'API'] as const;
export type AllPocList = (typeof ALL_POCS)[number];

// value → key 매핑
export const POCValueToKey: Record<ValidPOCValue, AllPocList> = {
  pc: 'PC',
  mw: 'MW',
  aos: 'AOS',
  ios: 'IOS',
  api: 'API',
};

// 유효한 POC value인지 검사
export function isValidPOCValue(value: string): value is ValidPOCValue {
  return Object.values(POC).includes(value as any) && value !== POC.ALL;
}

// 전체 유효한 value 목록 반환
export function getAllPOCValues(): ValidPOCValue[] {
  return Object.values(POC).filter((v): v is ValidPOCValue => v !== POC.ALL);
}
