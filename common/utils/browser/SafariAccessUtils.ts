/**
 * Description : SafariAccessUtils.ts - 📌 iOS 기반의 Safari 브라우저 및 설정 앱 자동화를 위한 유틸리티 클래스
 * Author : Shiwoo Min
 * Date : 2024-04-10
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

export class SafariAccessUtils {
  // WebDriverIO 기반 iOS 드라이버 인스턴스
  private readonly driver: Browser;
  // Appium 콘텍스트 전환 함수 (NATIVE_APP, WEBVIEW 등 전환용)
  private readonly switchContext: (view: string) => Promise<void>;

  /** 현재 POC 동적 추출 */
  private get poc(): string {
    return POCEnv.getType() || 'ALL';
  }

  /** 로깅 인스턴스 */
  private get logger(): winston.Logger {
    return Logger.getLogger(this.poc) as winston.Logger;
  }

  constructor(driver: Browser, switchContext: (view: string) => Promise<void>) {
    this.driver = driver;
    this.switchContext = switchContext;
  }

  /**
   * Safari 실행 후 최초 팝업/권한 등을 자동 처리
   */
  async handleSafariSetup(): Promise<void> {
    this.logger.info(`[${this.poc}] Safari 처음 팝업/권한 처리 시작`);
    await this.switchContext('NATIVE_APP');
    await this.driver.setTimeout({ implicit: 2000 });

    const stepLabels = ['Continue', 'Allow', 'Not Now', 'Done'];

    for (const label of stepLabels) {
      const el = await this.findElementByLabel(label);
      if (el) {
        this.logger.info(`[${this.poc}] '${label}' 클릭`);
        await el.click();
      }
    }

    await this.driver.setTimeout({ implicit: 20000 });
    this.logger.info(`[${this.poc}] Safari 처음 처리 완료`);
  }

  /**
   * Safari 방문 기록 및 웹사이트 데이터 지우기
   * iOS 설정 앱 > Safari > 방문 기록 지우기 흐름 자동화
   */
  async clearSafariCache(): Promise<void> {
    this.logger.info(`[${this.poc}] Safari 캐시 정리 시작`);
    try {
      await this.switchContext('NATIVE_APP');
      await this.driver.activateApp('com.apple.Preferences');
      await this.pause(1500);

      await this.swipeUp();

      const safari = await this.findElementByLabel('Safari');
      if (safari) await safari.click();

      await this.pause(1000);
      await this.swipeUp();
      await this.swipeUp();

      const clearData = await this.findElementByLabel('방문 기록 및 웹사이트 데이터 지우기');
      if (clearData) await clearData.click();

      const confirm = await this.findElementByLabel('모든 방문 기록');
      if (confirm) await confirm.click();

      const tabClose = await this.findElementByLabel('모든 탭 닫기');
      if (tabClose && (await tabClose.getAttribute('value')) === '0') {
        await tabClose.click();
      }

      const finalConfirm = await this.findElementByLabel('방문 기록 지우기');
      if (finalConfirm) await finalConfirm.click();

      this.logger.info(`[${this.poc}] Safari 캐시 정리 완료`);

      await this.driver.activateApp('com.lguplus.mobile.cs');
      await this.switchContext('WEBVIEW_com.lguplus.mobile.cs');
    } catch (e) {
      this.logger.error(`[${this.poc}] Safari 캐시 정리 중 예외 발생: ${e}`);
      await this.driver.activateApp('com.lguplus.mobile.cs');
      await this.switchContext('WEBVIEW_com.lguplus.mobile.cs');
    }
  }

  /**
   * label을 가진 요소 탐색
   */
  private async findElementByLabel(label: string) {
    try {
      const el = await this.driver.$(`-ios predicate string:label == "${label}" AND visible == 1`);
      if (await el.isDisplayed()) return el;
      return null;
    } catch {
      return null;
    }
  }

  /**
   * 위로 스와이프
   */
  private async swipeUp(): Promise<void> {
    const { height, width } = await this.driver.getWindowSize();
    const startY = Math.floor(height * 0.8);
    const endY = Math.floor(height * 0.2);
    const startX = Math.floor(width / 2);

    await this.driver.touchPerform([
      { action: 'press', options: { x: startX, y: startY } },
      { action: 'wait', options: { ms: 300 } },
      { action: 'moveTo', options: { x: startX, y: endY } },
      { action: 'release' },
    ]);

    await this.pause(1000);
  }

  /**
   * 지연 시간 대기
   */
  private async pause(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
