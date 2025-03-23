import { exec } from 'child_process';
import dotenv from 'dotenv';
import * as fs from 'fs';
import wd from 'webdriverio';
import type { Logger as WinstonLogger } from 'winston';

dotenv.config();

/**
 * Appium: 서버 및 앱 관리 유틸리티 클래스
 */
export class AppiumServerUtils {
  constructor(private logger?: WinstonLogger) {}

  /** Appium: 실행 중인 포트 확인 및 종료 (Windows 전용) */
  public checkAndKillPort(startPort: number): void {
    this.logger?.info(`포트 ${startPort}~${startPort + 10} 확인 중...`);

    for (let port = startPort; port <= startPort + 10; port++) {
      exec(`netstat -ano | findstr ${port}`, (error, stdout) => {
        if (stdout.includes(port.toString())) {
          this.logger?.info(`실행 중인 포트 발견: ${port}, 종료 중...`);
          exec(
            `for /f "tokens=5" %t in ('netstat -ano ^| findstr ${port}') do (taskkill /f /pid %t)`,
          );
        }
      });
    }
  }

  /** Appium: Appium 서버 시작 */
  public startAppiumServer(port: number): void {
    this.logger?.info(`Appium 서버 시작 중 (포트: ${port})...`);

    const command = `appium --port ${port}`;
    const serverProcess = exec(command);

    serverProcess.stdout?.on('data', data => this.logger?.info(`Appium: ${data.toString()}`));
    serverProcess.stderr?.on('data', error => this.logger?.error(`오류: ${error.toString()}`));

    serverProcess.on('close', code => this.logger?.info(`Appium 서버 종료 (코드: ${code})`));
  }

  /** Appium: Appium 서버 종료 */
  public stopAppiumServer(port: number): void {
    this.logger?.info(`Appium 서버 종료 중 (포트: ${port})...`);
    this.checkAndKillPort(port);
  }

  /** Appium: ADB (Android Debug Bridge) 명령 실행 */
  public runAdbCommand(command: string): void {
    this.logger?.info(`ADB 명령 실행: adb ${command}`);

    exec(`adb ${command}`, (error, stdout, stderr) => {
      if (error) {
        this.logger?.error(`ADB 오류: ${error.message}`);
        return;
      }
      if (stderr) {
        this.logger?.error(`ADB 경고: ${stderr}`);
      }
      this.logger?.info(`ADB 실행 완료:\n${stdout}`);
    });
  }

  /** Appium: 앱 강제 종료 (Android) */
  public forceStopAndroidApp(packageName: string): void {
    this.logger?.info(`앱 종료 중: ${packageName}`);
    this.runAdbCommand(`shell am force-stop ${packageName}`);
  }

  /** Appium: 앱 캐시 삭제 (Android) */
  public clearAndroidAppCache(packageName: string): void {
    this.logger?.info(`앱 캐시 삭제: ${packageName}`);
    this.runAdbCommand(`shell pm clear ${packageName}`);
  }

  /** Appium: 앱 설치 (Android) */
  public installAndroidApp(apkPath: string): void {
    if (!fs.existsSync(apkPath)) {
      this.logger?.error(`APK 파일이 존재하지 않음: ${apkPath}`);
      return;
    }

    this.logger?.info(`앱 설치 중: ${apkPath}`);
    this.runAdbCommand(`install -r ${apkPath}`);
  }

  /** Appium: iOS 앱 설치 (iOS Simulator) */
  public installIosApp(appPath: string): void {
    if (!fs.existsSync(appPath)) {
      this.logger?.error(`iOS 앱 파일이 존재하지 않음: ${appPath}`);
      return;
    }

    this.logger?.info(`iOS 앱 설치 중: ${appPath}`);
    exec(`xcrun simctl install booted ${appPath}`, (error, stdout, stderr) => {
      if (error) {
        this.logger?.error(`iOS 앱 설치 오류: ${error.message}`);
        return;
      }
      if (stderr) {
        this.logger?.error(`iOS 앱 설치 경고: ${stderr}`);
      }
      this.logger?.info(`iOS 앱 설치 완료:\n${stdout}`);
    });
  }

  /** Appium: iOS 앱 강제 종료 (iOS Simulator) */
  public forceStopIosApp(bundleId: string): void {
    this.logger?.info(`iOS 앱 종료 중: ${bundleId}`);
    exec(`xcrun simctl terminate booted ${bundleId}`, (error, stdout, stderr) => {
      if (error) {
        this.logger?.error(`iOS 앱 종료 오류: ${error.message}`);
        return;
      }
      if (stderr) {
        this.logger?.error(`iOS 앱 종료 경고: ${stderr}`);
      }
      this.logger?.info(`iOS 앱 종료 완료:\n${stdout}`);
    });
  }

  /** Appium: iOS 앱 캐시 삭제 (iOS Simulator) */
  public clearIosAppCache(bundleId: string): void {
    this.logger?.info(`iOS 앱 캐시 삭제: ${bundleId}`);
    exec(`xcrun simctl uninstall booted ${bundleId}`, (error, stdout, stderr) => {
      if (error) {
        this.logger?.error(`iOS 앱 캐시 삭제 오류: ${error.message}`);
        return;
      }
      if (stderr) {
        this.logger?.error(`iOS 앱 캐시 삭제 경고: ${stderr}`);
      }
      this.logger?.info(`iOS 앱 캐시 삭제 완료:\n${stdout}`);
    });
  }

  /** Appium: Appium 세션 생성 (Android) */
  public async startAndroidSession() {
    const options: WebdriverIO.Options = {
      capabilities: [
        {
          platformName: 'Android',
          deviceName: 'emulator-5554',
          app: '/path/to/your/app.apk',
          automationName: 'UiAutomator2',
        },
      ],
    };

    return await wd.remote(options);
  }

  /** Appium: Appium 세션 생성 (iOS) */
  public async startIosSession() {
    const options: WebdriverIO.Options = {
      capabilities: [
        {
          platformName: 'iOS',
          deviceName: 'iPhone 14 Pro Max',
          app: '/path/to/your/app.app',
          automationName: 'XCUITest',
        },
      ],
    };

    return await wd.remote(options);
  }
}
