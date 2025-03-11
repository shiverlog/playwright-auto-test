import { Locator, Page } from '@playwright/test';

import { logger } from '../logger/customLogger';

export class ElementActions {
  /**
   * 요소 클릭
   * @param page - Playwright Page 객체
   * @param selector - 클릭할 요소의 선택자
   */
  public static async clickElement(page: Page, selector: string) {
    await page.waitForSelector(selector);
    await page.click(selector);
  }

  /**
   * 요소에 텍스트 입력
   * @param page - Playwright Page 객체
   * @param selector - 입력할 요소의 선택자
   * @param text - 입력할 텍스트 값
   */
  public static async typeText(page: Page, selector: string, text: string) {
    await page.waitForSelector(selector);
    await page.fill(selector, text);
  }

  /**
   * 요소의 텍스트 가져오기
   * @param page - Playwright Page 객체
   * @param selector - 가져올 요소의 선택자
   * @returns 요소의 텍스트 내용
   */
  public static async getText(page: Page, selector: string): Promise<string> {
    await page.waitForSelector(selector);
    return await page.innerText(selector);
  }

  /**
   * 요소 존재 여부 확인
   * @param page - Playwright Page 객체
   * @param selector - 확인할 요소의 선택자
   * @returns 요소가 존재하면 true, 없으면 false
   */
  public static async isElementVisible(page: Page, selector: string): Promise<boolean> {
    return await page.isVisible(selector);
  }
}
