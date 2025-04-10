/**
 * Description : ContextUtils.ts - 📌 Appium 연결에서 컨텍스트 전환을 지원하는 유틸 클래스
 * Author : Shiwoo Min
 * Date : 2024-04-10
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import { chromium, type Page } from '@playwright/test';
import type { CDPSession } from 'playwright-core';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

export class ContextUtils {
  // 현재 POC 키
  private static readonly poc = POCEnv.getType();
  // 로깅 인스턴스
  private static readonly logger = Logger.getLogger(this.poc) as winston.Logger;

  // POC별 page 객체 저장
  private static readonly pageMap: Map<string, Page> = new Map();

  public static setPageForCurrentPOC(page: Page): void {
    this.pageMap.set(this.poc, page);
  }

  public static getPageIfAvailable(): Page | undefined {
    return this.pageMap.get(this.poc);
  }

  /**
   * WebView로 콘텍스트 전환 + Playwright page 및 CDP 세션 연결
   */
  public static async switchToWebView(
    driver: Browser,
    port: number,
  ): Promise<{ page: Page; session: CDPSession }> {
    const contexts = (await driver.getContexts()) as string[];
    const webviewContext = contexts.find(c => c.includes('WEBVIEW'));
    if (!webviewContext) {
      throw new Error(`[ContextUtils][${this.poc}] WebView 콘텍스트를 찾을 수 없습니다.`);
    }

    this.logger.info(`[ContextUtils][${this.poc}] WebView 콘텍스트 탐지됨: ${webviewContext}`);
    await driver.switchContext(webviewContext);
    this.logger.info(`[ContextUtils][${this.poc}] WebView 콘텍스트로 전환됨`);

    const cdpEndpoint = `http://127.0.0.1:${port}`;
    this.logger.info(`[ContextUtils][${this.poc}] CDP 연결 시도: ${cdpEndpoint}`);

    const browser = await chromium.connectOverCDP(cdpEndpoint);
    const context = browser.contexts()[0];
    const page = context.pages()[0];
    if (!page) {
      throw new Error(`[ContextUtils][${this.poc}] WebView 페이지를 찾을 수 없습니다.`);
    }

    const session = await context.newCDPSession(page);

    this.setPageForCurrentPOC(page);
    this.logger.info(`[ContextUtils][${this.poc}] WebView 페이지 및 CDP 세션 연결 완료`);

    return { page, session };
  }

  /**
   * iOS: WEBVIEW context 반환
   */
  public static async getDefaultIOSWebviewContext(driver: Browser): Promise<string | null> {
    const contexts = await driver.getContexts();
    const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));

    if (stringContexts.length === 2) {
      const webview = stringContexts[1];
      this.logger.info(`[ContextUtils] default webview context: ${webview}`);
      return webview;
    }

    this.logger.warn(`[ContextUtils] WEBVIEW 콘텍스트를 찾을 수 없습니다.`);
    return null;
  }

  /**
   * 현재 콘텍스트가 NATIVE_APP인지 확인
   */
  public static async isInNativeContext(driver: Browser): Promise<boolean> {
    const currentContext = await driver.getContext();
    const isNative = typeof currentContext === 'string' && currentContext.includes('NATIVE_APP');
    this.logger.info(
      `[ContextUtils] 현재 콘텍스트: ${currentContext} (NATIVE_APP 여부: ${isNative})`,
    );
    return isNative;
  }

  /**
   * 현재 콘텍스트가 WEBVIEW인지 확인
   */
  public static async isInWebviewContext(driver: Browser): Promise<boolean> {
    const currentContext = await driver.getContext();
    const isWebview = typeof currentContext === 'string' && currentContext.includes('WEBVIEW');
    this.logger.info(
      `[ContextUtils] 현재 콘텍스트: ${currentContext} (WEBVIEW 여부: ${isWebview})`,
    );
    return isWebview;
  }

  /**
   * WEBVIEW 콘텍스트로 전환 (있으면 true 반환)
   */
  public static async switchToWebviewContext(driver: Browser): Promise<boolean> {
    const contexts = await driver.getContexts();
    const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));
    const webview = stringContexts.find(ctx => ctx.includes('WEBVIEW'));

    if (webview) {
      await driver.switchContext(webview);
      this.logger.info(`[ContextUtils] Switched to WEBVIEW: ${webview}`);
      return true;
    }

    this.logger.warn(`[ContextUtils] WEBVIEW 콘텍스트가 존재하지 않습니다.`);
    return false;
  }

  /**
   * NATIVE_APP 콘텍스트로 전환
   */
  public static async switchToNativeContext(driver: Browser): Promise<void> {
    const contexts = await driver.getContexts();
    const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));
    const native = stringContexts.find(ctx => ctx.includes('NATIVE_APP'));

    if (native) {
      await driver.switchContext(native);
      this.logger.info(`[ContextUtils] Switched to NATIVE_APP: ${native}`);
    } else {
      this.logger.warn(`[ContextUtils] NATIVE_APP 콘텍스트가 존재하지 않습니다.`);
    }
  }
}
