/**
 * Description : PlatformConstants.ts - 📌 플랫폼 관련 고정 매핑 정보 정의
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import type { POCType } from '@common/types/platform-types.js';
import { Platform, UIType } from '@common/types/platform-types.js';

// POC -> Platform 매핑
export const POC_TO_PLATFORM_MAP: Partial<Record<Exclude<POCType, 'EMPTY'>, Platform>> = {
  PC: Platform.PC_WEB,
  MW: Platform.MOBILE_WEB,
  AOS: Platform.ANDROID_APP,
  IOS: Platform.IOS_APP,
  API: Platform.PC_WEB,
};

// Platform -> UI 타입 매핑
export const PLATFORM_TO_UI_MAP: Record<Platform, UIType> = {
  PC_WEB: UIType.PC,
  MOBILE_WEB: UIType.MOBILE,
  ANDROID_APP: UIType.APP,
  IOS_APP: UIType.APP,
  NATIVE_APP: UIType.APP,
};

// POC -> 폴더 매핑
export const POC_FOLDER_MAP: Record<Exclude<POCType, 'ALL'>, string> = {
  PC: 'pc-web',
  MW: 'mobile-web',
  AOS: 'android',
  IOS: 'ios',
  API: 'api',
};

// POC -> 브라우저 조합 (browser Matrix)
export const BROWSER_MATRIX: Record<Exclude<POCType, 'ALL'>, string[]> = {
  PC: ['pc-chrome'],
  MW: ['pc-mobile-web', 'emulator-mobile-web', 'android-device-chrome', 'ios-device-safari'],
  AOS: ['android-app'],
  IOS: ['ios-app'],
  API: [],
};

// Optional: ALL 대응이 필요한 경우 undefined fallback 정의
export const getPlatformByPOC = (poc: POCType): Platform | undefined =>
  poc === 'ALL' ? undefined : POC_TO_PLATFORM_MAP[poc];
