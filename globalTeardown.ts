/**
 * Description : globalTeardown.ts - 📌 Playwright 테스트 실행 후 정리 작업
 * Author : Shiwoo Min
 * Date : 2025-04-02
 */
import { PocInitializer } from '@common/initializers/PocInitializer.js';
import { Logger } from '@common/logger/customLogger.js';
import type { POCKey, POCType } from '@common/types/platform-types.js';
import { ALL_POCS } from '@common/types/platform-types.js';
import dotenv from 'dotenv';
import type winston from 'winston';

dotenv.config();

async function globalTeardown() {
  // 환경변수로부터 활성화할 POCType을 가져옴
  const activePOC = (process.env.POC || '') as POCType;

  // 'ALL'일 경우 전체 POCKey 대상으로 실행
  const pocList: POCKey[] = activePOC === 'ALL' ? ALL_POCS : [activePOC as POCKey];

  // 각 POC에 대해 teardown 병렬 실행
  await Promise.all(
    pocList.map(async poc => {
      const logger = Logger.getLogger(poc) as winston.Logger;
      logger.info(`[GLOBAL TEARDOWN] [${poc.toUpperCase()}] 테스트 종료 처리 시작`);

      try {
        await PocInitializer.teardown(poc);
        logger.info(`[GLOBAL TEARDOWN] [${poc.toUpperCase()}] 종료 처리 완료`);
      } catch (err) {
        logger.error(`[GLOBAL TEARDOWN] [${poc.toUpperCase()}] 종료 처리 실패: ${err}`);
        throw err;
      }
    }),
  );
}

export default globalTeardown;
