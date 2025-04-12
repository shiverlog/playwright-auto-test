/**
 * Description : AndroidTestEnv.ts - 📌 Android App 테스트 환경 설정 및 정리 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { appFixture } from '@common/fixtures/BaseAppFixture';
import { Logger } from '@common/logger/customLogger';
import type { TestEnvHandler } from '@common/types/test-env-handler';
import { ContextUtils } from '@common/utils/context/ContextUtils';
import { POCEnv } from '@common/utils/env/POCEnv';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

export class AndroidTestEnv {
  private readonly pocList = POCEnv.getPOCList();
  private readonly logger: winston.Logger;

  constructor() {
    const currentPoc = POCEnv.getType();
    this.logger = Logger.getLogger(currentPoc.toUpperCase()) as winston.Logger;
  }

  /**
   * Android 앱 테스트 환경 초기화
   */
  public async setup(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] Android 테스트 환경 설정 시작`);

      try {
        const { driver }: { driver: Browser } = await appFixture.setupForPoc(poc);

        if (driver) {
          const isWebview = await ContextUtils.isInWebviewContext(driver);

          if (isWebview) {
            this.logger.info(`[${poc}] 현재 WebView 컨텍스트 상태`);
          } else {
            this.logger.info(`[${poc}] WebView가 아닌 상태, Native 컨텍스트인지 확인 중`);
            const isNative = await ContextUtils.isInNativeContext(driver);

            if (isNative) {
              this.logger.info(`[${poc}] 현재 Native 컨텍스트 상태`);
            } else {
              this.logger.warn(`[${poc}] WebView도 Native도 아닌 상태`);
            }
          }
        } else {
          this.logger.warn(`[${poc}] 드라이버가 초기화되지 않아 컨텍스트 확인 실패`);
        }

        this.logger.info(`[${poc}] Android 테스트 환경 설정 완료`);
      } catch (error) {
        this.logger.error(`[${poc}] Android 테스트 환경 설정 실패: ${error}`);
        throw error;
      }
    }
  }

  /**
   * Android 앱 테스트 환경 정리
   */
  public async teardown(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] Android 테스트 환경 정리 시작`);

      try {
        await appFixture.teardownForPoc(poc);
        this.logger.info(`[${poc}] Android 테스트 환경 정리 완료`);
      } catch (error) {
        this.logger.error(`[${poc}] Android 테스트 환경 정리 실패: ${error}`);
        throw error;
      }
    }
  }
}
