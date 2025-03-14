import { Locator, Page, test } from '@playwright/test';
import { UIElementActions } from './UIElementActions';

export default class EditBoxActions extends UIElementActions {
  constructor(page: Page, selector: string, description: string) {
    super(page, selector, description);
  }

  /**
   * 입력 필드 값을 설정 (기존 값 삭제 후 입력)
   * @param value 입력할 값
   * @returns this (체이닝 가능)
   */
  public async fill(value: string) {
    await test.step(`Entering ${this.description} as ${value}`, async () => {
      await this.getLocator().fill(value);
    });
    return this;
  }

  /**
   * 입력 필드 값을 타이핑 (기존 값 유지됨)
   * @param value 입력할 값
   * @returns this (체이닝 가능)
   */
  public async type(value: string) {
    await test.step(`Typing ${this.description} as ${value}`, async () => {
      await this.getLocator().type(value);
    });
    return this;
  }

  /**
   * 입력 후 'Tab' 키 입력
   * @param value 입력할 값
   * @returns this (체이닝 가능)
   */
  public async fillAndTab(value: string) {
    await test.step(`Entering ${this.description} as ${value} and pressing Tab`, async () => {
      await this.getLocator().fill(value);
      await this.getLocator().press('Tab');
    });
    return this;
  }

  /**
   * 타이핑 후 'Tab' 키 입력
   * @param value 입력할 값
   * @returns this (체이닝 가능)
   */
  public async typeAndTab(value: string) {
    await test.step(`Typing ${this.description} as ${value} and pressing Tab`, async () => {
      await this.getLocator().type(value);
      await this.getLocator().press('Tab');
    });
    return this;
  }
}
