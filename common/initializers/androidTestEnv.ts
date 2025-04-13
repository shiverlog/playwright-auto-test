/**
 * Description : AndroidTestEnv.ts - 📌 Android App 테스트 환경 설정 및 정리 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { appFixture } from '@common/fixtures/BaseAppFixture';
import { Logger } from '@common/logger/customLogger';
import type { TestEnvHandler } from '@common/types/test-env-handler';
import { ContextUtils } from '@common/utils/context/ContextUtils';
import { POCEnv } from '@common/utils/env/POCEnv';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

export class AndroidTestEnv implements TestEnvHandler {
  // 현재 실행 대상 POC 리스트 (예: aos, ios 등)
  private readonly pocList = POCEnv.getPOCList();

  // 공통 로거
  private readonly logger: winston.Logger;

  constructor() {
    // 현재 환경의 POC를 기반으로 로거 생성
    this.logger = Logger.getLogger(POCEnv.getType().toUpperCase()) as winston.Logger;
  }

  /**
   * Android 앱 테스트 환경 초기화
   */
  public async setup(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] Android 테스트 환경 설정 시작`);

      try {
        // Appium 드라이버 설정 (POC별로)
        const { driver }: { driver: Browser } = await appFixture.setupForPoc(poc);

        // 드라이버 없을 경우 스킵
        if (!driver) {
          this.logger.warn(`[${poc}] 드라이버 초기화 실패`);
          continue;
        }

        // 현재 컨텍스트 상태 출력 (WebView, Native, 혹은 비정상)
        await this.logContextState(driver, poc);

        this.logger.info(`[${poc}] Android 테스트 환경 설정 완료`);
      } catch (error) {
        // 예외 발생 시 로그 및 리소스 정리
        await this.handleSetupError(poc, error);
        throw error; // 전체 테스트 중단
      }
    }
  }

  /**
   * Android 앱 테스트 환경 정리
   */
  public async teardown(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] Android 테스트 환경 정리 시작`);

      try {
        // Appium 드라이버 정리
        await appFixture.teardownForPoc(poc);
        this.logger.info(`[${poc}] Android 테스트 환경 정리 완료`);
      } catch (error) {
        // 정리 실패 시에도 다음 POC 진행
        this.logger.error(`[${poc}] Android 테스트 환경 정리 실패: ${error}`);
      }
    }
  }

  /**
   * 현재 드라이버의 컨텍스트(WebView or Native) 상태 확인 및 로깅
   */
  private async logContextState(driver: Browser, poc: string): Promise<void> {
    if (await ContextUtils.isInWebviewContext(driver)) {
      this.logger.info(`[${poc}] 현재 WebView 컨텍스트`);
    } else if (await ContextUtils.isInNativeContext(driver)) {
      this.logger.info(`[${poc}] 현재 Native 컨텍스트`);
    } else {
      this.logger.warn(`[${poc}] WebView도 Native도 아닌 상태`);
    }
  }

  /**
   * 테스트 설정 중 오류 발생 시 정리 및 로그 처리
   */
  private async handleSetupError(poc: string, error: unknown): Promise<void> {
    this.logger.error(`[${poc}] Android 테스트 환경 설정 실패: ${error}`);

    try {
      // 실패한 환경 안전하게 teardown 시도
      await appFixture.teardownForPoc(poc);
      this.logger.warn(`[${poc}] 실패 후 리소스 정리 완료`);
    } catch (teardownErr) {
      this.logger.error(`[${poc}] 정리 중 추가 오류: ${teardownErr}`);
    }
  }
}
