/**
 * Description : PortUtils.ts - 📌 사용 가능한 포트를 비동기로 세팅 유틸
 * Author : Shiwoo Min
 * Date : 2024-04-12
 * - Appium 프로세스와 Playwright CDP 연결을 동시에 가능
 * - 시스템 전체에서 공유하는 globalUsedPorts 사용
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import { exec } from 'child_process';
import * as net from 'net';
import { promisify } from 'util';
import type winston from 'winston';

const execAsync = promisify(exec);

export class PortUtils {
  private readonly logger: winston.Logger;
  private readonly poc: string;
  private readonly startPort: number;
  private readonly maxPort: number;

  // 모든 인스턴스에서 공유할 전역 사용 포트 목록
  private static readonly globalUsedPorts: Set<number> = new Set();

  constructor(startPort = 4723, maxPort = 4800) {
    this.startPort = startPort;
    this.maxPort = maxPort;
    this.poc = POCEnv.getType();
    this.logger = Logger.getLogger(this.poc.toUpperCase()) as winston.Logger;
  }

  /**
   * 해당 포트가 등록되어 사용 중인지 확인
   */
  public static isRegistered(port: number): boolean {
    return PortUtils.globalUsedPorts.has(port);
  }

  /**
   * 모든 인스턴스에서 공유할 전역 사용 포트 목록에 포트 등록
   */
  public static registerPort(port: number): void {
    PortUtils.globalUsedPorts.add(port);
  }

  /**
   * 사용 가능한 포트 여부 확인
   */
  private async checkPort(port: number): Promise<boolean> {
    return new Promise(resolve => {
      const server = net
        .createServer()
        .once('error', () => resolve(false))
        .once('listening', () => {
          server.close();
          resolve(true);
        })
        .listen(port);
    });
  }

  /**
   * 지정된 POC(aos, ios)에 대한 단일 포트 할당
   */
  public async getAppiumPortBundle(poc: 'aos' | 'ios'): Promise<{
    poc: 'aos' | 'ios';
    port: number;
    platformName: 'Android' | 'iOS';
  }> {
    const port = await this.getPortForPoc(poc);
    const platformName = poc === 'aos' ? 'Android' : 'iOS';
    return { poc, port, platformName };
  }

  /**
   * 지정된 POC(aos, ios)에 대한 단일 포트 할당
   */
  public async getPortForPoc(poc: 'aos' | 'ios'): Promise<number> {
    this.logger.debug(`[PortUtils][${poc}] 포트 할당 시작`);
    const port = await this.getAvailablePort();
    this.logger.info(`[PortUtils][${poc}] 포트 할당 완료 -> ${port}`);
    return port;
  }

  /**
   * all 메시지 상태에서 aos/ios 동시 실행을 위한 번들 설정
   */
  public async getAppiumPortBundlesForAll(): Promise<{
    aos: { poc: 'aos'; port: number; platformName: 'Android' };
    ios: { poc: 'ios'; port: number; platformName: 'iOS' };
  }> {
    const { aos, ios } = await this.getPortsForAllPocs();
    return {
      aos: { poc: 'aos', port: aos, platformName: 'Android' },
      ios: { poc: 'ios', port: ios, platformName: 'iOS' },
    };
  }

  /**
   * CDP(WebView) 연결을 위한 주소 URL을 만듭니다.
   * Playwright browserType.connectOverCDP() 메서드에서 필요
   */
  public getWebViewCDPUrl(port: number): string {
    return `http://localhost:${port}`;
  }

  /**
   * all 모드일 때, aos/ios 병렬 실행을 위한 포트 2개 할당
   * 반환 형식: { aos: number, ios: number }
   */
  public async getPortsForAllPocs(): Promise<{ aos: number; ios: number }> {
    this.logger.debug(`[PortUtils][ALL] aos/ios 포트 동시 할당 시작`);
    const [aos, ios] = await this.getMultipleAvailablePorts(2);
    this.logger.info(`[PortUtils][ALL] 포트 할당 완료 → aos: ${aos}, ios: ${ios}`);
    return { aos, ios };
  }

  /**
   * 지정된 범위 내에서 사용 가능한 포트 발견 및 반환
   */
  public async getAvailablePort(): Promise<number> {
    this.logger.debug(
      `[PortUtils][${this.poc}] 사용 가능한 포트를 ${this.startPort} - ${this.maxPort} 범위에서 검색합니다.`,
    );

    for (let port = this.startPort; port <= this.maxPort; port++) {
      if (PortUtils.globalUsedPorts.has(port)) {
        this.logger.debug(`[PortUtils][${this.poc}] 포트 ${port} -> 사용 중 (기록됨)`);
        continue;
      }

      const isAvailable = await this.checkPort(port);
      if (isAvailable) {
        PortUtils.globalUsedPorts.add(port);
        this.logger.info(`[PortUtils][${this.poc}] 사용 가능한 포트 발견 -> ${port}`);
        return port;
      } else {
        this.logger.debug(`[PortUtils][${this.poc}] 포트 ${port} -> 사용 불가`);
      }
    }

    this.logger.error(`[PortUtils][${this.poc}] 사용 가능한 포트를 찾을 수 없습니다.`);
    throw new Error('사용 가능한 포트를 찾을 수 없습니다.');
  }

  /**
   * 주어진 포트 또는 범위를 사용하는 프로세스를 강제로 종료 (macOS/Linux/Windows 지원)
   */
  public async killProcessOnPorts(startPort: number, endPort?: number): Promise<void> {
    const rangeEnd = endPort ?? startPort;
    this.logger.info(
      `[PortUtils][${this.poc}] 포트 ${startPort} - ${rangeEnd} 확인 및 종료 시도 중...`,
    );

    const killPortPromises = [];

    for (let port = startPort; port <= rangeEnd; port++) {
      if (PortUtils.globalUsedPorts.has(port)) {
        this.logger.info(
          `[PortUtils][${this.poc}] [SKIP] 포트 ${port}는 현재 테스트에서 사용 중이므로 종료하지 않음`,
        );
        continue;
      }

      killPortPromises.push(
        new Promise<void>((resolve, reject) => {
          const isWin = process.platform === 'win32';

          if (isWin) {
            exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
              this.logger.debug(`[WIN] netstat stdout (${port}): ${stdout}`);
              if (error || !stdout) return resolve();

              const pid = stdout?.trim().split(/\s+/)[4];
              if (pid) {
                this.logger.info(`[WIN] 포트 ${port} 사용중인 PID: ${pid}, 종료 시도`);
                exec(`taskkill /F /PID ${pid}`, err => {
                  if (!err) {
                    PortUtils.releasePort(port);
                    this.logger.info(
                      `[PortUtils][${this.poc}] 포트 ${port} 전역 사용 목록에서 해제 완료`,
                    );
                  }
                  err ? reject(err) : resolve();
                });
              } else {
                this.logger.info(`[WIN] 포트 ${port}는 사용 중이지 않음`);
                resolve();
              }
            });
          } else {
            exec(`lsof -i :${port}`, (error, stdout) => {
              this.logger.debug(`[UNIX] lsof stdout (${port}):\n${stdout}`);
              if (error && !stdout) return resolve();

              const line = stdout.split('\n')[1];
              const pid = line?.split(/\s+/)[1];
              if (pid) {
                this.logger.info(`[UNIX] 포트 ${port} 사용중인 PID: ${pid}, 종료 시도`);
                exec(`kill -9 ${pid}`, err => {
                  if (!err) {
                    PortUtils.releasePort(port);
                    this.logger.info(
                      `[PortUtils][${this.poc}] 포트 ${port} 전역 사용 목록에서 해제 완료`,
                    );
                  }
                  err ? reject(err) : resolve();
                });
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
      this.logger.info(`[PortUtils][${this.poc}] 포트 종료 작업 완료`);
    } catch (err: any) {
      this.logger.error(`[PortUtils][${this.poc}] 포트 종료 중 에러 발생: ${err.message}`);
    }
  }

  /**
   * 사용 완료된 포트를 전역 목록에서 해제
   */
  public static releasePort(port: number): void {
    PortUtils.globalUsedPorts.delete(port);
  }

  /**
   * 여러 개의 사용 가능한 포트를 반환
   */
  public async getMultipleAvailablePorts(count: number): Promise<number[]> {
    this.logger.debug(
      `[PortUtils][${this.poc}] ${count}개의 사용 가능한 포트를 검색합니다. 범위: ${this.startPort} ~ ${this.maxPort}`,
    );

    const foundPorts: number[] = [];

    for (let port = this.startPort; port <= this.maxPort && foundPorts.length < count; port++) {
      if (PortUtils.globalUsedPorts.has(port)) continue;

      const isAvailable = await this.checkPort(port);
      if (isAvailable) {
        PortUtils.globalUsedPorts.add(port);
        this.logger.info(`[PortUtils][${this.poc}] 사용 가능한 포트 발견 -> ${port}`);
        foundPorts.push(port);
      }
    }

    if (foundPorts.length < count) {
      this.logger.error(
        `[PortUtils][${this.poc}] ${count}개의 포트를 찾지 못했습니다. (${foundPorts.length}개만 확보됨)`,
      );
      throw new Error(`${count}개의 사용 가능한 포트를 찾을 수 없습니다.`);
    }

    return foundPorts;
  }
}
