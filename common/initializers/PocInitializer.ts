/**
 * Description : PocInitializer.ts - 📌 각 POC 테스트 환경 초기화 및 정리 매니저 (POCEnv 기반, POCKey 제거 버전)
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { AndroidTestEnv } from '@common/initializers/AndroidTestEnv.js';
import { ApiTestEnv } from '@common/initializers/ApiTestEnv.js';
import { CleanupInitializer } from '@common/initializers/CleanupInitializer.js';
import { IosTestEnv } from '@common/initializers/IosTestEnv.js';
import { MobileWebTestEnv } from '@common/initializers/MobileWebTestEnv.js';
import { PcTestEnv } from '@common/initializers/PcTestEnv.js';
import { Logger } from '@common/logger/customLogger.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import type winston from 'winston';

/**
 * 각 POC 이름에 대응하는 테스트 환경 핸들러 매핑
 */
const POC_CLASS_MAP: Record<string, { setup: () => Promise<void>; teardown: () => Promise<void> }> =
  {
    PC: new PcTestEnv(),
    MW: new MobileWebTestEnv(),
    AOS: new AndroidTestEnv(),
    IOS: new IosTestEnv(),
    API: new ApiTestEnv(),
  };

/**
 * 각 POC에 대한 테스트 환경을 초기화 및 정리
 */
export class PocInitializer {
  private static readonly loggerMap = new Map<string, winston.Logger>();

  private static getLogger(poc: string): winston.Logger {
    if (!this.loggerMap.has(poc)) {
      this.loggerMap.set(poc, Logger.getLogger(poc) as winston.Logger);
    }
    return this.loggerMap.get(poc)!;
  }

  /**
   * 모든 POC에 대한 테스트 환경 초기화 실행
   */
  public static async setup(): Promise<void> {
    const pocList = POCEnv.getPOCList();

    await Promise.all(
      pocList.map(async poc => {
        const logger = this.getLogger(poc);
        const handler = POC_CLASS_MAP[poc];

        logger.info(`[SETUP] ${poc.toUpperCase()} 시작`);

        if (!handler) {
          logger.warn(`[SETUP] 알 수 없는 POC: ${poc}`);
          return;
        }

        try {
          await new CleanupInitializer().run();
          await handler.setup();
          logger.info(`[SETUP] ${poc.toUpperCase()} 완료`);
        } catch (error: any) {
          logger.error(`[SETUP] ${poc.toUpperCase()} 실패 - ${error.message || error}`);
          throw error;
        }
      }),
    );
  }

  /**
   * 모든 POC에 대한 테스트 환경 정리 작업 실행
   */
  public static async teardown(): Promise<void> {
    const pocList = POCEnv.getPOCList();

    await Promise.all(
      pocList.map(async poc => {
        const logger = this.getLogger(poc);
        const handler = POC_CLASS_MAP[poc];

        logger.info(`[TEARDOWN] ${poc.toUpperCase()} 시작`);

        if (!handler) {
          logger.warn(`[TEARDOWN] 알 수 없는 POC: ${poc}`);
          return;
        }

        try {
          await handler.teardown();
          logger.info(`[TEARDOWN] ${poc.toUpperCase()} 완료`);
        } catch (error: any) {
          logger.error(`[TEARDOWN] ${poc.toUpperCase()} 실패 - ${error.message || error}`);
          throw error;
        }
      }),
    );
  }
}
