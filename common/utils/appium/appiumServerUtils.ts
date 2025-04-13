/**
 * Description : AppiumServerUtils.ts - 📌 Appium 서버/앱 제어 유틸리티 클래스
 * Author : Shiwoo Min
 * Date : 2024-04-12
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import { PortUtils } from '@common/utils/network/PortUtils';
import { type ChildProcess, exec, spawn } from 'child_process';
import dotenv from 'dotenv';
import * as fs from 'fs';
import type winston from 'winston';

dotenv.config();

export class AppiumServerUtils {
  private readonly poc: string;
  private readonly logger: winston.Logger;
  private serverProcessMap = new Map<number, ChildProcess>();

  constructor() {
    this.poc = POCEnv.getType();
    this.logger = Logger.getLogger(this.poc.toUpperCase()) as winston.Logger;
  }

  /**
   * Appium 서버 시작 (EADDRINUSE 발생 시 다른 포트로 최대 3회 재시도)
   */
  public async startAppiumServer(port: number, retryCount = 3): Promise<number> {
    this.logger.info(`Appium 서버 시작 시도 (포트: ${port})...`);

    const tryStart = async (targetPort: number, attemptsLeft: number): Promise<number> => {
      return new Promise((resolve, reject) => {
        const appiumProcess = spawn(
          'appium',
          [
            '--port',
            targetPort.toString(),
          ],
          {
            detached: true,
            stdio: 'pipe',
            shell: true,
            env: {
              ...process.env,
              // Chromedriver 자동 다운로드 설정
              APPIUM_CHROMEDRIVER_AUTODOWNLOAD: 'true',
            },
          },
        );

        appiumProcess.unref();

        appiumProcess.stdout?.on('data', data => {
          const msg = data.toString();
          this.logger.info(`[Appium ${targetPort}] ${msg}`);

          if (msg.includes('Appium v') && msg.includes('Welcome')) {
            this.logger.info(`[Appium ${targetPort}] 서버 시작 성공`);
            this.serverProcessMap.set(targetPort, appiumProcess);
            PortUtils.registerPort(targetPort);
            resolve(targetPort);
          }
        });

        appiumProcess.stderr?.on('data', data => {
          const errMsg = data.toString().trim();

          // 디버거 연결 메시지는 무시
          if (errMsg === 'Debugger attached.') {
            this.logger.debug(`[Appium ${targetPort}] 디버거 연결 감지됨 → 무시`);
            return;
          }

          this.logger.error(`[Appium ${targetPort} 오류] ${errMsg}`);

          // 포트 충돌인 경우: 재시도
          if (errMsg.includes('EADDRINUSE') && attemptsLeft > 0) {
            this.logger.warn(
              `[개발 ${targetPort}] 포트 충돌, 재시도 중 (${retryCount - attemptsLeft + 1}/${retryCount})`,
            );
            appiumProcess.kill('SIGKILL');

            setTimeout(async () => {
              try {
                const portUtils = new PortUtils();
                await portUtils.killProcessOnPorts(targetPort); // 포트 강제 종료 시도
                const newPort = await portUtils.getAvailablePort();
                this.logger.info(`[Appium] 재시도용 새 포트 할당: ${newPort}`);
                const result = await tryStart(newPort, attemptsLeft - 1);
                resolve(result);
              } catch (retryErr) {
                reject(retryErr);
              }
            }, 1000);
          } else {
            appiumProcess.kill('SIGKILL');
            reject(new Error(`[Appium ${targetPort}] 서버 시작 실패: ${errMsg}`));
          }
        });

        appiumProcess.on('error', err => {
          reject(new Error(`[Appium ${targetPort}] 프로세스 에러: ${err.message}`));
        });
      });
    };

    return tryStart(port, retryCount);
  }

  /**
   * Appium 서버 종료
   */
  public async stopAppiumServer(port: number): Promise<void> {
    this.logger.info(`Appium 서버 종료 중 (포트: ${port})...`);

    const process = this.serverProcessMap.get(port);
    if (process && process.pid) {
      this.logger.info(`내가 시작한 Appium 프로세스(PID: ${process.pid}) 종료 시도`);
      try {
        process.kill('SIGKILL');
        this.serverProcessMap.delete(port);
        this.logger.info(`Appium 프로세스 정상 종료됨`);
        PortUtils.releasePort(port);
      } catch (e) {
        this.logger.error(`Appium 프로세스 종료 실패: ${e}`);
      }
    } else {
      this.logger.warn(`내가 시작한 Appium 프로세스가 아니므로 종료하지 않음`);
    }
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
   * iOS 앱 설치
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
   * iOS 앱 강제 종료
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
   * iOS 앱 캐시 삭제
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
