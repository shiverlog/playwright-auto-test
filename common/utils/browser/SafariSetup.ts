/**
 * Description : SafariSetup.ts - 📌 iOS 기반의 Safari 브라우저 및 설정 앱 자동화를 위한 유틸리티 클래스
 * Author : Shiwoo Min
 * Date : 2024-04-14
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type { Browser } from 'webdriverio';
import type winston from 'winston';
import { PortUtils } from '@common/utils/network/PortUtils';
import waitOn from 'wait-on';
import type { Page as PWPage } from '@playwright/test';
import { chromium } from 'playwright';

export class SafariSetup {
  // winston 로깅 인스턴스
  private readonly logger: winston.Logger;
  // 현재 테스트 중인 POC 키
  private readonly poc: string;
  // Appium WebDriverIO 드라이버 인스턴스 (NativeView 제어용)
  private readonly driver: Browser;
  // WebView <-> NativeView 컨텍스트 전환 함수
  private readonly switchContext: (view: string) => Promise<void>;
  // 실제 디바이스의 UDID (ADB/Safari 디버깅 등에서 사용됨)
  private readonly udid: string;

  constructor(driver: Browser, switchContext: (view: string) => Promise<void>, udid: string) {
    this.driver = driver;
    this.switchContext = switchContext;
    this.udid = udid;
    this.poc = POCEnv.getType();
    this.logger = Logger.getLogger(this.poc.toUpperCase()) as winston.Logger;
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
        try {
          await el.click();
        } catch (e) {
          this.logger.warn(`[${this.poc}] '${label}' 클릭 실패`, e);
        }
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

      const clearData = await this.findElementByLabel('Clear History and Website Data');
      if (clearData) await clearData.click();

      const confirm = await this.findElementByLabel('Clear History and Data');
      if (confirm) await confirm.click();

      const tabClose = await this.findElementByLabel('Close All Tabs');
      if (tabClose && (await tabClose.getAttribute('value')) === '0') {
        await tabClose.click();
      }

      const finalConfirm = await this.findElementByLabel('Clear History');
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
   * iOS WebKit 디버깅용 포트 포워딩 처리
   */
  public async forwardWebViewPort(): Promise<number> {
    const localPort = await new PortUtils().getAvailablePort();
    const forwardCmd = `ios_webkit_debug_proxy -c ${this.udid}:${localPort} &`;
    try {
      this.logger.info(`[SafariSetup] WebKit 디버깅 포트 포워딩 시작: ${forwardCmd}`);
      // NOTE: 실제 실행 필요 시 shell spawn 방식으로 수정 가능
      return localPort;
    } catch (e) {
      this.logger.error(`[SafariSetup] 포트 포워딩 실패: ${e}`);
      throw e;
    }
  }

  /**
   * Playwright로 WebView 세션에 연결 (iOS Safari)
   */
  // TODO CDP 관련 주석처리
  // public async connectToWebView(localPort: number): Promise<PWPage | undefined> {
  //   try {
  //     const wsEndpoint = `http://127.0.0.1:${localPort}`;
  //     await waitOn({ resources: [wsEndpoint], timeout: 7000 });
  //     const pwBrowser = await chromium.connectOverCDP(wsEndpoint);
  //     const context = pwBrowser.contexts()[0];
  //     if (context) {
  //       const pages = context.pages();
  //       const page = pages[0] || (await context.newPage());
  //       this.logger.info(`[SafariSetup] Playwright WebView 페이지 연결 완료`);
  //       return page;
  //     } else {
  //       this.logger.warn(`[SafariSetup] Playwright context 없음 - 페이지 생성 실패`);
  //       return undefined;
  //     }
  //   } catch (e) {
  //     this.logger.error('[SafariSetup] Playwright WebView 연결 실패:', e);
  //     return undefined;
  //   }
  // }

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

  /**
   * iOS 권한 팝업 자동 클릭 처리
   */
  public async handleIOSPopups(): Promise<void> {
    const labels = [
      'Allow',
      'Allow While Using App',
      'OK',
      "Don't Allow",
      '허용',
      '앱을 사용하는 동안 허용',
      '확인',
      '남지어',
      '동의',
    ];

    for (const label of labels) {
      try {
        const el = await this.driver.$(
          `-ios predicate string:label == "${label}" AND visible == 1`,
        );
        if (await el.isDisplayed()) {
          await el.click();
          this.logger.info(`[iOS Permissions][${this.poc}] 팝업 자동 클릭: ${label}`);
        }
      } catch {
        // 무시: 요소가 없을 수도 있음
      }
    }
  }

  /**
   * iOS Safari 시스템 설정에서 권한 처리
   */
  public async handleSafariSystemPermissions(): Promise<void> {
    try {
      const safariLabels = [
        '방문 기록 및 웹사이트 데이터 지우기',
        '모든 방문 기록',
        '모든 타블 닫기',
        '방문 기록 지우기',
      ];

      for (const label of safariLabels) {
        const el = await this.driver.$(
          `-ios predicate string:label == "${label}" AND visible == 1`,
        );
        if (await el.isDisplayed()) {
          await el.click();
          this.logger.info(`[iOS Safari][${this.poc}] 설정 클릭 처리: ${label}`);
        }
      }
    } catch (error) {
      this.logger.error(`[iOS Safari][${this.poc}] Safari 권한 처리 실패:`, error);
    }
  }
}
