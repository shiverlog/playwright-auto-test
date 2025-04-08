/**
 * Description : device-config.ts - 📌 Appium 옵션 상세 설정을 정의하는 인터페이스
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */

// Appium 포트와 함께 확장된 단일 디바이스 구성 타입
export type DeviceConfigWithPort = DeviceConfig & {
  port?: number;
};

// Android 디바이스 구성 (platformName = 'Android')
export type AndroidDeviceConfig = DeviceConfigWithPort & {
  platformName: 'Android';
};

// iOS 디바이스 구성 (platformName = 'iOS')
export type IOSDeviceConfig = DeviceConfigWithPort & {
  platformName: 'iOS';
};

/**
 * WebDriverIO의 RemoteOptions 직접 정의
 * - Playwright + Appium 연동 시 필요한 구조
 */
export type RemoteOptions = {
  // Appium 통신 프로토콜 (기본적으로 'http')
  protocol: 'http' | 'https';
  // Appium 서버의 호스트 주소 (일반적으로 '127.0.0.1')
  hostname: string;
  // Appium 포트 번호 (기본: 4723)
  port: number;
  // Appium 서버 path
  path: string;
  // WebDriver capabilities (Appium용 DesiredCapabilities 적용)
  capabilities: DesiredCapabilities;
};

/**
 * WebDriverIO의 DesiredCapabilities 직접 정의
 */
export interface DesiredCapabilities {
  // 플랫폼 이름
  platformName?: string;
  // 디바이스 이름
  deviceName?: string;
  // 브라우저 이름
  browserName?: string;
  // Appium 자동화 엔진
  automationName?: string;
  // Android 앱 패키지명
  appPackage?: string;
  // Android 앱 시작 액티비티
  appActivity?: string;
  // 디바이스 고유 식별자
  udid?: string;
  // 앱 캐시 유지 여부
  noReset?: boolean;
  // 권한 자동 허용 여부
  autoGrantPermissions?: boolean;
  // 확장 가능성
  [key: string]: any;
}

/**
 * 디바이스 옵션 정의 (Android/iOS 공통)
 */
export interface DeviceOptions {
  // Appium 자동화 엔진 (UiAutomator2, XCUITest)
  automationName?: string;
  // 디바이스 고유 식별자 (UDID)
  udid?: string;
  // iOS 앱 번들 ID
  bundleId?: string;
  // 앱 파일 경로
  app?: string;
  // 운영체제 버전
  platformVersion?: string;
  // Android 앱 시작 액티비티
  appActivity?: string;
  // Android 앱 패키지명
  appPackage?: string;
  // chromedriver 경로
  chromedriverExecutable?: string;
  // WebView 디버깅 활성화 여부
  setWebContentsDebuggingEnabled?: boolean;
  // 퍼포먼스 로그 활성화 여부
  enablePerformanceLogging?: boolean;
  // ADB 명령 실행 타임아웃
  adbExecTimeout?: number;
  // 명령 대기 타임아웃
  newCommandTimeout?: number;
  // 앱 캐시 유지 여부
  noReset?: boolean;
  // iOS 네이티브 탭 지원
  nativeWebTap?: boolean;
  // Xcode 팀 ID
  xcodeOrgId?: string;
  // Xcode 서명 ID
  xcodeSigningId?: string;
  // WebView 자동 전환 여부
  autoWebview?: boolean;
  // 테스트 종료 시 앱 종료 여부
  shouldTerminateApp?: boolean;
  // 앱 강제 실행 여부
  forceAppLaunch?: boolean;
  // idle 대기 시간
  waitForIdleTimeout?: number;
  // 최대 타이핑 빈도
  maxTypingFrequency?: number;
  // 요소 탐색 실패 시 페이지 소스 출력
  printPageSourceOnFindFailure?: boolean;
  // 자동 alert 닫기
  autoDismissAlerts?: boolean;
  // Safari 초기 URL
  safariInitialUrl?: string;
  // 시뮬레이터 포인터 트레이스 표시 여부
  simulatorTracePointer?: boolean;
  // 스냅샷 최대 깊이
  snapshotMaxDepth?: number;
  // 소프트 키보드 강제 표시 여부
  forceSimulatorSoftwareKeyboardPresence?: boolean;
  // 앱 자동 실행 여부
  autoLaunch?: boolean;
  // 앱을 세션 재시작 시 끄지 않고 유지
  dontStopAppOnReset?: boolean;
  // 앱 시작 시 대기 시간 (ms)
  appWaitDuration?: number;
  // 잠금 해제 동작 여부
  skipUnlock?: boolean;
  // 화면 잠금 해제 타입
  unlockType?: 'pin' | 'pattern' | 'password';
  // 잠금 해제 키 값
  unlockKey?: string;
}

