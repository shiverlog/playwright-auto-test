import { ALL_POCS } from '@common/constants/PathConstants.js';
import type { POCType } from '@common/constants/PathConstants.js';
import { PocSetupController } from '@common/controllers/PocSetupController.js';
import { Logger } from '@common/logger/customLogger.js';
import dotenv from 'dotenv';

dotenv.config();

async function globalSetup() {
  const activePOC = (process.env.POC || '') as POCType;
  const pocList = activePOC === '' ? ALL_POCS : [activePOC];

  await Promise.all(
    pocList.map(async poc => {
      const logger = Logger.getLogger(poc);
      logger.info(`[GLOBAL SETUP] [${poc.toUpperCase()}] 테스트 환경 설정 시작`);

      try {
        await PocSetupController.setup(poc);
        logger.info(`[GLOBAL SETUP] [${poc.toUpperCase()}] 테스트 환경 설정 완료`);
      } catch (err) {
        logger.error(`[GLOBAL SETUP] [${poc.toUpperCase()}] 설정 실패: ${err}`);
        throw err;
      }
    }),
  );
}

export default globalSetup;
