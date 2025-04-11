/**
 * Description : ApiTestEnv.ts - 📌 API POC 테스트 환경 설정 및 정리 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type winston from 'winston';

export class ApiTestEnv {
  // 현재 실행 대상 POC 목록
  private readonly pocList = POCEnv.getPOCList();

  // POC별 로거 저장용 Map
  private readonly loggerMap = new Map<string, winston.Logger>();

  constructor() {
    for (const poc of this.pocList) {
      this.loggerMap.set(poc, Logger.getLogger(poc) as winston.Logger);
    }
  }

  /**
   * 지정된 POC에 대한 로거 반환
   */
  private getLogger(poc: string): winston.Logger {
    return this.loggerMap.get(poc)!;
  }

  /**
   * API 테스트 환경 설정
   */
  public async setup(): Promise<void> {
    for (const poc of this.pocList) {
      const logger = this.getLogger(poc);
      logger.info(`[${poc}] API 테스트 환경 설정 시작`);

      try {
        // TODO: mock 서버 연결, 토큰 발급 등
        logger.info(`[${poc}] API 테스트 환경 설정 완료`);
      } catch (error) {
        logger.error(`[${poc}] API 테스트 환경 설정 실패: ${error}`);
        throw error;
      }
    }
  }

  /**
   * API 테스트 환경 정리
   */
  public async teardown(): Promise<void> {
    for (const poc of this.pocList) {
      const logger = this.getLogger(poc);
      logger.info(`[${poc}] API 테스트 환경 정리 시작`);

      try {
        // TODO: 리소스 해제, 로그아웃 처리 등
        logger.info(`[${poc}] API 테스트 환경 정리 완료`);
      } catch (error) {
        logger.error(`[${poc}] API 테스트 환경 정리 실패: ${error}`);
        throw error;
      }
    }
  }
}
