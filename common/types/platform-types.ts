/**
 * Description : platform-types.ts - 📌 플랫폼, UI, POC 관련 타입 및 enum-like 정의
 * Author : Shiwoo Min
 * Date : 2025-04-03
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

export type POCType = keyof typeof POC;
export type POCValue = (typeof POC)[POCType];
export type POCKey = Exclude<POCType, 'ALL'>;
export type ValidPOCValue = Exclude<POCValue, ''>;
