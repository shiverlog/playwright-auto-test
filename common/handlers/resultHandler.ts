/**
 * Description : resultHandler.ts - 📌 공통 테스트 처리 핸들러
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { POCType, getLogFile, getTestResultFile } from '@common/config/config';
import { logger } from '@common/logger/customLogger';
import * as fs from 'fs';

/**
 * 테스트 결과 (LOG & TEST_RESULT) 저장
 * @param poc 실행 환경 (pc, mw, aos, ios, api)
 * @param status 테스트 결과 ("PASS" 또는 "FAIL")
 * @param details 추가 정보 (예: 오류 메시지 또는 실행 로그)
 */
export async function saveResult(poc: POCType, status: 'PASS' | 'FAIL', details?: string) {
  try {
    // 로그 저장
    const logFilePath = getLogFile(poc);
    const logData = `[${new Date().toISOString()}] [${status}] ${details || ''}\n`;
    fs.appendFileSync(logFilePath, logData);
    logger.info(`로그 저장됨: ${logFilePath}`);

    // 테스트 결과 저장
    const testResultFilePath = getTestResultFile(poc);
    const testResultData = {
      timestamp: new Date().toISOString(),
      status: status,
      details: details || 'No additional details',
    };
    fs.writeFileSync(testResultFilePath, JSON.stringify(testResultData, null, 2));
    logger.info(`테스트 결과 저장됨: ${testResultFilePath}`);
  } catch (err) {
    logger.error('테스트 로그 저장 중 오류 발생:', err);
  }
}
