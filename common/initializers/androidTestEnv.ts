/**
 * Description : AndroidTestEnv.ts - 📌 Android App 테스트 환경 설정 및 정리 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-16
 * - 앱 내 Webview Playwright 연결 실패 및 Puppeteer 연결 실패로 인해 단일 Appium 을 사용하여야 함 (불안정하고 세팅도 까다로운데, Not Supported로 인한 제한이 많음)
 * - Webview 연결을 위해서는 AppiumDriver 를 사용해야 하며, Playwright는 AppiumDriver와의 호환성 문제로 인해 사용하지 않음
 */
import { MobileActions } from '@common/actions/MobileActions';
import { appFixture } from '@common/fixtures/BaseAppFixture';
import { Logger } from '@common/logger/customLogger';
import type { TestEnvHandler } from '@common/types/test-env-handler';
// CDP 연결을 위한 유틸리티이나, 시도 시, Playwright와의 호환성 문제로 인해 사용하지 않음
// import { CDPConnectUtils } from '@common/utils/context/CDPConnectUtils';
import { ContextUtils } from '@common/utils/context/ContextUtils';
import { POCEnv } from '@common/utils/env/POCEnv';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

export class AndroidTestEnv implements TestEnvHandler {
  // 현재 실행 대상 POC 리스트
  private readonly pocList = POCEnv.getPOCList();
  // 공통 로거
  private readonly logger: winston.Logger;
  // MobileActionUtils 저장
  private readonly mobileUtilsMap = new Map<string, MobileActions>();

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
        // Appium 드라이버
        const driver = appFixture['nativeDrivers'].get(poc);
        if (!driver) {
          this.logger.warn(`[${poc}] 기존 드라이버 없음 -> 테스트 환경 초기화 실패`);
          return;
        }

        if (!driver) {
          this.logger.warn(`[${poc}] 드라이버 초기화 실패`);
          continue;
        }

        const port = appFixture.getPortForPOC(poc);
        this.logger.info(`[${poc}] 연결된 Appium 포트: ${port}`);

        // 앱 수동 실행 (포그라운드 전환)
        const appPackage =
          driver.capabilities['appium:options']?.appPackage ||
          (driver.capabilities as any).appPackage;
        if (appPackage) {
          await driver.activateApp(appPackage);
          await driver.pause(3000);
          this.logger.info(`[${poc}] 앱 실행 완료: ${appPackage}`);
        } else {
          this.logger.warn(`[${poc}] appPackage 정보가 없습니다. 앱 실행 실패`);
        }

        // 현재 컨텍스트(NATIVE/WEBVIEW) 상태 출력
        await this.logContextState(driver, poc);

        // 컨텍스트 전환 준비용 UDID 확보
        const udid =
          (driver.capabilities as any)['appium:udid'] || (driver.capabilities as any)['udid'] || '';

        // Appium만으로 WebView 전환
        if (port && udid) {
          await this.switchToWebViewContext(poc, driver);
        } else {
          this.logger.warn(`[${poc}] WebView 연결에 필요한 포트 또는 UDID 누락`);
        }

