/**
 * Description : iosTestEnv.ts - 📌 iOS POC 테스트 환경 설정 및 정리
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import type { POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';

export async function initializeIosTestEnv(poc: POCType): Promise<void> {
  const logger = Logger.getLogger(poc);

  try {
    logger.info(`[${poc.toUpperCase()}] iOS 테스트 환경 설정 시작`);

    // TODO: iOS 앱 설치, 캐시 초기화, 디바이스 연결 등 수행

    logger.info(`[${poc.toUpperCase()}] iOS 테스트 환경 설정 완료`);
  } catch (error) {
    logger.error(`[${poc.toUpperCase()}] iOS 테스트 환경 설정 실패: ${error}`);
    throw error;
  }
}

export async function cleanupIosTestEnv(poc: POCType): Promise<void> {
  const logger = Logger.getLogger(poc);

  try {
    logger.info(`[${poc.toUpperCase()}] iOS 테스트 환경 정리 시작`);

    // TODO: Appium 세션 정리, 로그 수집 등

    logger.info(`[${poc.toUpperCase()}] iOS 테스트 환경 정리 완료`);
  } catch (error) {
    logger.error(`[${poc.toUpperCase()}] iOS 테스트 환경 정리 실패: ${error}`);
    throw error;
  }
}
