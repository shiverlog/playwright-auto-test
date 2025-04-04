/**
 * Description : platform-types.ts - 📌 플랫폼, UI, POC 관련 타입 및 enum-like 정의
 * Author : Shiwoo Min
 * Date : 2025-04-04
 */

// 플랫폼 구분
export const Platform = {
  PC_WEB: 'PC_WEB',
  MOBILE_WEB: 'MOBILE_WEB',
  ANDROID_APP: 'ANDROID_APP',
  IOS_APP: 'IOS_APP',
  NATIVE_APP: 'NATIVE_APP',
} as const;

export type Platform = keyof typeof Platform;
export type PlatformValue = (typeof Platform)[Platform];

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

// POC 타입 (Purpose of Coverage)
export const POC = {
  PC: 'pc',
  MW: 'mw',
  AOS: 'aos',
  IOS: 'ios',
  API: 'api',
  ALL: '',
} as const;

// POC 객체의 key
export type POCType = keyof typeof POC;
// POC 객체의 value
export type POCValue = (typeof POC)[POCType];
// ''을 제외한 유효한 POC value 타입
export type ValidPOCValue = Exclude<POCValue, 'ALL'>;
// 병렬 실행 등에서 순회 가능한 POC 목록 상수 (ALL 제외)
export const ALL_POCS: POCKey[] = ['PC', 'MW', 'AOS', 'IOS', 'API'];
export type POCKey = Exclude<POCType, 'ALL'>;
