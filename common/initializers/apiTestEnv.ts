/**
 * Description : ApiTestEnv.ts - 📌 API POC 테스트 환경 설정 및 정리 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type winston from 'winston';

export class ApiTestEnv {
  private readonly pocList = POCEnv.getList();
  private readonly loggerMap = new Map<string, winston.Logger>();

  constructor() {
    for (const poc of this.pocList) {
      this.loggerMap.set(poc, Logger.getLogger(poc) as winston.Logger);
    }
  }

  private get logger(): Record<string, winston.Logger> {
    const result: Record<string, winston.Logger> = {};
    for (const [poc, log] of this.loggerMap.entries()) {
      result[poc] = log;
    }
    return result;
  }

  public async setup(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger[poc].info(`[${poc}] API 테스트 환경 설정 시작`);

      try {
        // TODO: mock 서버 연결, 토큰 발급 등
        this.logger[poc].info(`[${poc}] API 테스트 환경 설정 완료`);
      } catch (error) {
        this.logger[poc].error(`[${poc}] API 테스트 환경 설정 실패: ${error}`);
        throw error;
      }
    }
  }

  public async teardown(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger[poc].info(`[${poc}] API 테스트 환경 정리 시작`);

      try {
        // TODO: 리소스 해제, 정리 등
        this.logger[poc].info(`[${poc}] API 테스트 환경 정리 완료`);
      } catch (error) {
        this.logger[poc].error(`[${poc}] API 테스트 환경 정리 실패: ${error}`);
        throw error;
      }
    }
  }
}
