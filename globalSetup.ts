/**
 * Description : globalSetup.ts - 📌 Playwright 테스트 실행 전 공통 환경 준비
 * Author : Shiwoo Min
 * Date : 2025-04-01
 */
import { ALL_POCS } from '@common/constants/PathConstants.js';
import type { POCType } from '@common/constants/PathConstants.js';
import { PocSetupController } from '@common/controllers/PocSetupController.js';
import { Logger } from '@common/logger/customLogger.js';
import dotenv from 'dotenv';

dotenv.config();

async function globalSetup() {
  // 현재 활성화된 POC (또는 전체 POC)
  const activePOC = (process.env.POC || '') as POCType;
  const pocList = activePOC === '' ? ALL_POCS : [activePOC];

  // 각 POC에 대해 비동기 병렬로 setup 진행
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
