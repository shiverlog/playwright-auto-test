import { ALL_POCS, POCType } from '@common/constants/PathConstants';
import { handleAndroidSetup, handleAndroidTeardown } from '@common/controllers/AndroidController';
import { handleApiSetup, handleApiTeardown } from '@common/controllers/ApiController';
import { handleIosSetup, handleIosTeardown } from '@common/controllers/IosController';
import { handleMwSetup, handleMwTeardown } from '@common/controllers/MobileWebController';
import { handlePcSetup, handlePcTeardown } from '@common/controllers/PcController';
import { Logger } from '@common/logger/customLogger';

type PocHandlers = {
  setup: (poc: POCType) => Promise<void>;
  teardown: (poc: POCType) => Promise<void>;
};

const POC_HANDLER_MAP: Record<Exclude<POCType, ''>, PocHandlers> = {
  pc: {
    setup: poc => handlePcSetup(poc),
    teardown: poc => handlePcTeardown(poc),
  },
  mw: {
    setup: poc => handleMwSetup(poc),
    teardown: poc => handleMwTeardown(poc),
  },
  aos: {
    setup: poc => handleAndroidSetup(poc),
    teardown: poc => handleAndroidTeardown(poc),
  },
  ios: {
    setup: poc => handleIosSetup(poc),
    teardown: poc => handleIosTeardown(poc),
  },
  api: {
    setup: poc => handleApiSetup(poc),
    teardown: poc => handleApiTeardown(poc),
  },
};

export class PocSetupController {
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
          await handler.setup(current);
          logger.info(`[SETUP] ${current.toUpperCase()} 완료`);
        } catch (error: any) {
          logger.error(`[SETUP] ${current.toUpperCase()} 실패 - ${error.message || error}`);
          throw error;
        }
      }),
    );
  }

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
