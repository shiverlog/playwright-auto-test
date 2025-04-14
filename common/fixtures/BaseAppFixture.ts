/**
 * Description : BaseAppFixture.ts - 📌 Appium 기반 Android/iOS 테스트를 위한 Fixture 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-12
 */
import { ANDROID_DEVICES, IOS_DEVICES } from '@common/config/deviceConfig';
import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import type {
  AppiumRemoteOptions,
  DeviceConfig,
  DeviceOptions,
} from '@common/types/device-config';
import { AppiumServerUtils } from '@common/utils/appium/AppiumServerUtils';
import { ChromeSetup } from '@common/utils/browser/ChromeSetup';
import { SafariSetup } from '@common/utils/browser/SafariSetup';
import { PortUtils } from '@common/utils/network/PortUtils';
import { ContextUtils } from '@common/utils/context/ContextUtils';
import { test as base, expect } from '@playwright/test';
import { chromium } from 'playwright';
import { remote } from 'webdriverio';
import type { Browser as WDIOBrowser } from 'webdriverio';
import waitOn from 'wait-on';
import type { Page as PWPage, Browser as PWBrowser } from 'playwright';
import axios from 'axios';
class BaseAppFixture extends BasePocFixture {
  // NativeView 제어용
  private nativeDrivers: Map<string, WDIOBrowser> = new Map();
  // WebView 제어용 Playwright 브라우저 인스턴스
  private webviewBrowsers: Map<string, PWBrowser> = new Map();
  // WebView 제어용 Playwright 페이지 객체
  private webviewPages: Map<string, PWPage> = new Map();
  // Appium 서버 유틸리티 (포트 제어, 실행/종료 관리 등)
  private appiumServers: Map<string, AppiumServerUtils> = new Map();
  // Appium 서버 포트 번호 (POC별 포트 추적용)
  private appiumPorts: Map<string, number> = new Map();

  constructor() {
    super();
  }

  /**
   * 주어진 POC에 해당하는 Appium 서버의 포트를 반환
   */
  public getPortForPOC(poc: string): number | undefined {
    return this.appiumPorts.get(poc);
  }

  /**
   * POC 키에 따른 디바이스 설정 반환
   */
  private getDeviceConfig(poc: string): DeviceConfig {
    const key = poc.toLowerCase();
    if (key.includes('android') || key.includes('aos')) return ANDROID_DEVICES['Galaxy Note20 Ultra'];
    if (key.includes('ios')) return IOS_DEVICES['iPhone 12 Pro Max'];
    throw new Error(`[BaseAppFixture] '${poc}' 디바이스 설정 없음`);
  }

  /**
   * POC 테스트 시작 전 세팅
   */
  public async setupForPoc(poc: string): Promise<{ driver: WDIOBrowser; port: number; page?: PWPage }> {
    this.getLogger(poc).info(`[BaseAppFixture] ${poc} 환경 준비 시작`);
    // BasePocFixture
    await this.beforeAll(poc);
    // initializeAppDriver
    const result = await this.initializeAppDriver(poc);
    this.nativeDrivers.set(poc, result.driver);
    if (result.page) this.webviewPages.set(poc, result.page);
    return result;
  }

