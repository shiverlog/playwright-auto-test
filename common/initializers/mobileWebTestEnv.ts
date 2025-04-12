/**
 * Description : MobileWebTestEnv.ts - 📌 Mobile Web 테스트 환경 설정 및 정리 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-12
 */
import { mobileWebFixture } from '@common/fixtures/BaseMobileWebFixture';
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type winston from 'winston';

export class MobileWebTestEnv {
  private readonly pocList = POCEnv.getPOCList();
  private readonly logger: winston.Logger;

  constructor() {
    const currentPoc = POCEnv.getType();
    this.logger = Logger.getLogger(currentPoc.toUpperCase()) as winston.Logger;
  }

  /**
   * 모바일 웹 테스트 환경 초기화
   */
  public async setup(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] Mobile Web 테스트 환경 설정 시작`);

      try {
        await mobileWebFixture.setupForPoc(poc);
        this.logger.info(`[${poc}] Mobile Web 테스트 환경 설정 완료`);
      } catch (error) {
        this.logger.error(`[${poc}] Mobile Web 테스트 환경 설정 실패: ${error}`);
        throw error;
      }
    }
  }

  /**
   * 모바일 웹 테스트 환경 정리
   */
  public async teardown(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] Mobile Web 테스트 환경 정리 시작`);

      try {
        await mobileWebFixture.teardownForPoc(poc);
        this.logger.info(`[${poc}] Mobile Web 테스트 환경 정리 완료`);
      } catch (error) {
        this.logger.error(`[${poc}] Mobile Web 테스트 환경 정리 실패: ${error}`);
        throw error;
      }
    }
  }
}
