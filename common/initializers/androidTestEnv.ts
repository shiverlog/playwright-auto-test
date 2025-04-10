/**
 * Description : AndroidTestEnv.ts - 📌 Android App 테스트 환경 설정 및 정리 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */
import { appFixture } from '@common/fixtures/BaseAppFixture';
import { Logger } from '@common/logger/customLogger';
import { ContextUtils } from '@common/utils/context/ContextUtils';
import { POCEnv } from '@common/utils/env/POCEnv';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

export class AndroidTestEnv {
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
      this.logger[poc].info(`[${poc}] Android 테스트 환경 설정 시작`);

      try {
        const { driver }: { driver: Browser } = await appFixture.setupForPoc(poc);

        if (driver) {
          const isWebview = await ContextUtils.isInWebviewContext(driver, poc);
          if (isWebview) {
            this.logger[poc].info(`[${poc}] 현재 WebView 컨텍스트 상태`);
          } else {
            this.logger[poc].info(`[${poc}] WebView가 아닌 상태, Native 컨텍스트인지 확인 중`);
            const isNative = await ContextUtils.isInNativeContext(driver, poc);
            if (isNative) {
              this.logger[poc].info(`[${poc}] 현재 Native 컨텍스트 상태`);
            } else {
              this.logger[poc].warn(`[${poc}] WebView도 Native도 아닌 상태`);
            }
          }
        } else {
          this.logger[poc].warn(`[${poc}] 드라이버가 초기화되지 않아 컨텍스트 확인 실패`);
        }

        this.logger[poc].info(`[${poc}] Android 테스트 환경 설정 완료`);
      } catch (error) {
        this.logger[poc].error(`[${poc}] Android 테스트 환경 설정 실패: ${error}`);
        throw error;
      }
    }
  }

  public async teardown(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger[poc].info(`[${poc}] Android 테스트 환경 정리 시작`);

      try {
        await appFixture.teardownForPoc(poc);
        this.logger[poc].info(`[${poc}] Android 테스트 환경 정리 완료`);
      } catch (error) {
        this.logger[poc].error(`[${poc}] Android 테스트 환경 정리 실패: ${error}`);
        throw error;
      }
    }
  }
}
