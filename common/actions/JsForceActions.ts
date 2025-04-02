/**
 * Description : JsForceActions.ts - 📌 자바스크립트 기반 강제 액션 유틸리티
 * Author : Shiwoo Min
 * Date : 2025-04-01
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
  public async forceClearInput(selector: string): Promise<void> {
    await this.page.evaluate(sel => {
      const el = document.querySelector(sel) as HTMLInputElement | null;
      if (el) el.value = '';
    }, selector);
  }

  /**
   * JavaScript로 요소에 focus() 주기
   */
  public async forceFocus(selector: string): Promise<void> {
    await this.page.evaluate(sel => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) el.focus();
    }, selector);
  }

  /**
   * 특정 요소를 z-index 최상단으로 설정
   */
  public async forceBringToFrontBasic(
    selector: string,
    position: 'relative' | 'fixed' = 'relative',
  ): Promise<void> {
    const style = `
    display: block !important;
    visibility: visible !important;
    z-index: 999999 !important;
    position: ${position} !important;
    ${position === 'fixed' ? 'bottom: 300px !important;' : ''}
  `;

    await this.page.evaluate(
      ({ sel, style }: { sel: string; style: string }) => {
        const el = document.querySelector(sel) as HTMLElement;
        if (el) el.style.cssText = style;
      },
      { sel: selector, style },
    );
  }

  /**
   * 지정된 요소를 강제로 z-index 최상단으로 위치
   * 두 가지 position 방식 (relative, fixed)을 시도
   */
  public async forceBringToFront(selector: string): Promise<void> {
    const positions: ('relative' | 'fixed')[] = ['relative', 'fixed'];

    for (const pos of positions) {
      await this.forceBringToFrontBasic(selector, pos);

      const isVisible = await this.page.evaluate(sel => {
        const el = document.querySelector(sel) as HTMLElement;
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }, selector);

      if (isVisible) return;
    }
  }

  /**
   * 여러 요소를 최상단(z-index)으로 가져옴
   */
  public async forceBringAllToFront(selector: string): Promise<void> {
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

  /**
   * 모든 자식 요소의 애니메이션 제거
   */
  public async forceDisableAnimations(parentSelector: string): Promise<void> {
    await this.page.evaluate(selector => {
      const elements = document.querySelectorAll(`${selector} *`);
      elements.forEach(el => {
        (el as HTMLElement).style.cssText += `
        animation: none !important;
        transition: none !important;
        transform: none !important;
        transition-delay: 0s !important;
        opacity: 1 !important;
      `;
      });
    }, parentSelector);
  }

  /**
   * 요소까지 스크롤 후 클릭
   */
  public async forceScrollAndClick(selector: string, jsClick = false): Promise<void> {
    const element = this.page.locator(selector);

    if (!jsClick) {
      await element.scrollIntoViewIfNeeded();
      await element.click();
    } else {
      await this.page.evaluate(sel => {
        const el = document.querySelector(sel) as HTMLElement;
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.click();
        }
      }, selector);
    }

    await this.page.waitForLoadState('networkidle');
  }

  /**
   * 지정된 요소를 강제로 화면 전면에 보이도록 스타일을 조정
   */
  public async forceShow(selector: string): Promise<void> {
    const success = await this.page.evaluate(sel => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) return false;

      const commonStyle = {
        display: 'block',
        visibility: 'visible',
        zIndex: '999999',
      };

      const tryPositions = ['relative', 'fixed'];

      for (const position of tryPositions) {
        Object.assign(el.style, {
          ...commonStyle,
          position,
        });

        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return true;
        }
      }

      return false;
    }, selector);
  }

  /**
   * 지정된 요소를 강제로 화면에 보이지 않도록 스타일을 조정
   */
  public async forceHide(selector: string): Promise<void> {
    await this.page.evaluate(sel => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
      }
    }, selector);
  }

  /**
   * 요소에 스크롤 후 클릭
   * - useJsScroll: true일 경우 요소를 강제로 중앙으로 스크롤 후 클릭
   */
  public async moveToClick(selector: string, useJsScroll = false): Promise<void> {
    const element = this.page.locator(selector);

    if (useJsScroll) {
      await this.scrollToCenter(selector);
    } else {
      await element.scrollIntoViewIfNeeded();
    }

    await element.hover();
    await element.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * 해당 요소를 화면 중앙으로 스크롤
   */
  private async scrollToCenter(selector: string): Promise<void> {
    await this.page.evaluate(sel => {
      const el = document.querySelector(sel);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      window.scrollBy({
        top: rect.top - window.innerHeight / 2,
        behavior: 'instant',
      });
    }, selector);
  }
}
