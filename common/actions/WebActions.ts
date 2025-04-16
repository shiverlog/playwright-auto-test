/**
 * Description : WebActions.ts - 📌 Playwright: 웹 전용 애션 유튜리티 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-01
 */
import { BaseActions } from '@common/actions/BaseActions.js';
import type { Locator, Page } from '@playwright/test';

export class WebActions extends BaseActions<undefined> {
  constructor(page: Page) {
    super(page);
  }

  /**
   *  Playwright: 로딩 스피너가 사라지는 때까지 대기
   */
  public async waitForSpinnerToDisappear(spinnerSelector: string, timeout = 5000): Promise<void> {
    await this.ensurePage().waitForSelector(spinnerSelector, { state: 'hidden', timeout });
  }

  /**
   *  Playwright: 로컴 스토리지에서 값 설정
   */
  public async setLocalStorage(key: string, value: string): Promise<void> {
    await this.ensurePage().evaluate(([k, v]) => localStorage.setItem(k, v), [key, value]);
  }

  /**
   *  Playwright: 로컴 스토리지에서 값 가져오기
   */
  public async getLocalStorage(key: string): Promise<string | null> {
    return (await this.ensurePage().evaluate(k => localStorage.getItem(k), key)) ?? null;
  }

  /**
   *  Playwright: 세션 스토리지에서 값 설정
   */
  public async setSessionStorage(key: string, value: string): Promise<void> {
    await this.ensurePage().evaluate(([k, v]) => sessionStorage.setItem(k, v), [key, value]);
  }

  /**
   *  Playwright: 세션 스토리지에서 값 가져오기
   */
  public async getSessionStorage(key: string): Promise<string | null> {
    return (await this.ensurePage().evaluate(k => sessionStorage.getItem(k), key)) ?? null;
  }

  /**
   *  Playwright: 특정 프레임 안에서 클릭
   */
  public async clickInsideFrame(frameSelector: string, innerSelector: string): Promise<void> {
    const frameElementHandle = await this.ensurePage().$(frameSelector);
    const frame = await frameElementHandle?.contentFrame();
    await frame?.click(innerSelector);
  }

  /**
   *  Playwright: 쿠키 값 가져오기
   */
  public async getCookie(name: string): Promise<string | undefined> {
    const cookies = await this.ensurePage().context().cookies();
    return cookies?.find(c => c.name === name)?.value;
  }

  /**
   *  Playwright: 쿠키 삭제
   */
  public async clearCookies(): Promise<void> {
    await this.ensurePage().context().clearCookies();
  }

  /**
   *  Playwright: 새로운 탭으로 전환
   */
  public async switchToLastTab(): Promise<void> {
    const pages = this.ensurePage().context().pages();
    const lastPage = pages?.[pages.length - 1];
    if (lastPage) await lastPage.bringToFront();
  }

  /**
   *  Playwright: 새 창 열기 후 URL 이동
   */
  public async openNewTabWithUrl(url: string): Promise<Page | undefined> {
    const newPage = await this.ensurePage().context().newPage();
    if (newPage) await newPage.goto(url);
    return newPage;
  }

  /**
   *  Playwright: 요소 속성 가져오기
   */
  public async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return (await this.getLocator(selector).getAttribute(attribute)) ?? null;
  }

  /**
   *  Playwright: 요소 존재 여부 확인
   */
  public async isElementPresent(selector: string): Promise<boolean> {
    const count = await this.getLocator(selector).count();
    return (count ?? 0) > 0;
  }

  /**
   *  Playwright: 요소 클릭 (스크롤 포폴)
   */
  public async scrollAndClick(selector: string): Promise<void> {
    const element = this.getLocator(selector);
    await element.scrollIntoViewIfNeeded();
    await element.click();
  }

  /**
   *  Playwright: 페이지 타이티널 반환
   */
  public async getPageTitle(): Promise<string> {
    return (await this.ensurePage().title()) ?? '';
  }

  /**
   *  Playwright: 페이지 전체 스크립샷
   */
  public async takeFullPageScreenshot(filePath: string): Promise<void> {
    await this.ensurePage().screenshot({ path: filePath, fullPage: true });
  }

  /**
   * Playwright: 요소를 오프셀 기준으로 드래그
   */
  public async dragElementByOffset(
    selector: string,
    offsetX: number,
    offsetY: number,
  ): Promise<void> {
    const element = this.getLocator(selector);
    const box = await element.boundingBox();
    if (!box) return;

    await this.ensurePage().mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await this.ensurePage().mouse.down();
    await this.ensurePage().mouse.move(
      box.x + box.width / 2 + offsetX,
      box.y + box.height / 2 + offsetY,
      {
        steps: 10,
      },
    );
    await this.ensurePage().mouse.up();
  }

  /**
   * Playwright: 요소를 다른 요소로 드래그 (drag & drop)
   */
  public async dragAndDrop(sourceSelector: string, targetSelector: string): Promise<void> {
    const source = this.getLocator(sourceSelector);
    const target = this.getLocator(targetSelector);
    await source.dragTo(target);
  }

  /**
   * Playwright: 마우스를 특정 위치로 이동
   */
  public async moveMouse(x: number, y: number): Promise<void> {
    await this.ensurePage().mouse.move(x, y);
  }

  /**
   * Playwright: 요소 중앙으로 마우스 이동
   */
  public async moveMouseToElement(selector: string): Promise<void> {
    const element = this.getLocator(selector);
    const box = await element.boundingBox();
    if (!box) return;

    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    await this.ensurePage().mouse.move(centerX, centerY);
  }
}
