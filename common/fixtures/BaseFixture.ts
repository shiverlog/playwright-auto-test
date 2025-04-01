import { ALL_POCS } from '@common/constants/PathConstants';
import type { POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export abstract class BaseFixture {
  constructor() {
    this.loadEnvForAllPOCs();
  }

  /**
   * .env 환경변수 로딩 (각 POC별 로깅)
   */
  protected loadEnvForAllPOCs(): void {
    // process.cwd()를 사용하여 프로젝트 루트 디렉토리에서 .env 파일을 찾음
    const envPath = path.resolve(process.cwd(), '.env');
    const baseMessage = fs.existsSync(envPath)
      ? '.env 환경변수 로딩 완료'
      : '.env 파일이 존재하지 않습니다. 기본값으로 진행합니다.';

    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
    }

    // 모든 POC에 대해 로깅
    ALL_POCS.forEach(poc => {
      const logger = Logger.getLogger(poc);
      logger.info(`[BaseFixture] ${baseMessage}`);
    });
  }

  /**
   * 공통 전처리 작업
   */
  public async beforeAll(poc: POCType): Promise<void> {
    const logger = Logger.getLogger(poc);
    logger.info('[BaseFixture] 테스트 환경 초기화 시작');
    await this.createFolderIfNotExists('logs', poc);
    await this.createFolderIfNotExists('screenshots', poc);
  }

  /**
   * 공통 후처리 작업
   */
  public async afterAll(poc: POCType): Promise<void> {
    const logger = Logger.getLogger(poc);
    logger.info('[BaseFixture] 테스트 완료 후 후처리 진행');
  }

  /**
   * 공통 로그 출력
   */
  protected log(message: string, poc: POCType = 'pc'): void {
    const logger = Logger.getLogger(poc);
    logger.info(`[BaseFixture] ${message}`);
  }

  /**
   * 디렉토리 없으면 생성
   */
  protected async createFolderIfNotExists(folderName: string, poc: POCType): Promise<void> {
    const fullPath = path.resolve(__dirname, '../../', folderName);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath);
      const logger = Logger.getLogger(poc);
      logger.info(`[BaseFixture] 디렉토리 생성: ${folderName}`);
    }
  }

  /**
   * 명령 실행 (로그 포함)
   */
  protected async runCommand(command: string, poc: POCType): Promise<void> {
    const logger = Logger.getLogger(poc);
    logger.info(`[BaseFixture] 명령 실행: ${command}`);
    try {
      const { stdout, stderr } = await execAsync(command);
      if (stdout) logger.info(`[BaseFixture] STDOUT: ${stdout}`);
      if (stderr) logger.warn(`[BaseFixture] STDERR: ${stderr}`);
    } catch (err: any) {
      const logger = Logger.getLogger(poc);
      logger.error(`[BaseFixture] 명령 실행 오류: ${err.message}`);
    }
  }

  /**
   * 전체 또는 개별 POC 실행
   */
  public async runTests(poc: POCType = ''): Promise<void> {
    if (poc === '') {
      await Promise.all(ALL_POCS.map(single => this.runSingleTest(single)));
    } else {
      await this.runSingleTest(poc);
    }
  }

  /**
   * 개별 POC 테스트 실행 흐름
   */
  private async runSingleTest(poc: POCType): Promise<void> {
    const logger = Logger.getLogger(poc);
    logger.info(`[BaseFixture] ${poc.toUpperCase()} 테스트 실행 시작`);
    try {
      await this.beforeAll(poc);
      await this.prepare(poc);
      logger.info(`[BaseFixture] ${poc.toUpperCase()} 테스트 실행 완료`);
      await this.afterAll(poc);
    } catch (err: any) {
      logger.error(`[BaseFixture] ${poc.toUpperCase()} 테스트 중 오류 발생: ${err.message}`);
    }
  }
  protected abstract prepare(poc: POCType, ...args: any[]): Promise<void>;
}
