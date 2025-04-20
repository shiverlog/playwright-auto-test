/**
 * Description : ScriptRunner.ts - 📌 테스트 스크립트 또는 자동화 작업을 실행하는 엔트리 포인트
 * Author : Shiwoo Min
 * Date : 2024-04-18
 */
import { TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import type { ValidPOCValue } from '@common/types/platform-types';
import { POCEnv } from '@common/utils/env/POCEnv';
import { exec } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import type winston from 'winston';

// 각 POC에 대해 실행할 스크립트 설정 정의
const CONFIG = (poc: ValidPOCValue) => ({
  poc,
  script: `.github/scripts/automation.sh`,
  description: `${poc.toUpperCase()} POC 배치 실행`,
});

class ScriptRunner {
  // 단일 실행 대상 POC
  private readonly poc: ValidPOCValue;
  // 실행 대상 POC 전체 목록 (전체 실행 시 multiple)
  private readonly pocList: ValidPOCValue[];
  // 공용 로거 인스턴스
  private readonly logger: winston.Logger;

  constructor() {
    this.poc = POCEnv.getType();
    this.pocList = POCEnv.getPOCList();
    this.logger = Logger.getLogger('ALL') as winston.Logger;
  }

  /**
   * 실행 진입점 - 단일/전체 모드 분기
   */
  public async run(): Promise<void> {
    if (POCEnv.isAll()) {
      this.logger.info('전체 POC 병렬 실행 모드로 진입합니다.');
      await this.runAll();
    } else {
      this.logger.info(`단일 POC(${this.poc}) 실행 모드로 진입합니다.`);
      await this.runOne(this.poc);
    }
  }

  /**
   * 전체 POC에 대해 병렬 실행
   */
  private async runAll(): Promise<void> {
    await Promise.all(
      this.pocList.map(poc =>
        this.runOne(poc).catch(error => {
          this.logger.error(`[ScriptRunner] ${poc} 실행 중 오류 발생:`, error);
        }),
      ),
    );

    this.logger.info('모든 POC 배치 스크립트 실행 완료');
  }

  /**
   * 단일 POC 실행
   */
  private runOne(poc: ValidPOCValue): Promise<void> {
    const { script, description } = CONFIG(poc);
    this.logger.info(`${description}: ${script} 실행 중...`);

    // 스크립트 경로 확인 및 디렉토리 생성
    const scriptDir = dirname(script);
    if (!existsSync(scriptDir)) {
      mkdirSync(scriptDir, { recursive: true });
    }

    // 실행할 스크립트 파일 존재 여부 확인
    if (!existsSync(script)) {
      this.logger.error(`${script} 파일이 존재하지 않습니다.`);
      return Promise.reject(new Error(`${script} 파일이 존재하지 않습니다.`));
    }

    // 로그 파일 경로 결정
    const logFilePath = TEST_RESULT_FILE_NAME(poc).log[0];

    // 실제 스크립트 실행 (bash 호출)
    return new Promise<void>((resolve, reject) => {
      exec(`bash ${script}`, (error, stdout, stderr) => {
        let logContent = `[${new Date().toISOString()}] [${poc.toUpperCase()}] ${description}\n`;

        if (error) {
          this.logger.error(`오류 발생: ${error.message}`);
          logContent += `오류 발생: ${error.message}\n`;
        }

        if (stderr) {
          this.logger.error(`경고: ${stderr}`);
          logContent += `경고: ${stderr}\n`;
        }

        this.logger.info(`실행 완료:\n${stdout}`);
        logContent += `실행 결과:\n${stdout}\n\n`;

        writeFileSync(logFilePath, logContent, { flag: 'a' });
        resolve();
      });
    });
  }
}

// 실행 시작
new ScriptRunner().run();
