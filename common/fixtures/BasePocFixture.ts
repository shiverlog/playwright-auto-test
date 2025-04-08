/**
 * Description : BasePocFixture.ts - 📌 BaseWebFixture, BaseAppFixture 확장을 위한 추상화 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-06
 */
import { Logger } from '@common/logger/customLogger';
import type { POCKey, POCType } from '@common/types/platform-types';
import { ALL_POCS } from '@common/types/platform-types';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import type winston from 'winston';

const execAsync = promisify(exec);

export abstract class BasePocFixture {
  /**
   * 테스트 실행 전 공통 작업
   */
  public async beforeAll(poc: POCType): Promise<void> {
    if (poc === 'ALL') return;
    const pocKey = poc as POCKey;
    const logger = Logger.getLogger(pocKey) as winston.Logger;
    logger.info('[BasePocFixture] 테스트 환경 초기화 시작');

    // await this.createFolderIfNotExists('logs', pocKey);
    // await this.createFolderIfNotExists('screenshots', pocKey);
  }

  /**
   * 테스트 실행 후 공통 정리 작업
   */
  public async afterAll(poc: POCType): Promise<void> {
    if (poc === 'ALL') return;
    const pocKey = poc as POCKey;
    const logger = Logger.getLogger(pocKey) as winston.Logger;
    logger.info('[BasePocFixture] 테스트 완료 후 후처리 진행');
  }

  /**
   * 특정 폴더가 존재하지 않으면 생성
   */
  protected async createFolderIfNotExists(folderName: string, poc: POCKey): Promise<void> {
    const fullPath = path.resolve(process.cwd(), folderName);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath);
      const logger = Logger.getLogger(poc) as winston.Logger;
      logger.info(`[BasePocFixture] 디렉토리 생성: ${folderName}`);
    }
  }

  /**
   * 외부 명령어 실행 유틸 (stdout, stderr 로그)
   */
  protected async runCommand(command: string, poc: POCKey): Promise<void> {
    const logger = Logger.getLogger(poc) as winston.Logger;
    logger.info(`[BasePocFixture] 명령 실행: ${command}`);

    try {
      const { stdout, stderr } = await execAsync(command);
      if (stdout) logger.info(`[BasePocFixture] STDOUT: ${stdout}`);
      if (stderr) logger.warn(`[BasePocFixture] STDERR: ${stderr}`);
    } catch (err: any) {
      logger.error(`[BasePocFixture] 명령 실행 오류: ${err.message}`);
    }
  }

  /**
   * 전체 POC 또는 특정 POC 테스트 실행
   */
  public async runTests(poc: POCType = 'ALL'): Promise<void> {
    const targetPOCs: POCKey[] = poc === 'ALL' ? ALL_POCS : [poc as POCKey];
    await Promise.all(targetPOCs.map(single => this.runSingleTest(single)));
  }

  /**
   * 단일 POC 실행 환경 구성
   */
  private async runSingleTest(poc: POCKey): Promise<void> {
    const logger = Logger.getLogger(poc) as winston.Logger;
    logger.info(`[BasePocFixture] ${poc.toUpperCase()} 테스트 실행 시작`);

    try {
      await this.beforeAll(poc);
      await this.prepare(poc);
      logger.info(`[BasePocFixture] ${poc.toUpperCase()} 테스트 실행 완료`);
      await this.afterAll(poc);
    } catch (err: any) {
      logger.error(`[BasePocFixture] ${poc.toUpperCase()} 테스트 중 오류 발생: ${err.message}`);
    }
  }

  /**
   * 각 POC에 맞는 사전 준비 작업 (하위 클래스에서 구현 필요)
   */
  protected abstract prepare(poc: POCType): Promise<void>;
}
