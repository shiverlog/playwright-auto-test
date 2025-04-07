/**
 * Description : scriptRunner.ts - 📌 테스트 스크립트 또는 자동화 작업을 실행하는 엔트리 포인트
 * Author : Shiwoo Min
 * Date : 2024-04-07
 */
import { POC_PATH, TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import { ALL_POCS } from '@common/types/platform-types';
import type { POCKey, POCType } from '@common/types/platform-types';
import { exec } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import type winston from 'winston';

// 각 POC에 대한 실행할 스크립트 설정
const CONFIG = (pocType: POCType) => ({
  poc: pocType,
  script: `.github/scripts/automation.sh`,
  description: `${pocType.toUpperCase()} POC 배치 실행`,
});

// 스크립트를 실행하는 함수
export const runBatchScript = (pocType: POCKey): Promise<void> => {
  const { script, description } = CONFIG(pocType);
  const logger = Logger.getLogger(pocType) as winston.Logger;

  logger.info(`${description}: ${script} 실행 중...`);

  const scriptDir = dirname(script);
  if (!existsSync(scriptDir)) {
    mkdirSync(scriptDir, { recursive: true });
  }

  if (!existsSync(script)) {
    logger.error(`${script} 파일이 존재하지 않습니다.`);
    return Promise.reject(new Error(`${script} 파일이 존재하지 않습니다.`));
  } else {
    logger.info(`${script} 파일이 이미 존재하여 기존 파일을 사용합니다.`);
  }

  const basePath = POC_PATH(pocType);
  const basePathString = Array.isArray(basePath) ? basePath[0] : basePath;
  const logFilePath = TEST_RESULT_FILE_NAME(pocType).log[0];

  return new Promise<void>((resolve, reject) => {
    exec(`bash ${script}`, (error, stdout, stderr) => {
      let logContent = `[${new Date().toISOString()}] [${pocType.toUpperCase()}] ${description}\n`;

      if (error) {
        logger.error(`오류 발생: ${error.message}`);
        logContent += `오류 발생: ${error.message}\n`;
      }

      if (stderr) {
        logger.error(`경고: ${stderr}`);
        logContent += `경고: ${stderr}\n`;
      }

      logger.info(`실행 완료:\n${stdout}`);
      logContent += `실행 결과:\n${stdout}\n\n`;

      writeFileSync(logFilePath, logContent, { flag: 'a' });
      resolve();
    });
  });
};

// POC를 병렬로 실행하는 함수
export const runAllBatchScripts = async (): Promise<void> => {
  try {
    await Promise.all(
      ALL_POCS.map((pocType: POCKey) => {
        const logger = Logger.getLogger(pocType) as winston.Logger;

        return runBatchScript(pocType).catch(error => {
          logger.error(`${pocType} POC 실행 중 오류 발생:`, error);
        });
      }),
    );

    const logger = Logger.getLogger('ALL') as winston.Logger;
    logger.info('모든 POC 배치 스크립트 실행 완료');
  } catch (error) {
    const logger = Logger.getLogger('ALL') as winston.Logger;
    logger.error('배치 스크립트 실행 중 오류 발생:', error);
  }
};

// 실행
runAllBatchScripts();
