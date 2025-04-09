/**
 * Description : ContextUtils.ts - 📌 Appium 연결에서 컨텍스트 전환을 지원하는 유틸 클래스
 * Author : Shiwoo Min
 * Date : 2024-04-04
 */
import { Logger } from '@common/logger/customLogger';
import type { POCKey } from '@common/types/platform-types';
import { chromium, type Page } from '@playwright/test';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

export class ContextUtils {
  private static getLogger(poc: POCKey): winston.Logger {
    return Logger.getLogger(poc) as winston.Logger;
  }

  /**
   * WebView로 콘텍스트 전환 + Playwright page 연결
   */
  public static async switchToWebView(driver: Browser, port: number, poc: POCKey): Promise<Page> {
    const logger = this.getLogger(poc);

    const contexts = (await driver.getContexts()) as string[];
    const webviewContext = contexts.find(c => c.includes('WEBVIEW'));
    if (!webviewContext)
      throw new Error(`[ContextUtils][${poc}] WebView 콘텍스트를 찾을 수 없습니다.`);

    logger.info(`[ContextUtils][${poc}] WebView 콘텍스트 탐지됨: ${webviewContext}`);
    await driver.switchContext(webviewContext);
    logger.info(`[ContextUtils][${poc}] WebView 콘텍스트로 전환됨`);

    const cdpEndpoint = `http://127.0.0.1:${port}`;
    logger.info(`[ContextUtils][${poc}] CDP 연결 시도: ${cdpEndpoint}`);

    const browser = await chromium.connectOverCDP(cdpEndpoint);
    const page = browser.contexts()[0].pages()[0];

    if (!page) throw new Error(`[ContextUtils][${poc}] WebView 페이지를 찾을 수 없습니다.`);

    logger.info(`[ContextUtils][${poc}] WebView 페이지 연결 완료`);
    return page;
  }

  /**
   * iOS: 2개의 context(NATIVE_APP, WEBVIEW)가 존재할 경우, WEBVIEW context를 반환
   */
  public static async getDefaultIOSWebviewContext(
    driver: Browser,
    poc: POCKey,
  ): Promise<string | null> {
    const logger = this.getLogger(poc);
    const contexts = await driver.getContexts();
    const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));

    if (stringContexts.length === 2) {
      const webview = stringContexts[1];
      logger.info(`[ContextUtils] default webview context: ${webview}`);
      return webview;
    }

    logger.warn(`[ContextUtils] WEBVIEW 콘텍스트를 찾을 수 없습니다.`);
    return null;
  }

  /**
   * 현재 콘텍스트가 NATIVE_APP인지 확인
   */
  public static async isInNativeContext(driver: Browser, poc: POCKey): Promise<boolean> {
    const logger = this.getLogger(poc);
    const currentContext = await driver.getContext();
    const isNative = typeof currentContext === 'string' && currentContext.includes('NATIVE_APP');
    logger.info(`[ContextUtils] 현재 콘텍스트: ${currentContext} (NATIVE_APP 여부: ${isNative})`);
    return isNative;
  }

  /**
   * 현재 콘텍스트가 WEBVIEW인지 확인
   */
  public static async isInWebviewContext(driver: Browser, poc: POCKey): Promise<boolean> {
    const logger = this.getLogger(poc);
    const currentContext = await driver.getContext();
    const isWebview = typeof currentContext === 'string' && currentContext.includes('WEBVIEW');
    logger.info(`[ContextUtils] 현재 콘텍스트: ${currentContext} (WEBVIEW 여부: ${isWebview})`);
    return isWebview;
  }

  /**
   * WEBVIEW 콘텍스트로 전환 (있으면 true 반환)
   */
  public static async switchToWebviewContext(driver: Browser, poc: POCKey): Promise<boolean> {
    const logger = this.getLogger(poc);
    const contexts = await driver.getContexts();
    const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));
    const webview = stringContexts.find(ctx => ctx.includes('WEBVIEW'));

    if (webview) {
      await driver.switchContext(webview);
      logger.info(`[ContextUtils] Switched to WEBVIEW: ${webview}`);
      return true;
    }

    logger.warn(`[ContextUtils] WEBVIEW 콘텍스트가 존재하지 않습니다.`);
    return false;
  }

  /**
   * NATIVE_APP 콘텍스트로 전환
   */
  public static async switchToNativeContext(driver: Browser, poc: POCKey): Promise<void> {
    const logger = this.getLogger(poc);
    const contexts = await driver.getContexts();
    const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));
    const native = stringContexts.find(ctx => ctx.includes('NATIVE_APP'));

    if (native) {
      await driver.switchContext(native);
      logger.info(`[ContextUtils] Switched to NATIVE_APP: ${native}`);
    } else {
      logger.warn(`[ContextUtils] NATIVE_APP 콘텍스트가 존재하지 않습니다.`);
    }
  }

  /**
   * 병렬로 전체 POCKey에 대해 WebView 컨텍스트 전환 시도
   */
  public static async switchAllToWebView(
    drivers: Record<POCKey, Browser>,
    ports: Record<POCKey, number>,
  ): Promise<Record<POCKey, Page>> {
    const results = await Promise.all(
      (Object.entries(drivers) as [POCKey, Browser][]).map(async ([poc, driver]) => {
        const page = await this.switchToWebView(driver, ports[poc], poc);
        return [poc, page] as const;
      }),
    );

    return Object.fromEntries(results) as Record<POCKey, Page>;
  }
}
