/**
 * Description : GlobalSetup.ts - 📌 Playwright 테스트 실행 초기화 작업
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { PocInitializer } from '@common/initializers/PocInitializer.js';
import { Logger } from '@common/logger/customLogger.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import dotenv from 'dotenv';
import type winston from 'winston';

dotenv.config();

class GlobalSetup {
  // 단일 실행 POC 타입
  private readonly poc: string = POCEnv.getType() || 'ALL';
  // 전역 로거 인스턴스
  private readonly logger: winston.Logger;

  constructor() {
    this.poc = POCEnv.getType();
    this.logger = Logger.getLogger('GLOBAL') as winston.Logger;
  }

  public async run(): Promise<void> {
    this.logger.info(`[GLOBAL SETUP] 시작 - 대상 POC: ${this.poc || 'ALL'}`);

    try {
      await PocInitializer.setup();
      this.logger.info(`[GLOBAL SETUP] 전체 테스트 환경 설정 완료`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(`[GLOBAL SETUP] 실패: ${errorMessage}`);
      throw err;
    }
  }
}

export default async function globalSetup(): Promise<void> {
  const handler = new GlobalSetup();
  await handler.run();
}
