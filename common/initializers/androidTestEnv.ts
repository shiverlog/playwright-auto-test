/**
 * Description : androidTestEnv.ts - 📌 Android App 테스트 환경 설정 및 정리 유틸
 * Author : Shiwoo Min
 * Date : 2025-04-06
 */
import { appFixture } from '@common/fixtures/BaseAppFixture';
import { Logger } from '@common/logger/customLogger';
import type { POCKey } from '@common/types/platform-types';
import { ContextUtils } from '@common/utils/context/ContextUtils';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

/**
 * Android 테스트 환경 설정
 */
export async function initializeAndroidTestEnv(poc: POCKey): Promise<void> {
  const logger = Logger.getLogger(poc) as winston.Logger;

  try {
    logger.info(`[${poc}] Android 테스트 환경 설정 시작`);

    // driver 명시적 반환 및 초기화 처리
    const { driver, port }: { driver: Browser; port: number } = await appFixture.setupForPoc(poc);

    // 반환된 driver 직접 사용하여, 네이티브 컨텍스트로 전환
    if (driver) {
      // 먼저 WebView 존재 여부 확인
      const isWebview = await ContextUtils.isInWebviewContext(driver, poc);
      if (isWebview) {
        logger.info(`[${poc}] 현재 WebView 컨텍스트 상태`);
      } else {
        logger.info(`[${poc}] WebView가 아닌 상태, Native 컨텍스트인지 확인 중`);
        const isNative = await ContextUtils.isInNativeContext(driver, poc);
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

/**
 * Android 테스트 환경 정리
 */
export async function cleanupAndroidTestEnv(poc: POCKey): Promise<void> {
  const logger = Logger.getLogger(poc) as winston.Logger;

  try {
    logger.info(`[${poc}] Android 테스트 환경 정리 시작`);
    await appFixture.teardownForPoc(poc);
    logger.info(`[${poc}] Android 테스트 환경 정리 완료`);
  } catch (error) {
    logger.error(`[${poc}] Android 테스트 환경 정리 실패: ${error}`);
    throw error;
  }
}
