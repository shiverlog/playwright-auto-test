/**
 * Description : BaseAppFixture.ts - 📌 Appium 기반 Android/iOS 테스트를 위한 Fixture 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-08
 */
import { ANDROID_DEVICES, IOS_DEVICES } from '@common/config/deviceConfig';
import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import { Logger } from '@common/logger/customLogger';
import type { AppiumRemoteOptions, DeviceConfig, DeviceOptions } from '@common/types/device-config';
import { AppiumServerUtils } from '@common/utils/appium/AppiumServerUtils';
import { ChromeAccessUtils } from '@common/utils/browser/ChromeAccessUtils';
import { SafariAccessUtils } from '@common/utils/browser/SafariAccessUtils';
import { PortUtils } from '@common/utils/network/PortUtils';
import { test as base, expect } from '@playwright/test';
import { execSync } from 'child_process';
import waitOn from 'wait-on';
import { remote } from 'webdriverio';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

class BaseAppFixture extends BasePocFixture {
  private appDrivers: Map<string, Browser> = new Map();
  private appiumServers: Map<string, AppiumServerUtils> = new Map();
  private appiumPorts: Map<string, number> = new Map();

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
  public async setupForPoc(poc: string): Promise<{ driver: Browser; port: number }> {
    this.loggerPerPoc[poc].info(`[BaseAppFixture] ${poc} 환경 준비 시작`);
    await this.beforeAll(poc);
    const { driver, port } = await this.initializeAppDriver(poc);
    this.appDrivers.set(poc, driver);
    return { driver, port };
  }

  /**
   * Appium 드라이버 초기화 + Appium 서버 시작 (동시 실행 대응)
   */
  public async initializeAppDriver(poc: string): Promise<{ driver: Browser; port: number }> {
    const logger = this.loggerPerPoc[poc];
    logger.info(`[BaseAppFixture] ${poc} 디바이스 초기화 중...`);

    const deviceConfig = this.getDeviceConfig(poc);
    let port = this.appiumPorts.get(poc);
    if (!port) {
      port = await new PortUtils().getAvailablePort();
      this.appiumPorts.set(poc, port);
    }

    let appiumServer = this.appiumServers.get(poc);
    if (!appiumServer) {
      appiumServer = new AppiumServerUtils();
      this.appiumServers.set(poc, appiumServer);
    }

    if (!process.env.MANUAL_APPIUM) {
      appiumServer.startAppiumServer(port);
      await waitOn({ resources: [`http://127.0.0.1:${port}/status`], timeout: 10000 });
    }

    const { udid, platformVersion, platformName } = deviceConfig;
    if (!udid || !platformVersion)
      throw new Error(`[BaseAppFixture] '${poc}' 디바이스에 udid 또는 platformVersion이 없습니다.`);

    const isAndroid = platformName.toUpperCase() === 'ANDROID';
    const isIOS = platformName.toUpperCase() === 'IOS';
    if (!isAndroid && !isIOS)
      throw new Error(`[BaseAppFixture] 지원하지 않는 플랫폼입니다: ${platformName}`);

    const baseOptions: DeviceOptions = deviceConfig.appium?.options || {};
    const mergedOptions: AppiumRemoteOptions['capabilities']['appium:options'] = {
      ...baseOptions,
      deviceName: deviceConfig.deviceName,
      udid,
      platformVersion,
      app: deviceConfig.app,
      automationName: baseOptions.automationName || (isAndroid ? 'UiAutomator2' : 'XCUITest'),
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

    if (isAndroid) {
      const chromeUtil = new ChromeAccessUtils(driver, switchContext, udid);
      await chromeUtil.bringToFrontIfNotVisible();
      await chromeUtil.clearChromeAppData();
    } else if (isIOS) {
      const safariUtil = new SafariAccessUtils(driver, switchContext);
      await safariUtil.handleSafariSetup();
    }

    return { driver, port };
  }

  /**
   * Appium 드라이버 종료 + Appium 서버 종료
   */
  public async destroyAppDriver(poc: string): Promise<void> {
    const logger = this.loggerPerPoc[poc];
    const driver = this.appDrivers.get(poc);
    const server = this.appiumServers.get(poc);
    const port = this.appiumPorts.get(poc);

    if (driver) {
      await driver.deleteSession();
      this.appDrivers.delete(poc);
      logger.info(`[BaseAppFixture] ${poc} 드라이버 세션 종료`);
    }
    if (server && port) {
      await server.stopAppiumServer(port);
      this.appiumServers.delete(poc);
      this.appiumPorts.delete(poc);
      logger.info(`[BaseAppFixture] ${poc} Appium 서버 종료`);
    }
  }

  /**
   * 테스트 준비 단계 - BasePocFixture 추상 메서드 구현
   */
  public async prepare(poc: string): Promise<void> {
    if (poc === 'ALL') return;
    await this.initializeAppDriver(poc);
  }

  /**
   * POC 테스트 종료 후 정리 작업
   */
  public async teardownForPoc(poc: string): Promise<void> {
    await this.destroyAppDriver(poc);
    await this.afterAll(poc);
    this.loggerPerPoc[poc].info(`[BaseAppFixture] ${poc} 환경 정리 완료`);
  }

  /**
   * Playwright용 테스트 fixture 확장 정의
   */
  public getTestExtend() {
    return base.extend<{
      poc: string;
      appDriver: Browser;
    }>({
      poc: [(process.env.POC as string) || '', { option: true }],

      appDriver: async ({ poc }, use) => {
        const { driver } = await this.setupForPoc(poc);
        await use(driver);
        await this.teardownForPoc(poc);
      },
    });
  }
}

export const appFixture = new BaseAppFixture();
export const test = appFixture.getTestExtend();
export { expect };
