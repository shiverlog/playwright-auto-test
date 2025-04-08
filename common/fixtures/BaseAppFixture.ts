/**
 * Description : BaseAppFixture.ts - 📌 Appium 기반 Android/iOS 테스트를 위한 Fixture 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-06
 */
import { ANDROID_DEVICES, IOS_DEVICES } from '@common/config/deviceConfig';
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
   * POC 테스트 시작 전 세팅 (디버이스 초기화, 로그 디렉토리 생성 등)
   */
  public async setupForPoc(poc: POCKey): Promise<Browser> {
    const logger = Logger.getLogger(poc) as winston.Logger;
    logger.info(`[BaseAppFixture] ${poc} 환경 준비 시작`);
    // 테스트 실행 전 공통 작업 실행
    await this.beforeAll(poc);
    const driver = await this.initializeAppDriver(poc);
    // appDrivers에 드라이버를 클래스 멤버로 저장
    this.appDrivers.set(poc, driver);
    return driver;
  }

  /**
   * Appium 드라이버 초기화 + Appium 서버 시작 (동시 실행 대응)
   */
  public async initializeAppDriver(poc: POCKey): Promise<Browser> {
    const logger = Logger.getLogger(poc) as winston.Logger;
    logger.info(`[BaseAppFixture] ${poc} 디바이스 초기화 중...`);

    // 디바이스 설정 가져오기
    const deviceConfig = getDeviceConfigByPoc(poc);

    // 이미 포트가 할당되어 있는지 확인 (중복 포트 방지용)
    let port = this.appiumPorts.get(poc);
    if (!port) {
      // 포트 동적 할당
      port = await getAvailablePort();
      this.appiumPorts.set(poc, port);
    }

    // Appium 서버 유틸 인스턴스 생성 및 저장
    let appiumServer = this.appiumServers.get(poc);
    if (!appiumServer) {
      appiumServer = new AppiumServerUtils(poc);
      this.appiumServers.set(poc, appiumServer);
    }

    appiumServer.startAppiumServer(port);
    await waitOn({ resources: [`http://127.0.0.1:${port}/status`], timeout: 10000 });

    if (!deviceConfig.udid || !deviceConfig.platformVersion) {
      throw new Error(`[BaseAppFixture] '${poc}' 디바이스에 udid 또는 platformVersion이 없습니다.`);
    }

    const platformName = deviceConfig.platformName;
    const isAndroid = platformName.toUpperCase() === 'ANDROID';
    const isIOS = platformName.toUpperCase() === 'IOS';

    if (!isAndroid && !isIOS) {
      throw new Error(`[BaseAppFixture] 지원하지 않는 플랫폼입니다: ${platformName}`);
    }

    // const appiumOptions = isAndroid
    //   ? {
    //       automationName: 'UiAutomator2' as const,
    //       appPackage: deviceConfig['appium:options']?.appPackage,
    //       appActivity: deviceConfig['appium:options']?.appActivity,
    //     }
    //   : {
    //       automationName: 'XCUITest' as const,
    //       bundleId: deviceConfig['appium:options']?.bundleId,
    //       useNewWDA: true,
    //       autoAcceptAlerts: true,
    //       safariInitialUrl: deviceConfig['appium:options']?.safariInitialUrl,
    //     };

    // const remoteOptions: AppiumRemoteOptions = {
    //   protocol: 'http',
    //   hostname: '127.0.0.1',
    //   port,
    //   path: '/',
    //   capabilities: {
    //     platformName: platformName as 'Android' | 'iOS',
    //     'appium:options': {
    //       deviceName: deviceConfig.deviceName,
    //       udid: deviceConfig.udid,
    //       platformVersion: deviceConfig.platformVersion,
    //       noReset: true,
    //       app: deviceConfig.app,
    //       ...appiumOptions,
    //     },
    //   },
    // };

    const appiumOptions: AppiumRemoteOptions['capabilities']['appium:options'] = {
      deviceName: deviceConfig.deviceName,
      udid: deviceConfig.udid,
      platformVersion: deviceConfig.platformVersion,
      app: deviceConfig.app,
      noReset: true,
      automationName: isAndroid ? 'UiAutomator2' : 'XCUITest',
      // 실행 앱을 지정
      ...(isAndroid
        ? {
            appPackage: deviceConfig['appium:options']?.appPackage,
            appActivity: deviceConfig['appium:options']?.appActivity,
          }
        : {
            bundleId: deviceConfig['appium:options']?.bundleId,
            useNewWDA: true,
            autoAcceptAlerts: true,
            safariInitialUrl: deviceConfig['appium:options']?.safariInitialUrl,
          }),
    };

    const remoteOptions: AppiumRemoteOptions = {
      protocol: 'http',
      hostname: '127.0.0.1',
      port,
      path: '/',
      capabilities: {
        platformName: platformName as 'Android' | 'iOS',
        'appium:options': appiumOptions,
      },
    };

    const driver = await remote(remoteOptions);
    this.appDrivers.set(poc, driver);
    logger.info(`[BaseAppFixture] ${poc} 드라이버 초기화 완료`);

    const switchContext = async (ctx: string) => await driver.switchContext(ctx);

    // Chrome 및 iOS 초기화 작업
    if (isAndroid) {
      const chromeUtil = new ChromeAccessUtils(driver, switchContext, deviceConfig.udid, poc);
      // Android 크롬 초기화
      await chromeUtil.clearChromeAppData();
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
   * 테스트 준비 단계 - BasePocFixture 추상 메서드 구현
   */
  public async prepare(poc: POCType): Promise<void> {
    if (poc === 'ALL') return;
    const pocKey = poc as POCKey;
    await this.initializeAppDriver(pocKey);
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
