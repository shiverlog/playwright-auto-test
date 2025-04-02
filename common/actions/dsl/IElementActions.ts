/**
 * Description : IElementActions.ts - 📌 DSL Element 인터페이스
 * Author : Shiwoo Min
 * Date : 2025-04-01
 */
import type { Locator } from '@playwright/test';

export interface IElementActions {
  // Selector 또는 Locator/Element 설정
  setSelector(selector: string): this;
  setLocator(locator: Locator): this;
  setElement(element: Element): this;
  setAppiumSelector(selector: string): Promise<this>;

  // 동작 메서드
  click(): Promise<this>;
  doubleClick(): Promise<this>;
  fill(text: string): Promise<this>;
  clearAndFill(text: string): Promise<this>;
  scrollIntoView(): Promise<this>;

  // 상태 조회
  isVisible(): Promise<boolean>;
  isEnabled(): Promise<boolean>;

  // 값 조회
  getText(): Promise<string>;
  getValue(): Promise<string>;
  getAttribute(attr: string): Promise<string | null>;

  // 대기
  waitForVisible(timeout?: number): Promise<this>;
  waitForHidden(timeout?: number): Promise<this>;

  // 액션
  exists(): Promise<boolean>;
  hover(): Promise<this>;
  focus(): Promise<this>;
  isChecked(): Promise<boolean>;
  selectOption(value: string): Promise<this>;
  takeScreenshot(path: string): Promise<void>;
  tap(): Promise<this>;
}
