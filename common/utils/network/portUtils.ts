/**
 * Description : PortUtils.ts - 📌 사용 가능한 포트를 비동기로 세팅 유틸
 * Author : Shiwoo Min
 * Date : 2024-04-10
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import * as net from 'net';
import type winston from 'winston';

/**
 * 지정된 범위 내에서 사용 가능한 포트를 관리하는 유틸리티 클래스
 */
export class PortUtils {
  // 현재 POC 키
  private readonly poc = POCEnv.getType();
  // 로깅 인스턴스
  private readonly logger: winston.Logger = Logger.getLogger(this.poc) as winston.Logger;

  /**
   * @param startPort - 시작 포트 번호 (기본값: 4723)
   * @param maxPort - 최대 포트 번호 (기본값: 4800)
   * @param usedPorts - 이미 사용 중인 포트를 기록한 Set
   */
  constructor(
    private readonly startPort = 4723,
    private readonly maxPort = 4800,
    private readonly usedPorts: Set<number> = new Set(),
  ) {}

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
   * 지정된 범위 내에서 사용 가능한 포트를 찾아 반환
   */
  public async getAvailablePort(): Promise<number> {
    this.logger.debug(
      `[portUtils][${this.poc}] 사용 가능한 포트를 ${this.startPort} - ${this.maxPort} 범위에서 탐색 중`,
    );

    for (let port = this.startPort; port <= this.maxPort; port++) {
      if (this.usedPorts.has(port)) {
        this.logger.debug(
          `[portUtils][${this.poc}] 포트 ${port} 은(는) 이미 사용 중 (usedPorts에 포함)`,
        );
        continue;
      }

      const isAvailable = await this.checkPort(port);
      if (isAvailable) {
        this.logger.info(`[portUtils][${this.poc}] 사용 가능한 포트 발견 → ${port}`);
        return port;
      } else {
        this.logger.debug(`[portUtils][${this.poc}] 포트 ${port} 은(는) 이미 사용 중`);
      }
    }

    this.logger.error(`[portUtils][${this.poc}] 사용 가능한 포트를 찾을 수 없습니다.`);
    throw new Error('사용 가능한 포트를 찾을 수 없습니다.');
  }
}
