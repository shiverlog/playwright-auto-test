/**
 * Description : PortUtils.ts - 📌 사용 가능한 포트를 비동기로 세팅 유틸
 * Author : Shiwoo Min
 * Date : 2024-04-12
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import * as net from 'net';
import type winston from 'winston';

export class PortUtils {
  private readonly logger: winston.Logger;
  private readonly poc: string;

  /**
   * @param startPort - 시작 포트 번호 (4723 기본값)
   * @param maxPort - 최대 포트 번호 (4800 기본값)
   * @param usedPorts - 이미 사용 중인 포트 파일의 Set
   */
  constructor(
    private readonly startPort = 4723,
    private readonly maxPort = 4800,
    private readonly usedPorts: Set<number> = new Set(),
  ) {
    this.poc = POCEnv.getType();
    this.logger = Logger.getLogger(this.poc.toUpperCase()) as winston.Logger;
  }

  /**
   * 개별 포트가 사용 가능한지 확인
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
   * 지정된 범위 내에서 사용 가능한 포트 발견 및 반환
   */
  public async getAvailablePort(): Promise<number> {
    this.logger.debug(
      `[PortUtils][${this.poc}] 사용 가능한 포트를 ${this.startPort} ~ ${this.maxPort} 범위에서 검색합니다.`,
    );

    for (let port = this.startPort; port <= this.maxPort; port++) {
      if (this.usedPorts.has(port)) {
        this.logger.debug(`[PortUtils][${this.poc}] 포트 ${port} → 사용 중 (기록됨)`);
        continue;
      }

      const isAvailable = await this.checkPort(port);
      if (isAvailable) {
        this.logger.info(`[PortUtils][${this.poc}] 사용 가능한 포트 발견 → ${port}`);
        return port;
      } else {
        this.logger.debug(`[PortUtils][${this.poc}] 포트 ${port} → 사용 불가`);
      }
    }

    this.logger.error(`[PortUtils][${this.poc}] 사용 가능한 포트를 찾을 수 없습니다.`);
    throw new Error('사용 가능한 포트를 찾을 수 없습니다.');
  }
}
