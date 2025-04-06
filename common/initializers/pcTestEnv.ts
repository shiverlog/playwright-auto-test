/**
 * Description : pcTestEnv.ts - 📌 PC POC 테스트 환경 설정 및 정리
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import { webFixture } from '@common/fixtures/BaseWebFixture';
import { Logger } from '@common/logger/customLogger';
import type { POCKey } from '@common/types/platform-types';
import type winston from 'winston';

export async function initializePcTestEnv(poc: POCKey): Promise<void> {
  const logger = Logger.getLogger(poc) as winston.Logger;

  try {
    logger.info(`[${poc}] PC 테스트 환경 설정 시작`);
    // WebFixture를 통해 공통 환경 세팅
    await webFixture.setupForPoc(poc);
    logger.info(`[${poc}] PC 테스트 환경 설정 완료`);
  } catch (error) {
    logger.error(`[${poc}] PC 테스트 환경 설정 실패: ${error}`);
    throw error;
  }
}

export async function cleanupPcTestEnv(poc: POCKey): Promise<void> {
  const logger = Logger.getLogger(poc) as winston.Logger;

  try {
    logger.info(`[${poc}] PC 테스트 환경 정리 시작`);
    // WebFixture를 통해 후처리
    await webFixture.teardownForPoc(poc);
    logger.info(`[${poc}] PC 테스트 환경 정리 완료`);
  } catch (error) {
    logger.error(`[${poc}] PC 테스트 환경 정리 실패: ${error}`);
    throw error;
  }
}
