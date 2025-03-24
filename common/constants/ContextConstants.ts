/**
 * Description : LocatorEnum.ts - 📌 사용할 요소 locators를 Enum 형태로 정리
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
// Platform
export const Platform = {
  PC_WEB: 'PC',
  MOBILE_WEB: 'MW',
  ANDROID_APP: 'AND',
  IOS_APP: 'IOS',
  NATIVE_APP: 'APP',
} as const;
export type Platform = typeof Platform[keyof typeof Platform];

// UIType
export const UIType = {
  PC: 'PC',
  MOBILE: 'MW',
  APP: 'APP',
} as const;
export type UIType = typeof UIType[keyof typeof UIType];

// POCType
export const POC = {
  PC: 'pc',
  MW: 'mw',
  AOS: 'aos',
  IOS: 'ios',
  API: 'api',
  EMPTY: '',
} as const;
export type POCType = typeof POC[keyof typeof POC];

// Mapping
export const POC_TO_PLATFORM_MAP: Record<POCType, Platform> = {
  [POC.PC]: Platform.PC_WEB,
  [POC.MW]: Platform.MOBILE_WEB,
  [POC.AOS]: Platform.ANDROID_APP,
  [POC.IOS]: Platform.IOS_APP,
  [POC.API]: Platform.PC_WEB,
  [POC.EMPTY]: Platform.PC_WEB,
};

export const PLATFORM_TO_UI_MAP: Record<Platform, UIType> = {
  [Platform.PC_WEB]: UIType.PC,
  [Platform.MOBILE_WEB]: UIType.MOBILE,
  [Platform.ANDROID_APP]: UIType.APP,
  [Platform.IOS_APP]: UIType.APP,
  [Platform.NATIVE_APP]: UIType.APP,
};
