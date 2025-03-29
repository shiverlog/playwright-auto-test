import { ALL_POCS, POCType } from '@common/constants/PathConstants';
import { PocSetupController } from '@common/controllers/PocSetupController';
import { cleanupOldFiles } from '@common/handlers/cleanupHandler';
import { Logger } from '@common/logger/customLogger';

// BaseFixture 클래스 정의
export class BaseFixture {
  /**
   * 테스트 전에 공통 설정을 수행
   */
  public async setup(poc: POCType): Promise<void> {
    const logger = Logger.getLogger(poc); // POC별 로깅 인스턴스

    logger.info(`[SETUP] ${poc.toUpperCase()} 환경 설정 시작`);

    try {
      await PocSetupController.setup(poc);
      logger.info(`[SETUP] ${poc.toUpperCase()} 환경 설정 완료`);
    } catch (error) {
      logger.error(`[SETUP] ${poc.toUpperCase()} 환경 설정 실패 - ${error}`);
      throw error;
    }
  }

  /**
   * 테스트 후에 공통 정리 작업을 수행
   */
  public async teardown(poc: POCType): Promise<void> {
    const logger = Logger.getLogger(poc); // POC별 로깅 인스턴스

    logger.info(`[TEARDOWN] ${poc.toUpperCase()} 테스트 종료 시작`);

    try {
      await PocSetupController.teardown(poc);
      logger.info(`[TEARDOWN] ${poc.toUpperCase()} 테스트 종료 완료`);
    } catch (error) {
      logger.error(`[TEARDOWN] ${poc.toUpperCase()} 테스트 종료 실패 - ${error}`);
      throw error;
    }
  }

  /**
   * 테스트 시작 전에 환경 설정
   */
  public async before(poc: POCType): Promise<void> {
    const logger = Logger.getLogger(poc); // POC별 로깅 인스턴스
    await this.setup(poc);
    await cleanupOldFiles(poc); // errorHandler.ts에서 정의한 cleanupOldFiles 호출
  }

  /**
   * 테스트 후에 환경 정리
   */
  public async after(poc: POCType): Promise<void> {
    const logger = Logger.getLogger(poc); // POC별 로깅 인스턴스
    await this.teardown(poc);
  }

  /**
   * 전체 POC 또는 특정 POC에 대해 테스트 실행 (병렬 처리)
   */
  public async runTests(poc: POCType = ''): Promise<void> {
    const logger = Logger.getLogger(poc); // POC별 로깅 인스턴스

    if (poc === '') {
      // 전체 POC 실행
      logger.info('전체 POC 테스트 시작');
      await Promise.all(
        ALL_POCS.map(async singlePoc => {
          await this.runSingleTest(singlePoc); // 병렬로 각 POC 실행
        }),
      );
      logger.info('전체 POC 테스트 완료');
    } else {
      // 특정 POC 실행
      await this.runSingleTest(poc);
    }
  }

  /**
   * 특정 POC에 대해 테스트 실행
   */
  private async runSingleTest(poc: POCType): Promise<void> {
    const logger = Logger.getLogger(poc); // POC별 로깅 인스턴스

    try {
      logger.info(`[RUN] ${poc.toUpperCase()} 테스트 시작`);
      await this.before(poc);
      // 실제 테스트 로직은 여기에 추가
      logger.info(`[RUN] ${poc.toUpperCase()} 테스트 완료`);
      await this.after(poc);
    } catch (error) {
      logger.error(`[RUN] ${poc.toUpperCase()} 테스트 실행 중 오류: ${error}`);
    }
  }
}
