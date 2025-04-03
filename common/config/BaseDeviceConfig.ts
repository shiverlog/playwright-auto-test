/**
 * Description : BaseDeviceConfig.ts - 📌 Appium 실제 디바이스 및 플랫폼 설정 정의
 * Author : Shiwoo Min
 * Date : 2025-03-31
 */
import type { DeviceConfig, DevicesJson } from '@common/types/device-config';
import { devices } from '@playwright/test';

// Android 기기
export const ANDROID_DEVICES: Record<string, DeviceConfig> = {
  // 개발 전용 기기
  'Galaxy Note20 Ultra': {
    platformName: 'Android',
    deviceName: 'Galaxy Note20 Ultra',
    appium: {
      options: {
        udid: 'R3CN70CT69N',
        platformVersion: '13',
        appActivity: 'com.lguplus.mobile.cs.activity.main.MainActivity',
        appPackage: 'com.lguplus.mobile.cs',
        app: '/path/to/android/app.apk',
        automationName: 'UiAutomator2',
      },
    },
  },
  // 리그레이션 전용 기기
  'Galaxy ZFilp4': {
    platformName: 'Android',
    deviceName: 'Galaxy ZFilp4',
    appium: {
      options: {
        udid: 'R3CTA081TAW',
        platformVersion: '14',
        appActivity: 'com.lguplus.mobile.cs.activity.main.MainActivity',
        appPackage: 'com.lguplus.mobile.cs',
        automationName: 'UiAutomator2',
      },
    },
  },
  // 속도측정 전용 기기
  'Galaxy S24 PLUS': {
    platformName: 'Android',
    deviceName: 'Galaxy S24 PLUS',
    appium: {
      options: {
        udid: 'R3CX20M45VH',
        platformVersion: '14',
        appActivity: 'com.sec.android.app.sbrowser.SBrowserMainActivity',
        appPackage: 'com.sec.android.app.sbrowser.beta',
        automationName: 'UiAutomator2',
      },
    },
  },
};

// iOS 기기
export const IOS_DEVICES: Record<string, DeviceConfig> = {
  // 개발 전용 기기
  'iPhone 15 Plus': {
    platformName: 'iOS',
    deviceName: 'iPhone 15 Plus',
    appium: {
      options: {
        udid: '00008120-000834603AE2201E',
        platformVersion: '17.0.3',
        bundleId: 'com.lguplus.mobile.cs',
        safariInitialUrl: 'https://m.lguplus.com/',
        automationName: 'XCUITest',
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
