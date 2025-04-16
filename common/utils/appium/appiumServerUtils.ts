/**
 * Description : AppiumServerUtils.ts - 📌 Appium 서버/앱 제어 유틸리티 클래스
 * Author : Shiwoo Min
 * Date : 2024-04-14
 * - 04/14 CDP 연결 확인, Appium 서버 시작/종료 메시지 간소화
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import { PortUtils } from '@common/utils/network/PortUtils';
import { type ChildProcess, exec } from 'child_process';
import dotenv from 'dotenv';
import { execa } from 'execa';
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
   * Appium 서버 시작 (충돌 시 최대 3회 재시도) spawn -> execa
   */
  public async startAppiumServer(port: number, retryCount = 3): Promise<number> {
    this.logger.info(`[Appium] 서버 시작 시도 (포트: ${port})`);

    const tryStart = async (targetPort: number, attemptsLeft: number): Promise<number> => {
      return new Promise<number>(async (resolve, reject) => {
        const portUtils = new PortUtils();

        // 사전 포트 사용 여부 확인
        const isAvailable = await portUtils.isPortAvailable(targetPort);
        if (!isAvailable) {
          this.logger.warn(`[Appium] 포트 ${targetPort} 이미 사용 중 -> 새 포트로 재시도`);
          const newPort = await portUtils.getAvailablePort();
          return resolve(await tryStart(newPort, attemptsLeft - 1));
        }

        try {
          const subprocess = execa('appium', ['--port', `${targetPort}`], {
            env: {
              ...process.env,
              CHROMEDRIVER_PATH:
                '/opt/homebrew/Caskroom/chromedriver/135.0.7049.84/chromedriver-mac-arm64/chromedriver',
              CHROMEDRIVER_AUTODOWNLOAD: 'true',
            },
          });

          let started = false;

          // Appium 서버 시작 메시지
          subprocess.stdout?.on('data', data => {
            const msg = data.toString();
            // this.logger.info(`[Appium ${targetPort}] ${msg}`);
            if (msg.includes('Appium v') && msg.includes('Welcome')) {
              started = true;
              this.logger.info(`[Appium ${targetPort}] 서버 시작 성공`);
              this.serverProcessMap.set(targetPort, subprocess);
              PortUtils.registerPort(targetPort);
              resolve(targetPort);
            }
          });

          subprocess.stderr?.on('data', async data => {
            const errMsg = data.toString().trim();
            // 다버깅 모드 사용 시 메시지 무시
            if (errMsg.includes('Debugger attached.')) {
              return;
            }
            this.logger.error(`[Appium ${targetPort}] 오류: ${errMsg}`);

            // 포트 충돌 처리
            if (errMsg.includes('EADDRINUSE')) {
              this.logger.warn(`[Appium ${targetPort}] 포트 충돌, 재시도 중...`);
              subprocess.kill('SIGKILL');
              await portUtils.killProcessOnPorts(targetPort);

              if (attemptsLeft > 0) {
                const newPort = await portUtils.getAvailablePort();
                this.logger.info(`[Appium] 새 포트 재시도: ${newPort}`);
                resolve(await tryStart(newPort, attemptsLeft - 1));
              } else {
                reject(new Error(`[Appium ${targetPort}] 포트 충돌로 인해 시작 실패`));
              }
            } else {
              subprocess.kill('SIGKILL');
              reject(new Error(`[Appium ${targetPort}] 시작 실패: ${errMsg}`));
            }
          });

          // 조기 종료 감지
          subprocess.on('exit', code => {
            if (!started) {
              this.logger.error(
                `[Appium ${targetPort}] 프로세스가 시작되기 전에 종료됨 (code=${code})`,
              );
              reject(new Error(`[Appium ${targetPort}] 조기 종료됨`));
            }
          });
        } catch (e) {
          this.logger.warn(`[Appium ${targetPort}] 예외 발생: ${e}`);
          await portUtils.killProcessOnPorts(targetPort);

          if (attemptsLeft > 0) {
            const newPort = await portUtils.getAvailablePort();
            resolve(await tryStart(newPort, attemptsLeft - 1));
          } else {
            reject(e);
          }
        }
      });
    };
    return tryStart(port, retryCount);
  }

  /**
   * Appium 서버 종료
   */
  public async stopAppiumServer(port: number): Promise<void> {
    this.logger.info(`[Appium] 서버 종료 시도 (포트: ${port})`);

    const process = this.serverProcessMap.get(port);
    if (process && process.pid) {
      try {
        process.kill('SIGKILL');
        this.serverProcessMap.delete(port);
        PortUtils.releasePort(port);
        this.logger.info(`[Appium ${port}] 정상 종료됨`);
      } catch (e) {
        this.logger.error(`[Appium ${port}] 종료 실패: ${e}`);
      }
    } else {
      this.logger.warn(`[Appium ${port}] 내가 시작한 프로세스가 아님, 무시함`);
    }
  }

  /**
   * ADB 명령 실행
   */
  public async runAdbCommand(command: string): Promise<void> {
    this.logger.info(`[ADB] 명령 실행: ${command}`);
    return new Promise((resolve, reject) => {
      exec(`adb ${command}`, (error, stdout, stderr) => {
        if (error) return reject(error);
        if (stderr) this.logger.warn(`[ADB] 경고: ${stderr}`);
        if (stdout) this.logger.info(`[ADB] 결과: ${stdout}`);
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
      this.logger.error(`[APK] 파일 없음: ${apkPath}`);
      return;
    }
    this.logger.info(`[APK] 앱 설치 중: ${apkPath}`);
    await this.runAdbCommand(`install -r ${apkPath}`);
  }

  /**
   * iOS 앱 설치
   */
  public async installIosApp(appPath: string): Promise<void> {
    if (!fs.existsSync(appPath)) {
      this.logger.error(`[iOS] 앱 파일 없음: ${appPath}`);
      return;
    }
    this.logger.info(`[iOS] 앱 설치 중: ${appPath}`);
    exec(`xcrun simctl install booted ${appPath}`, (error, stdout, stderr) => {
      if (error) this.logger.error(`[iOS] 설치 오류: ${error.message}`);
      if (stderr) this.logger.warn(`[iOS] 경고: ${stderr}`);
      if (stdout) this.logger.info(`[iOS] 설치 결과:\n${stdout}`);
    });
  }

  /**
   * iOS 앱 강제 종료
   */
  public async forceStopIosApp(bundleId: string): Promise<void> {
    this.logger.info(`[iOS] 앱 종료 요청: ${bundleId}`);
    exec(`xcrun simctl terminate booted ${bundleId}`, (error, stdout, stderr) => {
      if (error) this.logger.error(`[iOS] 종료 오류: ${error.message}`);
      if (stderr) this.logger.warn(`[iOS] 경고: ${stderr}`);
      if (stdout) this.logger.info(`[iOS] 종료 결과:\n${stdout}`);
    });
  }

  /**
   * iOS 앱 캐시 삭제
   */
  public async uninstallIosApp(bundleId: string): Promise<void> {
    this.logger.info(`[iOS] 앱 제거 요청: ${bundleId}`);
    exec(`xcrun simctl uninstall booted ${bundleId}`, (error, stdout, stderr) => {
      if (error) this.logger.error(`[iOS] 제거 오류: ${error.message}`);
      if (stderr) this.logger.warn(`[iOS] 경고: ${stderr}`);
      if (stdout) this.logger.info(`[iOS] 제거 결과:\n${stdout}`);
    });
  }
}
