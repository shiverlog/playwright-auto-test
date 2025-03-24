import { BaseActionUtils } from '@common/actions/BaseActionUtils';
import type { Page } from '@playwright/test';
import { Browser, Element } from 'webdriverio';

/**
 * Appium: 모바일 전용 액션 유틸리티 클래스
 */
export class MobileActionUtils extends BaseActionUtils {
  constructor(page: Page, driver: Browser) {
    super(page, driver);
  }
  /** Appium: 요소 클릭 */
  public async click(selector: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.click();
  }

  /** Appium: swipe up 동작 */
  public async swipeUp(): Promise<void> {
    await this.driver?.touchAction([
      { action: 'press', x: 300, y: 800 },
      { action: 'wait', ms: 200 },
      { action: 'moveTo', x: 300, y: 300 },
      'release',
    ]);
  }

  /** Appium: 요소 찾기 (BaseActionUtils 시그니처 맞추기 위해 public 유지) */
  public async findAppiumElement(selector: string): Promise<Element | undefined> {
    if (!this.driver) return;
    const el = await this.driver.$(selector);
    return el as unknown as Element;
  }

  /**
   *  Appium: 토스트 메시지 존재 여부
   */
  public async isToastVisible(text: string): Promise<boolean> {
    const element = await this.findAppiumElement(`//*[@text='${text}']`);
    return (await element?.isDisplayed()) ?? false;
  }

  /**
   *  Appium: 키패드 숨기기
   */
  public async hideKeyboard(): Promise<void> {
    try {
      await this.driver?.hideKeyboard();
    } catch (_) {}
  }

  /**
   *  Appium: 화면 터치
   */
  public async tap(x: number, y: number): Promise<void> {
    await this.driver?.touchAction({ action: 'tap', x, y });
  }

  /**
   *  Appium: 스크롤하여 요소 찾기
   */
  public async scrollAndFind(selector: string, maxScroll = 5): Promise<Element | undefined> {
    for (let i = 0; i < maxScroll; i++) {
      const el = await this.findAppiumElement(selector);
      if (el && (await el.isDisplayed())) return el;
      await this.swipeUp();
    }
    return undefined;
  }
  // ========== Playwright 관련 ==========

  /** Playwright: 웹 요소 탭 (터치) */
  public async tapWebElement(selector: string): Promise<void> {
    await this.page?.locator(selector).tap();
  }

  /** Playwright: 웹 요소 텍스트 가져오기 */
  public async getWebText(selector: string): Promise<string> {
    return (await this.page?.locator(selector).innerText()) ?? '';
  }

  /** Playwright: 웹 요소로 스크롤 */
  public async scrollWebToElement(selector: string): Promise<void> {
    await this.page?.locator(selector).scrollIntoViewIfNeeded();
  }

  /** Playwright: 모바일 뷰포트에서 키보드 입력 */
  public async typeWebText(selector: string, text: string): Promise<void> {
    const locator = this.page?.locator(selector);
    await locator?.fill('');
    await locator?.type(text);
  }

  
}
