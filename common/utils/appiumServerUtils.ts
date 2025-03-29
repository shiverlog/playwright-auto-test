import { exec } from 'child_process';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { platform } from 'os';
import wd from 'webdriverio';
import type { Logger as WinstonLogger } from 'winston';

dotenv.config();

/**
 * Appium: 서버 및 앱 관리 유틸리티 클래스
 */
export class AppiumServerUtils {
  constructor(private logger?: WinstonLogger) {}

  /**
   * Appium: 실행 중인 포트 확인 및 종료 (Windows, Mac, Ubuntu, WSL 전용)
   */
  public async checkAndKillPort(startPort: number): Promise<void> {
    this.logger?.info(`포트 ${startPort}~${startPort + 10} 확인 중...`);

    const killPortPromises = [];

    for (let port = startPort; port <= startPort + 10; port++) {
      killPortPromises.push(
        new Promise<void>((resolve, reject) => {
          if (platform() === 'win32') {
            // Windows 환경 (netstat + taskkill)
            exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
              if (error) {
                this.logger?.error(`포트 ${port} 확인 중 오류 발생: ${error.message}`);
                return reject(error);
              }

              if (stderr) {
                this.logger?.error(`포트 ${port} 확인 경고: ${stderr}`);
              }

              // 포트가 열려있는 경우 종료
              if (stdout) {
                const pid = stdout.split(/\s+/)[4]; // PID가 5번째 열에 위치
                if (pid) {
                  this.logger?.info(`실행 중인 포트 발견: ${port}, 종료 중...`);
                  exec(`taskkill /F /PID ${pid}`, (killError, killStdout, killStderr) => {
                    if (killError) {
                      this.logger?.error(`포트 ${port} 종료 중 오류 발생: ${killError.message}`);
                      return reject(killError);
                    }
                    if (killStderr) {
                      this.logger?.error(`포트 ${port} 종료 경고: ${killStderr}`);
                    }
                    this.logger?.info(`포트 ${port} 종료 완료: ${killStdout}`);
                    resolve();
                  });
                } else {
                  resolve(); // PID를 찾을 수 없으면 그냥 종료
                }
              } else {
                resolve(); // 포트가 열려있지 않으면 그냥 종료
              }
            });
          } else {
            // Mac 및 Ubuntu 환경 (lsof + kill)
            exec(`lsof -i :${port}`, (error, stdout, stderr) => {
              if (error) {
                this.logger?.error(`포트 ${port} 확인 중 오류 발생: ${error.message}`);
                return reject(error);
              }

              if (stderr) {
                this.logger?.error(`포트 ${port} 확인 경고: ${stderr}`);
              }

              // 포트가 열려있는 경우 종료
              if (stdout) {
                const pid = stdout.split('\n')[1]?.split(/\s+/)[1];
                if (pid) {
                  this.logger?.info(`실행 중인 포트 발견: ${port}, 종료 중...`);
                  exec(`kill -9 ${pid}`, (killError, killStdout, killStderr) => {
                    if (killError) {
                      this.logger?.error(`포트 ${port} 종료 중 오류 발생: ${killError.message}`);
                      return reject(killError);
                    }
                    if (killStderr) {
                      this.logger?.error(`포트 ${port} 종료 경고: ${killStderr}`);
                    }
                    this.logger?.info(`포트 ${port} 종료 완료: ${killStdout}`);
                    resolve();
                  });
                } else {
                  resolve(); // 프로세스 ID를 찾을 수 없으면 그냥 종료
                }
              } else {
                resolve(); // 포트가 열려있지 않으면 그냥 종료
              }
            });
          }
        }),
      );
    }

    await Promise.all(killPortPromises);
  }

  /**
   * Appium: Appium 서버 시작
   */
  public startAppiumServer(port: number): void {
    this.logger?.info(`Appium 서버 시작 중 (포트: ${port})...`);

    const command = `appium --port ${port}`;
    const serverProcess = exec(command);

    serverProcess.stdout?.on('data', data => this.logger?.info(`Appium: ${data.toString()}`));
    serverProcess.stderr?.on('data', error => this.logger?.error(`오류: ${error.toString()}`));

    serverProcess.on('close', code => this.logger?.info(`Appium 서버 종료 (코드: ${code})`));
    serverProcess.on('error', err => {
      this.logger?.error(`Appium 서버 실행 중 오류 발생: ${err.message}`);
    });
  }

  /**
   * Appium: Appium 서버 종료
   */
  public async stopAppiumServer(port: number): Promise<void> {
    this.logger?.info(`Appium 서버 종료 중 (포트: ${port})...`);
    await this.checkAndKillPort(port);
  }

  /**
   * Appium: ADB (Android Debug Bridge) 명령 실행
   */
  public async runAdbCommand(command: string): Promise<void> {
    this.logger?.info(`ADB 명령 실행: adb ${command}`);

    return new Promise<void>((resolve, reject) => {
      exec(`adb ${command}`, (error, stdout, stderr) => {
        if (error) {
          this.logger?.error(`ADB 오류: ${error.message}`);
          return reject(error);
        }
        if (stderr) {
          this.logger?.error(`ADB 경고: ${stderr}`);
        }
        this.logger?.info(`ADB 실행 완료:\n${stdout}`);
        resolve();
      });
    });
  }

  /**
   * Appium: 앱 강제 종료 (Android)
   */
  public async forceStopAndroidApp(packageName: string): Promise<void> {
    this.logger?.info(`앱 종료 중: ${packageName}`);
    await this.runAdbCommand(`shell am force-stop ${packageName}`);
  }

  /**
   * Appium: 앱 캐시 삭제 (Android)
   */
  public async clearAndroidAppCache(packageName: string): Promise<void> {
    this.logger?.info(`앱 캐시 삭제: ${packageName}`);
    await this.runAdbCommand(`shell pm clear ${packageName}`);
  }

  /**
   * Appium: 앱 설치 (Android)
   */
  public async installAndroidApp(apkPath: string): Promise<void> {
    if (!fs.existsSync(apkPath)) {
      this.logger?.error(`APK 파일이 존재하지 않음: ${apkPath}`);
      return;
    }

    this.logger?.info(`앱 설치 중: ${apkPath}`);
    await this.runAdbCommand(`install -r ${apkPath}`);
  }

  /**
   * Appium: iOS 앱 설치 (iOS Simulator)
   */
  public async installIosApp(appPath: string): Promise<void> {
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

  /**
   * Appium: iOS 앱 강제 종료 (iOS Simulator)
   */
  public async forceStopIosApp(bundleId: string): Promise<void> {
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

  /**
   * Appium: iOS 앱 캐시 삭제 (iOS Simulator)
   */
  public async clearIosAppCache(bundleId: string): Promise<void> {
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

  /**
   * Appium: Appium 세션 생성 (Android)
   */
  public async startAndroidSession(): Promise<any> {
    const options: wd.Options = {
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

  /**
   * Appium: Appium 세션 생성 (iOS)
   */
  public async startIosSession(): Promise<any> {
    const options: wd.Options = {
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
