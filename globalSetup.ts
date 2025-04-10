/**
 * Description : globalSetup.ts - 📌 Playwright 테스트 실행 초기화 작업
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */
import { PocInitializer } from '@common/initializers/PocInitializer.js';
import { Logger } from '@common/logger/customLogger.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import dotenv from 'dotenv';
import type winston from 'winston';

dotenv.config();

class GlobalSetupHandler {
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
    await Promise.all(this.pocList.map(poc => this.setupPOC(poc)));
  }

  private async setupPOC(poc: string): Promise<void> {
    this.logger.info(`[GLOBAL SETUP] [${poc.toUpperCase()}] 테스트 환경 설정 시작`);

    try {
      await PocInitializer.setup(poc);
      this.logger.info(`[GLOBAL SETUP] [${poc.toUpperCase()}] 테스트 환경 설정 완료`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(`[GLOBAL SETUP] [${poc.toUpperCase()}] 설정 실패: ${errorMessage}`);
      throw err;
    }
  }
}

export default async function globalSetup(): Promise<void> {
  const handler = new GlobalSetupHandler();
  await handler.run();
}
