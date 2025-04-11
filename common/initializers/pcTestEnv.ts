/**
 * Description : PcTestEnv.ts - 📌 PC POC 테스트 환경 설정 및 정리 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { webFixture } from '@common/fixtures/BaseWebFixture';
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type winston from 'winston';

export class PcTestEnv {
  // 현재 실행 대상 POC 목록
  private readonly pocList = POCEnv.getPOCList();

  // POC별 로거 인스턴스 캐싱용
  private readonly loggerMap = new Map<string, winston.Logger>();

  constructor() {
    for (const poc of this.pocList) {
      this.loggerMap.set(poc, Logger.getLogger(poc) as winston.Logger);
    }
  }

  /**
   * 개별 POC에 대한 로거 반환
   */
  private getLogger(poc: string): winston.Logger {
    return this.loggerMap.get(poc)!;
  }

  /**
   * 테스트 환경 초기화 로직 (PC 환경)
   * - 각 POC에 대해 webFixture 기반으로 setup 실행
   */
  public async setup(): Promise<void> {
    for (const poc of this.pocList) {
      const logger = this.getLogger(poc);
      logger.info(`[${poc}] PC 테스트 환경 설정 시작`);

      try {
        await webFixture.setupForPoc(poc);
        logger.info(`[${poc}] PC 테스트 환경 설정 완료`);
      } catch (error) {
        logger.error(`[${poc}] PC 테스트 환경 설정 실패: ${error}`);
        throw error;
      }
    }
  }

  /**
   * 테스트 환경 정리 로직 (PC 환경)
   * - 각 POC에 대해 webFixture 기반으로 teardown 실행
   */
  public async teardown(): Promise<void> {
    for (const poc of this.pocList) {
      const logger = this.getLogger(poc);
      logger.info(`[${poc}] PC 테스트 환경 정리 시작`);

      try {
        await webFixture.teardownForPoc(poc);
        logger.info(`[${poc}] PC 테스트 환경 정리 완료`);
      } catch (error) {
        logger.error(`[${poc}] PC 테스트 환경 정리 실패: ${error}`);
        throw error;
      }
    }
  }
}
