/**
 * Description : scriptRunner.ts - 📌 테스트 스크립트 또는 자동화 작업을 실행하는 엔트리 포인트
 * Author : Shiwoo Min
 * Date : 2024-04-10
 */
import { POC_PATH, TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import type { POCKey } from '@common/types/platform-types';
import { POCEnv } from '@common/utils/env/POCEnv';
import { exec } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import type winston from 'winston';

// 각 POC에 대한 실행할 스크립트 설정
const CONFIG = (poc: POCKey) => ({
  poc,
  script: `.github/scripts/automation.sh`,
  description: `${poc.toUpperCase()} POC 배치 실행`,
});

class ScriptRunner {
  // poc 단일 실행
  private readonly poc: string;
  // 전체 poc 목록
  private readonly pocList: string[];
  // 전역 로거 인스턴스
  private readonly logger: winston.Logger;

  constructor() {
    this.poc = POCEnv.getType();
    this.pocList = POCEnv.getList();
    this.logger = Logger.getLogger('ALL') as winston.Logger;
  }

  public async run(): Promise<void> {
    if (POCEnv.isAll()) {
      this.logger.info('전체 POC 병렬 실행 모드로 진입합니다.');
      await this.runAll();
    } else {
      this.logger.info(`단일 POC(${this.poc}) 실행 모드로 진입합니다.`);
      await this.runOne(this.poc as POCKey);
    }
  }

  private async runAll(): Promise<void> {
    await Promise.all(
      this.pocList.map(poc =>
        this.runOne(poc as POCKey).catch(error => {
          const pocLogger = Logger.getLogger('ALL') as winston.Logger;
          pocLogger.error(`[ScriptRunner] ${poc} 실행 중 오류 발생:`, error);
        }),
      ),
    );

    this.logger.info('모든 POC 배치 스크립트 실행 완료');
  }

  private runOne(poc: POCKey): Promise<void> {
    const { script, description } = CONFIG(poc);
    const logger = Logger.getLogger(poc) as winston.Logger;

    logger.info(`${description}: ${script} 실행 중...`);

    const scriptDir = dirname(script);
    if (!existsSync(scriptDir)) {
      mkdirSync(scriptDir, { recursive: true });
    }

    if (!existsSync(script)) {
      logger.error(`${script} 파일이 존재하지 않습니다.`);
      return Promise.reject(new Error(`${script} 파일이 존재하지 않습니다.`));
    }

    const logFilePath = TEST_RESULT_FILE_NAME(poc).log[0];

    return new Promise<void>((resolve, reject) => {
      exec(`bash ${script}`, (error, stdout, stderr) => {
        let logContent = `[${new Date().toISOString()}] [${poc.toUpperCase()}] ${description}\n`;

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
  }
}

// 실행 진입점
new ScriptRunner().run();
