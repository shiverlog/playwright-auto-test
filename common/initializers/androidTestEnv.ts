/**
 * Description : AndroidTestEnv.ts - 📌 Android App 테스트 환경 설정 및 정리 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { appFixture } from '@common/fixtures/BaseAppFixture';
import { Logger } from '@common/logger/customLogger';
import { ContextUtils } from '@common/utils/context/ContextUtils';
import { POCEnv } from '@common/utils/env/POCEnv';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

export class AndroidTestEnv {
  // 현재 실행 대상 POC 리스트
  private readonly pocList = POCEnv.getPOCList();

  // POC별 로거 인스턴스 저장용 Map
  private readonly loggerMap = new Map<string, winston.Logger>();

  constructor() {
    for (const poc of this.pocList) {
      this.loggerMap.set(poc, Logger.getLogger(poc) as winston.Logger);
    }
  }

  /**
   * 개별 POC의 로거 반환
   */
  private getLogger(poc: string): winston.Logger {
    return this.loggerMap.get(poc)!;
  }

  /**
   * Android 앱 테스트 환경 초기화
   */
  public async setup(): Promise<void> {
    for (const poc of this.pocList) {
      const logger = this.getLogger(poc);
      logger.info(`[${poc}] Android 테스트 환경 설정 시작`);

      try {
        const { driver }: { driver: Browser } = await appFixture.setupForPoc(poc);

        if (driver) {
          const isWebview = await ContextUtils.isInWebviewContext(driver);

          if (isWebview) {
            logger.info(`[${poc}] 현재 WebView 컨텍스트 상태`);
          } else {
            logger.info(`[${poc}] WebView가 아닌 상태, Native 컨텍스트인지 확인 중`);
            const isNative = await ContextUtils.isInNativeContext(driver);

            if (isNative) {
              logger.info(`[${poc}] 현재 Native 컨텍스트 상태`);
            } else {
              logger.warn(`[${poc}] WebView도 Native도 아닌 상태`);
            }
          }
        } else {
          logger.warn(`[${poc}] 드라이버가 초기화되지 않아 컨텍스트 확인 실패`);
        }

        logger.info(`[${poc}] Android 테스트 환경 설정 완료`);
      } catch (error) {
        logger.error(`[${poc}] Android 테스트 환경 설정 실패: ${error}`);
        throw error;
      }
    }
  }

  /**
   * Android 앱 테스트 환경 정리
   */
  public async teardown(): Promise<void> {
    for (const poc of this.pocList) {
      const logger = this.getLogger(poc);
      logger.info(`[${poc}] Android 테스트 환경 정리 시작`);

      try {
        await appFixture.teardownForPoc(poc);
        logger.info(`[${poc}] Android 테스트 환경 정리 완료`);
      } catch (error) {
        logger.error(`[${poc}] Android 테스트 환경 정리 실패: ${error}`);
        throw error;
      }
    }
  }
}
