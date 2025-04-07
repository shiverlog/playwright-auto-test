/**
 * Description : androidTestEnv.ts - 📌 Android App 테스트 환경 설정 및 정리 유틸
 * Author : Shiwoo Min
 * Date : 2025-04-06
 */
import { appFixture } from '@common/fixtures/BaseAppFixture';
import { Logger } from '@common/logger/customLogger';
import type { POCKey } from '@common/types/platform-types';
import type winston from 'winston';

/**
 * Android 테스트 환경 설정
 */
export async function initializeAndroidTestEnv(poc: POCKey): Promise<void> {
  const logger = Logger.getLogger(poc) as winston.Logger;

  try {
    logger.info(`[${poc}] Android 테스트 환경 설정 시작`);
    await appFixture.setupForPoc(poc);
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
