/**
 * Description : iosTestEnv.ts - 📌 iOS POC 테스트 환경 설정 및 정리
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import { Logger } from '@common/logger/customLogger';
import type { POCKey } from '@common/types/platform-types';
import type winston from 'winston';

export async function initializeIosTestEnv(poc: POCKey): Promise<void> {
  const logger = Logger.getLogger(poc) as winston.Logger;

  try {
    logger.info(`[${poc}] iOS 테스트 환경 설정 시작`);
    // TODO: iOS 앱 설치 등
    logger.info(`[${poc}] iOS 테스트 환경 설정 완료`);
  } catch (error) {
    logger.error(`[${poc}] iOS 테스트 환경 설정 실패: ${error}`);
    throw error;
  }
}

export async function cleanupIosTestEnv(poc: POCKey): Promise<void> {
  const logger = Logger.getLogger(poc) as winston.Logger;

  try {
    logger.info(`[${poc}] iOS 테스트 환경 정리 시작`);
    // TODO: Appium 세션 정리 등
    logger.info(`[${poc}] iOS 테스트 환경 정리 완료`);
  } catch (error) {
    logger.error(`[${poc}] iOS 테스트 환경 정리 실패: ${error}`);
    throw error;
  }
}
