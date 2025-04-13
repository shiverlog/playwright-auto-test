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
  // 테스트 대상 POC 리스트
  private readonly pocList = POCEnv.getPOCList();

  // 공통 로거 인스턴스
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = Logger.getLogger(POCEnv.getType().toUpperCase()) as winston.Logger;
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
        await this.handleSetupError(poc, error);
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
        // 다음 POC도 계속 정리되도록 throw 생략
      }
    }
  }

  /**
   * 테스트 설정 중 오류 발생 시 리소스 정리 및 로그 처리
   */
  private async handleSetupError(poc: string, error: unknown): Promise<void> {
    this.logger.error(`[${poc}] iOS 테스트 환경 설정 실패: ${error}`);

    try {
      await appFixture.teardownForPoc(poc);
      this.logger.warn(`[${poc}] 실패 후 리소스 정리 완료`);
    } catch (teardownErr) {
      this.logger.error(`[${poc}] 정리 중 추가 오류: ${teardownErr}`);
    }
  }
}
