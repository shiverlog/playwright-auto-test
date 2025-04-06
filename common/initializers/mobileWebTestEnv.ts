/**
 * Description : mobileWebTestEnv.ts - 📌 Mobile Web 테스트 환경 설정 및 정리
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import { mobileWebFixture } from '@common/fixtures/BaseMobileWebFixture';
import { Logger } from '@common/logger/customLogger';
import type { POCKey } from '@common/types/platform-types';
import type winston from 'winston';

export async function initializeMobileWebTestEnv(poc: POCKey): Promise<void> {
  const logger = Logger.getLogger(poc) as winston.Logger;

  try {
    logger.info(`[${poc}] Mobile Web 테스트 환경 설정 시작`);
    // WebFixture를 통해 공통 환경 세팅
    await mobileWebFixture.setupForPoc(poc);
    logger.info(`[${poc}] Mobile Web 테스트 환경 설정 완료`);
  } catch (error) {
    logger.error(`[${poc}] Mobile Web 테스트 환경 설정 실패: ${error}`);
    throw error;
  }
}

export async function cleanupMobileWebTestEnv(poc: POCKey): Promise<void> {
  const logger = Logger.getLogger(poc) as winston.Logger;

  try {
    logger.info(`[${poc}] Mobile Web 테스트 환경 정리 시작`);
    // WebFixture를 통해 후처리
    await mobileWebFixture.teardownForPoc(poc);
    logger.info(`[${poc}] Mobile Web 테스트 환경 정리 완료`);
  } catch (error) {
    logger.error(`[${poc}] Mobile Web 테스트 환경 정리 실패: ${error}`);
    throw error;
  }
}
