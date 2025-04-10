/**
 * Description : ResultHandler.ts - 테스트 결과 저장 및 오류 처리 클래스 (POCEnv 기반)
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */
import { TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import type { POCKey } from '@common/types/platform-types';
import { POCEnv } from '@common/utils/env/POCEnv';
import * as fs from 'fs/promises';
import { type BrowserContext, chromium, type Page } from 'playwright';
import type winston from 'winston';

export class ResultHandler {
  /**
   * 테스트 결과 저장 메서드
   */
  public static async saveTestResult(
    status: 'PASS' | 'FAIL',
    details?: string,
    page?: Page,
  ): Promise<void> {
    const pocList = POCEnv.getList();
    const timestamp = new Date().toISOString();
    const logData = `[${timestamp}] [${status}] ${details || ''}\n`;

    for (const poc of pocList) {
      const pocKey = poc as POCKey;
      const logger = Logger.getLogger(pocKey) as winston.Logger;
      const results = TEST_RESULT_FILE_NAME(pocKey);

      const testResultData = {
        timestamp,
        status,
        details: details || 'No additional details',
      };

      try {
        for (const path of results.playwrightReport) {
          await fs.writeFile(path, JSON.stringify(testResultData, null, 2));
          logger.info(`테스트 결과 저장됨: ${path}`);
        }

        for (const path of results.log) {
          await fs.appendFile(path, logData);
          logger.info(`로그 저장됨: ${path}`);
        }

        for (const path of results.allureResult) {
          await fs.writeFile(path, JSON.stringify(testResultData, null, 2));
          logger.info(`Allure 결과 저장됨: ${path}`);
        }

        if (status === 'FAIL' && page) {
          await ResultHandler.handleError(
            page,
            pocKey,
            new Error(details || 'Test failed'),
            '테스트 실패',
          );
        }
      } catch (err) {
        logger.error('테스트 결과 저장 중 오류 발생:', err);
      }
    }
  }

  /**
   * 오류 처리 및 관련 리소스 저장 (스크린샷, 트레이스, 비디오)
   */
  private static async handleError(
    page: Page,
    poc: POCKey,
    error: Error,
    message: string,
  ): Promise<void> {
    const logger = Logger.getLogger(poc) as winston.Logger;

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
        logger.warn(`예상치 못한 예외 발생: ${error.name}`);
    }

    const results = TEST_RESULT_FILE_NAME(poc);

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const newPage = await context.newPage();

    for (const screenshotPath of results.screenshots) {
      await ResultHandler.screenshotOnError(newPage, screenshotPath, logger);
    }

    for (const tracePath of results.traces) {
      await ResultHandler.saveTestTrace(context, tracePath, logger);
    }

    for (const videoPath of results.videos) {
      await ResultHandler.saveTestVideo(videoPath, logger);
    }

    await context.close();
    await browser.close();
  }

  /**
   * 오류 발생 시 스크린샷 저장
   */
  private static async screenshotOnError(page: Page, filePath: string, logger: winston.Logger) {
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
  private static async saveTestTrace(
    context: BrowserContext,
    filePath: string,
    logger: winston.Logger,
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
  private static async saveTestVideo(filePath: string, logger: winston.Logger) {
    try {
      logger.info(`비디오 파일 저장됨: ${filePath}`);
    } catch (err) {
      logger.error('비디오 저장 중 오류 발생:', err);
    }
  }
}
