/**
 * Description : resultHandler.ts - 📌 테스트 결과 저장 핸들러
 * Author : Shiwoo Min
 * Date : 2025-03-30
 */
import { TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import { errorHandler } from '@common/handlers/errorHandler';
import { Logger } from '@common/logger/customLogger';
import type { POCKey, POCType } from '@common/types/platform-types';
import { ALL_POCS } from '@common/types/platform-types';
import * as fs from 'fs/promises';
import type { BrowserContext, Page } from 'playwright';
import type winston from 'winston';

/**
 * 테스트 결과 저장 핸들러 - 성공/실패 여부에 따라 파일 저장 또는 에러 핸들링
 */
export async function resultHandler(
  poc: POCType,
  status: 'PASS' | 'FAIL',
  details?: string,
  page?: Page,
): Promise<void> {
  const pocList: POCKey[] = poc === 'ALL' ? ALL_POCS : [poc as POCKey];
  const timestamp = new Date().toISOString();
  const logData = `[${timestamp}] [${status}] ${details || ''}\n`;

  await Promise.all(
    pocList.map(async (currentPOC: POCKey) => {
      const logger = Logger.getLogger(currentPOC) as winston.Logger;
      const results = TEST_RESULT_FILE_NAME(currentPOC);

      const testResultData = {
        timestamp,
        status,
        details: details || 'No additional details',
      };

      try {
        // 모든 경로 순회하여 결과 저장
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

        // 실패한 경우만 errorHandler 호출
        if (status === 'FAIL') {
          await errorHandler(page!, currentPOC, new Error(details || 'Test failed'), '테스트 실패');
        }
      } catch (err) {
        logger.error('테스트 결과 저장 중 오류 발생:', err);
      }
    }),
  );
}
