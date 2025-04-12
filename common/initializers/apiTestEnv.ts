/**
 * Description : ApiTestEnv.ts - 📌 API POC 테스트 환경 설정 및 정리 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type winston from 'winston';

export class ApiTestEnv {
  private readonly pocList = POCEnv.getPOCList();
  private readonly logger: winston.Logger;

  constructor() {
    const currentPoc = POCEnv.getType();
    this.logger = Logger.getLogger(currentPoc.toUpperCase()) as winston.Logger;
  }

  /**
   * API 테스트 환경 설정
   */
  public async setup(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] API 테스트 환경 설정 시작`);

      try {
        // TODO: mock 서버 연결, 토큰 발급 등
        this.logger.info(`[${poc}] API 테스트 환경 설정 완료`);
      } catch (error) {
        this.logger.error(`[${poc}] API 테스트 환경 설정 실패: ${error}`);
        throw error;
      }
    }
  }

  /**
   * API 테스트 환경 정리
   */
  public async teardown(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] API 테스트 환경 정리 시작`);

      try {
        // TODO: 리소스 해제, 로그아웃 처리 등
        this.logger.info(`[${poc}] API 테스트 환경 정리 완료`);
      } catch (error) {
        this.logger.error(`[${poc}] API 테스트 환경 정리 실패: ${error}`);
        throw error;
      }
    }
  }
}
