/**
 * Description : CDPConnectUtils.ts - 📌 CDP를 통한 WebView 접속 전용 유틸
 * Author : Shiwoo Min
 * Date : 2025-04-14
 */

import { PortUtils } from '@common/utils/network/PortUtils';
import { chromium, type Page } from '@playwright/test';
import type { BrowserContext, CDPSession } from 'playwright-core';
import { execSync } from 'child_process';
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';

export class CDPConnectUtils {
  private static readonly poc = POCEnv.getType();
  private static readonly logger = Logger.getLogger(this.poc.toUpperCase());
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY_MS = 2000;

  /**
   * WebView PID 검색 + 포트 포워딩 + CDP 접속 주소 생성
   */
  public static async getWebViewCDPEndpoint(udid: string): Promise<{ port: number; wsEndpoint: string }> {
    const output = execSync(`adb -s ${udid} shell cat /proc/net/unix | grep webview_devtools_remote`, { encoding: 'utf-8' });
    const match = output.match(/webview_devtools_remote_(\d+)/);
    if (!match) throw new Error(`[CDPConnectUtils] WebView PID가 없습니다.`);
    const pid = match[1];

    const port = await new PortUtils().getAvailablePort();
    execSync(`adb -s ${udid} forward tcp:${port} localabstract:webview_devtools_remote_${pid}`);

    const wsEndpoint = `ws://127.0.0.1:${port}/devtools/browser`;
    return { port, wsEndpoint };
  }

  /**
   * CDP 기반으로 Playwright 페이지 및 세션 연결
   */
  public static async connectToWebView(wsEndpoint: string): Promise<{ page: Page; session: CDPSession }> {
    let browser;
    for (let i = 0; i < this.MAX_RETRIES; i++) {
      try {
        browser = await chromium.connectOverCDP(wsEndpoint);
        break;
      } catch (err: any) {
        const msg = err?.message || String(err);
        if (msg.includes('Browser context management is not supported')) {
          this.logger?.warn(`[CDPConnectUtils][${this.poc}] WebView는 제한된 CDP 기능만 지원합니다. BrowserContext 관련 명령은 사용할 수 없습니다.`);
        } else {
          this.logger?.warn(`[CDPConnectUtils][${this.poc}] CDP 연결 시도 실패 (${i + 1}/${this.MAX_RETRIES}): ${msg}`);
        }
        await new Promise(res => setTimeout(res, this.RETRY_DELAY_MS));
      }
    }

    if (!browser) {
      throw new Error(`[CDPConnectUtils][${this.poc}] CDP 연결에 ${this.MAX_RETRIES}회 시도했지만 실패했습니다.`);
    }

    const context = browser.contexts()[0];
    const page = await this.waitForWebViewPage(context);

    let session: CDPSession;
    try {
      session = await context.newCDPSession(page);
    } catch (e) {
      this.logger.warn(`[CDPConnectUtils][${this.poc}] CDP 세션 생성 실패 (WebView는 제한된 환경일 수 있음): ${e}`);
      throw e;
    }

    return { page, session };
  }

  /**
   * WebView 페이지 대기 (최대 3회)
   */
  private static async waitForWebViewPage(context: BrowserContext): Promise<Page> {
    for (let i = 0; i < this.MAX_RETRIES; i++) {
      const pages = context.pages();
      if (pages.length > 0) return pages[0];
      await new Promise(res => setTimeout(res, 500));
    }
    throw new Error(`[CDPConnectUtils][${this.poc}] WebView 페이지를 찾을 수 없습니다.`);
  }

  /**
   * CDP 연결 없이 포워딩 주소만 테스트하거나 확인할 때 사용할 유틸
   */
  public static async tryGetOnlyEndpoint(udid: string): Promise<string | null> {
    try {
      const { wsEndpoint } = await this.getWebViewCDPEndpoint(udid);
      return wsEndpoint;
    } catch (e) {
      this.logger.warn(`[CDPConnectUtils][${this.poc}] wsEndpoint 확인 실패: ${e}`);
      return null;
    }
  }

  /**
   * 현재 디바이스에서 디버깅 가능한 WebView PID 목록 반환
   */
  public static getAvailableWebViewContexts(udid: string): string[] {
    try {
      const output = execSync(`adb -s ${udid} shell cat /proc/net/unix`, { encoding: 'utf-8' });
      const matches = [...output.matchAll(/webview_devtools_remote_(\d+)/g)];
      return matches.map(m => m[1]);
    } catch (e) {
      this.logger.warn(`[CDPConnectUtils][${this.poc}] WebView 목록 조회 실패: ${e}`);
      return [];
    }
  }

  /**
   * CDP 연결을 타임아웃과 함께 시도
   */
  public static async connectWithTimeout(wsEndpoint: string, timeoutMs: number): Promise<{ page: Page; session: CDPSession }> {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('CDP 연결 타임아웃')), timeoutMs));
    const connection = (async () => {
      const browser = await chromium.connectOverCDP(wsEndpoint);
      const context = browser.contexts()[0];
      const page = await this.waitForWebViewPage(context);
      const session = await context.newCDPSession(page);
      return { page, session };
    })();

    return Promise.race([connection, timeout]) as Promise<{ page: Page; session: CDPSession }>;
  }

  /**
   * ADB 포트 포워딩 해제
   */
  public static releaseForwardedPort(port: number, udid: string): void {
    try {
      execSync(`adb -s ${udid} forward --remove tcp:${port}`);
      this.logger.info(`[CDPConnectUtils][${this.poc}] 포트 포워딩 해제 완료 (tcp:${port})`);
    } catch (e) {
      this.logger.warn(`[CDPConnectUtils][${this.poc}] 포트 포워딩 해제 실패: ${e}`);
    }
  }
}
