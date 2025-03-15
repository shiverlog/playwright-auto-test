/**
 * Description : TestConstants.ts - 📌 테스트 관련 상수 (기본 설정, 예제 데이터 등)
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
export default class TestConstants {
  // 웹 브라우저 옵션
  static readonly CHROME = 'chrome';
  static readonly FIREFOX = 'firefox';
  static readonly WEBKIT = 'webkit';
  static readonly CHROMIUM = 'chromium';
  static readonly EDGE = 'edge';

  // 모바일 브라우저 옵션 (for Playwright and Appium)
  static readonly MOBILE_CHROME = 'chrome';
  static readonly MOBILE_SAFARI = 'safari';
  static readonly MOBILE_SAMSUNG = 'samsung';

  // 모바일 앱 옵션 (Appium)
  static readonly PLATFORM_ANDROID = 'Android';
  static readonly PLATFORM_IOS = 'iOS';

  // Default Viewport Sizes
  static readonly DEFAULT_VIEWPORT = { width: 1280, height: 720 };
  static readonly MOBILE_VIEWPORT = { width: 375, height: 812 };

  // Appium Device Capabilities (기본값)
  static readonly DEFAULT_ANDROID_CAPS = {
    platformName: TestConstants.PLATFORM_ANDROID,
    deviceName: 'Android Emulator',
    browserName: TestConstants.MOBILE_CHROME,
    automationName: 'UiAutomator2',
  };

  static readonly DEFAULT_IOS_CAPS = {
    platformName: TestConstants.PLATFORM_IOS,
    deviceName: 'iPhone Simulator',
    browserName: TestConstants.MOBILE_SAFARI,
    automationName: 'XCUITest',
  };

  // Playwright + Appium 통합 APP 테스트
  static readonly MODE_DESKTOP = 'desktop';
  static readonly MODE_MOBILE_WEB = 'mobile-web';
  static readonly MODE_NATIVE_APP = 'native-app';

  // 테스트 모드
  static readonly PARALLEL_MODE = 'parallel';
  static readonly SERIAL_MODE = 'serial';
}
