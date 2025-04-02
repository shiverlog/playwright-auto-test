/**
 * Description : LocatorEnum.ts - 📌 사용할 요소 locators를 Enum 형태로 정리
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */

// Platform
export const Platform = {
  PC_WEB: 'PC_WEB',
  MOBILE_WEB: 'MOBILE_WEB',
  ANDROID_APP: 'ANDROID_APP',
  IOS_APP: 'IOS_APP',
  NATIVE_APP: 'NATIVE_APP',
} as const;
export type Platform = keyof typeof Platform;

// UIType
export const UIType = {
  PC: 'PC',
  MOBILE: 'MOBILE',
  APP: 'APP',
} as const;
export type UIType = keyof typeof UIType;

// POCType
export const POC = {
  PC: 'pc',
  MW: 'mw',
  AOS: 'aos',
  IOS: 'ios',
  API: 'api',
  EMPTY: '',
} as const;
export type POCType = keyof typeof POC;

// Mapping
export const POC_TO_PLATFORM_MAP: Record<POCType, Platform> = {
  PC: Platform.PC_WEB,
  MW: Platform.MOBILE_WEB,
  AOS: Platform.ANDROID_APP,
  IOS: Platform.IOS_APP,
  API: Platform.PC_WEB,
  EMPTY: Platform.PC_WEB,
};

export const PLATFORM_TO_UI_MAP: Record<Platform, UIType> = {
  PC_WEB: UIType.PC,
  MOBILE_WEB: UIType.MOBILE,
  ANDROID_APP: UIType.APP,
  IOS_APP: UIType.APP,
  NATIVE_APP: UIType.APP,
};
