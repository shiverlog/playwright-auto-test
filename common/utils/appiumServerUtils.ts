import { Logger } from '@common/logger/customLogger';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import wd from 'webdriverio';

// logger 인스턴스 선언
const logger = Logger.getLogger('');

/**
 * Appium 관련 설정 (기본 포트 및 서버 옵션)
 */
const APPIUM_PORT = 4723; // 기본 Appium 포트
const APPIUM_LOG_FILE = path.resolve(__dirname, '@common/logs/appium.log');

/**
 * 실행 중인 포트 확인 및 종료 (Windows)
 * @param startPort 시작 포트 (기본: 4723)
 */
export function checkAndKillPort(startPort: number = APPIUM_PORT): void {
  logger.info(`포트 ${startPort}~${startPort + 10} 확인 중...`);

  for (let port = startPort; port <= startPort + 10; port++) {
    exec(`netstat -ano | findstr ${port}`, (error, stdout) => {
      if (stdout.includes(port.toString())) {
        logger.info(`실행 중인 포트 발견: ${port}, 종료 중...`);
        exec(
          `for /f "tokens=5" %t in ('netstat -ano ^| findstr ${port}') do (taskkill /f /pid %t)`,
        );
      }
    });
  }
}

/**
 * Appium 서버 시작
 * @param port Appium 포트 (기본: 4723)
 */
export function startAppiumServer(port: number = APPIUM_PORT): void {
  logger.info(`Appium 서버 시작 중 (포트: ${port})...`);

  const command = `appium --port ${port} --log ${APPIUM_LOG_FILE}`;
  const serverProcess = exec(command);

  serverProcess.stdout?.on('data', data => logger.info(`Appium: ${data.toString()}`));
  serverProcess.stderr?.on('data', error => logger.error(`오류: ${error.toString()}`));

  serverProcess.on('close', code => logger.info(`Appium 서버 종료 (코드: ${code})`));
}

/**
 * Appium 서버 종료
 * @param port Appium 포트 (기본: 4723)
 */
export function stopAppiumServer(port: number = APPIUM_PORT): void {
  logger.info(`Appium 서버 종료 중 (포트: ${port})...`);
  checkAndKillPort(port);
}

/**
 * ADB (Android Debug Bridge) 명령 실행
 * @param command 실행할 ADB 명령어 (예: "devices", "shell pm clear com.android.chrome")
 */
export function runAdbCommand(command: string): void {
  logger.info(`ADB 명령 실행: adb ${command}`);

  exec(`adb ${command}`, (error, stdout, stderr) => {
    if (error) {
      logger.error(`ADB 오류: ${error.message}`);
      return;
    }
    if (stderr) {
      logger.error(`ADB 경고: ${stderr}`);
    }
    logger.info(`ADB 실행 완료:\n${stdout}`);
  });
}

/**
 * 앱 강제 종료 (Android)
 * @param packageName 앱 패키지명 (예: "com.example.app")
 */
export function forceStopAndroidApp(packageName: string): void {
  logger.info(`앱 종료 중: ${packageName}`);
  runAdbCommand(`shell am force-stop ${packageName}`);
}

/**
 * 앱 캐시 삭제 (Android)
 * @param packageName 앱 패키지명 (예: "com.example.app")
 */
export function clearAndroidAppCache(packageName: string): void {
  logger.info(`앱 캐시 삭제: ${packageName}`);
  runAdbCommand(`shell pm clear ${packageName}`);
}

/**
 * 앱 설치 (Android)
 * @param apkPath APK 파일 경로
 */
export function installAndroidApp(apkPath: string): void {
  if (!fs.existsSync(apkPath)) {
    logger.error(`APK 파일이 존재하지 않음: ${apkPath}`);
    return;
  }

  logger.info(`앱 설치 중: ${apkPath}`);
  runAdbCommand(`install -r ${apkPath}`);
}

/**
 * iOS 앱 설치 (iOS Simulator)
 * @param appPath .app 파일 경로
 */
export function installIosApp(appPath: string): void {
  if (!fs.existsSync(appPath)) {
    logger.error(`iOS 앱 파일이 존재하지 않음: ${appPath}`);
    return;
  }

  logger.info(`iOS 앱 설치 중: ${appPath}`);
  exec(`xcrun simctl install booted ${appPath}`, (error, stdout, stderr) => {
    if (error) {
      logger.error(`iOS 앱 설치 오류: ${error.message}`);
      return;
    }
    if (stderr) {
      logger.error(`iOS 앱 설치 경고: ${stderr}`);
    }
    logger.info(`iOS 앱 설치 완료:\n${stdout}`);
  });
}

/**
 * iOS 앱 강제 종료 (iOS Simulator)
 * @param bundleId 앱 번들 ID (예: "com.example.app")
 */
export function forceStopIosApp(bundleId: string): void {
  logger.info(`iOS 앱 종료 중: ${bundleId}`);
  exec(`xcrun simctl terminate booted ${bundleId}`, (error, stdout, stderr) => {
    if (error) {
      logger.error(`iOS 앱 종료 오류: ${error.message}`);
      return;
    }
    if (stderr) {
      logger.error(`iOS 앱 종료 경고: ${stderr}`);
    }
    logger.info(`iOS 앱 종료 완료:\n${stdout}`);
  });
}

/**
 * iOS 앱 캐시 삭제 (iOS Simulator)
 * @param bundleId 앱 번들 ID
 */
export function clearIosAppCache(bundleId: string): void {
  logger.info(`iOS 앱 캐시 삭제: ${bundleId}`);
  exec(`xcrun simctl uninstall booted ${bundleId}`, (error, stdout, stderr) => {
    if (error) {
      logger.error(`iOS 앱 캐시 삭제 오류: ${error.message}`);
      return;
    }
    if (stderr) {
      logger.error(`iOS 앱 캐시 삭제 경고: ${stderr}`);
    }
    logger.info(`iOS 앱 캐시 삭제 완료:\n${stdout}`);
  });
}

/**
 * Appium 세션 생성 (Android)
 */
async function startAndroidSession() {
  const options: WebdriverIO.Options = {
    capabilities: [
      {
        platformName: 'Android',
        deviceName: 'emulator-5554', // 에뮬레이터 또는 실제 기기 이름
        app: '/path/to/your/app.apk', // 설치할 APK 경로
        automationName: 'UiAutomator2', // Appium 2.x에서 지원하는 Android automation name
      },
    ],
  };

  const driver = await wd.remote(options);
  return driver;
}

/**
 * Appium 세션 생성 (iOS)
 */
async function startIosSession() {
  const options: WebdriverIO.Options = {
    capabilities: [
      {
        platformName: 'iOS',
        deviceName: 'iPhone 14 Pro Max', // 사용 가능한 iOS 시뮬레이터 또는 실제 기기 이름
        app: '/path/to/your/app.app', // 설치할 iOS 앱 경로
        automationName: 'XCUITest', // iOS 자동화 드라이버
      },
    ],
  };

  const driver = await wd.remote(options);
  return driver;
}
