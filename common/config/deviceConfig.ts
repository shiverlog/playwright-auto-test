/**
 * Description : deviceConfig.ts - 📌 Appium 실제 디바이스 및 플랫폼 설정 정의
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import type { DeviceConfig } from '@common/types/device-config.js';
import { devices } from '@playwright/test';
import path from 'path';

// 자사 App APK 경로
const apkPath = path.resolve(
  // aapt dump badging "./common/assets/mobileCS_release_v7.0.4(352)_20250320_1207.apk"
  process.cwd(),
  'common/assets/mobileCS_release_v7.0.4(352)_20250320_1207.apk',
);

/**
 * PC 기기 정의 (13인치 / 15인치)
 */
export const PC_DEVICES: Record<string, DeviceConfig> = {
  '13-inch': {
    platformName: 'PC',
    deviceName: 'Desktop 13-inch',
    browserName: 'chromium',
    ['appium:options']: undefined,
    udid: '',
    platformVersion: '',
    app: '',
  },
  '15-inch': {
    platformName: 'PC',
    deviceName: 'Desktop 15-inch',
    browserName: 'chromium',
    ['appium:options']: undefined,
    udid: '',
    platformVersion: '',
    app: '',
  },
};

/**
 * Android 기기
 */
export const ANDROID_DEVICES: Record<string, DeviceConfig> = {
  // 개발 전용 기기
  'Galaxy Note20 Ultra': {
    platformName: 'Android',
    deviceName: 'Galaxy Note20 Ultra',
    udid: 'R3CN70CT69N',
    platformVersion: '13',
    appPackage: 'com.lguplus.mobile.cs',
    appActivity: 'com.lguplus.mobile.cs.activity.main.MainActivity',
    app: apkPath,
    chromedriver_autodownload: true,
    appium: {
      options: {
        udid: 'R3CN70CT69N',
        platformVersion: '13',
        appActivity: 'com.lguplus.mobile.cs.activity.main.MainActivity',
        appPackage: 'com.lguplus.mobile.cs',
        automationName: 'UiAutomator2',
        chromedriver_autodownload: true,
        noReset: true,
        app: apkPath,
        autoLaunch: true,
        dontStopAppOnReset: true,
        appWaitDuration: 30000,
        skipUnlock: false,
        unlockType: 'pin',
        unlockKey: '3152',
      },
    },
  },
  // 리그레이션 전용 기기
  'Galaxy ZFilp4': {
    platformName: 'Android',
    deviceName: 'Galaxy ZFilp4',
    udid: 'R3CTA081TAW',
    platformVersion: '14',
    appPackage: 'com.lguplus.mobile.cs',
    appActivity: 'com.lguplus.mobile.cs.activity.main.MainActivity',
    appium: {
      options: {
        udid: 'R3CTA081TAW',
        platformVersion: '14',
        appActivity: 'com.lguplus.mobile.cs.activity.main.MainActivity',
        appPackage: 'com.lguplus.mobile.cs',
        automationName: 'UiAutomator2',
        autoLaunch: true,
        dontStopAppOnReset: true,
        appWaitDuration: 30000,
      },
    },
  },
  // 속도측정 전용 기기
  'Galaxy S24 PLUS': {
    platformName: 'Android',
    deviceName: 'Galaxy S24 PLUS',
    udid: 'R3CX20M45VH',
    platformVersion: '14',
    appActivity: 'com.sec.android.app.sbrowser.SBrowserMainActivity',
    appPackage: 'com.sec.android.app.sbrowser.beta',
    appium: {
      options: {
        udid: 'R3CX20M45VH',
        platformVersion: '14',
        appActivity: 'com.sec.android.app.sbrowser.SBrowserMainActivity',
        appPackage: 'com.sec.android.app.sbrowser.beta',
        automationName: 'UiAutomator2',
        autoLaunch: true,
        dontStopAppOnReset: true,
        appWaitDuration: 30000,
      },
    },
  },
};

/**
 * iOS 기기
 */
