import { Page } from '@playwright/test';

import { logger } from '../logger/customLogger';

export class PageUtils {
  /**
   * 특정 URL로 이동
   * @param page - Playwright Page 객체
   * @param url - 이동할 URL
   */
  public static async navigateTo(page: Page, url: string) {
    await page.goto(url);
  }

  /**
   * 현재 페이지의 URL 가져오기
   * @param page - Playwright Page 객체
   * @returns 현재 페이지 URL
   */
  public static async getCurrentUrl(page: Page): Promise<string> {
    return page.url();
  }

  /**
   * 새 탭 열기
   * @param page - Playwright Page 객체
   * @param url - 열 URL (선택 사항)
   * @returns 새로운 페이지 객체
   */
  public static async openNewTab(page: Page, url?: string): Promise<Page> {
    const newPage = await page.context().newPage();
    if (url) await newPage.goto(url);
    return newPage;
  }
}
