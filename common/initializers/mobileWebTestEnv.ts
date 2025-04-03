/**
 * Description : mobileWebTestEnv.ts - 📌 Mobile Web 테스트 환경 설정 및 정리
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import type { POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';

export async function initializeMobileWebTestEnv(poc: POCType): Promise<void> {
  const logger = Logger.getLogger(poc);

  try {
    logger.info(`[${poc.toUpperCase()}] Mobile Web 테스트 환경 설정 시작`);

    // TODO: 모바일 뷰포트 설정, 브라우저 에이전트 세팅 등

    logger.info(`[${poc.toUpperCase()}] Mobile Web 테스트 환경 설정 완료`);
  } catch (error) {
    logger.error(`[${poc.toUpperCase()}] Mobile Web 테스트 환경 설정 실패: ${error}`);
    throw error;
  }
}

export async function cleanupMobileWebTestEnv(poc: POCType): Promise<void> {
  const logger = Logger.getLogger(poc);

  try {
    logger.info(`[${poc.toUpperCase()}] Mobile Web 테스트 환경 정리 시작`);

    // TODO: 뷰포트 초기화, 세션 종료 등

    logger.info(`[${poc.toUpperCase()}] Mobile Web 테스트 환경 정리 완료`);
  } catch (error) {
    logger.error(`[${poc.toUpperCase()}] Mobile Web 테스트 환경 정리 실패: ${error}`);
    throw error;
  }
}
