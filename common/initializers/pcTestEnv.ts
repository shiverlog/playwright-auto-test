/**
 * Description : PcTestEnv.ts - 📌 PC POC 테스트 환경 설정 및 정리 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */
import { webFixture } from '@common/fixtures/BaseWebFixture';
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type winston from 'winston';

export class PcTestEnv {
  private readonly pocList = POCEnv.getList();
  private readonly loggerMap = new Map<string, winston.Logger>();

  constructor() {
    for (const poc of this.pocList) {
      this.loggerMap.set(poc, Logger.getLogger(poc) as winston.Logger);
    }
  }

  private get logger(): Record<string, winston.Logger> {
    const loggers: Record<string, winston.Logger> = {};
    for (const [poc, logger] of this.loggerMap.entries()) {
      loggers[poc] = logger;
    }
    return loggers;
  }

  public async setup(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger[poc].info(`[${poc}] PC 테스트 환경 설정 시작`);

      try {
        await webFixture.setupForPoc(poc);
        this.logger[poc].info(`[${poc}] PC 테스트 환경 설정 완료`);
      } catch (error) {
        this.logger[poc].error(`[${poc}] PC 테스트 환경 설정 실패: ${error}`);
        throw error;
      }
    }
  }

  public async teardown(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger[poc].info(`[${poc}] PC 테스트 환경 정리 시작`);

      try {
        await webFixture.teardownForPoc(poc);
        this.logger[poc].info(`[${poc}] PC 테스트 환경 정리 완료`);
      } catch (error) {
        this.logger[poc].error(`[${poc}] PC 테스트 환경 정리 실패: ${error}`);
        throw error;
      }
    }
  }
}
