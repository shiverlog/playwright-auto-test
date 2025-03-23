import { Logger } from '@common/logger/customLogger';

const logger = Logger.getLogger('aos');

export async function handleAndroidSetup(): Promise<void> {
  try {
    logger.info('[AOS] Android 환경 설정 시작');
    logger.info('[AOS] 설정 완료');
  } catch (error) {
    logger.error(`[AOS] 설정 실패: ${error}`);
    throw error;
  }
}

export async function handleAndroidTeardown(): Promise<void> {
  try {
    logger.info('[AOS] Android 테스트 종료');
  } catch (error) {
    logger.error(`[AOS] 종료 실패: ${error}`);
    throw error;
  }
}
