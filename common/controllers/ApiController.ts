import { Logger } from '@common/logger/customLogger';

const logger = Logger.getLogger('api');

export async function handleApiSetup(): Promise<void> {
  try {
    logger.info('[API] API 환경 설정 시작');
    logger.info('[API] API 환경 설정 완료');
  } catch (error) {
    logger.error(`[API] 설정 실패: ${error}`);
    throw error;
  }
}

export async function handleApiTeardown(): Promise<void> {
  try {
    logger.info('[API] API 테스트 종료');
  } catch (error) {
    logger.error(`[API] 종료 실패: ${error}`);
    throw error;
  }
}
