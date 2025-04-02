/**
 * Description : globalTeardown.ts - 📌 Playwright 테스트 실행 후 정리 작업
 * Author : Shiwoo Min
 * Date : 2025-04-02
 */
import type { POCType } from '@common/constants/PathConstants.js';
import { ALL_POCS } from '@common/constants/PathConstants.js';
import { PocSetupController } from '@common/controllers/PocSetupController.js';
import { Logger } from '@common/logger/customLogger.js';
import dotenv from 'dotenv';

dotenv.config();

async function globalTeardown() {
  const activePOC = (process.env.POC || '') as POCType;
  const pocList = activePOC === '' ? ALL_POCS : [activePOC];

  // 각 POC에 대해 비동기 병렬로 teardown 진행
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
