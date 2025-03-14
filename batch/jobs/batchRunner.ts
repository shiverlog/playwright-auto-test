/**
 * Description : batchRunner.ts - 📌 POC 타입별 배치 스크립트를 동적으로 생성/실행 후, 중앙에서 관리
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { BATCH_LOG_FILE_NAME, POCType } from '@common/constants/PathConstants';
import { logger } from '@common/logger/customLogger';
import { exec } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

// 각 POC에 대한 실행할 스크립트 설정
const CONFIG = (pocType: POCType) => ({
  poc: pocType,
  script: `batch/automation_${pocType}.sh`,
  description: `${pocType.toUpperCase()} POC 배치 실행`,
});

// 실행 시 입력된 POCType을 가져옴
const pocType: POCType | undefined = process.argv[2] as POCType;
const validPOCTypes: POCType[] = ['pc', 'mw', 'aos', 'ios', 'api'];

if (!pocType || !validPOCTypes.includes(pocType)) {
  logger.error('잘못된 POCType 입니다. 사용 가능한 값: pc | mw | aos | ios | api');
  process.exit(1);
}

const { script, description } = CONFIG(pocType);
logger.info(`${description}: ${script} 실행 중...`);

// 스크립트 폴더 존재 확인 및 생성
const scriptDir = dirname(script);
if (!existsSync(scriptDir)) {
  mkdirSync(scriptDir, { recursive: true });
}

// 스크립트 파일 동적 생성
if (!existsSync(script)) {
  logger.info(`${script} 파일이 존재하지 않아 새로 생성합니다.`);

  const batchScriptContent = `#!/bin/bash
echo "${pocType.toUpperCase()} POC 배치 실행 중..."
# 여기에 ${pocType.toUpperCase()} 전용 로직 추가`;

  writeFileSync(script, batchScriptContent, { mode: 0o755 });
  logger.info(`${script} 파일 생성 완료.`);
} else {
  logger.info(`${script} 파일이 이미 존재하여 기존 파일을 사용합니다.`);
}

// 배치 로그 중앙화
const centralizedLogFile = BATCH_LOG_FILE_NAME(pocType);
const centralizedLogDir = dirname(centralizedLogFile);
if (!existsSync(centralizedLogDir)) {
  mkdirSync(centralizedLogDir, { recursive: true });
}

// 실행 및 로그 중앙화
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

  // 중앙화된 로그에 결과 기록 (추가모드)
  writeFileSync(centralizedLogFile, logContent, { flag: 'a' });
});
