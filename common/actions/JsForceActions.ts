/**
 * JsForceActions: 자바스크립트 기반 강제 액션 유틸리티
 * - headless 환경이나 특수 상황에서 Playwright 기본 API로 동작하지 않을 때 활용
 */
import type { Page } from '@playwright/test';

export class JsForceActions {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * JavaScript로 요소 클릭
   */
  public async forceClick(selector: string): Promise<void> {
    await this.page.evaluate(sel => {
      const el = document.querySelector(sel);
      if (el) (el as HTMLElement).click();
    }, selector);
  }

  /**
   * JavaScript로 텍스트 입력
   */
  public async forceType(selector: string, value: string): Promise<void> {
    await this.page.evaluate(
      ([sel, val]) => {
        const el = document.querySelector(sel) as HTMLInputElement | null;
        if (el) el.value = val;
      },
      [selector, value],
    );
  }

  /**
   * JavaScript로 input 값 초기화
   */
  public async clearInput(selector: string): Promise<void> {
    await this.page.evaluate(sel => {
      const el = document.querySelector(sel) as HTMLInputElement | null;
      if (el) el.value = '';
    }, selector);
  }

  /**
   * JavaScript로 요소에 focus() 주기
   */
  public async focus(selector: string): Promise<void> {
    await this.page.evaluate(sel => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) el.focus();
    }, selector);
  }

  /**
   * 특정 요소를 최상단(z-index)으로 가져옴
   */
  public async bringToFront(selector: string): Promise<void> {
    await this.page.evaluate(sel => {
      const el = document.querySelector(sel) as HTMLElement;
      if (el) {
        el.style.cssText = `
          display: block !important;
          visibility: visible !important;
          position: relative !important;
          z-index: 999999999 !important;
        `;
      }
    }, selector);
  }

  /**
   * 여러 요소를 최상단(z-index)으로 가져옴
   */
  public async bringAllToFront(selector: string): Promise<void> {
    await this.page.evaluate(sel => {
      document.querySelectorAll(sel).forEach(el => {
        (el as HTMLElement).style.cssText = `
          display: block !important;
          visibility: visible !important;
          position: relative !important;
          z-index: 999999999 !important;
        `;
      });
    }, selector);
  }
}
