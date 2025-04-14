/**
 * Description : ChromeSetup.ts - 📌 Android 기반의 Chrome 브라우저 초기 셋업 자동화 유틸리티
 * Author : Shiwoo Min
 * Date : 2024-04-14
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import { execSync } from 'child_process';
import type { Browser } from 'webdriverio';
import type winston from 'winston';
import { PortUtils } from '@common/utils/network/PortUtils';
import waitOn from 'wait-on';
import { chromium } from 'playwright';
import type { Page as PWPage } from '@playwright/test';
import axios from 'axios';

export class ChromeSetup {
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

    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      this.logger.error('[Chromedriver] 크롬 버전 확인 실패:', msg);
    }
  }

  /**
   * 공통 순서로 Chrome 초기 설정 처리
   */
  async handleChromeSetup(options: { skipWebViewSwitch?: boolean } = {}): Promise<void> {
    const { skipWebViewSwitch = false } = options;
    await this.bringToFrontIfNotVisible();
    await this.switchContext('NATIVE_APP');
    await this.driver.setTimeout({ implicit: 2000 });

    const stepIds = [
      // 로그인 화면에서 계속하기
      'com.android.chrome:id/signin_fre_continue_button',
      // 나의 정보 확인
      'com.android.chrome:id/button_primary',
      // 사용자 알림 확인
      'com.android.chrome:id/ack_button',
      // 예
      'com.android.chrome:id/positive_button',
      // 아니오
      'com.android.chrome:id/negative_button',
      // 권한 허용 버튼
      'com.android.permissioncontroller:id/permission_allow_button',
    ];

  for (const id of stepIds) {
        try {
          const el = await this.driver.$(`id=${id}`);
          if (await el.isDisplayed()) {
            await el.click();
            this.logger.info(`[ChromeSetup] 클릭됨: ${id}`);
          }
        } catch {}
      }

  if (!skipWebViewSwitch) {
      await this.switchContext('NATIVE_APP');
      const contexts = await this.driver.getContexts();
      const contextStrings = contexts.map(c => typeof c === 'string' ? c : c.id ?? '');
      const webviewContext = contextStrings.find(id => id.includes('WEBVIEW'));
      if (webviewContext) {
        await this.switchContext(webviewContext);
        this.logger.info(`[ChromeAccess] WebView 컨텍스트 전환 완료: ${webviewContext}`);
      }
    }
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
   * ADB 포트 포워딩: 사용 가능한 포트 → WebView 디버깅 포트로 연결 (자동 할당)
   */
  public async forwardWebViewPort(): Promise<number> {
    const localPort = await new PortUtils().getAvailablePort();
    const forwardCmd = `adb -s ${this.udid} forward tcp:${localPort} localabstract:chrome_devtools_remote`;
    try {
      execSync(forwardCmd);
      this.logger.info(`[ChromeAccess] WebView 디버깅 포트 포워딩 완료: ${forwardCmd}`);
      return localPort;
    } catch (e) {
      this.logger.error(`[ChromeAccess] 포트 포워딩 실패: ${e}`);
      throw e;
    }
  }

  /**
   * Playwright를 통해 WebView에 연결하고 Page 인스턴스를 반환
   */
  // TODO CDP 관련 주석처리
  // public async connectToWebView(debuggerAddress: string): Promise<PWPage | undefined> {
  //   try {
  //     const wsEndpoint = `ws://${debuggerAddress}/devtools/browser`;
  //     const pwBrowser = await chromium.connectOverCDP(wsEndpoint);
  //     const context = pwBrowser.contexts()[0];
  //     const page = context?.pages()[0] ?? await context?.newPage();
  //     this.logger.info(`[ChromeAccess] Playwright WebView 페이지 연결 완료`);
  //     return page;
  //   } catch (e) {
  //     this.logger.error('[ChromeAccess] Playwright WebView 연결 실패:', e);
  //     return undefined;
  //   }
  // }

  /**
   * Chrome 앱이 포그라운드에 없을 경우 강제로 앞으로 가져오기
   */
  async bringToFrontIfNotVisible(): Promise<void> {
    try {
      const currentPackage = await this.driver.getCurrentPackage?.();
      if (currentPackage !== 'com.android.chrome') {
        this.logger.info(`[ChromeAccess] 현재 앱 (${currentPackage}) -> 강제 전환`);
        await this.driver.activateApp('com.android.chrome');
        await this.driver.pause(2000);
      } else {
        this.logger.info(`[ChromeAccess] Chrome이 이미 포그라운드에 있음`);
      }
    } catch (e) {
      this.logger.error('[ChromeAccess] 포그라운드 앱 전환 실패:', e);
    }
  }
}
