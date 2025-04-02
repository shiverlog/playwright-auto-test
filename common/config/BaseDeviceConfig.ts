/**
 * Description : BaseDeviceConfig.ts - 📱 Appium 실제 디바이스 및 플랫폼 설정 정의
 * Author : Shiwoo Min
 * Date : 2025-03-31
 */
import { devices } from '@playwright/test';

export interface AndroidDeviceConfig {
  udid: string;
  platformVersion: string;
  appActivity: string;
  appPackage: string;
  platformName?: 'Android';
  deviceName?: string;
  app?: string;
  automationName?: string;
  port?: number;
}

export interface IOSDeviceConfig {
  udid: string;
  platformVersion: string;
  bundleId: string;
  safariInitialUrl?: string;
  platformName?: 'iOS';
  deviceName?: string;
  app?: string;
  automationName?: string;
  port?: number;
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
    app: '/path/to/android/app.apk',
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

export const BASE_DEVICES = {
  pc: {
    name: 'Desktop Chrome',
    device: devices['Desktop Chrome'],
  },
  mw: {
    name: 'Mobile Chrome',
    device: devices['galaxy note 20 ultra'],
  },
  aos: {
    name: 'Android App',
    device: devices['galaxy note 20 ultra'],
    config: {
      platformName: 'Android',
      deviceName: 'Galaxy Note20 Ultra',
      app: process.env.ANDROID_APP_PATH ?? '/path/to/android/app.apk',
      automationName: 'UiAutomator2',
      ...ANDROID_DEVICES['Galaxy Note20 Ultra'],
    },
  },
  ios: {
    name: 'iOS App',
    device: devices['iPhone 12'],
    config: {
      platformName: 'iOS',
      deviceName: 'iPhone 12 Pro Max',
      app: process.env.IOS_APP_PATH ?? '/path/to/ios/app.ipa',
      automationName: 'XCUITest',
      ...IOS_DEVICES['iPhone 12 Pro Max'],
    },
  },
  api: {
    name: 'API Only',
  },
} as const;
