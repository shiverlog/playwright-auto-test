import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { Browser, Element } from 'webdriverio';

/**
 * Cross-platform: DSL 스타일 Element 액션 클래스 (Playwright + Appium 통합)
 */
export class ElementActions {
  private locator?: Locator;
  private element?: Element;
  private isPlaywright: boolean;
  private page?: Page;
  private driver?: Browser;

  constructor(options: { page?: Page; driver?: Browser }) {
    this.page = options.page;
    this.driver = options.driver;
    this.isPlaywright = !!options.page;
  }

  /**
   * Playwright: Locator 설정
   */
  public setLocator(locator: Locator): this {
    this.locator = locator;
    this.isPlaywright = true;
    return this;
  }

  /**
   * Appium: Element 설정
   */
  public setElement(element: Element): this {
    this.element = element;
    this.isPlaywright = false;
    return this;
  }

  /**
   * Playwright: Selector로 locator 설정
   */
  public setSelector(selector: string): this {
    if (this.page) {
      this.locator = this.page.locator(selector);
      this.isPlaywright = true;
    }
    return this;
  }

  /**
   * Appium: Selector로 element 설정
   */
  public async setAppiumSelector(selector: string): Promise<this> {
    if (this.driver) {
      const el = await this.driver.$(selector);
      this.element = el as unknown as Element;
      this.isPlaywright = false;
    }
    return this;
  }

  /** 클릭 */
  public async click(): Promise<this> {
    if (this.isPlaywright && this.locator) {
      await this.locator.click();
    } else if (this.element) {
      await this.element.click();
    }
    return this;
  }

  /** 더블 클릭 */
  public async doubleClick(): Promise<this> {
    if (this.isPlaywright && this.locator) {
      await this.locator.dblclick();
    } else if (this.element && this.driver) {
      await this.element.click();
      await this.driver.pause(100); // 짧은 딜레이
      await this.element.click();
    }
    return this;
  }

  /** 텍스트 입력 (기존 값 유지 X) */
  public async fill(text: string): Promise<this> {
    if (this.isPlaywright && this.locator) {
      await this.locator.fill(text);
    } else if (this.element) {
      await this.element.setValue(text);
    }
    return this;
  }

  /** 기존 값을 지우고 텍스트 입력 */
  public async clearAndFill(text: string): Promise<this> {
    if (this.isPlaywright && this.locator) {
      await this.locator.fill('');
      await this.locator.type(text);
    } else if (this.element) {
      await this.element.clearValue();
      await this.element.setValue(text);
    }
    return this;
  }

  /** 요소가 뷰에 보이도록 스크롤 */
  public async scrollIntoView(): Promise<this> {
    if (this.isPlaywright && this.locator) {
      await this.locator.scrollIntoViewIfNeeded();
    } else if (this.element) {
      await this.element.scrollIntoView();
    }
    return this;
  }

  /** 요소가 화면에 보이는지 여부 확인 */
  public async isVisible(): Promise<boolean> {
    if (this.isPlaywright && this.locator) {
      return await this.locator.isVisible();
    } else if (this.element) {
      return await this.element.isDisplayed();
    }
    return false;
  }

  /** 요소가 활성화(클릭 가능 등) 상태인지 확인 */
  public async isEnabled(): Promise<boolean> {
    if (this.isPlaywright && this.locator) {
      return await this.locator.isEnabled();
    } else if (this.element) {
      return await this.element.isEnabled();
    }
    return false;
  }

  /** 요소의 텍스트 반환 */
  public async getText(): Promise<string> {
    if (this.isPlaywright && this.locator) {
      return (await this.locator.innerText()) ?? '';
    } else if (this.element) {
      return (await this.element.getText()) ?? '';
    }
    return '';
  }

  /** input 요소의 value 값 반환 */
  public async getValue(): Promise<string> {
    if (this.isPlaywright && this.locator) {
      return (await this.locator.inputValue()) ?? '';
    } else if (this.element) {
      return (await this.element.getValue()) ?? '';
    }
    return '';
  }

  /** 특정 attribute 값 반환 */
  public async getAttribute(attr: string): Promise<string | null> {
    if (this.isPlaywright && this.locator) {
      return await this.locator.getAttribute(attr);
    } else if (this.element) {
      return await this.element.getAttribute(attr);
    }
    return null;
  }

  /** 요소가 보일 때까지 대기 */
  public async waitForVisible(timeout = 5000): Promise<this> {
    if (this.isPlaywright && this.locator) {
      await this.locator.waitFor({ state: 'visible', timeout });
    } else if (this.element) {
      await this.element.waitForDisplayed({ timeout });
    }
    return this;
  }

  /** 요소가 사라질 때까지 대기 */
  public async waitForHidden(timeout = 5000): Promise<this> {
    if (this.isPlaywright && this.locator) {
      await this.locator.waitFor({ state: 'hidden', timeout });
    } else if (this.element) {
      await this.element.waitForDisplayed({ reverse: true, timeout });
    }
    return this;
  }
}
