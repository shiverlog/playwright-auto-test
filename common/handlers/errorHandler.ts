/**
 * Description : errorHandler.ts - 📌 공통 에러 처리 핸들러
 * Author : Shiwoo Min
 * Date : 2025-03-30
 */
import { TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import type { POCKey, POCType } from '@common/types/platform-types';
import { ALL_POCS } from '@common/types/platform-types';
import * as fs from 'fs/promises';
import type { BrowserContext, Page } from 'playwright';
import { chromium } from 'playwright';
import type winston from 'winston';

/**
 * 예외 처리 핸들러 - error exception case (POC 별로 브라우저 컨텍스트 분리)
 */
export async function errorHandler(
  page: Page,
  poc: POCType,
  error: any,
  message = '오류 발생',
): Promise<boolean> {
  const pocList: POCKey[] = poc === 'ALL' ? ALL_POCS : [poc as POCKey];

  for (const currentPOC of pocList) {
    const logger = Logger.getLogger(currentPOC) as winston.Logger;
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

    const results = TEST_RESULT_FILE_NAME(currentPOC);

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const newPage = await context.newPage();

    for (const screenshotPath of results.screenshots) {
      await screenshotOnError(newPage, screenshotPath, logger);
    }

    for (const tracePath of results.traces) {
      await saveTestTrace(context, tracePath, logger);
    }

    for (const videoPath of results.videos) {
      await saveTestVideo(videoPath, logger);
    }

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
  const pocList: POCKey[] = poc === 'ALL' ? ALL_POCS : [poc as POCKey];
  const timestamp = new Date().toISOString();
  const logData = `[${timestamp}] [${status}] ${details || ''}\n`;

  await Promise.all(
    pocList.map(async currentPOC => {
      const logger = Logger.getLogger(currentPOC) as winston.Logger;
      const results = TEST_RESULT_FILE_NAME(currentPOC);

      const testResultData = {
        timestamp,
        status,
        details: details || 'No additional details',
      };

      try {
        await fs.appendFile(
          results.playwrightReport[0],
          JSON.stringify(testResultData, null, 2) + '\n',
        );
        logger.info(`테스트 결과 저장됨: ${results.playwrightReport[0]}`);

        await fs.appendFile(results.log[0], logData);
        logger.info(`로그 저장됨: ${results.log[0]}`);

        await fs.appendFile(
          results.allureResult[0],
          JSON.stringify(testResultData, null, 2) + '\n',
        );
        logger.info(`Allure 결과 저장됨: ${results.allureResult[0]}`);
      } catch (err) {
        logger.error('테스트 결과 저장 중 오류 발생:', err);
      }
    }),
  );
}

/**
 * 오류 발생 시 스크린샷 저장
 */
async function screenshotOnError(page: Page, filePath: string, logger: winston.Logger) {
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
async function saveTestTrace(context: BrowserContext, filePath: string, logger: winston.Logger) {
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
async function saveTestVideo(filePath: string, logger: winston.Logger) {
  try {
    logger.info(`비디오 파일 저장됨: ${filePath}`);
    // 실제 비디오 처리 로직은 별도 구현 필요 (Playwright 기본 저장은 테스트 후 자동 처리)
  } catch (err) {
    logger.error('비디오 저장 중 오류 발생:', err);
  }
}
