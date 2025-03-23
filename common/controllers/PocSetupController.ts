import { ALL_POCS, POCType } from '@common/constants/PathConstants';
import { handleAndroidSetup, handleAndroidTeardown } from '@common/controllers/AndroidController';
import { handleApiSetup, handleApiTeardown } from '@common/controllers/ApiController';
import { handleIosSetup, handleIosTeardown } from '@common/controllers/IosController';
import { handleMwSetup, handleMwTeardown } from '@common/controllers/MobileWebController';
import { handlePcSetup, handlePcTeardown } from '@common/controllers/PcController';
import { Logger } from '@common/logger/customLogger';

/**
 * POC 환경 설정 컨트롤러
 */
export class PocSetupController {
  /**
   * 전체 또는 특정 POC에 대해 setup 수행 (async)
   */
  public static async setup(poc: POCType): Promise<void> {
    const pocList = poc === '' ? ALL_POCS : [poc];

    for (const current of pocList) {
      const logger = Logger.getLogger(current);
      logger.info(`[SETUP] ${current.toUpperCase()} 시작`);

      try {
        switch (current) {
          case 'pc':
            await handlePcSetup();
            break;
          case 'mw':
            await handleMwSetup();
            break;
          case 'aos':
            await handleAndroidSetup();
            break;
          case 'ios':
            await handleIosSetup();
            break;
          case 'api':
            await handleApiSetup();
            break;
          default:
            logger.warn(`[SETUP] 알 수 없는 POC: ${current}`);
        }
        logger.info(`[SETUP] ${current.toUpperCase()} 완료`);
      } catch (error: any) {
        logger.error(`[SETUP] ${current.toUpperCase()} 실패 - ${error.message || error}`);
      }
    }
  }

  /**
   * 전체 또는 특정 POC에 대해 teardown 수행 (async)
   */
  public static async teardown(poc: POCType): Promise<void> {
    const pocList = poc === '' ? ALL_POCS : [poc];

    for (const current of pocList) {
      const logger = Logger.getLogger(current);
      logger.info(`[TEARDOWN] ${current.toUpperCase()} 시작`);

      try {
        switch (current) {
          case 'pc':
            await handlePcTeardown();
            break;
          case 'mw':
            await handleMwTeardown();
            break;
          case 'aos':
            await handleAndroidTeardown();
            break;
          case 'ios':
            await handleIosTeardown();
            break;
          case 'api':
            await handleApiTeardown();
            break;
          default:
            logger.warn(`[TEARDOWN] 알 수 없는 POC: ${current}`);
        }
        logger.info(`[TEARDOWN] ${current.toUpperCase()} 완료`);
      } catch (error: any) {
        logger.error(`[TEARDOWN] ${current.toUpperCase()} 실패 - ${error.message || error}`);
      }
    }
  }
}