  /**
   * Appium 드라이버 초기화 + Appium 서버 시작 (동시 실행 대응)
   */
  public async initializeAppDriver(poc: string): Promise<{ driver: WDIOBrowser; port: number; page?: PWPage }> {
    const logger = this.getLogger(poc);
    const device = this.getDeviceConfig(poc);
    // PortUtils 사용
    const portUtils = new PortUtils();
    const port = await portUtils.getAvailablePort();
    // AppiumServerUtils 사용
    const appiumServer = new AppiumServerUtils();
    this.appiumServers.set(poc, appiumServer);
    this.appiumPorts.set(poc, port);

    if (!process.env.MANUAL_APPIUM) {
      await appiumServer.startAppiumServer(port);
      await waitOn({ resources: [`http://127.0.0.1:${port}/status`], timeout: 10000 });
    }

    // 플랫폼 분기
    const isAndroid = device.platformName.toUpperCase() === 'ANDROID';
    const isIOS = device.platformName.toUpperCase() === 'IOS';

    const baseOpts = (device.appium?.options ?? {}) as DeviceOptions;
    const mergedOpts: AppiumRemoteOptions['capabilities']['appium:options'] = {
      ...baseOpts,
      deviceName: device.deviceName,
      udid: device.udid,
      platformVersion: device.platformVersion,
      app: device.app,
      automationName: baseOpts.automationName || (isAndroid ? 'UiAutomator2' : 'XCUITest'),
      chromedriverExecutable: process.env.CHROMEDRIVER_PATH,
      adbExecTimeout: 30000,
    };
    delete (mergedOpts as any).browserName;

    const remoteOpts: AppiumRemoteOptions = {
      protocol: 'http',
      hostname: '127.0.0.1',
      port,
      path: '/',
      capabilities: {
        platformName: device.platformName as 'Android' | 'iOS',
        'appium:options': mergedOpts,
      },
    };
    // 드라이버 셋팅
    const driver = await remote(remoteOpts);
    let page: PWPage | undefined;
    const switchCtx = async (ctx: string) => await driver.switchContext(ctx);

    // WebView 연결 전에 컨텍스트 목록 로깅
    const contexts = await driver.getContexts();
    logger.info(`[BaseAppFixture] Appium 컨텍스트 목록: ${JSON.stringify(contexts)}`);
    if (!contexts.some((ctx: any) => (typeof ctx === 'string' ? ctx.includes('WEBVIEW') : ctx.id?.includes('WEBVIEW')))) {
      logger.warn(`[BaseAppFixture] WebView 컨텍스트 없음 -> Playwright 연결 생략`);
    }

    // Android로 분기
    if (isAndroid) {
      const chrome = new ChromeSetup(driver, switchCtx, device.udid);
      // 크롬 호환성 확인
      await chrome.syncChromedriver();
      // 크롬 초기 설정
      await chrome.handleChromeSetup({ skipWebViewSwitch: !!mergedOpts.autoWebview });
      // chrome.clearChromeAppData(); // 필요시 사용

      // TODO CDP 연결 주석 처리 -> 에러 발생 해결하지 못함
      // try {
      //   // Appium 세션에서 debuggerAddress 추출
      //   const caps = driver.capabilities as any;
      //   const debuggerAddress = caps['goog:chromeOptions']?.debuggerAddress;
      //   if (!debuggerAddress) throw new Error('debuggerAddress 누락됨');

      //   const wsEndpoint = `ws://${debuggerAddress}/devtools/browser`;
      //   const pwBrowser = await chromium.connectOverCDP(wsEndpoint);
      //   const context = pwBrowser.contexts()[0];
      //   const page = context?.pages()[0] ?? await context?.newPage();
      //   if (page) this.webviewPages.set(poc, page);
      // } catch (err) {
      //   logger.warn(`[BaseAppFixture] WebView 연결 실패: ${err}`);
      // }
      // 앱 다시 앞으로 전환
      if (mergedOpts.appPackage) {
        await driver.activateApp(mergedOpts.appPackage);
        await driver.pause(3000);
      }
    }

    // iOS로 분기
    if (isIOS) {
      const safari = new SafariSetup(driver, switchCtx, device.udid);
      await safari.handleSafariSetup();

      if (mergedOpts.bundleId) {
        await driver.activateApp(mergedOpts.bundleId);
        await driver.pause(3000);
      }
    }
    return { driver, port, page };
  }

  /**
   * Appium 드라이버 종료 + Appium 서버 종료
   */
  public async destroyAppDriver(poc: string): Promise<void> {
    const logger = this.getLogger(poc);
    const driver = this.nativeDrivers.get(poc);
    const server = this.appiumServers.get(poc);
    const port = this.appiumPorts.get(poc);
    const page = this.webviewPages.get(poc);
    const portUtils = new PortUtils();

    if (page) {
      try {
        await page.context()?.close();
        logger.info(`[BaseAppFixture] ${poc} Playwright 페이지 종료 완료`);
      } catch (e) {
        logger.warn(`[BaseAppFixture] ${poc} Playwright 페이지 종료 실패: ${e}`);
      }
      this.webviewPages.delete(poc);
    }

    if (driver) {
        try {
          if ((driver as any).sessionId) {
            await driver.deleteSession();
          }
          logger.info(`[BaseAppFixture] ${poc} Appium 드라이버 세션 종료 완료`);
        } catch (e) {
          logger.warn(`[BaseAppFixture] ${poc} 드라이버 세션 종료 실패: ${e}`);
        }
        this.nativeDrivers.delete(poc);
      }

    if (server && port) {
      try {
        await server.stopAppiumServer(port);
        await portUtils.killProcessOnPorts(port);
        logger.info(`[BaseAppFixture] ${poc} Appium 서버 종료 완료 (포트: ${port})`);
      } catch (e) {
        logger.warn(`[BaseAppFixture] ${poc} Appium 서버 종료 실패: ${e}`);
      }
      this.appiumServers.delete(poc);
      this.appiumPorts.delete(poc);
    }
  }

  /**
   * 테스트 준비 단계 - BasePocFixture 추상 메서드 구현
   */
  public async prepare(poc: string): Promise<void> {
    if (poc === 'all') return;
    await this.setupForPoc(poc);
  }

  /**
   * POC 테스트 종료 후 정리 작업
   */
  public async teardownForPoc(poc: string): Promise<void> {
    await this.destroyAppDriver(poc);
    await this.afterAll(poc);
    this.getLogger(poc).info(`[BaseAppFixture] ${poc} 정리 완료`);
  }

  /**
   * Playwright용 테스트 fixture 확장 정의
   */
  public getTestExtend() {
    return base.extend<{
      poc: string;
      appDriver: WDIOBrowser;
      page?: PWPage;
    }>({
      poc: [(process.env.POC as string) || '', { option: true }],
      appDriver: async ({ poc }, use) => {
        const { driver } = await this.setupForPoc(poc);
        try {
          await use(driver);
        } finally {
          await this.teardownForPoc(poc);
        }
      },
      page: async ({ poc }, use) => {
        const page = this.webviewPages.get(poc);
        if (page) await use(page);
      },
    });
  }
}


export const appFixture = new BaseAppFixture();
export const test = appFixture.getTestExtend();
export { expect };