export const IOS_DEVICES: Record<string, DeviceConfig> = {
  // 개발 전용 기기
  'iPhone 15 Plus': {
    platformName: 'iOS',
    deviceName: 'iPhone 15 Plus',
    udid: '00008120-000834603AE2201E',
    platformVersion: '17.0.3',
    bundleId: 'com.lguplus.mobile.cs',
    appium: {
      options: {
        udid: '00008120-000834603AE2201E',
        platformVersion: '17.0.3',
        bundleId: 'com.lguplus.mobile.cs',
        safariInitialUrl: 'https://m.lguplus.com/',
        automationName: 'XCUITest',
        autoLaunch: true,
        dontStopAppOnReset: true,
        appWaitDuration: 30000,
        skipUnlock: false,
      },
    },
  },
  // 리그레이션 전용 기기
  'iPhone 12 Pro Max': {
    platformName: 'iOS',
    deviceName: 'iPhone 12 Pro Max',
    appium: {
      options: {
        udid: '00008101-00052DEE22C1001E',
        platformVersion: '18.1.1',
        bundleId: 'com.lguplus.mobile.cs',
        automationName: 'XCUITest',
        autoLaunch: true,
        dontStopAppOnReset: true,
        appWaitDuration: 30000,
        skipUnlock: false,
      },
    },
  },
};

export const BASE_EMULATOR_DEVICES = {
  // 에뮬레이션 Android 기기
  'android-emulator': {
    name: 'Android Emulator App',
    device: devices['Pixel 5'],
    config: {
      platformName: 'Android',
      deviceName: 'Android Emulator',
      appium: {
        options: {
          udid: '',
          platformVersion: '13',
          appActivity: 'com.lguplus.mobile.cs.activity.main.MainActivity',
          appPackage: 'com.lguplus.mobile.cs',
          app: process.env.ANDROID_EMULATOR_APP_PATH ?? '/path/to/android/emulator/app.apk',
          automationName: 'UiAutomator2',
          autoLaunch: true,
          dontStopAppOnReset: true,
        },
      },
    },
  },
  // 에뮬레이션 iOS 기기
  'ios-simulator': {
    name: 'iOS Simulator App',
    device: devices['iPhone 12'],
    config: {
      platformName: 'iOS',
      deviceName: 'iPhone 12',
      appium: {
        options: {
          udid: '',
          platformVersion: '17.0',
          bundleId: 'com.lguplus.mobile.cs',
          safariInitialUrl: 'https://m.lguplus.com/',
          app: process.env.IOS_SIMULATOR_APP_PATH ?? '/path/to/ios/simulator/app.app',
          automationName: 'XCUITest',
          autoLaunch: true,
          dontStopAppOnReset: true,
        },
      },
    },
  },
} as const;

// 테스트 전용 기기
export const BASE_DEVICES = {
  pc: {
    name: 'Desktop Chrome',
    device: devices['Desktop Chrome'],
  },
  mw: {
    name: 'Mobile Chrome',
    device: devices['galaxy note 20 ultra'],
  },
  aos: [
    {
      name: 'Galaxy Note20 Ultra',
      device: devices['galaxy note 20 ultra'],
      config: ANDROID_DEVICES['Galaxy Note20 Ultra'],
    },
    {
      name: 'Android Emulator App',
      device: devices['Pixel 5'],
      config: BASE_EMULATOR_DEVICES['android-emulator'].config,
    },
  ],
  ios: [
    {
      name: 'iPhone 12 Pro Max',
      device: devices['iPhone 12'],
      config: IOS_DEVICES['iPhone 12 Pro Max'],
    },
    {
      name: 'iOS Simulator App',
      device: devices['iPhone 12'],
      config: BASE_EMULATOR_DEVICES['ios-simulator'].config,
    },
  ],
  api: {
    name: 'API Only',
  },
} as const;

// 현재 실행 디바이스 정보 (환경변수 기반)
export const ANDROID_DEVICE = process.env.ANDROID_DEVICE || 'Galaxy Note20 Ultra';
export const IOS_DEVICE = process.env.IOS_DEVICE || 'iPhone 15 Plus';

export const CURRENT_ANDROID_CONFIG: DeviceConfig =
  ANDROID_DEVICES[ANDROID_DEVICE] || ANDROID_DEVICES['Galaxy Note20 Ultra'];
export const CURRENT_IOS_CONFIG: DeviceConfig =
  IOS_DEVICES[IOS_DEVICE] || IOS_DEVICES['iPhone 15 Plus'];

// 실제 테스트 연결 기기 최대 수
export const MAX_REAL_DEVICES = parseInt(process.env.MAX_REAL_DEVICES || '2', 10);
