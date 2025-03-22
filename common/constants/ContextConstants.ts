/**
 * Description : LocatorEnum.ts - 📌 사용할 요소 locators를 Enum 형태로 정리
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { POCType } from '@common/constants/PathConstants';

// 실제 테스트 환경 기준 플랫폼 구분
export enum Platform {
  PC_WEB = 'PC',
  MOBILE_WEB = 'MW',
  ANDROID_APP = 'AND',
  IOS_APP = 'IOS',
  NATIVE_APP = 'APP', // 공통 앱 정의 (Android / iOS 구분 없음)
}

// UI 화면 디바이스 형태
export enum UIType {
  PC = 'PC',
  MOBILE = 'MW',
  APP = 'APP',
}

// POC → 플랫폼 매핑
export const POC_TO_PLATFORM_MAP: Record<POCType, Platform> = {
  pc: Platform.PC_WEB,
  mw: Platform.MOBILE_WEB,
  aos: Platform.ANDROID_APP,
  ios: Platform.IOS_APP,
  api: Platform.PC_WEB,
  '': Platform.PC_WEB,
};

// 플랫폼 → UI 형태 매핑
export const PLATFORM_TO_UI_MAP: Record<Platform, UIType> = {
  [Platform.PC_WEB]: UIType.PC,
  [Platform.MOBILE_WEB]: UIType.MOBILE,
  [Platform.ANDROID_APP]: UIType.APP,
  [Platform.IOS_APP]: UIType.APP,
  [Platform.NATIVE_APP]: UIType.APP,
};
