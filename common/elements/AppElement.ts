import type { Browser, Element } from 'webdriverio';

/**
 * Appium 기반의 단일 Element Wrapper 클래스
 */
export class AppElement {
  constructor(
    private element: Element,
    private driver: Browser,
  ) {}

  /**
   * 기본 클릭
   */
  async click(): Promise<this> {
    await this.element.click();
    return this;
  }

  /**
   * 두 번 클릭 (딜레이 포함)
   */
  async reClick(delay = 300): Promise<this> {
    await this.element.click();
    await this.driver.pause(delay);
    await this.element.click();
    return this;
  }

  /**
   * 표시될 때까지 기다렸다가 클릭
   */
  async waitAndClick(timeout = 5000): Promise<this> {
    await this.element.waitForDisplayed({ timeout });
    await this.element.click();
    return this;
  }

  /**
   * 텍스트 입력
   */
  async fill(text: string): Promise<this> {
    await this.element.setValue(text);
    return this;
  }

  /**
   * 기존 텍스트 제거 후 새 텍스트 입력
   */
  async clearAndFill(text: string): Promise<this> {
    await this.element.clearValue();
    await this.element.setValue(text);
    return this;
  }

  /**
   * 텍스트 가져오기
   */
  async getText(): Promise<string> {
    return await this.element.getText();
  }

  /**
   * 값(value 속성) 가져오기
   */
  async getValue(): Promise<string> {
    return await this.element.getValue();
  }

  /**
   * 속성(attribute) 값 가져오기
   */
  async getAttribute(attr: string): Promise<string | null> {
    return await this.element.getAttribute(attr);
  }

  /**
   * 요소가 표시되는지 여부
   */
  async isVisible(): Promise<boolean> {
    return await this.element.isDisplayed();
  }

  /**
   * 요소가 활성화되어 있는지 여부
   */
  async isEnabled(): Promise<boolean> {
    return await this.element.isEnabled();
  }

  /**
   * 요소가 존재하는지 여부
   */
  async exists(): Promise<boolean> {
    try {
      return await this.element.isExisting();
    } catch {
      return false;
    }
  }

  /**
   * 요소가 보일 때까지 대기
   */
  async waitForVisible(timeout = 5000): Promise<this> {
    await this.element.waitForDisplayed({ timeout });
    return this;
  }

  /**
   * 요소가 사라질 때까지 대기
   */
  async waitForHidden(timeout = 5000): Promise<this> {
    await this.element.waitForDisplayed({ reverse: true, timeout });
    return this;
  }

  /**
   * center 좌표로 터치
   */
  async tap(): Promise<this> {
    const rect = await (this.element as any).getRect();
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;

    await this.driver.touchAction({ action: 'tap', x, y });
    return this;
  }

  /**
   * 안전 클릭 (실패해도 에러 던지지 않음)
   */
  async safeClick(): Promise<boolean> {
    try {
      await this.element.click();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * raw WebdriverIO element 반환
   */
  getRaw(): Element {
    return this.element;
  }
}
