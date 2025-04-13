/**
 * Description : BaseAppFixture.ts - 📌 Appium 기반 Android/iOS 테스트를 위한 Fixture 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-12
 */
import { ANDROID_DEVICES, IOS_DEVICES } from '@common/config/deviceConfig';
import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import type { AppiumRemoteOptions, DeviceConfig, DeviceOptions } from '@common/types/device-config';
import { AppiumServerUtils } from '@common/utils/appium/AppiumServerUtils';
import { ChromeSetup } from '@common/utils/browser/ChromeSetup';
import { SafariSetup } from '@common/utils/browser/SafariSetup';
import { PortUtils } from '@common/utils/network/PortUtils';
import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { exec } from 'child_process';
import { chromium } from 'playwright';
import { promisify } from 'util';
import waitOn from 'wait-on';
import { remote } from 'webdriverio';
import type { Browser } from 'webdriverio';

const MAX_PORT_OFFSET = 10;
const execAsync = promisify(exec);

class BaseAppFixture extends BasePocFixture {
  private appDrivers: Map<string, Browser> = new Map();
  private appiumServers: Map<string, AppiumServerUtils> = new Map();
  private appiumPorts: Map<string, number> = new Map();
  private appPages: Map<string, Page> = new Map();

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
    const lower = poc.toLowerCase();
    if (lower.includes('android') || lower.includes('aos'))
      return ANDROID_DEVICES['Galaxy Note20 Ultra'];
    if (lower.includes('ios')) return IOS_DEVICES['iPhone 12 Pro Max'];
    throw new Error(`[BaseAppFixture] '${poc}'에 해당하는 디바이스 설정이 없습니다.`);
  }

  /**
   * POC 테스트 시작 전 세팅 (디바이스 초기화, 로그 디렉토리 생성 등)
   */
  public async setupForPoc(poc: string): Promise<{ driver: Browser; port: number; page?: Page }> {
    this.getLogger(poc).info(`[BaseAppFixture] ${poc} 환경 준비 시작`);
    await this.beforeAll(poc);
    const { driver, port, page } = await this.initializeAppDriver(poc);
    this.appDrivers.set(poc, driver);
    if (page) this.appPages.set(poc, page);
    return { driver, port, page };
  }

  /**
   * Appium 드라이버 초기화 + Appium 서버 시작 (동시 실행 대응)
   */
  public async initializeAppDriver(
    poc: string,
  ): Promise<{ driver: Browser; port: number; page?: Page }> {
    const logger = this.getLogger(poc);
    logger.info(`[BaseAppFixture] ${poc} 디바이스 초기화 중...`);

    const deviceConfig = this.getDeviceConfig(poc);
    const portUtils = new PortUtils();
    let port = this.appiumPorts.get(poc);

    // 사용 가능한 포트 확보 + 기존 포트 강제 종료 로직 통합 (checkPort 제거)
    if (port) {
      logger.warn(
        `[BaseAppFixture] ${poc} 기존 포트 감지됨: ${port}, 강제 종료 후 새로운 포트 할당 시도`,
      );
      await portUtils.killProcessOnPorts(port);
    }
    port = await portUtils.getAvailablePort();
    this.appiumPorts.set(poc, port);

    let appiumServer = this.appiumServers.get(poc);
    if (!appiumServer) {
      appiumServer = new AppiumServerUtils();
      this.appiumServers.set(poc, appiumServer);
    }

    if (!process.env.MANUAL_APPIUM) {
      logger.info(`[BaseAppFixture] ${poc} Appium 서버 시작 (port: ${port})`);
      try {
        await appiumServer.startAppiumServer(port);
        await waitOn({ resources: [`http://127.0.0.1:${port}/status`], timeout: 10000 });
      } catch (e) {
        logger.error(`[BaseAppFixture] Appium 서버 시작 실패 (port: ${port})`);
        throw e;
      }
    }

    const { udid, platformVersion, platformName } = deviceConfig;
    if (!udid || !platformVersion) {
      throw new Error(`[BaseAppFixture] '${poc}' 디바이스에 udid 또는 platformVersion이 없습니다.`);
    }

    const isAndroid = platformName.toUpperCase() === 'ANDROID';
    const isIOS = platformName.toUpperCase() === 'IOS';
    if (!isAndroid && !isIOS) {
      throw new Error(`[BaseAppFixture] 지원하지 않는 플랫폼입니다: ${platformName}`);
    }

    const baseOptions: DeviceOptions = deviceConfig.appium?.options || {};
    const mergedOptions: AppiumRemoteOptions['capabilities']['appium:options'] = {
      ...baseOptions,
      deviceName: deviceConfig.deviceName,
      udid,
      platformVersion,
      app: deviceConfig.app,
      automationName: baseOptions.automationName || (isAndroid ? 'UiAutomator2' : 'XCUITest'),
      adbExecTimeout: 60000,
    };

    delete (mergedOptions as any).browserName;

    const remoteOptions: AppiumRemoteOptions = {
      protocol: 'http',
      hostname: '127.0.0.1',
      port,
      path: '/',
      capabilities: {
        platformName: platformName as 'Android' | 'iOS',
        'appium:options': mergedOptions,
      },
    };

    const driver = await remote(remoteOptions);
    this.appDrivers.set(poc, driver);
    logger.info(`[BaseAppFixture] ${poc} 드라이버 초기화 완료`);

    const switchContext = async (ctx: string) => await driver.switchContext(ctx);
    let page: Page | undefined;

    if (isAndroid) {
      const chromeUtil = new ChromeSetup(driver, switchContext, udid);
      // 앱 데이터 초기화
      chromeUtil.clearChromeAppData();
      // 자동 chromedriver 다운로드 처리
      await chromeUtil.syncChromedriver();
      // 초기 셋업 자동화 (버튼 클릭 등)
      await chromeUtil.handleChromeSetup();

      try {
        const localPort = 9291;
        const remoteDevtools = 'chrome_devtools_remote';
        const forwardCmd = `adb -s ${udid} forward tcp:${localPort} localabstract:${remoteDevtools}`;
        await execAsync(forwardCmd);
        logger.info(`[BaseAppFixture] WebView 디버깅 포트 포워딩: ${forwardCmd}`);

        const wsEndpoint = `http://127.0.0.1:${localPort}`;
        const pwBrowser = await chromium.connectOverCDP(wsEndpoint);
        const context = pwBrowser.contexts()[0];

        if (context) {
          const pages = context.pages();
          page = pages[0] || (await context.newPage());
          logger.info(`[BaseAppFixture] Playwright WebView 페이지 연결 완료`);
        } else {
          logger.warn(`[BaseAppFixture] Playwright context 없음 - 페이지 생성 실패`);
        }
      } catch (e) {
        logger.warn(`[BaseAppFixture] Playwright WebView 연결 실패: ${e}`);
      }

      const appPackage = mergedOptions.appPackage || mergedOptions.app?.split('/')[0];
      if (appPackage) {
        // await driver.activateApp(appPackage);
        logger.info(`[BaseAppFixture] ${poc} 앱을 포어그라운드로 bring 처리 완료`);
      } else {
        logger.warn(`[BaseAppFixture] ${poc} 앱 포어그라운드 전환 실패 - appPackage 정보 없음`);
      }
    }

    if (isIOS) {
      const safariUtil = new SafariSetup(driver, switchContext);
      await safariUtil.handleSafariSetup();

      const bundleId = mergedOptions.bundleId || mergedOptions.app;
      if (bundleId) {
        await driver.activateApp(bundleId);
        logger.info(`[BaseAppFixture] ${poc} 앱을 포어그라운드로 bring 처리 완료`);
      } else {
        logger.warn(`[BaseAppFixture] ${poc} 앱 포어그라운드 전환 실패 - bundleId 정보 없음`);
      }
    }

    return { driver, port, page };
  }

  /**
   * Appium 드라이버 종료 + Appium 서버 종료
   */
  public async destroyAppDriver(poc: string): Promise<void> {
    const logger = this.getLogger(poc);
    const driver = this.appDrivers.get(poc);
    const server = this.appiumServers.get(poc);
    const port = this.appiumPorts.get(poc);
    const page = this.appPages.get(poc);

    if (driver) {
      // 수정: 세션 ID 존재 여부 확인 후 안전하게 종료
      if (driver.sessionId) {
        try {
          await driver.deleteSession();
        } catch (e) {
          logger.warn(`[BaseAppFixture] ${poc} 드라이버 세션 종료 실패: ${e}`);
        }
      } else {
        logger.warn(`[BaseAppFixture] ${poc} 드라이버 세션 없음 또는 이미 종료됨`);
      }

      this.appDrivers.delete(poc);
      logger.info(`[BaseAppFixture] ${poc} 드라이버 세션 종료`);
    }

    if (page) {
      // playwright page 정리
      try {
        await page.context()?.close();
      } catch (e) {
        logger.warn(`[BaseAppFixture] ${poc} Playwright page 종료 실패: ${e}`);
      }
      this.appPages.delete(poc);
    }

    if (server && port) {
      await server.stopAppiumServer(port);
      this.appiumServers.delete(poc);
      this.appiumPorts.delete(poc);
      logger.info(`[BaseAppFixture] ${poc} Appium 서버 종료`);

      // 포트 강제 종료 처리 추가
      try {
        await new PortUtils().killProcessOnPorts(port);
        logger.info(`[BaseAppFixture] ${poc} Appium 포트 프로세스 강제 종료 완료`);
      } catch (e) {
        logger.warn(`[BaseAppFixture] ${poc} 포트 강제 종료 실패 또는 필요 없음: ${e}`);
      }
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
    this.getLogger(poc).info(`[BaseAppFixture] ${poc} 환경 정리 완료`);
  }

  /**
   * Playwright용 테스트 fixture 확장 정의
   */
  public getTestExtend() {
    return base.extend<{
      poc: string;
      appDriver: Browser;
      page?: Page;
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
        const page = this.appPages.get(poc);
        if (page) await use(page);
      },
    });
  }
}

export const appFixture = new BaseAppFixture();
export const test = appFixture.getTestExtend();
export { expect };