/**
 * 단일 디바이스 구성을 정의하는 인터페이스
 * - iOS / Android 디바이스 정보와 Appium 옵션 포함
 */
export interface DeviceConfig {
  // 플랫폼 이름 (Android 또는 iOS)
  platformName: string;
  // 디바이스 이름
  deviceName: string;
  // 브라우저 이름 (옵션)
  browserName?: string;
  // Appium W3C 표준 vendor prefix 옵션
  ['appium:options']?: DeviceOptions;
  // 레거시 구조 지원
  appium?: {
    options?: DeviceOptions;
  };

  // 디바이스 고유 식별자 (UDID)
  udid?: string;
  // OS 버전 (예: '13' 또는 '17.4')
  platformVersion?: string;
  // Android 앱 패키지 이름
  appPackage?: string;
  // Android 앱 시작 Activity
  appActivity?: string;
  // iOS 앱의 번들 ID
  bundleId?: string;
  // 앱 경로 또는 URL
  app?: string;
}

/**
 * 전체 devices.json 파일 구조를 정의하는 인터페이스
 */
export interface DevicesJson {
  // 공통 설정
  common?: Record<string, any>;
  // iOS - 실제 디바이스 목록
  iOS: Record<string, DeviceConfig>;
  // Android - 실제 디바이스 목록
  Android: Record<string, DeviceConfig>;
  // 에뮬레이터 목록
  emulator?: Record<string, DeviceConfig>;
  // 기본 Android 디바이스 이름
  androidDeviceName?: string;
  // 기본 iOS 디바이스 이름
  iosDeviceName?: string;
  // 기본 에뮬레이터 이름
  emulatorDeviceName?: string;
  // 프록시 사용 여부
  useProxy?: boolean;
}

/**
 *  WebDriverIO 의 Remote 직접 정의
 */
export interface AppiumRemoteOptions {
  // Appium 통신 프로토콜
  protocol: 'http' | 'https';
  // Appium 서버의 호스트 주소
  hostname: string;
  // Appium 포트 번호 (기본: 4723)
  port: number;
  // Appium 서버 path
  path: string;
  // WebDriver capabilities (Appium용 DesiredCapabilities 적용)
  capabilities: AppiumCapabilities;
}

/**
 * WebDriverIO 의 AppiumCapabilities 직접 정의
 */
export interface AppiumCapabilities {
  // W3C 표준 플랫폼 이름 ('Android' 또는 'iOS')
  platformName: 'Android' | 'iOS';
  // Appium 전용 옵션을 담는 W3C-compliant vendor prefix 필드
  'appium:options': {
    // 디바이스 이름
    deviceName: string;
    // 디바이스 고유 식별자 (UDID)
    udid: string;
    // OS 버전
    platformVersion: string;
    // Android 앱 패키지 이름
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
    // 앱 자동 실행
    autoLaunch?: boolean;
    // 앱 유지
    dontStopAppOnReset?: boolean;
    // 앱 대기 시간
    appWaitDuration?: number;
    // 잠금 해제 관련
    skipUnlock?: boolean;
    unlockType?: 'pin' | 'pattern' | 'password';
    unlockKey?: string;
    // 기타 Appium 옵션을 확장 가능하게 허용
    [key: string]: any;
  };
}

/**
 * chromedriver 패키지 메타 정보 타입
 */
export interface ChromedriverMeta {
  // 크롬 드라이버 실행 파일 경로
  path: string;
  // pnpm 패키지 내에 정의된 chromedriver 버전
  version: string;
  // 바이너리 실제 크롬 드라이버의 버전 (예: 117.0.5938.92)
  chromeDriverVersion: string;
  // chromedriver 바이너리가 위치한 디렉토리
  folder: string;
  // 시스템 아키텍처 (예: x64, arm64)
  arch: string;
  // 실행 플랫폼 (예: 'win32', 'darwin', 'linux')
  platform: string;
  // chromedriver 다운로드 URL
  url: string;
}
