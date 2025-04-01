import { ALL_POCS, POC_PATH, TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import type { POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import { exec } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

// 각 POC에 대한 실행할 스크립트 설정
const CONFIG = (pocType: POCType) => ({
  poc: pocType,
  script: `.github/scripts/automation.sh`,
  description: `${pocType.toUpperCase()} POC 배치 실행`,
});

// 스크립트를 실행하는 함수
export const runBatchScript = (pocType: POCType) => {
  const { script, description } = CONFIG(pocType);
  const logger = Logger.getLogger(pocType);

  logger.info(`${description}: ${script} 실행 중...`);

  // 스크립트 폴더 존재 확인 및 생성
  const scriptDir = dirname(script);
  if (!existsSync(scriptDir)) {
    mkdirSync(scriptDir, { recursive: true });
  }

  // 스크립트 파일이 존재하지 않으면 오류 처리
  if (!existsSync(script)) {
    logger.error(`${script} 파일이 존재하지 않습니다.`);
    return Promise.reject(new Error(`${script} 파일이 존재하지 않습니다.`));
  } else {
    logger.info(`${script} 파일이 이미 존재하여 기존 파일을 사용합니다.`);
  }

  // POC에 맞는 경로를 base로 사용 (POC_PATH를 base로 사용)
  const basePath = POC_PATH(pocType);

  // Ensure basePath is a string, not an array
  const basePathString = Array.isArray(basePath) ? basePath[0] : basePath;

  // 로그 파일 경로 설정 (POC별로 동적으로 생성)
  const logFilePath = TEST_RESULT_FILE_NAME(basePathString, pocType).log; // basePath를 전달

  // 실행 및 로그 중앙화
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

      // 각 POC별로 로그 파일에 기록 (추가모드)
      writeFileSync(logFilePath, logContent, { flag: 'a' });

      resolve(); // 작업 완료
    });
  });
};

// POC를 병렬로 실행하는 함수
export const runAllBatchScripts = async () => {
  try {
    // Promise.all을 사용하여 병렬 실행, 각 POC에 대한 오류는 개별적으로 처리
    await Promise.all(
      ALL_POCS.map(pocType => {
        const logger = Logger.getLogger(pocType); // POC별로 로거를 가져옴

        return runBatchScript(pocType).catch(error => {
          // 각 POC에 맞는 로거로 오류 기록
          logger.error(`${pocType} POC 실행 중 오류 발생:`, error);
        });
      }),
    );

    // 모든 배치 스크립트 실행 완료 로그
    const logger = Logger.getLogger(''); // 공통 로거 (전체 실행 완료를 위한)
    logger.info('모든 POC 배치 스크립트 실행 완료');
  } catch (error) {
    // 전체 오류 처리
    const logger = Logger.getLogger(''); // 공통 로거 (전체 오류 처리)
    logger.error('배치 스크립트 실행 중 오류 발생:', error);
  }
};

// 실행
runAllBatchScripts();
