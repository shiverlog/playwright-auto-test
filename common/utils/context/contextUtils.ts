/**
 * Description : ContextUtils.ts - 📌 Appium 연결에서 컨텍스트 전환 + CDP 포워딩 지원 유틸
 * Author : Shiwoo Min
 * Date : 2025-04-14
 */

import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import { CDPConnectUtils } from '@common/utils/context/CDPConnectUtils';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

export class ContextUtils {
  private static readonly poc: string = POCEnv.getType();
  private static readonly logger: winston.Logger = Logger.getLogger(this.poc.toUpperCase()) as winston.Logger;
  private static readonly MAX_RETRIES = 3;

  /**
   * 현재 컨텍스트가 NATIVE_APP인지 확인
   */
  public static async isInNativeContext(driver: Browser): Promise<boolean> {
    const currentContext = await driver.getContext();
    const isNative = typeof currentContext === 'string' && currentContext.includes('NATIVE_APP');
    this.logger.info(`[ContextUtils][${this.poc}] 현재 컨텍스트: ${currentContext} (NATIVE_APP 여부: ${isNative})`);
    return isNative;
  }

  /**
   * 현재 컨텍스트가 WEBVIEW인지 확인
   */
  public static async isInWebviewContext(driver: Browser): Promise<boolean> {
    const currentContext = await driver.getContext();
    const isWebview = typeof currentContext === 'string' && currentContext.includes('WEBVIEW');
    this.logger.info(`[ContextUtils][${this.poc}] 현재 컨텍스트: ${currentContext} (WEBVIEW 여부: ${isWebview})`);
    return isWebview;
  }

  /**
   * 현재 컨텍스트 문자열 반환
   */
  public static async getCurrentContext(driver: Browser): Promise<string> {
    const currentContext = await driver.getContext();
    this.logger.info(`[ContextUtils][${this.poc}] 현재 컨텍스트: ${currentContext}`);
    return currentContext as string;
  }

  /**
   * WEBVIEW 컨텍스트로 전환 (CDP 사용하지 않는 단순 전환)
   */
  public static async switchToWebviewContext(driver: Browser, udid?: string): Promise<boolean> {
    const contexts = await driver.getContexts();
    const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));
    const webview = stringContexts.find(ctx => ctx.includes('WEBVIEW'));

    if (webview) {
      await driver.switchContext(webview);
      this.logger.info(`[ContextUtils][${this.poc}] Switched to WEBVIEW: ${webview}`);

      if (udid) {
        try {
          const { wsEndpoint } = await CDPConnectUtils.getWebViewCDPEndpoint(udid);
          this.logger.info(`[ContextUtils][${this.poc}] CDP 포워딩 주소: ${wsEndpoint}`);
        } catch (e) {
          this.logger.warn(`[ContextUtils][${this.poc}] CDP 포워딩 실패 (옵셔널): ${e}`);
        }
      }

      return true;
    }

    this.logger.warn(`[ContextUtils][${this.poc}] WEBVIEW 컨텍스트가 존재하지 않습니다.`);
    return false;
  }

  /**
   * WEBVIEW 컨텍스트 전환 + CDP 연결용 포워딩 주소 반환
   */
  public static async switchToWebViewCDP(
    driver: Browser,
    udid: string,
  ): Promise<{ success: boolean; wsEndpoint?: string }> {
    const contexts = await driver.getContexts();
    const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));
    const webview = stringContexts.find(ctx => ctx.includes('WEBVIEW'));

    if (!webview) {
      this.logger.warn(`[ContextUtils][${this.poc}] WEBVIEW 컨텍스트가 존재하지 않습니다.`);
      return { success: false };
    }

    await driver.switchContext(webview);
    this.logger.info(`[ContextUtils][${this.poc}] Switched to WEBVIEW: ${webview}`);

    try {
      const { wsEndpoint } = await CDPConnectUtils.getWebViewCDPEndpoint(udid);
      this.logger.info(`[ContextUtils][${this.poc}] CDP 포워딩 주소 획득: ${wsEndpoint}`);
      return { success: true, wsEndpoint };
    } catch (e) {
      this.logger.warn(`[ContextUtils][${this.poc}] 포워딩 주소 생성 실패: ${e}`);
      return { success: true };
    }
  }

  /**
   * NATIVE_APP 컨텍스트로 전환
   */
  public static async switchToNativeContext(driver: Browser): Promise<void> {
    const contexts = await driver.getContexts();
    const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));
    const native = stringContexts.find(ctx => ctx.includes('NATIVE_APP'));

    if (native) {
      await driver.switchContext(native);
      this.logger.info(`[ContextUtils][${this.poc}] Switched to NATIVE_APP: ${native}`);
    } else {
      this.logger.warn(`[ContextUtils][${this.poc}] NATIVE_APP 컨텍스트가 존재하지 않습니다.`);
    }
  }

  /**
   * iOS: 기본 WebView 컨텍스트 반환
   */
  public static async getDefaultIOSWebviewContext(driver: Browser): Promise<string | null> {
    const contexts = await driver.getContexts();
    const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));

    if (stringContexts.length === 2) {
      const webview = stringContexts[1];
      this.logger.info(`[ContextUtils][${this.poc}] default webview context: ${webview}`);
      return webview;
    }
    this.logger.warn(`[ContextUtils][${this.poc}] WEBVIEW 컨텍스트를 찾을 수 없습니다.`);
    return null;
  }

  /**
   * iOS: WebKit 포트 포워딩 명령 생성
   */
  public static async forwardIOSWebKitPort(udid: string): Promise<number> {
    const port = Math.floor(Math.random() * (65535 - 1024) + 1024);
    const cmd = `ios_webkit_debug_proxy -c ${udid}:${port} &`;
    this.logger.info(`[ContextUtils][${this.poc}] WebKit 디버깅 포트 연결 명령: ${cmd}`);
    return port;
  }
}
