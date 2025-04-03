/**
 * Description : BasePocFixture.ts - 📌 BaseWebFixture, BaseAppFixture 확장을 위한 추상 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import { ALL_POCS } from '@common/constants/PathConstants';
import type { POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);
export abstract class BasePocFixture {
  constructor() {
    this.loadEnvForAllPOCs();
  }

  /**
   * .env 환경변수 로딩 (프로젝트 루트 기준) + 모든 POC 로거에 메시지 출력
   */
  protected loadEnvForAllPOCs(): void {
    const envPath = path.resolve(process.cwd(), '.env');
    const message = fs.existsSync(envPath)
      ? '.env 환경변수 로딩 완료'
      : '.env 파일이 존재하지 않습니다. 기본값으로 진행합니다.';

    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
    }

    ALL_POCS.forEach(poc => {
      Logger.getLogger(poc).info(`[BasePocFixture] ${message}`);
    });
  }

  /**
   * 테스트 실행 전 공통 작업 (로그/스크린샷 디렉토리 생성)
   */
  public async beforeAll(poc: POCType): Promise<void> {
    const logger = Logger.getLogger(poc);
    logger.info('[BasePocFixture] 테스트 환경 초기화 시작');
    await this.createFolderIfNotExists('logs', poc);
    await this.createFolderIfNotExists('screenshots', poc);
  }

  /**
   * 테스트 실행 후 공통 정리 작업
   */
  public async afterAll(poc: POCType): Promise<void> {
    const logger = Logger.getLogger(poc);
    logger.info('[BasePocFixture] 테스트 완료 후 후처리 진행');
  }

  /**
   * 특정 폴더가 존재하지 않으면 생성
   */
  protected async createFolderIfNotExists(folderName: string, poc: POCType): Promise<void> {
    const fullPath = path.resolve(process.cwd(), folderName);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath);
      Logger.getLogger(poc).info(`[BasePocFixture] 디렉토리 생성: ${folderName}`);
    }
  }

  /**
   * 외부 명령어 실행 유틸 (로깅 포함)
   */
  protected async runCommand(command: string, poc: POCType): Promise<void> {
    const logger = Logger.getLogger(poc);
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
  public async runTests(poc: POCType = ''): Promise<void> {
    if (poc === '') {
      await Promise.all(ALL_POCS.map(single => this.runSingleTest(single)));
    } else {
      await this.runSingleTest(poc);
    }
  }

  /**
   * 단일 POC 실행 흐름
   */
  private async runSingleTest(poc: POCType): Promise<void> {
    const logger = Logger.getLogger(poc);
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
