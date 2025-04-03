/**
 * Description : BaseAppFixture.ts - 📌 APP 테스트를 위한 Fixture 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import type { POCType } from '@common/constants/PathConstants';
import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import { Logger } from '@common/logger/customLogger';
import type {
  DeviceConfigWithPort,
  DeviceOptions,
  RemoteOptions,
} from '@common/types/device-config';
import { AppiumServerUtils } from '@common/utils/appium/appiumServerUtils';
import { getAvailablePort } from '@common/utils/network/portUtils';
import { test as base, expect } from '@playwright/test';
import { remote } from 'webdriverio';
import type { Browser, DesiredCapabilities, Options } from 'webdriverio';

// Appium 서버 유틸 인스턴스
const appiumUtils = new AppiumServerUtils();

/**
 * Appium 드라이버 생성 함수
 */
async function createAppiumDriver(config: DeviceConfigWithPort): Promise<Browser> {
  const port = config.port || 4723;
  const opts: DeviceOptions = config.appium?.options || config['appium:options'] || {};

  // Appium capabilities 구성 (W3C 표준에 맞게 "appium:" prefix 사용)
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

  const driver = await remote(options as Options);
  return driver;
}

/**
 * BaseAppFixture - App 테스트 전용 Fixture 클래스
 * Appium 서버 준비, 앱 설치 및 캐시 초기화 등 포함
 */
class BaseAppFixture extends BasePocFixture {
  private configMap: Partial<Record<POCType, DeviceConfigWithPort>> = {};

  // 각 POC별 디바이스 설정 저장
  public setDeviceConfig(poc: POCType, config: DeviceConfigWithPort) {
    this.configMap[poc] = config;
  }

  // 각 POC에 맞는 사전 준비 작업 (외부에서 호출 가능하도록 public으로 변경)
  public async prepare(poc: POCType): Promise<void> {
    const config = this.configMap[poc];
    if (!config) throw new Error(`No config found for POC: ${poc}`);

    const opts: DeviceOptions = config.appium?.options || config['appium:options'] || {};
    const port = config.port || (await getAvailablePort(4723));
    config.port = port;

    const logger = Logger.getLogger(poc);
    logger.info(`[BaseAppFixture] 테스트 준비 시작`);
    logger.info(`[BaseAppFixture] 플랫폼: ${config.platformName}, UDID: ${opts.udid}`);
    logger.info(`[BaseAppFixture] Appium 포트: ${port}`);

    // Appium 서버 초기화 및 시작
    await appiumUtils.checkAndKillPort(port);
    appiumUtils.startAppiumServer(port);
    logger.info(`[BaseAppFixture] Appium 서버 시작 완료`);

    // 플랫폼별 캐시 초기화 및 앱 설치
    if (config.platformName === 'Android') {
      if (opts.appPackage) await appiumUtils.clearAndroidAppCache(opts.appPackage);
      if (opts.app) await appiumUtils.installAndroidApp(opts.app);
    } else {
      if (opts.bundleId) await appiumUtils.clearIosAppCache(opts.bundleId);
      if (opts.app) await appiumUtils.installIosApp(opts.app);
    }
  }
}

// BaseAppFixture 인스턴스 생성
const appFixture = new BaseAppFixture();

/**
 * Playwright 테스트 확장 정의
 * - Appium 드라이버 및 디바이스 설정을 fixture context에 주입
 */
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
