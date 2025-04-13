/**
 * Description : ChromeSetup.ts - 📌 Android 기반의 Chrome 브라우저 초기 셋업 자동화 유틸리티 (공통 처리)
 * Author : Shiwoo Min
 * Date : 2024-04-13
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import { execSync } from 'child_process';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

export class ChromeSetup {
  private readonly logger: winston.Logger;
  private readonly poc: string;
  private readonly driver: Browser;
  private readonly switchContext: (view: string) => Promise<void>;
  private readonly udid: string;

  constructor(driver: Browser, switchContext: (view: string) => Promise<void>, udid: string) {
    this.driver = driver;
    this.switchContext = switchContext;
    this.udid = udid;
    this.poc = POCEnv.getType();
    this.logger = Logger.getLogger(this.poc.toUpperCase()) as winston.Logger;
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
   * 공통 순서로 Chrome 초기 설정 처리
   */
  async handleChromeSetup(): Promise<void> {
    await this.bringToFrontIfNotVisible();
    await this.switchContext('NATIVE_APP');
    await this.driver.setTimeout({ implicit: 2000 });

    const stepIds = [
      'com.android.chrome:id/signin_fre_continue_button',
      'com.android.chrome:id/button_primary',
      'com.android.chrome:id/ack_button',
      'com.android.chrome:id/positive_button',
      'com.android.chrome:id/negative_button',
      'com.android.permissioncontroller:id/permission_allow_button',
    ];

    for (const resourceId of stepIds) {
      await this.tryClick(resourceId);
    }

    await this.driver.setTimeout({ implicit: 20000 });
    await this.switchToWebViewContext();
  }

  /**
   * WEBVIEW 컨텍스트가 존재할 경우 자동 전환
   */
  private async switchToWebViewContext(): Promise<void> {
    try {
      const contexts = await this.driver.getContexts?.();
      const contextIdList = Array.isArray(contexts)
        ? contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id || ''))
        : [];

      const target = contextIdList.find(id => id.includes('WEBVIEW'));
      if (target) {
        await this.switchContext(target);
        this.logger.info(`[ChromeAccess] WebView 컨텍스트 전환 완료: ${target}`);
      } else {
        this.logger.warn('[ChromeAccess] WebView 컨텍스트를 찾을 수 없습니다.');
      }
    } catch (e) {
      this.logger.error('[ChromeAccess] WebView 컨텍스트 전환 실패:', e);
    }
  }

  /**
   * 리소스 ID 기준으로 요소를 찾아 클릭
   */
  private async tryClick(resourceId: string): Promise<void> {
    const el = await this.findElementIfExists(resourceId);
    if (el) {
      try {
        await el.click();
        this.logger.info(`[ChromeSetup] 클릭됨: ${resourceId}`);
      } catch (e) {
        this.logger.warn(`[ChromeSetup] 클릭 실패: ${resourceId}`, e);
      }
    }
  }

  /**
   * 주어진 resource-id를 가진 요소가 존재하면 반환
   */
  private async findElementIfExists(resourceId: string) {
    try {
      const el = await this.driver.$(`id=${resourceId}`);
      return (await el.isDisplayed()) ? el : null;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      this.logger.debug(`[ChromeSetup] 요소 탐색 실패 (${resourceId}): ${msg}`);
      return null;
    }
  }

  /**
   * 디바이스의 크롬 버전에 맞는 Chromedriver 자동 다운로드 처리
   */
  public async syncChromedriver(): Promise<void> {
    try {
      const versionCmd = `adb -s ${this.udid} shell dumpsys package com.android.chrome | grep versionName`;
      const result = execSync(versionCmd, { encoding: 'utf-8' });
      const matched = result.match(/versionName=([\d.]+)/);
      const chromeVersion = matched?.[1] ?? '';

      if (!chromeVersion) {
        this.logger.warn('[Chromedriver] Chrome 버전 탐지 실패');
        return;
      }

      const majorVersion = parseInt(chromeVersion.split('.')[0], 10);
      this.logger.info(`[Chromedriver] Chrome 버전: ${chromeVersion} → major: ${majorVersion}`);

      // chromedriver_autodownload 옵션 활성화 안내
      this.logger.info(
        `[Chromedriver] 자동 다운로드 기능을 사용하려면 Appium 실행 시 '--use-plugins=chromedriver' 옵션이 필요합니다.`,
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      this.logger.error('[Chromedriver] 크롬 버전 확인 실패:', msg);
    }
  }
}
