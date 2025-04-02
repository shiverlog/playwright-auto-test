/**
 * Description : WebActions.ts - 📌 Playwright: 웹 전용 액션 유틸리티 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-01
 */
import { BaseActionUtils } from '@common/actions/BaseActionUtils';
import type { Locator, Page } from '@playwright/test';

export class WebActionUtils extends BaseActionUtils<undefined> {
  constructor(page: Page) {
    super(page);
  }

  /**
   *  Playwright: 로딩 스피너가 사라질 때까지 대기
   */
  public async waitForSpinnerToDisappear(spinnerSelector: string, timeout = 5000): Promise<void> {
    await this.page.waitForSelector(spinnerSelector, { state: 'hidden', timeout });
  }

  /**
   *  Playwright: 로컬 스토리지에서 값 설정
   */
  public async setLocalStorage(key: string, value: string): Promise<void> {
    await this.page.evaluate(([k, v]) => localStorage.setItem(k, v), [key, value]);
  }

  /**
   *  Playwright: 로컬 스토리지에서 값 가져오기
   */
  public async getLocalStorage(key: string): Promise<string | null> {
    return (await this.page.evaluate(k => localStorage.getItem(k), key)) ?? null;
  }

  /**
   *  Playwright: 세션 스토리지에서 값 설정
   */
  public async setSessionStorage(key: string, value: string): Promise<void> {
    await this.page.evaluate(([k, v]) => sessionStorage.setItem(k, v), [key, value]);
  }

  /**
   *  Playwright: 세션 스토리지에서 값 가져오기
   */
  public async getSessionStorage(key: string): Promise<string | null> {
    return (await this.page.evaluate(k => sessionStorage.getItem(k), key)) ?? null;
  }

  /**
   *  Playwright: 특정 프레임 안에서 클릭
   */
  public async clickInsideFrame(frameSelector: string, innerSelector: string): Promise<void> {
    const frameElementHandle = await this.page.$(frameSelector);
    const frame = await frameElementHandle?.contentFrame();
    await frame?.click(innerSelector);
  }

  /**
   *  Playwright: 쿠키 값 가져오기
   */
  public async getCookie(name: string): Promise<string | undefined> {
    const cookies = await this.page.context().cookies();
    return cookies?.find(c => c.name === name)?.value;
  }

  /**
   *  Playwright: 쿠키 삭제
   */
  public async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }

  /**
   *  Playwright: 새로운 탭으로 전환
   */
  public async switchToLastTab(): Promise<void> {
    const pages = this.page.context().pages();
    const lastPage = pages?.[pages.length - 1];
    if (lastPage) await lastPage.bringToFront();
  }

  /**
   *  Playwright: 새 창 열기 후 URL 이동
   */
  public async openNewTabWithUrl(url: string): Promise<Page | undefined> {
    const newPage = await this.page.context().newPage();
    if (newPage) await newPage.goto(url);
    return newPage;
  }

  /**
   *  Playwright: 요소 속성 가져오기
   */
  public async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return (await this.page.locator(selector).getAttribute(attribute)) ?? null;
  }

  /**
   *  Playwright: 요소 존재 여부 확인
   */
  public async isElementPresent(selector: string): Promise<boolean> {
    const count = await this.page.locator(selector).count();
    return (count ?? 0) > 0;
  }

  /**
   *  Playwright: 요소 클릭 (스크롤 포함)
   */
  public async scrollAndClick(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await element?.scrollIntoViewIfNeeded();
    await element?.click();
  }

  /**
   *  Playwright: 페이지 타이틀 반환
   */
  public async getPageTitle(): Promise<string> {
    return (await this.page.title()) ?? '';
  }

  /**
   *  Playwright: 페이지 전체 스크린샷
   */
  public async takeFullPageScreenshot(filePath: string): Promise<void> {
    await this.page.screenshot({ path: filePath, fullPage: true });
  }

  /**
   * Playwright: 요소를 오프셋 기준으로 드래그
   */
  public async dragElementByOffset(
    selector: string,
    offsetX: number,
    offsetY: number,
  ): Promise<void> {
    const element = this.page.locator(selector);
    const box = await element?.boundingBox();
    if (!box || !this.page) return;

    await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(box.x + box.width / 2 + offsetX, box.y + box.height / 2 + offsetY, {
      steps: 10,
    });
    await this.page.mouse.up();
  }

  /**
   * Playwright: 요소를 다른 요소로 드래그 (drag & drop)
   */
  public async dragAndDrop(sourceSelector: string, targetSelector: string): Promise<void> {
    const source = this.page.locator(sourceSelector);
    const target = this.page.locator(targetSelector);
    await source?.dragTo(target!);
  }

  /**
   * Playwright: 마우스를 특정 위치로 이동
   */
  public async moveMouse(x: number, y: number): Promise<void> {
    await this.page.mouse.move(x, y);
  }

  /**
   * Playwright: 요소 중앙으로 마우스 이동
   */
  public async moveMouseToElement(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    const box = await element.boundingBox();

    if (!box) return;

    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    await this.page.mouse.move(centerX, centerY);
  }
}
