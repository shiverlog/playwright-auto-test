/**
 * Description : errorHandler.ts - 📌 공통 에러 처리 핸들러
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { ALL_POCS, TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import type { POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import * as fs from 'fs/promises';
import type { BrowserContext, Page } from 'playwright';
import { chromium } from 'playwright';

/**
 * 예외 처리 핸들러 - error exception case (POC 별로 브라우저 컨텍스트 분리)
 */
export async function errorHandler(
  page: Page,
  poc: POCType,
  error: any,
  message = '오류 발생',
): Promise<boolean> {
  const pocList = poc === '' ? ALL_POCS : [poc];

  for (const currentPOC of pocList) {
    const logger = Logger.getLogger(currentPOC);
    logger.error(`${message}: ${error.message}`);
    logger.error(error.stack);

    switch (error.name) {
      case 'TimeoutError':
        logger.warn('타임아웃이 발생했습니다.');
        break;
      case 'NoSuchElementError':
        logger.warn('요소를 찾을 수 없습니다.');
        break;
      case 'ElementNotVisibleError':
        logger.warn('요소가 보이지 않습니다.');
        break;
      case 'ElementNotInteractableError':
        logger.warn('해당 요소와 상호작용할 수 없습니다.');
        break;
      case 'SelectorError':
        logger.warn('잘못된 선택자가 사용되었습니다.');
        break;
      case 'NavigationError':
        logger.warn('페이지 네비게이션 중 오류가 발생했습니다.');
        break;
      case 'AssertionError':
        logger.warn('테스트 검증에 실패하였습니다. (Assertion Error)');
        break;
      case 'PageError':
        logger.warn('페이지에서 오류가 발생했습니다.');
        break;
      default:
        logger.error(`예상치 못한 예외 발생: ${error.name}`);
        break;
    }

    const results = TEST_RESULT_FILE_NAME(process.cwd(), currentPOC);

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const newPage = await context.newPage();

    await screenshotOnError(newPage, results.screenshots, logger);
    await saveTestTrace(context, results.traces, logger);
    await saveTestVideo(results.videos, logger);

    await context.close();
    await browser.close();
  }

  return false;
}

/**
 * 테스트 결과 저장 핸들러 - POC별 또는 전체 저장 지원
 */
export async function resultHandler(
  poc: POCType,
  status: 'PASS' | 'FAIL',
  details?: string,
): Promise<void> {
  const pocList = poc === '' ? ALL_POCS : [poc];
  const timestamp = new Date().toISOString();
  const logData = `[${timestamp}] [${status}] ${details || ''}\n`;

  await Promise.all(
    pocList.map(async currentPOC => {
      const logger = Logger.getLogger(currentPOC);
      const results = TEST_RESULT_FILE_NAME(process.cwd(), currentPOC);

      const testResultData = {
        timestamp,
        status,
        details: details || 'No additional details',
      };

      try {
        // 결과를 덮어쓰지 않고, 파일을 덧붙이는 방식으로 변경
        // writeFile -> appendFile
        await fs.appendFile(
          results.playwrightReport,
          JSON.stringify(testResultData, null, 2) + '\n',
        );
        logger.info(`테스트 결과 저장됨: ${results.playwrightReport}`);

        await fs.appendFile(results.log, logData);
        logger.info(`로그 저장됨: ${results.log}`);

        await fs.appendFile(results.allureResult, JSON.stringify(testResultData, null, 2) + '\n');
        logger.info(`Allure 결과 저장됨: ${results.allureResult}`);
      } catch (err) {
        logger.error('테스트 결과 저장 중 오류 발생:', err);
      }
    }),
  );
}

/**
 * 오류 발생 시 스크린샷 저장
 */
async function screenshotOnError(
  page: Page,
  filePath: string,
  logger: ReturnType<typeof Logger.getLogger>,
) {
  try {
    await page.screenshot({ path: filePath, fullPage: true });
    logger.info(`스크린샷 저장됨: ${filePath}`);
  } catch (err) {
    logger.error('스크린샷 캡처 중 오류 발생:', err);
  }
}

/**
 * 오류 발생 시 트레이스 저장
 */
async function saveTestTrace(
  context: BrowserContext,
  filePath: string,
  logger: ReturnType<typeof Logger.getLogger>,
) {
  try {
    await context.tracing.stop({ path: filePath });
    logger.info(`트레이스 파일 저장됨: ${filePath}`);
  } catch (err) {
    logger.error('트레이스 저장 중 오류 발생:', err);
  }
}

/**
 * 오류 발생 시 비디오 저장
 */
async function saveTestVideo(filePath: string, logger: ReturnType<typeof Logger.getLogger>) {
  try {
    logger.info(`비디오 파일 저장됨: ${filePath}`);
  } catch (err) {
    logger.error('비디오 저장 중 오류 발생:', err);
  }
}
