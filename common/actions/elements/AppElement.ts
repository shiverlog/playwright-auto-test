/**
 * Description : AppElement.ts - 📌 Appium 기반의 단일 Element 조작을 위한 Wrapper 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-14
 */
import type { ChainablePromiseElement, Browser} from 'webdriverio';

/**
 * Appium 기반의 단일 Element Wrapper 클래스
 */
export class AppElement {
  constructor(
    private element: ChainablePromiseElement,
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
   * 표시될 때까지 기다린다가 클릭
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
   * 요소가 사라지기 까지 대기
   */
  async waitForHidden(timeout = 5000): Promise<this> {
    await this.element.waitForDisplayed({ reverse: true, timeout });
    return this;
  }

  /**
   * center 좌표로 터치
   */
  async tap(): Promise<this> {
    const raw = await this.element as unknown as WebdriverIO.Element & {
      getRect: () => Promise<{ x: number; y: number; width: number; height: number }>;
    };
    const rect = await raw.getRect();
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
  async getRaw(): Promise<WebdriverIO.Element> {
    return await this.element as unknown as WebdriverIO.Element;
  }

  /**
   * 텍스트가 포함되어 있는지 검사
   */
  async containsText(expected: string): Promise<boolean> {
    const text = await this.getText();
    return text.includes(expected);
  }

  /**
   * 포커스 설정
   */
  async focus(): Promise<this> {
    await this.driver.execute('arguments[0].focus()', this.element);
    return this;
  }

  /**
   * 포커스 해제
   */
  async blur(): Promise<this> {
    await this.driver.execute('arguments[0].blur()', this.element);
    return this;
  }

  /**
   * 스크롤로 노출
   */
  async scrollIntoView(): Promise<this> {
    await this.driver.execute('arguments[0].scrollIntoView(true)', this.element);
    return this;
  }

  /**
   * 길게 누르기
   */
  async longPress(duration = 1000): Promise<this> {
    const el = await this.element as unknown as WebdriverIO.Element & {
      getRect: () => Promise<{ x: number; y: number; width: number; height: number }>;
    };
    const rect = await el.getRect();
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;

    await this.driver.touchAction([
      { action: 'press', x, y },
      { action: 'wait', ms: duration },
      { action: 'release' },
    ]);
    return this;
  }
}
