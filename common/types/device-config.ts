/**
 * Description : device-config.ts - 📌 Appium 옵션 상세 설정을 정의하는 인터페이스
 * Author : Shiwoo Min
 * Date : 2025-04-02
 * - 플랫폼, 디바이스, 크롬드라이버, 타임아웃 등 다양한 속성 포함
 */
export interface DeviceOptions {
  // Appium 자동화 엔진 (eUiAutomator2, XCUITest)
  automationName?: string;
  // 디바이스 고유 식별자
  udid?: string;
  // 운영체제 버전
  platformVersion?: string;
  // Android 앱 시작 Activity
  appActivity?: string;
  // Android 앱 패키지명
  appPackage?: string;
  // 크롬드라이버 경로
  chromedriverExecutable?: string;
  // WebView 디버깅 활성화
  setWebContentsDebuggingEnabled?: boolean;
  // 퍼포먼스 로그 활성화
  enablePerformanceLogging?: boolean;
  // ADB 명령 실행 타임아웃
  adbExecTimeout?: number;
  // 새로운 명령 대기 시간
  newCommandTimeout?: number;
  // 앱 상태 초기화 여부
  noReset?: boolean;
  // WebView에서 네이티브 탭 사용
  nativeWebTap?: boolean;
  // Xcode 팀 ID (iOS)
  xcodeOrgId?: string;
  // 서명 ID (iOS)
  xcodeSigningId?: string;
  // 자동 WebView 전환
  autoWebview?: boolean;
  // 테스트 종료 시 앱 종료 여부
  shouldTerminateApp?: boolean;
  // 앱 강제 실행 여부
  forceAppLaunch?: boolean;
  // idle 대기 시간
  waitForIdleTimeout?: number;
  // 타이핑 속도
  maxTypingFrequency?: number;
  // 요소 찾기 실패 시 소스 출력
  printPageSourceOnFindFailure?: boolean;
  // 자동 alert 닫기
  autoDismissAlerts?: boolean;
  // Safari 초기 URL (iOS)
  safariInitialUrl?: string;
  // 시뮬레이터 포인터 표시
  simulatorTracePointer?: boolean;
  // 최대 스냅샷 깊이
  snapshotMaxDepth?: number;
  // 소프트 키보드 강제 활성화
  forceSimulatorSoftwareKeyboardPresence?: boolean;
}

/**
 * 단일 디바이스 구성을 정의하는 인터페이스
 * - iOS / Android 디바이스 정보와 Appium 옵션 포함
 */
export interface DeviceConfig {
  // 플랫폼 이름 (iOS or Android)
  platformName: string;
  // 디바이스 이름
  deviceName: string;
  // 브라우저 이름
  browserName?: string;
  // Appium 옵션
  ['appium:options']?: DeviceOptions;
  appium?: {
    options?: DeviceOptions;
  };
}

/**
 * 전체 devices.json 파일 구조를 정의하는 인터페이스
 */
export interface DevicesJson {
  // 공통 설정 블록
  common?: Record<string, any>;
  // iOS 디바이스 목록
  iOS: Record<string, DeviceConfig>;
  // Android 디바이스 목록
  Android: Record<string, DeviceConfig>;
  // 기본 Android 디바이스 이름
  android?: string;
  // 기본 iOS 디바이스 이름
  ios?: string;
  // 프록시 사용 여부
  useProxy?: boolean;
}
