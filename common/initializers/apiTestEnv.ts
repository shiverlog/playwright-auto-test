/**
 * Description : apiTestEnv.ts - 📌 API POC 테스트 환경 설정 및 정리
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import { Logger } from '@common/logger/customLogger';
import type { POCKey } from '@common/types/platform-types';
import type winston from 'winston';

export async function initializeApiTestEnv(poc: POCKey): Promise<void> {
  const logger = Logger.getLogger(poc) as winston.Logger;

  try {
    logger.info(`[${poc}] API 테스트 환경 설정 시작`);
    // TODO: mock, 토큰 등
    logger.info(`[${poc}] API 테스트 환경 설정 완료`);
  } catch (error) {
    logger.error(`[${poc}] API 테스트 환경 설정 실패: ${error}`);
    throw error;
  }
}

export async function cleanupApiTestEnv(poc: POCKey): Promise<void> {
  const logger = Logger.getLogger(poc) as winston.Logger;

  try {
    logger.info(`[${poc}] API 테스트 환경 정리 시작`);
    // TODO: 리소스 정리 등
    logger.info(`[${poc}] API 테스트 환경 정리 완료`);
  } catch (error) {
    logger.error(`[${poc}] API 테스트 환경 정리 실패: ${error}`);
    throw error;
  }
}