        this.logger.info(`[${poc}] Android 테스트 환경 설정 완료`);
      } catch (error) {
        await this.handleSetupError(poc, error);
        throw error;
      }
    }
  }

  /**
   * WebView 컨텍스트 전환 (Appium 단독)
   * - getContexts → WEBVIEW_* 찾기
   * - switchContext → 이후 WebView DOM 조작 가능
   */
  private async switchToWebViewContext(poc: string, driver: Browser): Promise<void> {
    try {
      const contexts = await driver.getContexts();
      const webviewCtx = contexts.find((ctx: any) =>
        typeof ctx === 'string' ? ctx.includes('WEBVIEW') : ctx.id?.includes('WEBVIEW'),
      );

      if (webviewCtx) {
        await driver.switchContext(webviewCtx);
        this.logger.info(`[${poc}] WebView 컨텍스트 전환 완료: ${webviewCtx}`);

        // WebView 내부 페이지 타이틀 확인
        const title = await driver.getTitle();
        this.logger.info(`[${poc}] WebView 페이지 타이틀: ${title}`);

        // MobileActions 생성 (page 없이 driver만 사용)
        // const actionUtils = new MobileActions(driver);
        // this.mobileUtilsMap.set(poc, actionUtils);
      } else {
        this.logger.warn(`[${poc}] WebView 컨텍스트 없음 → WebView 조작 생략`);
      }
    } catch (e) {
      this.logger.warn(
        `[${poc}] WebView 컨텍스트 전환 중 예외 발생: ${e instanceof Error ? e.message : e}`,
      );
      throw e;
    }
  }

  /** /Note: CDP 연결은 기술적인 이슈로 주석처리  */
  /**
   * Android 앱 테스트 환경 초기화 + CDP 연결
   */
  // public async setup(): Promise<void> {
  //   for (const poc of this.pocList) {
  //     this.logger.info(`[${poc}] Android 테스트 환경 설정 시작`);

  //     try {
  //       // Appium 드라이버 설정 (POC별로)
  //       const { driver }: { driver: Browser } = await appFixture.setupForPoc(poc);

  //       // 드라이버 없을 경우 스킵
  //       if (!driver) {
  //         this.logger.warn(`[${poc}] 드라이버 초기화 실패`);
  //         continue;
  //       }

  //       // Appium 포트 확인
  //       const port = appFixture.getPortForPOC(poc);
  //       this.logger.info(`[${poc}] 연결된 Appium 포트: ${port}`);

  //       // 앱 실행
  //       const appPackage =
  //         driver.capabilities['appium:options']?.appPackage ||
  //         (driver.capabilities as any).appPackage;
  //       if (appPackage) {
  //         await driver.activateApp(appPackage);
  //         await driver.pause(3000);
  //         this.logger.info(`[${poc}] 앱 실행 완료: ${appPackage}`);
  //       } else {
  //         this.logger.warn(`[${poc}] appPackage 정보가 없습니다. 앱 실행 실패`);
  //       }

  //       // 현재 컨텍스트 상태 출력
  //       await this.logContextState(driver, poc);

  //       // UDID 추출
  //       const udid =
  //         (driver.capabilities as any)['appium:udid'] || (driver.capabilities as any)['udid'] || '';

  //       if (port && udid) {
  //         // WebView 연결 시도
  //         await this.tryConnectToWebView(poc, driver, udid);
  //       } else {
  //         this.logger.warn(`[${poc}] WebView 연결에 필요한 포트 또는 UDID 누락`);
  //       }

  //       this.logger.info(`[${poc}] Android 테스트 환경 설정 완료`);
  //     } catch (error) {
  //       // 오류 발생 시 정리 및 로그 처리
  //       await this.handleSetupError(poc, error);
  //       throw error;
  //     }
  //   }
  // }

  /**
   * CDP를 사용한 WebView 연결
   */
  // private async tryConnectToWebView(poc: string, driver: Browser, udid: string): Promise<void> {
  //   try {
  //     const { wsEndpoint } = await ContextUtils.switchToWebViewCDP(driver, udid);

  //     if (!wsEndpoint) {
  //       this.logger.warn(`[${poc}] WebView 포워딩 주소(wsEndpoint) 획득 실패`);
  //       return;
  //     }

  //     const { page } = await CDPConnectUtils.connectToWebView(wsEndpoint);
  //     if (page) {
  //       const title = await page.title();
  //       this.logger.info(`[${poc}] WebView 연결 완료 (title: ${title})`);

  //       const actionUtils = new MobileActions(driver);
  //       actionUtils.setPageFromContext(page);
  //       this.mobileUtilsMap.set(poc, actionUtils);
  //     } else {
  //       throw new Error(`[${poc}] Playwright Page 객체 연결 실패 또는 없음`);
  //     }
  //   } catch (e) {
  //     // WebView 연결 예외 메시지 가독성 향상
  //     this.logger.warn(`[${poc}] WebView 연결 중 예외 발생: ${e instanceof Error ? e.message : e}`);
  //     throw e;
  //   }
  // }
  /**  Note: CDP 연결은 기술적인 이슈로 주석처리/  */

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
    // 액션 유틸 맵 정리
    this.mobileUtilsMap.clear();
  }
}
