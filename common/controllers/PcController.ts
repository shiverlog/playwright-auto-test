import { Logger } from '@common/logger/customLogger';

const logger = Logger.getLogger('pc');

export async function handlePcSetup(): Promise<void> {
  try {
    logger.info('[PC] 테스트 설정 시작');
    logger.info('[PC] 테스트 설정 완료');
  } catch (error) {
    logger.error(`[PC] 설정 실패: ${error}`);
    throw error;
  }
}

export async function handlePcTeardown(): Promise<void> {
  try {
    logger.info('[PC] 테스트 종료 시작');
    logger.info('[PC] 테스트 종료 완료');
  } catch (error) {
    logger.error(`[PC] 종료 실패: ${error}`);
    throw error;
  }
}
