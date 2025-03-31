/**
 * Description : BaseDeviceConfig.ts - 📱 Appium 실제 디바이스 및 플랫폼 설정 정의
 * Author : Shiwoo Min
 * Date : 2025-03-31
 */
export interface AndroidDeviceConfig {
  udid: string;
  platformVersion: string;
  appActivity: string;
  appPackage: string;
}

export interface IOSDeviceConfig {
  udid: string;
  platformVersion: string;
  bundleId: string;
  safariInitialUrl?: string;
}

export const ANDROID_DEVICES: Record<string, AndroidDeviceConfig> = {
  'Galaxy Note20 Ultra': {
    udid: 'R3CN70CT69N',
    platformVersion: '14',
    appActivity: 'com.lguplus.mobile.cs.activity.main.MainActivity',
    appPackage: 'com.lguplus.mobile.cs',
  },
  'Galaxy ZFilp4': {
    udid: 'R3CTA081TAW',
    platformVersion: '14',
    appActivity: 'com.lguplus.mobile.cs.activity.main.MainActivity',
    appPackage: 'com.lguplus.mobile.cs',
  },
  'Galaxy S24 PLUS': {
    udid: 'R3CX20M45VH',
    platformVersion: '14',
    appActivity: 'com.sec.android.app.sbrowser.SBrowserMainActivity',
    appPackage: 'com.sec.android.app.sbrowser.beta',
  },
};

export const IOS_DEVICES: Record<string, IOSDeviceConfig> = {
  'iPhone 12 Pro Max': {
    udid: '00008101-00052DEE22C1001E',
    platformVersion: '18.1.1',
    bundleId: 'com.lguplus.mobile.cs',
  },
  'iPhone 15 Plus': {
    udid: '00008110-001018AE21C2401E',
    platformVersion: '16.3.1',
    bundleId: 'com.apple.mobilesafari',
    safariInitialUrl: 'https://m.lguplus.com/',
  },
};
