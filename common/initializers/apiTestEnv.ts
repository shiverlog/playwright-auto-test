/**
 * Description : apiTestEnv.ts - 📌 API POC 테스트 환경 설정 및 정리
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import type { POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';

export async function initializeApiTestEnv(poc: POCType): Promise<void> {
  const logger = Logger.getLogger(poc);

  try {
    logger.info(`[${poc.toUpperCase()}] API 테스트 환경 설정 시작`);

    // TODO: API 관련 mock 데이터 초기화, 인증 토큰 발급 등 필요한 작업 수행

    logger.info(`[${poc.toUpperCase()}] API 테스트 환경 설정 완료`);
  } catch (error) {
    logger.error(`[${poc.toUpperCase()}] API 테스트 환경 설정 실패: ${error}`);
    throw error;
  }
}

export async function cleanupApiTestEnv(poc: POCType): Promise<void> {
  const logger = Logger.getLogger(poc);

  try {
    logger.info(`[${poc.toUpperCase()}] API 테스트 환경 정리 시작`);

    // TODO: 리소스 정리, 로그 저장, 연결 종료 등

    logger.info(`[${poc.toUpperCase()}] API 테스트 환경 정리 완료`);
  } catch (error) {
    logger.error(`[${poc.toUpperCase()}] API 테스트 환경 정리 실패: ${error}`);
    throw error;
  }
}
