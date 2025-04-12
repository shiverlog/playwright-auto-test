/**
 * Description : PcTestEnv.ts - 📌 PC POC 테스트 환경 설정 및 정리 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-12
 */
import { webFixture } from '@common/fixtures/BaseWebFixture';
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type winston from 'winston';

export class PcTestEnv {
  private readonly pocList = POCEnv.getPOCList();
  private readonly logger: winston.Logger;
  constructor() {
    const currentPoc = POCEnv.getType();
    this.logger = Logger.getLogger(currentPoc.toUpperCase()) as winston.Logger;
  }

  /**
   * 테스트 환경 초기화 로직 (PC 환경)
   * - 각 POC에 대해 webFixture 기반으로 setup 실행
   */
  public async setup(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] PC 테스트 환경 설정 시작`);

      try {
        await webFixture.setupForPoc(poc);
        this.logger.info(`[${poc}] PC 테스트 환경 설정 완료`);
      } catch (error) {
        this.logger.error(`[${poc}] PC 테스트 환경 설정 실패: ${error}`);
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
      this.logger.info(`[${poc}] PC 테스트 환경 정리 시작`);

      try {
        await webFixture.teardownForPoc(poc);
        this.logger.info(`[${poc}] PC 테스트 환경 정리 완료`);
      } catch (error) {
        this.logger.error(`[${poc}] PC 테스트 환경 정리 실패: ${error}`);
        throw error;
      }
    }
  }
}
