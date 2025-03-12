import { POCType } from '@common/config/config';
import { logger } from '@common/logger/customLogger';
import { exec } from 'child_process';
import { existsSync, writeFileSync } from 'fs';

// 각 POC에 대한 실행할 스크립트 및 설명 설정
const CONFIG = (pocType: POCType) => ({
  poc: pocType,
  script: 'batch/automation.sh',
  description: `${pocType} POC 배치 실행`,
});

// 실행 시 입력된 POCType을 가져옴
const pocType: POCType | undefined = process.argv[2] as POCType;
if (!pocType) {
  logger.error('❌ 잘못된 POCType 입니다. 사용 가능한 값: pc | mw | aos | ios | api');
  process.exit(1);
}

// logger
const { script, description } = CONFIG(pocType);
logger.info(`${description}: ${script} 실행 중...`);

// 스크립트 중복을 방지하기 위해, 확인 후 동적으로 생성
if (!existsSync(script)) {
  logger.info(`${script} 파일이 존재하지 않음. 새로 생성합니다...`);

  const batchScriptContent = `#!/bin/bash
  echo "${pocType} POC 배치 실행 중..."
  # 여기에 ${pocType} 전용 로직 추가 가능`;
  // 실행 권한 추가
  writeFileSync(script, batchScriptContent, { mode: 0o755 });
  logger.info(`${script} 파일 생성 완료.`);
} else {
  logger.info(`${script} 파일이 이미 존재함. 기존 파일을 사용합니다.`);
}

exec(`bash ${script}`, (error, stdout, stderr) => {
  if (error) {
    logger.error(`오류 발생: ${error.message}`);
    return;
  }
  if (stderr) {
    logger.error(`경고: ${stderr}`);
    return;
  }
  logger.info(`실행 완료:\n${stdout}`);
});
