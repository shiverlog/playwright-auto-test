/**
 * Description : resultHandler.ts - 📌 공통 테스트 처리 핸들러
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { ALL_POCS, POCType, TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import * as fs from 'fs/promises';
import { BrowserContext, Page, chromium } from 'playwright';

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
    const log = Logger.getLogger(currentPOC);
    log.error(`${message}: ${error.message}`);
    log.error(error.stack);

    switch (error.name) {
      case 'TimeoutError':
        log.warn('타임아웃이 발생했습니다.');
        break;
      case 'NoSuchElementError':
        log.warn('요소를 찾을 수 없습니다.');
        break;
      case 'ElementNotVisibleError':
        log.warn('요소가 보이지 않습니다.');
        break;
      case 'ElementNotInteractableError':
        log.warn('해당 요소와 상호작용할 수 없습니다.');
        break;
      case 'SelectorError':
        log.warn('잘못된 선택자가 사용되었습니다.');
        break;
      case 'NavigationError':
        log.warn('페이지 네비게이션 중 오류가 발생했습니다.');
        break;
      case 'AssertionError':
        log.warn('테스트 검증에 실패하였습니다. (Assertion Error)');
        break;
      case 'PageError':
        log.warn('페이지에서 오류가 발생했습니다.');
        break;
      default:
        log.error(`예상치 못한 예외 발생: ${error.name}`);
        break;
    }

    const results = TEST_RESULT_FILE_NAME(process.cwd(), currentPOC);

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const newPage = await context.newPage();

    await screenshotOnError(newPage, results.screenshots, log);
    await saveTestTrace(context, results.traces, log);
    await saveTestVideo(results.videos, log);

    await context.close();
    await browser.close();
  }

  return false;
}

/**
 * 테스트 결과 저장 핸들러 - POC별 또는 전체 저장 지원 (병렬 실행 고려)
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
      const log = Logger.getLogger(currentPOC);
      const results = TEST_RESULT_FILE_NAME(process.cwd(), currentPOC);

      const testResultData = {
        timestamp,
        status,
        details: details || 'No additional details',
      };

      try {
        await fs.writeFile(results.playwrightReport, JSON.stringify(testResultData, null, 2));
        log.info(`테스트 결과 저장됨: ${results.playwrightReport}`);

        await fs.appendFile(results.log, logData);
        log.info(`로그 저장됨: ${results.log}`);

        await fs.writeFile(results.allureResult, JSON.stringify(testResultData, null, 2));
        log.info(`Allure 결과 저장됨: ${results.allureResult}`);
      } catch (err) {
        log.error('테스트 결과 저장 중 오류 발생:', err);
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
  log: ReturnType<typeof Logger.getLogger>,
) {
  try {
    await page.screenshot({ path: filePath, fullPage: true });
    log.info(`스크린샷 저장됨: ${filePath}`);
  } catch (err) {
    log.error('스크린샷 캡처 중 오류 발생:', err);
  }
}

/**
 * 오류 발생 시 트레이스 저장
 */
async function saveTestTrace(
  context: BrowserContext,
  filePath: string,
  log: ReturnType<typeof Logger.getLogger>,
) {
  try {
    await context.tracing.stop({ path: filePath });
    log.info(`트레이스 파일 저장됨: ${filePath}`);
  } catch (err) {
    log.error('트레이스 저장 중 오류 발생:', err);
  }
}

/**
 * 오류 발생 시 비디오 저장 (경로만 로깅)
 */
async function saveTestVideo(filePath: string, log: ReturnType<typeof Logger.getLogger>) {
  try {
    log.info(`비디오 파일 저장됨: ${filePath}`);
  } catch (err) {
    log.error('비디오 저장 중 오류 발생:', err);
  }
}
