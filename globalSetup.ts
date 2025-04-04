import { PocInitializer } from '@common/initializers/PocInitializer.js';
import { Logger } from '@common/logger/customLogger.js';
import type { POCKey, POCType } from '@common/types/platform-types.js';
import { ALL_POCS } from '@common/types/platform-types.js';
import dotenv from 'dotenv';
import type winston from 'winston';

dotenv.config();

async function globalSetup() {
  // 환경변수로부터 활성화할 POC를 불러옴
  const activePOC = (process.env.POC || '') as POCType;

  // 'ALL' 혹은 공백일 경우 전체 POC 처리
  const pocList: POCKey[] = activePOC === 'ALL' ? ALL_POCS : [activePOC as POCKey];

  // 병렬로 각 POC에 대해 세팅
  await Promise.all(
    pocList.map(async poc => {
      const logger = Logger.getLogger(poc) as winston.Logger;
      logger.info(`[GLOBAL SETUP] [${poc.toUpperCase()}] 테스트 환경 설정 시작`);

      try {
        await PocInitializer.setup(poc);
        logger.info(`[GLOBAL SETUP] [${poc.toUpperCase()}] 테스트 환경 설정 완료`);
      } catch (err) {
        logger.error(`[GLOBAL SETUP] [${poc.toUpperCase()}] 설정 실패: ${err}`);
        throw err;
      }
    }),
  );
}

export default globalSetup;
