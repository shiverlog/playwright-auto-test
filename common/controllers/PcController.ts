import type { POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';

export async function handlePcSetup(poc: POCType): Promise<void> {
  const logger = Logger.getLogger(poc);
  try {
    logger.info(`[${poc.toUpperCase()}] PC 테스트 설정 시작`);
    logger.info(`[${poc.toUpperCase()}] 설정 완료`);
  } catch (error) {
    logger.error(`[${poc.toUpperCase()}] 설정 실패: ${error}`);
    throw error;
  }
}

export async function handlePcTeardown(poc: POCType): Promise<void> {
  const logger = Logger.getLogger(poc);
  try {
    logger.info(`[${poc.toUpperCase()}] 테스트 종료 시작`);
    logger.info(`[${poc.toUpperCase()}] 테스트 종료 완료`);
  } catch (error) {
    logger.error(`[${poc.toUpperCase()}] 종료 실패: ${error}`);
    throw error;
  }
}
