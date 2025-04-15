/**
 * Description : WebViewActions.ts - 📌 Playwright: 웹 전용 애션 유튜리티 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-15
 */
import { ActionConstants } from '@common/constants/ActionConstants.js';
import type { Platform } from '@common/types/platform-types.js';
import { POCEnv } from '@common/utils/env/POCEnv';
import { execSync } from 'child_process';
import type { Page as PPage } from 'puppeteer-core';
import type { Browser } from 'webdriverio';

const DEFAULT_RETRY = 5;

export class WebViewActions {
  protected page: PPage;
  protected driver: Browser;
  protected platform: Platform;
  private readonly poc: string = POCEnv.getType();

  /**
   * WebView Page 세팅 (Puppeteer 전용)
   */
  public setPage(page: PPage): void {
    this.page = page;
  }

  /**
   * WebView 연결 후 ContextUtils에서 page 주입
   */
  public setPageFromContext(page: PPage): void {
    if (!page) {
      throw new Error(`[MobileActionUtils] WebView Page가 전달되지 않았습니다.`);
    }
    this.setPage(page);
  }

  /**
   * WebView 연결 여부 확인
   */
  public hasWebView(): boolean {
    return !!this.page;
  }

  /**
   * WebView page가 설정돼 있지 않으면 예외 발생
   */
  private getPageOrThrow(): PPage {
    if (!this.page) {
      throw new Error(
        '[MobileActionUtils] WebView가 연결되지 않았습니다. page가 설정되지 않았습니다.',
      );
    }
    return this.page;
  }

  /**
   * WebView 내에서 특정 요소를 클릭
   */
  public async clickInWebView(selector: string): Promise<void> {
    const page = this.getPageOrThrow();
    await page.locator(selector).click();
  }

  /**
   * WebView 내의 입력 필드에 값을 채움
   */
  public async fillInWebView(selector: string, value: string): Promise<void> {
    const page = this.getPageOrThrow();
    await page.locator(selector).fill(value);
  }

  /**
   * WebView에서 텍스트를 가져오는 예시 메서드
   */
  public async getTextInWebView(selector: string): Promise<string> {
    const page = this.getPageOrThrow();
    const el = await page.$(selector);
    if (!el) throw new Error(`[getTextInWebView] 요소 없음: ${selector}`);
    return await page.evaluate(el => (el as HTMLElement).innerText, el);
  }
}
