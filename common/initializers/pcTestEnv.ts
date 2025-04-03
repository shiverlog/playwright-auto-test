/**
 * Description : pcTestEnv.ts - 📌 PC POC 테스트 환경 설정 및 정리
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import type { POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';

export async function initializePcTestEnv(poc: POCType): Promise<void> {
  const logger = Logger.getLogger(poc);

  try {
    logger.info(`[${poc.toUpperCase()}] PC 테스트 환경 설정 시작`);

    // TODO: 브라우저 초기화, 설정 파일 로딩, 쿠키 정리 등

    logger.info(`[${poc.toUpperCase()}] PC 테스트 환경 설정 완료`);
  } catch (error) {
    logger.error(`[${poc.toUpperCase()}] PC 테스트 환경 설정 실패: ${error}`);
    throw error;
  }
}

export async function cleanupPcTestEnv(poc: POCType): Promise<void> {
  const logger = Logger.getLogger(poc);

  try {
    logger.info(`[${poc.toUpperCase()}] PC 테스트 환경 정리 시작`);

    // TODO: 캐시/세션 정리, 스크린샷 정리 등

    logger.info(`[${poc.toUpperCase()}] PC 테스트 환경 정리 완료`);
  } catch (error) {
    logger.error(`[${poc.toUpperCase()}] PC 테스트 환경 정리 실패: ${error}`);
    throw error;
  }
}
