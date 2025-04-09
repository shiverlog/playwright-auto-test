/**
 * Description : AppiumServerUtils.ts - 📌 Appium 서버 및 앱 관련 제어 유틸리티 클래스
 * Author : Shiwoo Min
 * Date : 2024-04-04
 */
import { Logger } from '@common/logger/customLogger';
import type { AppiumRemoteOptions } from '@common/types/device-config';
import type { POCKey } from '@common/types/platform-types';
import { type ChildProcess, exec, spawn } from 'child_process';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { platform } from 'os';
import { remote } from 'webdriverio';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

dotenv.config();

/**
 * Appium 서버/앱 제어 유틸리티 클래스
 */
export class AppiumServerUtils {
  private logger: winston.Logger;
  private poc?: POCKey;
  private serverProcessMap = new Map<number, ChildProcess>();
  constructor(poc?: POCKey) {
    this.poc = poc;
    this.logger = Logger.getLogger(poc || 'ALL') as winston.Logger;
  }

  /**
   * 실행 중인 포트를 찾아 종료 (4723 - 4733 범위)
   */
  public async checkAndKillPort(startPort: number): Promise<void> {
    this.logger.info(`포트 ${startPort} - ${startPort + 10} 확인 및 종료 시도 중...`);

    const killPortPromises = [];

    for (let port = startPort; port <= startPort + 10; port++) {
      killPortPromises.push(
        new Promise<void>((resolve, reject) => {
          if (platform() === 'win32') {
            exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
              this.logger.debug(`[WIN] netstat stdout (${port}): ${stdout}`);
              if (error) {
                this.logger.warn(`[WIN] netstat error (${port}): ${error.message}`);
                return resolve(); // 에러 무시하고 다음으로 진행
              }
              const pid = stdout?.trim().split(/\s+/)[4];
              if (pid) {
                this.logger.info(`[WIN] 포트 ${port} 사용중인 PID: ${pid}, 종료 시도`);
                exec(`taskkill /F /PID ${pid}`, err => (err ? reject(err) : resolve()));
              } else {
                this.logger.info(`[WIN] 포트 ${port}는 사용 중이지 않음`);
                resolve();
              }
            });
          } else {
            exec(`lsof -i :${port}`, (error, stdout, stderr) => {
              this.logger.debug(`[UNIX] lsof stdout (${port}):\n${stdout}`);
              if (error && !stdout) {
                this.logger.warn(`[UNIX] lsof error (${port}): ${error.message}`);
                return resolve(); // 에러 무시하고 다음으로 진행
              }
              const line = stdout.split('\n')[1];
              const pid = line?.split(/\s+/)[1];
              if (pid) {
                this.logger.info(`[UNIX] 포트 ${port} 사용중인 PID: ${pid}, 종료 시도`);
                exec(`kill -9 ${pid}`, err => (err ? reject(err) : resolve()));
              } else {
                this.logger.info(`[UNIX] 포트 ${port}는 사용 중이지 않음`);
                resolve();
              }
            });
          }
        }),
      );
    }
    try {
      await Promise.all(killPortPromises);
      this.logger.info(`포트 종료 작업 완료`);
    } catch (err) {
      this.logger.error(`포트 종료 중 에러 발생: ${err}`);
    }
  }

  /**
   * Appium 서버 실행
   */
  public startAppiumServer(port: number): void {
    this.logger.info(`Appium 서버 시작 중 (포트: ${port})...`);

    const appiumProcess = spawn('appium', ['--port', port.toString()], {
      detached: true,
      stdio: 'pipe',
      shell: true,
    });
    this.serverProcessMap.set(port, appiumProcess);
    appiumProcess.stdout?.on('data', data =>
      this.logger.info(`[Appium ${port}] ${data.toString()}`),
    );
    appiumProcess.stderr?.on('data', data =>
      this.logger.error(`[Appium ${port} 오류] ${data.toString()}`),
    );
    appiumProcess.on('close', code => this.logger.warn(`[Appium ${port}] 종료됨 (코드: ${code})`));
    appiumProcess.on('error', err =>
      this.logger.error(`[Appium ${port}] 실행 실패: ${err.message}`),
    );
  }

  /**
   * Appium 서버 종료
   */
  public async stopAppiumServer(port: number): Promise<void> {
    this.logger.info(`Appium 서버 종료 중 (포트: ${port})...`);
    await this.checkAndKillPort(port);
  }

  /**
   * ADB 명령 실행
   */
  public async runAdbCommand(command: string): Promise<void> {
    this.logger.info(`ADB 명령 실행: adb ${command}`);
    return new Promise((resolve, reject) => {
      exec(`adb ${command}`, (error, stdout, stderr) => {
        if (error) return reject(error);
        if (stderr) this.logger.warn(`ADB 경고: ${stderr}`);
        this.logger.info(`ADB 결과: ${stdout}`);
        resolve();
      });
    });
  }

  /**
   * Android 앱 강제 종료
   */
  public async forceStopAndroidApp(packageName: string): Promise<void> {
    this.logger.info(`앱 종료 요청: ${packageName}`);
    await this.runAdbCommand(`shell am force-stop ${packageName}`);
  }

  /**
   * Android 앱 캐시 삭제
   */
  public async clearAndroidAppCache(packageName: string): Promise<void> {
    this.logger.info(`앱 캐시 삭제 요청: ${packageName}`);
    await this.runAdbCommand(`shell pm clear ${packageName}`);
  }

  /**
   * Android 앱 설치
   */
  public async installAndroidApp(apkPath: string): Promise<void> {
    if (!fs.existsSync(apkPath)) {
      this.logger.error(`APK 파일이 존재하지 않음: ${apkPath}`);
      return;
    }
    this.logger.info(`앱 설치 중: ${apkPath}`);
    await this.runAdbCommand(`install -r ${apkPath}`);
  }

  /**
   * iOS 앱 설치 (시뮬레이터)
   */
  public async installIosApp(appPath: string): Promise<void> {
    if (!fs.existsSync(appPath)) {
      this.logger.error(`iOS 앱 파일이 존재하지 않음: ${appPath}`);
      return;
    }
    this.logger.info(`iOS 앱 설치 중: ${appPath}`);
    exec(`xcrun simctl install booted ${appPath}`, (error, stdout, stderr) => {
      if (error) this.logger.error(`iOS 앱 설치 오류: ${error.message}`);
      if (stderr) this.logger.warn(`iOS 앱 설치 경고: ${stderr}`);
      if (stdout) this.logger.info(`iOS 앱 설치 완료:\n${stdout}`);
    });
  }

  /**
   * iOS 앱 강제 종료 (시뮬레이터)
   */
  public async forceStopIosApp(bundleId: string): Promise<void> {
    this.logger.info(`iOS 앱 종료 요청: ${bundleId}`);
    exec(`xcrun simctl terminate booted ${bundleId}`, (error, stdout, stderr) => {
      if (error) this.logger.error(`iOS 앱 종료 오류: ${error.message}`);
      if (stderr) this.logger.warn(`iOS 앱 종료 경고: ${stderr}`);
      if (stdout) this.logger.info(`iOS 앱 종료 완료:\n${stdout}`);
    });
  }

  /**
   * iOS 앱 캐시 삭제 (시뮬레이터)
   */
  public async clearIosAppCache(bundleId: string): Promise<void> {
    this.logger.info(`iOS 앱 캐시 삭제 요청: ${bundleId}`);
    exec(`xcrun simctl uninstall booted ${bundleId}`, (error, stdout, stderr) => {
      if (error) this.logger.error(`iOS 앱 캐시 삭제 오류: ${error.message}`);
      if (stderr) this.logger.warn(`iOS 앱 캐시 삭제 경고: ${stderr}`);
      if (stdout) this.logger.info(`iOS 앱 캐시 삭제 완료:\n${stdout}`);
    });
  }
}
