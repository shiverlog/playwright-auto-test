import { Logger } from '@common/logger/customLogger';

const logger = Logger.getLogger('ios');

export async function handleIosSetup(): Promise<void> {
  try {
    logger.info('[iOS] iOS 환경 설정 시작');
    logger.info('[iOS] 설정 완료');
  } catch (error) {
    logger.error(`[iOS] 설정 실패: ${error}`);
    throw error;
  }
}

export async function handleIosTeardown(): Promise<void> {
  try {
    logger.info('[iOS] 테스트 종료');
  } catch (error) {
    logger.error(`[iOS] 종료 실패: ${error}`);
    throw error;
  }
}
