/**
 * Description : BaseAppFixture.ts - 📌 APP 테스트를 위한 Fixture 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-04
 */
/**
 * Description : BaseAppFixture.ts - 📌 APP 테스트를 위한 Fixture 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-04
 */
import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import { Logger } from '@common/logger/customLogger';
import type { DeviceConfigWithPort, DeviceOptions } from '@common/types/device-config';
import type { POCKey, POCType } from '@common/types/platform-types';
import { ALL_POCS } from '@common/types/platform-types';
import { AppiumServerUtils } from '@common/utils/appium/AppiumServerUtils';
import { getAvailablePort } from '@common/utils/network/portUtils';
import { test as base, expect } from '@playwright/test';
import { remote } from 'webdriverio';
import type { Browser, DesiredCapabilities, Options } from 'webdriverio';
import type winston from 'winston';

// Appium 유틸 인스턴스
const appiumUtils = new AppiumServerUtils();

// Appium remote wrapper
const getRemoteDriver = async (options: Options): Promise<Browser> => {
  const remoteFunc = remote as unknown as (options: Options) => Promise<Browser>;
  return await remoteFunc(options);
};

/**
 * Appium 드라이버 생성 함수
 */
async function createAppiumDriver(config: DeviceConfigWithPort): Promise<Browser> {
  const port = config.port || 4723;
  const opts: DeviceOptions = config.appium?.options || config['appium:options'] || {};

  const capabilities: DesiredCapabilities = {
    platformName: config.platformName,
    browserName: config.browserName || '',
    'appium:deviceName': config.deviceName,
    'appium:automationName':
      opts.automationName || (config.platformName === 'iOS' ? 'XCUITest' : 'UiAutomator2'),
    'appium:udid': opts.udid,
    'appium:app': opts.app,
    'appium:noReset': true,
    ...(config.platformName === 'Android'
      ? {
          'appium:appPackage': opts.appPackage,
          'appium:appActivity': opts.appActivity,
        }
      : {
          'appium:bundleId': opts.bundleId,
        }),
  };

  const options: Options = {
    protocol: 'http',
    port,
    path: '/wd/hub',
    capabilities: [capabilities],
  };

  return await getRemoteDriver(options);
}

/**
 * BaseAppFixture - App 테스트 전용 Fixture 클래스
 */
class BaseAppFixture extends BasePocFixture {
  private configMap: Partial<Record<POCKey, DeviceConfigWithPort>> = {};

  /**
   * 디바이스 설정 등록
   */
  public setDeviceConfig(poc: POCType, config: DeviceConfigWithPort): void {
    if (poc === 'ALL') return;
    const pocKey = poc as POCKey;
    this.configMap[pocKey] = config;
  }

  /**
   * 사전 준비 함수 - ALL 또는 개별 POC 모두 지원
   */
  public async prepare(poc: POCType): Promise<void> {
    const targetPOCs: POCKey[] = poc === 'ALL' ? ALL_POCS : [poc as POCKey];

    for (const pocKey of targetPOCs) {
      const config = this.configMap[pocKey];
      if (!config) throw new Error(`No config found for POC: ${pocKey}`);

      const opts: DeviceOptions = config.appium?.options || config['appium:options'] || {};
      const port = config.port || (await getAvailablePort(4723));
      config.port = port;

      const logger = Logger.getLogger(pocKey) as winston.Logger;
      logger.info(`[BaseAppFixture] 테스트 준비 시작`);
      logger.info(`[BaseAppFixture] 플랫폼: ${config.platformName}, UDID: ${opts.udid}`);
      logger.info(`[BaseAppFixture] Appium 포트: ${port}`);

      await appiumUtils.checkAndKillPort(port);
      appiumUtils.startAppiumServer(port);
      logger.info(`[BaseAppFixture] Appium 서버 시작 완료`);

      if (config.platformName === 'Android') {
        if (opts.appPackage) await appiumUtils.clearAndroidAppCache(opts.appPackage);
        if (opts.app) await appiumUtils.installAndroidApp(opts.app);
      } else {
        if (opts.bundleId) await appiumUtils.clearIosAppCache(opts.bundleId);
        if (opts.app) await appiumUtils.installIosApp(opts.app);
      }
    }
  }
}

// BaseAppFixture 인스턴스
const appFixture = new BaseAppFixture();

/**
 * Playwright 테스트 확장 정의
 */
export const test = base.extend<{
  driver: Browser;
  deviceConfig: DeviceConfigWithPort;
}>({
  driver: async ({ deviceConfig }, use) => {
    // 플랫폼명을 POCKey로 매핑 (ex: iOS → IOS, Android → AOS)
    const platformName = deviceConfig.platformName.toLowerCase();
    const poc =
      platformName === 'ios'
        ? 'IOS'
        : platformName === 'android'
          ? 'AOS'
          : (platformName.toUpperCase() as POCKey);

    const logger = Logger.getLogger(poc) as winston.Logger;

    appFixture.setDeviceConfig(poc, deviceConfig);
    await appFixture.beforeAll(poc);

    try {
      await appFixture.prepare(poc);
      const driver = await createAppiumDriver(deviceConfig);

      logger.info(`[Fixture] ${poc} 드라이버 세션 생성 완료`);
      await use(driver);
    } catch (err) {
      logger.error(`[Fixture] ${poc} 테스트 중 오류 발생: ${(err as Error).message}`);
      throw err;
    } finally {
      logger.info(`[Fixture] ${poc} 테스트 종료 - Appium 세션 및 서버 종료`);
      try {
        if (deviceConfig.port) {
          await appiumUtils.stopAppiumServer(deviceConfig.port);
        }
      } catch (e) {
        logger.warn(`[Fixture] Appium 서버 종료 중 오류: ${(e as Error).message}`);
      }
      await appFixture.afterAll(poc);
    }
  },
});

export { expect };
