/**
 * Description : ChromeAccessUtils.ts - 📌 Android 기반의 Chrome 브라우저 초기 셋업 자동화 유틸리티
 * Author : Shiwoo Min
 * Date : 2024-04-11
 */
import { Logger } from '@common/logger/customLogger';
import type { ChromeAccessConfig } from '@common/types/device-config';
import { POCEnv } from '@common/utils/env/POCEnv';
import { execSync } from 'child_process';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

export type ChromeFlavor = 'stable' | 'beta' | 'v135plus';

// Chrome 버전별 또는 채널별 초기화 단계 ID 구성
const CHROME_CONFIGS: Record<ChromeFlavor, ChromeAccessConfig> = {
  stable: {
    pkgPrefix: 'com.android.chrome:id',
    stepIds: [
      'terms_accept',
      'signin_fre_continue_button',
      'positive_button',
      'negative_button',
      'com.android.permissioncontroller:id/permission_allow_button',
    ],
  },
  beta: {
    pkgPrefix: 'com.chrome.beta:id',
    stepIds: [
      'signin_fre_continue_button',
      'button_primary',
      'terms_accept',
      'positive_button',
      'com.android.permissioncontroller:id/permission_allow_button',
    ],
  },
  v135plus: {
    pkgPrefix: 'com.android.chrome:id',
    stepIds: [
      'button_primary',
      'signin_fre_continue_button',
      'terms_accept',
      'positive_button',
      'com.android.permissioncontroller:id/permission_allow_button',
    ],
  },
};

export class ChromeAccessUtils {
  private readonly driver: Browser;
  private readonly switchContext: (view: string) => Promise<void>;
  private readonly udid: string;

  /** 현재 POC 동적 추출 */
  private get poc(): string {
    return POCEnv.getType() || 'ALL';
  }

  /** 로깅 인스턴스 */
  private get logger(): winston.Logger {
    return Logger.getLogger(this.poc) as winston.Logger;
  }

  constructor(driver: Browser, switchContext: (view: string) => Promise<void>, udid: string) {
    this.driver = driver;
    this.switchContext = switchContext;
    this.udid = udid;
  }

  /**
   * 지정된 Chrome flavor에 따라 초기 설정을 자동으로 처리
   */
  async handleChromeSetup(flavor: ChromeFlavor): Promise<void> {
    const config = CHROME_CONFIGS[flavor];

    this.switchContext('NATIVE_APP');
    await this.driver.setTimeout({ implicit: 2000 });

    for (const id of config.stepIds) {
      const fullId = id.includes(':') ? id : `${config.pkgPrefix}/${id}`;
      const el = await this.findElementIfExists(fullId);
      if (el) {
        await el.click();
        this.logger.info(`[ChromeSetup] 클릭됨: ${fullId}`);
      }
    }
    await this.driver.setTimeout({ implicit: 20000 });
  }

  /**
   * Chrome 버전을 자동 감지하여 알맞은 flavor로 초기 설정 수행
   */
  async autoHandleChromeSetup(): Promise<void> {
    const caps = this.driver.capabilities;
    const version = (caps.browserVersion || (caps as any).platformVersion || '0.0') as string;
    const flavor = detectChromeFlavor(version);
    this.logger.info(`[ChromeSetup] 감지된 버전: ${version} → Flavor: ${flavor}`);
    await this.handleChromeSetup(flavor);
  }

  /**
   * Chrome 앱 데이터 초기화 (ADB shell pm clear)
   */
  clearChromeAppData(): void {
    const packageName = 'com.android.chrome';
    try {
      const result = execSync(`adb -s ${this.udid} shell pm clear ${packageName}`, {
        encoding: 'utf-8',
      });

      if (!result.includes('Success')) {
        this.logger.warn(`[ADB] Chrome clear 실패: ${result}`);
        throw new Error(`Chrome 데이터 초기화 실패`);
      }

      this.logger.info('[ADB] Chrome 앱 데이터 초기화 완료');
    } catch (e) {
      this.logger.error('[ADB] Chrome 데이터 초기화 중 예외:', e);
    }
  }

  /**
   * Chrome 앱이 포그라운드에 없을 경우 강제로 앞으로 가져오기
   */
  async bringToFrontIfNotVisible(): Promise<void> {
    try {
      const currentPackage = await this.driver.getCurrentPackage?.();

      if (currentPackage !== 'com.android.chrome') {
        this.logger.info(`[ChromeAccess] 현재 앱이 Chrome이 아님 (${currentPackage}) -> 강제 전환`);
        await this.driver.activateApp('com.android.chrome');
        await this.driver.pause(2000);
      } else {
        this.logger.info(`[ChromeAccess] Chrome이 이미 포그라운드에 있음`);
      }
    } catch (e) {
      this.logger.error('[ChromeAccess] 포그라운드 앱 전환 실패:', e);
    }
  }

  /**
   * 단순 고정된 ID 순서에 따른 Chrome 초기화 (버전 무관한 공통 처리)
   */
  async chromeAccessBasic(): Promise<void> {
    await this.bringToFrontIfNotVisible();
    this.switchContext('NATIVE_APP');
    await this.driver.setTimeout({ implicit: 2000 });

    const tryClick = async (resourceId: string) => {
      const el = await this.findElementIfExists(resourceId);
      if (el) {
        await el.click();
        this.logger.info(`[ChromeBasic] 클릭됨: ${resourceId}`);
      }
    };

    await tryClick('com.android.chrome:id/signin_fre_continue_button');
    await tryClick('com.android.chrome:id/button_primary');
    await tryClick('com.android.chrome:id/ack_button');

    const negativeBtn = await this.findElementIfExists('com.android.chrome:id/negative_button');
    if (negativeBtn) {
      await negativeBtn.click();
      await tryClick('com.android.permissioncontroller:id/permission_allow_button');
    }

    await this.driver.setTimeout({ implicit: 20000 });
    this.switchContext('WEBVIEW_com.lguplus.mobile.cs');
  }

  /**
   * 주어진 resource-id를 가진 요소가 존재하면 반환
   */
  private async findElementIfExists(resourceId: string) {
    try {
      const el = await this.driver.$(`id=${resourceId}`);
      if (await el.isDisplayed()) return el;
      return null;
    } catch {
      return null;
    }
  }
}

/**
 * Chrome 버전 문자열을 기반으로 flavor 판단
 */
export function detectChromeFlavor(version: string): ChromeFlavor {
  const major = parseInt(version.split('.')[0], 10);

  if (isNaN(major)) return 'stable';
  if (major >= 135) return 'v135plus';

  return 'stable';
}
