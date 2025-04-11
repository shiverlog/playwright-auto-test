/**
 * Description : IosTestEnv.ts - 📌 iOS POC 테스트 환경 설정 및 정리 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { appFixture } from '@common/fixtures/BaseAppFixture';
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type winston from 'winston';

export class IosTestEnv {
  // 현재 실행 대상 POC 리스트
  private readonly pocList = POCEnv.getPOCList();

  // POC별 로거 캐싱용 맵
  private readonly loggerMap = new Map<string, winston.Logger>();

  constructor() {
    for (const poc of this.pocList) {
      this.loggerMap.set(poc, Logger.getLogger(poc) as winston.Logger);
    }
  }

  /**
   * 지정된 POC에 대한 로거 인스턴스 반환
   */
  private getLogger(poc: string): winston.Logger {
    return this.loggerMap.get(poc)!;
  }

  /**
   * iOS 테스트 환경 초기화
   */
  public async setup(): Promise<void> {
    for (const poc of this.pocList) {
      const logger = this.getLogger(poc);
      logger.info(`[${poc}] iOS 테스트 환경 설정 시작`);

      try {
        await appFixture.setupForPoc(poc);
        logger.info(`[${poc}] iOS 테스트 환경 설정 완료`);
      } catch (error) {
        logger.error(`[${poc}] iOS 테스트 환경 설정 실패: ${error}`);
        throw error;
      }
    }
  }

  /**
   * iOS 테스트 환경 정리
   */
  public async teardown(): Promise<void> {
    for (const poc of this.pocList) {
      const logger = this.getLogger(poc);
      logger.info(`[${poc}] iOS 테스트 환경 정리 시작`);

      try {
        await appFixture.teardownForPoc(poc);
        logger.info(`[${poc}] iOS 테스트 환경 정리 완료`);
      } catch (error) {
        logger.error(`[${poc}] iOS 테스트 환경 정리 실패: ${error}`);
        throw error;
      }
    }
  }
}
