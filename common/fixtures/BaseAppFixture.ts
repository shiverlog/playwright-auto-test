import type { AndroidDeviceConfig, IOSDeviceConfig } from '@common/config/BaseDeviceConfig';
import type { POCType } from '@common/constants/PathConstants';
import { BaseFixture } from '@common/fixtures/BaseFixture';
import { Logger } from '@common/logger/customLogger';
import { AppiumServerUtils } from '@common/utils/appium/appiumServerUtils';
import { getAvailablePort } from '@common/utils/network/portUtils';
import { test as base, expect } from '@playwright/test';
import type { Browser, DesiredCapabilities, Options } from 'webdriverio';
import { remote } from 'webdriverio';

// 타입 정의
export type DeviceConfigWithPort =
  | (AndroidDeviceConfig & {
      platformName: 'Android';
      deviceName: string;
      app: string;
      automationName?: string;
      port?: number;
    })
  | (IOSDeviceConfig & {
      platformName: 'iOS';
      deviceName: string;
      app?: string;
      automationName?: string;
      port?: number;
    });

// Appium 유틸 인스턴스
const appiumUtils = new AppiumServerUtils();

async function createAppiumDriver(config: DeviceConfigWithPort): Promise<Browser> {
  const port = config.port || 4723;

  const capabilities = {
    platformName: config.platformName,
    deviceName: config.deviceName,
    udid: config.udid,
    automationName:
      config.automationName || (config.platformName === 'iOS' ? 'XCUITest' : 'UiAutomator2'),
    app: config.app,
    noReset: true,
    ...(config.platformName === 'Android'
      ? {
          appPackage: config.appPackage,
          appActivity: config.appActivity,
        }
      : {
          bundleId: config.bundleId,
        }),
  } as Record<string, any>;

  const options = {
    protocol: 'http',
    hostname: 'localhost',
    port,
    path: '/wd/hub',
    capabilities,
  } as unknown as Options;

  const driver = (await remote(options)) as unknown as Browser;
  return driver;
}

// BaseAppFixture 구현
class BaseAppFixture extends BaseFixture {
  private configMap: Partial<Record<POCType, DeviceConfigWithPort>> = {};

  public setDeviceConfig(poc: POCType, config: DeviceConfigWithPort) {
    this.configMap[poc] = config;
  }

  override async prepare(poc: POCType): Promise<void> {
    const config = this.configMap[poc];
    if (!config) throw new Error(`No config found for POC: ${poc}`);

    const port = config.port || (await getAvailablePort(4723));
    config.port = port;

    const logger = Logger.getLogger(poc);
    logger.info(
      `[BaseAppFixture] 테스트 준비 - 플랫폼: ${config.platformName}, UDID: ${config.udid}`,
    );
    logger.info(`[BaseAppFixture] Appium 포트 할당: ${port}`);

    await appiumUtils.checkAndKillPort(port);
    appiumUtils.startAppiumServer(port);
    logger.info(`[BaseAppFixture] Appium 서버 시작됨 (포트: ${port})`);

    if (config.platformName === 'Android') {
      await appiumUtils.clearAndroidAppCache(config.appPackage);
      await appiumUtils.installAndroidApp(config.app);
    } else {
      if (config.bundleId) {
        await appiumUtils.clearIosAppCache(config.bundleId);
      }
      if (config.app) {
        await appiumUtils.installIosApp(config.app);
      }
    }
  }
}

// BaseAppFixture 인스턴스
const appFixture = new BaseAppFixture();

// Playwright Fixture 정의
export const test = base.extend<{
  driver: Browser;
  deviceConfig: DeviceConfigWithPort;
}>({
  driver: async ({ deviceConfig }, use) => {
    const poc = deviceConfig.platformName as POCType;
    const logger = Logger.getLogger(poc);

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
