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
    // adb devices
    udid: 'R3CN70CT69N',
    // adb -s <UDID> shell getprop ro.build.version.release
    platformVersion: '13',
    // adb shell monkey -p com.lguplus.mobile.cs -v 1
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
  // sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
  // xcrun xctrace list devices
  // brew install ideviceinstaller
  // ideviceinstaller -l | grep lguplus
  'iPhone 12 Pro Max': {
    udid: '00008101-00052DEE22C1001E',
    platformVersion: '18.1.1',
    bundleId: 'com.lguplus.mobile.cs',
  },
  'iPhone 15 Plus': {
    udid: '00008120-000834603AE2201E',
    platformVersion: '17.0.3',
    bundleId: 'com.lguplus.mobile.cs',
    safariInitialUrl: 'https://m.lguplus.com/',
  },
};
