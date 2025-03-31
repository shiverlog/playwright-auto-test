import dotenv from 'dotenv';
import 'tsconfig-paths/register';

import { ALL_POCS, POCType } from './common/constants/PathConstants';
import { PocSetupController } from './common/controllers/PocSetupController';
import { Logger } from './common/logger/customLogger';

dotenv.config();

async function globalTeardown() {
  const activePOC = (process.env.POC || '') as POCType;
  const pocList = activePOC === '' ? ALL_POCS : [activePOC];

  await Promise.all(
    pocList.map(async poc => {
      const logger = Logger.getLogger(poc);
      logger.info(`[GLOBAL TEARDOWN] [${poc.toUpperCase()}] 테스트 종료 처리 시작`);

      try {
        await PocSetupController.teardown(poc);
        logger.info(`[GLOBAL TEARDOWN] [${poc.toUpperCase()}] 종료 처리 완료`);
      } catch (err) {
        logger.error(`[GLOBAL TEARDOWN] [${poc.toUpperCase()}] 종료 처리 실패: ${err}`);
        throw err;
      }
    }),
  );
}

export default globalTeardown;
