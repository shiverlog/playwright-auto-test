/**
 * Description : GlobalTeardown.ts - 📌 Playwright 테스트 실행 후 정리 작업
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */
import { resultHandler } from '@common/logger/ResultHandler.js';
import { PocInitializer } from '@common/initializers/PocInitializer.js';
import { Logger } from '@common/logger/customLogger.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import dotenv from 'dotenv';
import type winston from 'winston';

dotenv.config();

class GlobalTeardownHandler {
  // poc 단일 실행
  private readonly poc: string;
  // 전체 poc 목록
  private readonly pocList: string[];
  // 전역 로거 인스턴스
  private readonly logger: winston.Logger;

  constructor() {
    this.poc = POCEnv.getType();
    this.pocList = POCEnv.getList();
    this.logger = Logger.getLogger('GLOBAL') as winston.Logger;
  }

  public async run(): Promise<void> {
    await Promise.all(this.pocList.map(poc => this.teardownPOC(poc)));
  }

  private async teardownPOC(poc: string): Promise<void> {
    this.logger.info(`[GLOBAL TEARDOWN] [${poc.toUpperCase()}] 테스트 종료 처리 시작`);

    try {
      await PocInitializer.teardown(poc);
      this.logger.info(`[GLOBAL TEARDOWN] [${poc.toUpperCase()}] 종료 처리 완료`);

      await resultHandler(poc, 'PASS', '[GLOBAL TEARDOWN] 테스트 정상 종료');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(`[GLOBAL TEARDOWN] [${poc.toUpperCase()}] 종료 처리 실패: ${errorMessage}`);

      await resultHandler(poc, 'FAIL', `[GLOBAL TEARDOWN] 오류: ${errorMessage}`);
      throw err;
    }
  }
}

export default async function globalTeardown(): Promise<void> {
  const handler = new GlobalTeardownHandler();
  await handler.run();
}
