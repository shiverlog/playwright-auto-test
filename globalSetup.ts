import dotenv from 'dotenv';
import 'tsconfig-paths/register';

import { ALL_POCS, POCType } from './common/constants/PathConstants';
import { PocSetupController } from './common/controllers/PocSetupController';
import { Logger } from './common/logger/customLogger';

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
