/**
 * Description : PocInitializer.ts - 📌 각 POC 테스트 환경 초기화 및 정리 매니저
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import { ALL_POCS } from '@common/constants/PathConstants';
import type { POCType } from '@common/constants/PathConstants';
import {
  cleanupAndroidTestEnv,
  initializeAndroidTestEnv,
} from '@common/initializers/androidTestEnv.js';
import { cleanupApiTestEnv, initializeApiTestEnv } from '@common/initializers/apiTestEnv.js';
import { cleanupOldFiles } from '@common/initializers/cleanupOldFiles';
import { cleanupIosTestEnv, initializeIosTestEnv } from '@common/initializers/iosTestEnv.js';
import {
  cleanupMobileWebTestEnv,
  initializeMobileWebTestEnv,
} from '@common/initializers/mobileWebTestEnv.js';
import { cleanupPcTestEnv, initializePcTestEnv } from '@common/initializers/pcTestEnv.js';
import { Logger } from '@common/logger/customLogger';

type PocHandlers = {
  setup: (poc: POCType) => Promise<void>;
  teardown: (poc: POCType) => Promise<void>;
};

// 각 POC 타입에 따라 초기화/정리 핸들러 맵 구성
const POC_HANDLER_MAP: Record<Exclude<POCType, ''>, PocHandlers> = {
  pc: {
    setup: initializePcTestEnv,
    teardown: cleanupPcTestEnv,
  },
  mw: {
    setup: initializeMobileWebTestEnv,
    teardown: cleanupMobileWebTestEnv,
  },
  aos: {
    setup: initializeAndroidTestEnv,
    teardown: cleanupAndroidTestEnv,
  },
  ios: {
    setup: initializeIosTestEnv,
    teardown: cleanupIosTestEnv,
  },
  api: {
    setup: initializeApiTestEnv,
    teardown: cleanupApiTestEnv,
  },
};

// POC 테스트 환경 초기화/정리 전용 클래스
export class PocInitializer {
  // POC별 초기화 작업
  public static async setup(poc: POCType): Promise<void> {
    const pocList = poc === '' ? ALL_POCS : [poc];

    await Promise.all(
      pocList.map(async current => {
        const logger = Logger.getLogger(current);
        logger.info(`[SETUP] ${current.toUpperCase()} 시작`);

        const handler = POC_HANDLER_MAP[current];
        if (!handler) {
          logger.warn(`[SETUP] 알 수 없는 POC: ${current}`);
          return;
        }

        try {
          // 오래된 파일 삭제
          await cleanupOldFiles(current);
          // POC-specific 환경 초기화
          await handler.setup(current);
          logger.info(`[SETUP] ${current.toUpperCase()} 완료`);
        } catch (error: any) {
          logger.error(`[SETUP] ${current.toUpperCase()} 실패 - ${error.message || error}`);
          throw error;
        }
      }),
    );
  }

  // POC별 정리 작업
  public static async teardown(poc: POCType): Promise<void> {
    const pocList = poc === '' ? ALL_POCS : [poc];

    await Promise.all(
      pocList.map(async current => {
        const logger = Logger.getLogger(current);
        logger.info(`[TEARDOWN] ${current.toUpperCase()} 시작`);

        const handler = POC_HANDLER_MAP[current];
        if (!handler) {
          logger.warn(`[TEARDOWN] 알 수 없는 POC: ${current}`);
          return;
        }

        try {
          await handler.teardown(current);
          logger.info(`[TEARDOWN] ${current.toUpperCase()} 완료`);
        } catch (error: any) {
          logger.error(`[TEARDOWN] ${current.toUpperCase()} 실패 - ${error.message || error}`);
          throw error;
        }
      }),
    );
  }
}
