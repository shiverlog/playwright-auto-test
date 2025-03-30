import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { Browser, Element } from 'webdriverio';

/**
 * DSL 스타일 Element 액션 클래스 (Playwright + Appium 통합)
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
   * Playwright 전용: 체크박스 등 체크 여부
   */
  public async isChecked(): Promise<boolean> {
    this.ensureElement();
    if (this.isPlaywright) {
      return await this.locator!.isChecked();
    }
    throw new Error('isChecked() is only supported in Playwright context.');
  }

  /**
   * Playwright 전용: 요소 스크린샷 저장
   */
  public async takeScreenshot(path: string): Promise<void> {
    this.ensureElement();
    if (this.isPlaywright) {
      await this.locator!.screenshot({ path });
    }
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

  // ========== Common ==========

  /**
   * Common: 요소 클릭
   * - Playwright: locator.click()
   * - Appium: element.click()
   */
  public async click(): Promise<this> {
    this.ensureElement();
    this.isPlaywright ? await this.locator!.click() : await this.element!.click();
    return this;
  }

  /**
   * Common: 요소 더블 클릭
   * - Playwright: locator.dblclick()
   * - Appium: 두 번 클릭으로 대체
   */
  public async doubleClick(): Promise<this> {
    this.ensureElement();
    if (this.isPlaywright) {
      await this.locator!.dblclick();
    } else {
      await this.element!.click();
      await this.driver!.pause(100);
      await this.element!.click();
    }
    return this;
  }

  /**
   * Common: 텍스트 입력
   * - Playwright: locator.fill()
   * - Appium: element.setValue()
   */
  public async fill(text: string): Promise<this> {
    this.ensureElement();
    this.isPlaywright ? await this.locator!.fill(text) : await this.element!.setValue(text);
    return this;
  }

  /**
   * Common: 기존 텍스트 제거 후 새 텍스트 입력
   * - Playwright: fill('') + type()
   * - Appium: clearValue() + setValue()
   */
  public async clearAndFill(text: string): Promise<this> {
    this.ensureElement();
    if (this.isPlaywright) {
      await this.locator!.fill('');
      await this.locator!.type(text);
    } else {
      await this.element!.clearValue();
      await this.element!.setValue(text);
    }
    return this;
  }

  /**
   * Common: 요소를 뷰포트에 스크롤
   * - Playwright: scrollIntoViewIfNeeded()
   * - Appium: scrollIntoView()
   */
  public async scrollIntoView(): Promise<this> {
    this.ensureElement();
    this.isPlaywright
      ? await this.locator!.scrollIntoViewIfNeeded()
      : await this.element!.scrollIntoView();
    return this;
  }

  /**
   * Common: 요소 가시성 여부
   * - Playwright: isVisible()
   * - Appium: isDisplayed()
   */
  public async isVisible(): Promise<boolean> {
    this.ensureElement();
    return this.isPlaywright ? await this.locator!.isVisible() : await this.element!.isDisplayed();
  }

  /**
   * Common: 요소 활성화 여부
   * - Playwright: isEnabled()
   * - Appium: isEnabled()
   */
  public async isEnabled(): Promise<boolean> {
    this.ensureElement();
    return this.isPlaywright ? await this.locator!.isEnabled() : await this.element!.isEnabled();
  }

  /**
   * Common: 텍스트 내용 반환
   * - Playwright: innerText()
   * - Appium: getText()
   */
  public async getText(): Promise<string> {
    this.ensureElement();
    return this.isPlaywright ? await this.locator!.innerText() : await this.element!.getText();
  }

  /**
   * Common: input value 값 반환
   * - Playwright: inputValue()
   * - Appium: getValue()
   */
  public async getValue(): Promise<string> {
    this.ensureElement();
    return this.isPlaywright ? await this.locator!.inputValue() : await this.element!.getValue();
  }

  /**
   * Common: attribute 값 반환
   * - Playwright: getAttribute(attr)
   * - Appium: getAttribute(attr)
   */
  public async getAttribute(attr: string): Promise<string | null> {
    this.ensureElement();
    return this.isPlaywright
      ? await this.locator!.getAttribute(attr)
      : await this.element!.getAttribute(attr);
  }

  /**
   * Common: 요소가 보일 때까지 대기
   * - Playwright: waitFor({ state: 'visible' })
   * - Appium: waitForDisplayed()
   */
  public async waitForVisible(timeout = 5000): Promise<this> {
    this.ensureElement();
    if (this.isPlaywright) {
      await this.locator!.waitFor({ state: 'visible', timeout });
    } else {
      await this.element!.waitForDisplayed({ timeout });
    }
    return this;
  }

  /**
   * Common: 요소가 사라질 때까지 대기
   * - Playwright: waitFor({ state: 'hidden' })
   * - Appium: waitForDisplayed({ reverse: true })
   */
  public async waitForHidden(timeout = 5000): Promise<this> {
    this.ensureElement();
    if (this.isPlaywright) {
      await this.locator!.waitFor({ state: 'hidden', timeout });
    } else {
      await this.element!.waitForDisplayed({ reverse: true, timeout });
    }
    return this;
  }

  /**
   * Common: 요소 존재 여부 확인
   */
  public async exists(): Promise<boolean> {
    if (this.isPlaywright) {
      if (!this.locator) throw new Error('Playwright locator is not set.');
      return (await this.locator.count()) > 0;
    } else {
      if (!this.element) throw new Error('Appium element is not set.');
      try {
        return await this.element.isExisting();
      } catch {
        return false;
      }
    }
  }

  /**
   * Common: 요소에 hover
   */
  public async hover(): Promise<this> {
    this.ensureElement();
    if (this.isPlaywright) {
      await this.locator!.hover();
    }
    return this;
  }

  /**
   * Common: 요소에 focus
   */
  public async focus(): Promise<this> {
    this.ensureElement();
    if (this.isPlaywright) {
      await this.locator!.focus();
    }
    return this;
  }

  /**
   * Common: select 요소에서 옵션 선택
   */
  public async selectOption(value: string): Promise<this> {
    this.ensureElement();
    if (this.isPlaywright) {
      await this.locator!.selectOption(value);
    } else {
      await this.element!.selectByVisibleText(value);
    }
    return this;
  }

  /**
   * Common: 모바일 터치 또는 tap 처리
   */
  public async tap(): Promise<this> {
    this.ensureElement();
    if (this.isPlaywright) {
      await this.locator!.tap();
    } else {
      const rect = await (this.element as any).getRect();
      const x = rect.x + rect.width / 2;
      const y = rect.y + rect.height / 2;
      await this.driver!.touchAction({ action: 'tap', x, y });
    }
    return this;
  }

  /**
   * Common: 내부 상태 확인
   */
  private ensureElement(): void {
    if (this.isPlaywright && !this.locator) throw new Error('Playwright locator is not set.');
    if (!this.isPlaywright && !this.element) throw new Error('Appium element is not set.');
  }
}
