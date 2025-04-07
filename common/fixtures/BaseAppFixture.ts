/**
 * Description : BaseAppFixture.ts - 📌 Appium 기반 Android/iOS 테스트를 위한 Fixture 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-06
 */
import { ANDROID_DEVICES, IOS_DEVICES } from '@common/config/BaseDeviceConfig';
import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import { Logger } from '@common/logger/customLogger';
import type { AppiumRemoteOptions, DeviceConfig } from '@common/types/device-config';
import type { POCKey, POCType } from '@common/types/platform-types';
import { AppiumServerUtils } from '@common/utils/appium/AppiumServerUtils';
import { ChromeAccessUtils } from '@common/utils/browser/ChromeAccessUtils';
import { SafariAccessUtils } from '@common/utils/browser/SafariAccessUtils';
import { getAvailablePort } from '@common/utils/network/portUtils';
import { test as base, expect } from '@playwright/test';
import waitOn from 'wait-on';
import { remote } from 'webdriverio';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

/**
 * 리그레이션 전용 기기 설정 디바이스 매핑
 */
function getDeviceConfigByPoc(poc: POCKey): DeviceConfig {
  const lower = poc.toLowerCase();

  if (lower.includes('android') || lower.includes('aos')) {
    return ANDROID_DEVICES['Galaxy Note20 Ultra'];
  }
  if (lower.includes('ios')) {
    return IOS_DEVICES['iPhone 12 Pro Max'];
  }
  throw new Error(`[BaseAppFixture] '${poc}'에 해당하는 디버이스 설정이 없습니다.`);
}
class BaseAppFixture extends BasePocFixture {
  private appDrivers: Map<POCKey, Browser> = new Map();
  private appiumServers: Map<POCKey, AppiumServerUtils> = new Map();
  private appiumPorts: Map<POCKey, number> = new Map();

  /**
   * Appium 드라이버 초기화 + Appium 서버 시작
   */
  public async initializeAppDriver(poc: POCKey): Promise<Browser> {
    const logger = Logger.getLogger(poc) as winston.Logger;
    logger.info(`[BaseAppFixture] ${poc} 디바이스 초기화 중...`);

    const deviceConfig = getDeviceConfigByPoc(poc);
    const port = await getAvailablePort();
    this.appiumPorts.set(poc, port);

    const appiumServer = new AppiumServerUtils(poc);
    this.appiumServers.set(poc, appiumServer);
    await appiumServer.stopAppiumServer(port);
    appiumServer.startAppiumServer(port);
    await waitOn({
      resources: [`http://127.0.0.1:${port}/status`],
      timeout: 10000,
    });
    // 런타임 검증
    if (!deviceConfig.udid || !deviceConfig.platformVersion) {
      throw new Error(`[BaseAppFixture] '${poc}' 디바이스에 udid 또는 platformVersion이 없습니다.`);
    }

    // 플랫폼 구분
    const platformName = deviceConfig.platformName;
    const isAndroid = platformName.toUpperCase() === 'ANDROID';
    const isIOS = platformName.toUpperCase() === 'IOS';

    if (!isAndroid && !isIOS) {
      throw new Error(`[BaseAppFixture] 지원하지 않는 플랫폼입니다: ${platformName}`);
    }

    // 공통 옵션
    const commonOptions = {
      deviceName: deviceConfig.deviceName,
      udid: deviceConfig.udid,
      platformVersion: deviceConfig.platformVersion,
      noReset: true,
      app: deviceConfig.app,
    };

    // platformName에 따라 capabilities 분기
    const remoteOptions: AppiumRemoteOptions = {
      protocol: 'http',
      hostname: '127.0.0.1',
      port,
      path: '/',
      capabilities: {
        platformName: platformName as 'Android' | 'iOS',
        'appium:options': isAndroid
          ? {
              ...commonOptions,
              automationName: 'UiAutomator2',
              appPackage: deviceConfig['appium:options']?.appPackage,
              appActivity: deviceConfig['appium:options']?.appActivity,
            }
          : {
              ...commonOptions,
              automationName: 'XCUITest',
              bundleId: deviceConfig['appium:options']?.bundleId,
              useNewWDA: true,
              autoAcceptAlerts: true,
              safariInitialUrl: deviceConfig['appium:options']?.safariInitialUrl,
            },
      },
    };

    const driver = await remote(remoteOptions);
    this.appDrivers.set(poc, driver);

    logger.info(`[BaseAppFixture] ${poc} 드라이버 초기화 완료`);

    // 컨텍스트 전환 핸들러
    const switchContext = async (ctx: string) => await driver.switchContext(ctx);

    // 플랫폼별 브라우저 초기화 유틸 실행
    if (isAndroid) {
      const chromeUtil = new ChromeAccessUtils(driver, switchContext, deviceConfig.udid, poc);
      chromeUtil.clearChromeAppData();
      await chromeUtil.autoHandleChromeSetup();
    } else if (isIOS) {
      const safariUtil = new SafariAccessUtils(driver, switchContext, poc);
      await safariUtil.handleSafariSetup();
    }
    return driver;
  }

  /**
   * Appium 드라이버 종료 + Appium 서버 종료
   */
  public async destroyAppDriver(poc: POCKey): Promise<void> {
    const logger = Logger.getLogger(poc) as winston.Logger;
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
      logger.info(`[BaseAppFixture] ${poc} Appium 서버 종료`);
      this.appiumServers.delete(poc);
      this.appiumPorts.delete(poc);
    }
  }

  /**
   * 테스트 준비 단계 - BasePocFixture 추사 메서드 구현
   */
  public async prepare(poc: POCType): Promise<void> {
    if (poc === 'ALL') return;
    const pocKey = poc as POCKey;
    await this.initializeAppDriver(pocKey);
  }

  /**
   * POC 테스트 시작 전 세팅 (디버이스 초기화, 로그 디렉토리 생성 등)
   */
  public async setupForPoc(poc: POCKey): Promise<Browser> {
    const logger = Logger.getLogger(poc) as winston.Logger;
    logger.info(`[BaseAppFixture] ${poc} 환경 준비 시작`);
    await this.beforeAll(poc);
    const driver = await this.initializeAppDriver(poc);
    return driver;
  }

  /**
   * POC 테스트 종료 후 정리 작업
   */
  public async teardownForPoc(poc: POCKey): Promise<void> {
    const logger = Logger.getLogger(poc) as winston.Logger;
    await this.destroyAppDriver(poc);
    await this.afterAll(poc);
    logger.info(`[BaseAppFixture] ${poc} 환경 정리 완료`);
  }

  /**
   * Playwright용 테스트 fixture 확장 정의
   */
  public getTestExtend() {
    return base.extend<{
      poc: POCType;
      appDriver: Browser;
    }>({
      poc: [(process.env.POC as POCType) || '', { option: true }],

      appDriver: async ({ poc }, use) => {
        const pocKey = poc as POCKey;
        const driver = await this.setupForPoc(pocKey);
        await use(driver);
        await this.teardownForPoc(pocKey);
      },
    });
  }
}

// App Fixture 인스턴스 생성 및 테스트 확장
export const appFixture = new BaseAppFixture();
export const test = appFixture.getTestExtend();
export { expect };
