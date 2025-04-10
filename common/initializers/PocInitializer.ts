/**
 * Description : PocInitializer.ts - 📌 각 POC 테스트 환경 초기화 및 정리 매니저 (POCEnv 기반)
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */
import { AndroidTestEnv } from '@common/initializers/AndroidTestEnv.js';
import { ApiTestEnv } from '@common/initializers/ApiTestEnv.js';
import { CleanupInitializer } from '@common/initializers/CleanupInitializer';
import { IosTestEnv } from '@common/initializers/IosTestEnv.js';
import { MobileWebTestEnv } from '@common/initializers/MobileWebTestEnv.js';
import { PcTestEnv } from '@common/initializers/PcTestEnv.js';
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type winston from 'winston';

const POC_CLASS_MAP = {
  PC: new PcTestEnv(),
  MW: new MobileWebTestEnv(),
  AOS: new AndroidTestEnv(),
  IOS: new IosTestEnv(),
  API: new ApiTestEnv(),
} as const;

type POCKey = keyof typeof POC_CLASS_MAP;

export class PocInitializer {
  private static readonly loggerMap = new Map<POCKey, winston.Logger>();

  private static get logger(): Record<POCKey, winston.Logger> {
    const result = {} as Record<POCKey, winston.Logger>;
    const pocList = POCEnv.getList() as POCKey[];

    for (const poc of pocList) {
      if (!this.loggerMap.has(poc)) {
        this.loggerMap.set(poc, Logger.getLogger(poc) as winston.Logger);
      }
      result[poc] = this.loggerMap.get(poc)!;
    }

    return result;
  }

  public static async setup(): Promise<void> {
    const pocList = POCEnv.getList() as POCKey[];

    await Promise.all(
      pocList.map(async poc => {
        const handler = POC_CLASS_MAP[poc];

        this.logger[poc].info(`[SETUP] ${poc.toUpperCase()} 시작`);

        if (!handler) {
          this.logger[poc].warn(`[SETUP] 알 수 없는 POC: ${poc}`);
          return;
        }

        try {
          await new CleanupInitializer().run();
          await handler.setup();
          this.logger[poc].info(`[SETUP] ${poc.toUpperCase()} 완료`);
        } catch (error: any) {
          this.logger[poc].error(`[SETUP] ${poc.toUpperCase()} 실패 - ${error.message || error}`);
          throw error;
        }
      }),
    );
  }

  public static async teardown(): Promise<void> {
    const pocList = POCEnv.getList() as POCKey[];

    await Promise.all(
      pocList.map(async poc => {
        const handler = POC_CLASS_MAP[poc];

        this.logger[poc].info(`[TEARDOWN] ${poc.toUpperCase()} 시작`);

        if (!handler) {
          this.logger[poc].warn(`[TEARDOWN] 알 수 없는 POC: ${poc}`);
          return;
        }

        try {
          await handler.teardown();
          this.logger[poc].info(`[TEARDOWN] ${poc.toUpperCase()} 완료`);
        } catch (error: any) {
          this.logger[poc].error(
            `[TEARDOWN] ${poc.toUpperCase()} 실패 - ${error.message || error}`,
          );
          throw error;
        }
      }),
    );
  }
}
