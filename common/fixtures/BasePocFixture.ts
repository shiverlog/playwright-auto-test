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
  /** 단일 POC 환경 */
  protected get poc(): string {
    return POCEnv.getType() || 'ALL';
  }

  /** POC 별 로깅 인스턴스 */
  protected get logger(): winston.Logger {
    return Logger.getLogger(this.poc) as winston.Logger;
  }

  /** 단일 및 다중 POC 목록 */
  protected get pocList(): string[] {
    return POCEnv.getPOCList();
  }

  /** 현재 POC 목록 및 각 항목에 대한 logger map */
  private readonly loggerMap = new Map<string, winston.Logger>();

  /** 각 POC 별 로거 검색 기능 */
  protected get loggerPerPoc(): Record<string, winston.Logger> {
    const map: Record<string, winston.Logger> = {};

    for (const poc of this.pocList) {
      if (!this.loggerMap.has(poc)) {
        this.loggerMap.set(poc, Logger.getLogger(poc) as winston.Logger);
      }
      map[poc] = this.loggerMap.get(poc)!;
    }

    return map;
  }

  /** 테스트 실행 전 공통 작업 */
  public async beforeAll(poc: string): Promise<void> {
    if (poc === 'ALL') return;
    this.loggerPerPoc[poc].info('[BasePocFixture] 테스트 환경 초기화 시작');
  }

  /** 테스트 실행 후 공통 정리 작업 */
  public async afterAll(poc: string): Promise<void> {
    if (poc === 'ALL') return;
    this.loggerPerPoc[poc].info('[BasePocFixture] 테스트 완료 후 후처리 진행');
  }

  /** 특정 폴더가 존재하지 않으면 생성 */
  protected async createFolderIfNotExists(folderName: string, poc: string): Promise<void> {
    const fullPath = path.resolve(process.cwd(), folderName);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath);
      this.loggerPerPoc[poc].info(`[BasePocFixture] 디렉토리 생성: ${folderName}`);
    }
  }

  /** 외부 명령어 실행 유틸 (stdout, stderr 로그) */
  protected async runCommand(command: string, poc: string): Promise<void> {
    this.loggerPerPoc[poc].info(`[BasePocFixture] 명령 실행: ${command}`);

    try {
      const { stdout, stderr } = await execAsync(command);
      if (stdout) this.loggerPerPoc[poc].info(`[BasePocFixture] STDOUT: ${stdout}`);
      if (stderr) this.loggerPerPoc[poc].warn(`[BasePocFixture] STDERR: ${stderr}`);
    } catch (err: any) {
      this.loggerPerPoc[poc].error(`[BasePocFixture] 명령 실행 오류: ${err.message}`);
    }
  }

  /** 전체 POC 또는 특정 POC 테스트 실행 */
  public async runTests(poc: string = 'ALL'): Promise<void> {
    const targetPOCs: string[] = poc === 'ALL' ? this.pocList : [poc];
    await Promise.all(targetPOCs.map(single => this.runSingleTest(single)));
  }

  /** 단일 POC 실행 환경 구성 */
  private async runSingleTest(poc: string): Promise<void> {
    this.loggerPerPoc[poc].info(`[BasePocFixture] ${poc.toUpperCase()} 테스트 실행 시작`);

    try {
      await this.beforeAll(poc);
      await this.prepare(poc);
      this.loggerPerPoc[poc].info(`[BasePocFixture] ${poc.toUpperCase()} 테스트 실행 완료`);
      await this.afterAll(poc);
    } catch (err: any) {
      this.loggerPerPoc[poc].error(
        `[BasePocFixture] ${poc.toUpperCase()} 테스트 중 오류 발생: ${err.message}`,
      );
    }
  }

  /** 각 POC에 맞는 사전 준비 작업 ( 하위 클래스에서 구현 필요 ) */
  protected abstract prepare(poc: string): Promise<void>;
}
