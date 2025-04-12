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
  private readonly pocList = POCEnv.getPOCList();
  private readonly logger: winston.Logger;

  constructor() {
    const currentPoc = POCEnv.getType();
    this.logger = Logger.getLogger(currentPoc.toUpperCase()) as winston.Logger;
  }

  /**
   * iOS 테스트 환경 초기화
   */
  public async setup(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] iOS 테스트 환경 설정 시작`);

      try {
        await appFixture.setupForPoc(poc);
        this.logger.info(`[${poc}] iOS 테스트 환경 설정 완료`);
      } catch (error) {
        this.logger.error(`[${poc}] iOS 테스트 환경 설정 실패: ${error}`);
        throw error;
      }
    }
  }

  /**
   * iOS 테스트 환경 정리
   */
  public async teardown(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] iOS 테스트 환경 정리 시작`);

      try {
        await appFixture.teardownForPoc(poc);
        this.logger.info(`[${poc}] iOS 테스트 환경 정리 완료`);
      } catch (error) {
        this.logger.error(`[${poc}] iOS 테스트 환경 정리 실패: ${error}`);
        throw error;
      }
    }
  }
}
