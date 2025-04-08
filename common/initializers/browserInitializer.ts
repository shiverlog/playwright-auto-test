/**
 * Description : browserInitializer.ts - 📌 Android Chrome 또는 iOS Safari 초기 세팅 핸들러
 * Author : Shiwoo Min
 * Date : 2025-03-30
 */
import type { DeviceConfig } from '@common/types/device-config';
import type { POCKey } from '@common/types/platform-types';
import { ChromeAccessUtils } from '@common/utils/browser/ChromeAccessUtils';
import { SafariAccessUtils } from '@common/utils/browser/SafariAccessUtils';
import type { Browser } from 'webdriverio';

/**
 * 플랫폼에 따라 크롬 또는 사파리 초기화 수행
 */
export async function browserInitializer(
  driver: Browser,
  switchContext: (view: string) => Promise<void>,
  deviceConfig: DeviceConfig,
  poc?: POCKey,
): Promise<void> {
  const isAndroid = deviceConfig.platformName.toLowerCase() === 'android' || 'and';
  const isIOS = deviceConfig.platformName.toLowerCase() === 'ios';

  // Android Chrome 초기화
  if (isAndroid) {
    const chromeUtil = new ChromeAccessUtils(driver, switchContext, deviceConfig.udid!, poc);
    await chromeUtil.clearChromeAppData();
    await chromeUtil.autoHandleChromeSetup();
  }

  // iOS Safari 초기화
  if (isIOS) {
    const safariUtil = new SafariAccessUtils(driver, switchContext, 'IOS');
    await safariUtil.handleSafariSetup();
  }
}
