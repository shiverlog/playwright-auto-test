/**
 * Description : BasePocFixture.ts - 📌 BaseWebFixture, BaseAppFixture 확장을 위한 추상화 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-06
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import type winston from 'winston';

const execAsync = promisify(exec);

export abstract class BasePocFixture {
  // 단일 POC 환경
  protected get poc(): string {
    return POCEnv.getType() || 'all';
  }

  // POC 별 로깅 인스턴스
  protected get logger(): winston.Logger {
    return Logger.getLogger(this.poc) as winston.Logger;
  }

  // 단일 및 다중 POC 목록
  protected get pocList(): string[] {
    return POCEnv.getPOCList();
  }

  // POC별 logger 캐시
  private readonly loggerMap = new Map<string, winston.Logger>();

  // 안전한 로거 반환 유틸
  protected getLogger(poc: string): winston.Logger {
    if (!this.loggerMap.has(poc)) {
      this.loggerMap.set(poc, Logger.getLogger(poc) as winston.Logger);
    }
    return this.loggerMap.get(poc)!;
  }

  /**
   * 테스트 실행 전 공통 작업
   */
  public async beforeAll(poc: string): Promise<void> {
    if (poc === 'all') return;
    this.getLogger(poc).info('[BasePocFixture] 테스트 환경 초기화 시작');
  }

  /**
   * 테스트 실행 후 공통 정리 작업
   */
  public async afterAll(poc: string): Promise<void> {
    if (poc === 'all') return;
    this.getLogger(poc).info('[BasePocFixture] 테스트 완료 후 후처리 진행');
  }

  /**
   * 특정 폴더가 존재하지 않으면 생성
   */
  protected async createFolderIfNotExists(folderName: string, poc: string): Promise<void> {
    const fullPath = path.resolve(process.cwd(), folderName);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      this.getLogger(poc).info(`[BasePocFixture] 디렉토리 생성: ${folderName}`);
    }
  }

  /**
   * 외부 명령어 실행 유틸 (stdout, stderr 로그)
   */
  protected async runCommand(command: string, poc: string): Promise<void> {
    this.getLogger(poc).info(`[BasePocFixture] 명령 실행: ${command}`);

    try {
      const { stdout, stderr } = await execAsync(command);
      if (stdout) this.getLogger(poc).info(`[BasePocFixture] STDOUT: ${stdout}`);
      if (stderr) this.getLogger(poc).warn(`[BasePocFixture] STDERR: ${stderr}`);
    } catch (err: any) {
      this.getLogger(poc).error(`[BasePocFixture] 명령 실행 오류: ${err.message}`);
    }
  }

  /**
   * 전체 POC 또는 특정 POC 테스트 실행
   */
  public async runTests(poc: string = 'all'): Promise<void> {
    const targetPOCs: string[] = poc === 'all' ? this.pocList : [poc];
    await Promise.all(targetPOCs.map(single => this.runSingleTest(single)));
  }

  /**
   * 단일 POC 실행 환경 구성
   */
  private async runSingleTest(poc: string): Promise<void> {
    this.getLogger(poc).info(`[BasePocFixture] ${poc.toUpperCase()} 테스트 실행 시작`);

    try {
      await this.beforeAll(poc);
      await this.prepare(poc);
      this.getLogger(poc).info(`[BasePocFixture] ${poc.toUpperCase()} 테스트 실행 완료`);
      await this.afterAll(poc);
    } catch (err: any) {
      this.getLogger(poc).error(
        `[BasePocFixture] ${poc.toUpperCase()} 테스트 중 오류 발생: ${err.message}`,
      );
    }
  }

  // 각 POC에 맞는 사전 준비 작업
  protected abstract prepare(poc: string): Promise<void>;
}
