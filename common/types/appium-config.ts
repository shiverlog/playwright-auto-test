/**
 * Description : appium-config.ts - 📌 Appium + 브라우저 기반 설정을 위한 타입 정의
 * Author : Shiwoo Min
 * Date : 2025-04-08
 */

// 지원되는 브라우저 이름 정의 (Chrome, ChromeBeta, Safari 등)
export type SupportedBrowser = 'Chrome' | 'ChromeBeta' | 'Safari';

// Chrome 전용 옵션 정의
export interface ChromeOptions {
  // 안드로이드에서 사용할 패키지명
  androidPackage: string;
  // 시작할 액티비티
  androidActivity?: string;
  // 이미 실행 중인 앱을 재사용할지 여부
  androidUseRunningApp?: boolean;
  // 디바이스 UDID 또는 시리얼 넘버
  androidDeviceSerial: string;
  // 프로세스 이름 (선택 사항)
  androidProcess?: string;
  // 디버깅용 exec 이름 (예: Terrace 등)
  androidExecName?: string;
  // WebView 디버깅용 소켓 이름
  androidDeviceSocket?: string;
  // W3C 모드 활성화 여부
  w3c?: boolean;
}

// Safari 전용 옵션 정의
export interface SafariOptions {
  // Safari 브라우저가 처음 로딩할 URL
  safariInitialUrl?: string;
  // 팝업 허용 여부
  safariAllowPopups?: boolean;
  // 사기 경고 무시 여부
  safariIgnoreFraudWarning?: boolean;
  // 새 창을 백그라운드에서 열기
  safariOpenLinksInBackground?: boolean;
}

// Appium 브라우저 전용 옵션 묶음 (크롬, 사파리)
export interface AppiumBrowserOptions {
  // Chrome 옵션
  chromeOptions?: ChromeOptions;
  // Safari 옵션
  safariOptions?: SafariOptions;
}

// 브라우저 기반 테스트 시 사용하는 전체 설정 구조
export interface BrowserConfig {
  // 플랫폼 종류 (Android 또는 iOS)
  platformName: 'Android' | 'iOS';
  // 사용할 브라우저 이름
  browserName: SupportedBrowser;
  // 디바이스 고유 식별자
  udid: string;
  // OS 버전
  platformVersion: string;
  // 자동화 엔진
  automationName: 'UiAutomator2' | 'XCUITest';
  // 앱 데이터 초기화 여부
  noReset?: boolean;
  // 명령 시간 초과 제한
  newCommandTimeout?: number;
  // WebView 자동 전환 여부
  autoWebview?: boolean;
  // WebView 디버깅 활성화 여부
  setWebContentsDebuggingEnabled?: boolean;
  // 브라우저 옵션 묶음
  appiumOptions?: AppiumBrowserOptions;
  // 확장 가능한 기타 필드
  [key: string]: any;
}

// Appium에서 사용하는 W3C 기반 capabilities 정의
export interface AppiumCapabilities {
  // 플랫폼 이름
  platformName: 'Android' | 'iOS';
  // Appium 표준 옵션
  'appium:options': {
    // 디바이스 이름
    deviceName?: string;
    // 디바이스 고유 식별자
    udid: string;
    // OS 버전
    platformVersion: string;
    // Android 앱 패키지 이름 (브라우저 자동화일 경우 미사용 가능)
    appPackage?: string;
    // Android 앱 시작 Activity
    appActivity?: string;
    // iOS 앱의 번들 ID
    bundleId?: string;
    // 앱 경로 또는 URL
    app?: string;
    // 앱 캐시 초기화 여부 (true: 유지, false: 초기화)
    noReset?: boolean;
    // Appium 자동화 엔진 이름
    automationName: 'UiAutomator2' | 'XCUITest';
    // WebView 자동 전환 여부
    autoWebview?: boolean;
    // WebView 디버깅 활성화 여부
    setWebContentsDebuggingEnabled?: boolean;
    // 브라우저 전용 옵션들
    chromeOptions?: ChromeOptions;
    safariOptions?: SafariOptions;
    // 확장 가능한 기타 필드
    [key: string]: any;
  };
}
