import { Logger } from '@common/logger/customLogger';

const logger = Logger.getLogger('mw');

export async function handleMwSetup(): Promise<void> {
  try {
    logger.info('[MW] 모바일 웹 설정 시작');
    logger.info('[MW] 설정 완료');
  } catch (error) {
    logger.error(`[MW] 설정 실패: ${error}`);
    throw error;
  }
}

export async function handleMwTeardown(): Promise<void> {
  try {
    logger.info('[MW] 테스트 종료');
  } catch (error) {
    logger.error(`[MW] 종료 실패: ${error}`);
    throw error;
  }
}
