import { ALL_POCS, POCType, TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import { errorHandler } from '@common/handlers/errorHandler';
import { Logger } from '@common/logger/customLogger';
import * as fs from 'fs/promises';
import type { BrowserContext, Page } from 'playwright';

/**
 * 테스트 결과 저장 핸들러 - POC별 또는 전체 저장 지원 (병렬 실행 고려)
 */
export async function resultHandler(
  poc: POCType,
  status: 'PASS' | 'FAIL',
  details?: string,
  page?: Page, // 페이지를 추가로 받을 수 있도록
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
        if (status === 'PASS') {
          // 성공한 경우 결과 저장
          await fs.writeFile(results.playwrightReport, JSON.stringify(testResultData, null, 2));
          logger.info(`테스트 결과 저장됨: ${results.playwrightReport}`);

          await fs.appendFile(results.log, logData);
          logger.info(`로그 저장됨: ${results.log}`);

          await fs.writeFile(results.allureResult, JSON.stringify(testResultData, null, 2));
          logger.info(`Allure 결과 저장됨: ${results.allureResult}`);
        } else {
          // 실패한 경우 errorHandler 호출
          await errorHandler(page!, currentPOC, new Error(details || 'Test failed'), '테스트 실패');
        }
      } catch (err) {
        logger.error('테스트 결과 저장 중 오류 발생:', err);
      }
    }),
  );
}
