/**
 * Description : device-config.ts - 📌 Appium 옵션 상세 설정을 정의하는 인터페이스
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import type { DesiredCapabilities } from 'webdriverio';

/**
 * Appium 포트와 함께 확장된 단일 디바이스 구성 타입
 */
export type DeviceConfigWithPort = DeviceConfig & {
  port?: number;
};

export type AndroidDeviceConfig = DeviceConfigWithPort & {
  platformName: 'Android';
};

export type IOSDeviceConfig = DeviceConfigWithPort & {
  platformName: 'iOS';
};

/**
 * WebDriverIO의 remote()에 사용되는 수동 옵션 타입
 * - Playwright + Appium 연동 시 필요한 구조
 */
export type RemoteOptions = {
  protocol: 'http' | 'https';
  hostname: string;
  port: number;
  path: string;
  capabilities: DesiredCapabilities | DesiredCapabilities[];
};

/**
 * 기기 설정에서 사용 ( Android/iOS/Emulation )
 */
export interface DeviceOptions {
  // Android/iOS - Appium 자동화 엔진 (eUiAutomator2, XCUITest)
  automationName?: string;
  // Android/iOS - 디바이스 고유 식별자
  udid?: string;
  // iOS - 설치된 iOS 앱의 번들 ID
  bundleId?: string;
  // Android/iOS - 설치할 앱 경로
  app?: string;
  // Android/iOS - 운영체제 버전
  platformVersion?: string;
  // Android - 시작 Activity
  appActivity?: string;
  // Android - 앱 패키지명
  appPackage?: string;
  // Android - 크론드라이버 경로
  chromedriverExecutable?: string;
  // Android - WebView 디버깅 활성화
  setWebContentsDebuggingEnabled?: boolean;
  // Android - 퍼포먼스 로그 활성화
  enablePerformanceLogging?: boolean;
  // Android - ADB 명령 실행 타임아웃
  adbExecTimeout?: number;
  // Android/iOS - 새로운 명령 대기 시간
  newCommandTimeout?: number;
  // Android/iOS - 앱 새로 설정 가능
  noReset?: boolean;
  // iOS - WebView에서 네이티브 탭 사용
  nativeWebTap?: boolean;
  // iOS - Xcode 팀 ID
  xcodeOrgId?: string;
  // iOS - 서명 ID
  xcodeSigningId?: string;
  // Android/iOS - WebView 자동 전환
  autoWebview?: boolean;
  // Android/iOS - 테스트 종료 시 앱 종료 여부
  shouldTerminateApp?: boolean;
  // Android/iOS - 앱 강제 실행 여부
  forceAppLaunch?: boolean;
  // Android/iOS - 아이들 대기 시간
  waitForIdleTimeout?: number;
  // Android/iOS - 타이핑 속도
  maxTypingFrequency?: number;
  // Android/iOS - 요소 찾기 실패 시 소스 출력
  printPageSourceOnFindFailure?: boolean;
  // iOS - 자동 alert 닫기
  autoDismissAlerts?: boolean;
  // iOS - Safari 초기 URL
  safariInitialUrl?: string;
  // iOS - 시뮬레이터 포인터 표시
  simulatorTracePointer?: boolean;
  // iOS - 최대 스냅샷 깊이
  snapshotMaxDepth?: number;
  // iOS - 소프트 키보드 강제 활성화
  forceSimulatorSoftwareKeyboardPresence?: boolean;
}

/**
 * 단일 디바이스 구성을 정의하는 인터페이스
 * - iOS / Android 디바이스 정보와 Appium 옵션 포함
 */
export interface DeviceConfig {
  platformName: string;
  deviceName: string;
  browserName?: string;
  ['appium:options']?: DeviceOptions;
  appium?: {
    options?: DeviceOptions;
  };
}

/**
 * 전체 devices.json 파일 구조를 정의하는 인터페이스
 */
export interface DevicesJson {
  common?: Record<string, any>;
  // iOS - 실제 디바이스 목록
  iOS: Record<string, DeviceConfig>;
  // Android - 실제 디바이스 목록
  Android: Record<string, DeviceConfig>;
  // Android/iOS - 에뮬레이터/시뮬레이터 디바이스 목록
  emulator?: Record<string, DeviceConfig>;
  // Android - 기본 디바이스 이름
  androidDeviceName?: string;
  // iOS - 기본 디바이스 이름
  iosDeviceName?: string;
  // Android/iOS - 기본 에뮬레이터/시뮬레이터 이름
  emulatorDeviceName?: string;
  // Android/iOS - 프록시 사용 여부
  useProxy?: boolean;
}
