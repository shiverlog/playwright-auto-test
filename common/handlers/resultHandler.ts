/**
 * Description : resultHandler.ts - 📌 공통 테스트 처리 핸들러
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import {
  ALLURE_RESULT_PATH,
  LOG_PATH,
  POCType,
  TEST_RESULT_PATH,
} from '@common/constants/constants';
import { logger } from '@common/logger/customLogger';
import * as fs from 'fs';
import path from 'path';

/**
 * 테스트 결과 (LOG, TEST_RESULT, ALLURE_RESULT) 저장 핸들러
 * @param poc 실행 환경 (pc, mw, aos, ios, api)
 * @param status 테스트 결과 ("PASS" 또는 "FAIL")
 * @param details 추가 정보 (예: 오류 메시지 또는 실행 로그)
 */
export async function resultHandler(poc: POCType, status: 'PASS' | 'FAIL', details?: string) {
  try {
    const timestamp = new Date().toISOString();
    const logData = `[${timestamp}] [${status}] ${details || ''}\n`;

    // 로그 저장
    const logFilePath = path.join(LOG_PATH, `${poc}_log.txt`);
    fs.appendFileSync(logFilePath, logData);
    logger.info(`로그 저장됨: ${logFilePath}`);

    // 테스트 결과 저장
    const testResultFilePath = path.join(TEST_RESULT_PATH, `${poc}_test-result.json`);
    const testResultData = { timestamp, status, details: details || 'No additional details' };
    fs.writeFileSync(testResultFilePath, JSON.stringify(testResultData, null, 2));
    logger.info(`테스트 결과 저장됨: ${testResultFilePath}`);

    // Allure 결과 저장
    const allureResultFilePath = path.join(ALLURE_RESULT_PATH, `${poc}_allure-result.json`);
    fs.writeFileSync(allureResultFilePath, JSON.stringify(testResultData, null, 2));
    logger.info(`Allure 결과 저장됨: ${allureResultFilePath}`);
  } catch (err) {
    logger.error('테스트 결과 저장 중 오류 발생:', err);
  }
}
