/**
 * Description : BaseActionUtils.ts - 📌 공통 액션 유틸리티 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-01
 * TDriver는 제네릭 타입 매개변수를 사용하여
 * - WebActionUtils 에서는 Playwright page 만 사용
 * - MobileActionUtils 에서는 Playwright + Appium 드라이버 객체를 함께 관리
 */
import { JsForceActions } from '@common/actions/JsForceActions.js';
import type { Locator, Page } from '@playwright/test';

export class BaseActionUtils<TDriver = unknown> {
  protected page: Page;
  protected js: JsForceActions;
  // driver?: TDriver; // Appium 드라이버 객체 (MobileActionUtils에서만 사용)
  constructor(page: Page, driver?: TDriver) {
    this.page = page;
    this.js = new JsForceActions(page);
  }

  // ========== Common ==========

  /**
   *  Common: 현재 페이지 URL 반환
   */
  public getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   *  Common: 새 탭 열기
   */
  public async openNewTab(url?: string): Promise<Page> {
    const newPage = await this.page.context().newPage();
    if (url) await newPage.goto(url);
    return newPage;
  }

  /**
   *  Common: 키보드 키 입력
   */
  public async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   *  Common: 페이지 뒤로가기
   */
  public async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   *  Common: 페이지 앞으로가기
   */
  public async goForward(): Promise<void> {
    await this.page.goForward();
  }

  /**
   *  Common: 페이지 새로고침
   */
  public async refresh(): Promise<void> {
    await this.page.reload();
  }

  /**
   *  Common: 페이지 로딩 대기
   */
  public async waitForLoadState(
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'load',
  ): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  /**
   *  Common: 클릭 후, 네비게이션 대기
   */
  public async clickAndWaitForNavigation(
    selector: string,
    waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'load',
  ): Promise<void> {
    await Promise.all([this.page.waitForLoadState(waitUntil), this.getLocator(selector).click()]);
  }

  /**
   *  Common: 스크린샷 저장
   */
  public async takeScreenshot(filename: string): Promise<void> {
    await this.page.screenshot({ path: filename, fullPage: true });
  }

  // ========== Playwright 전용 ==========

  /**
   * Playwright에서 요소를 찾는 안전한 헬퍼 함수
   */
  protected getLocator(selector: string): Locator {
    if (!this.page) {
      throw new Error(`[Playwright] page 객체가 정의되지 않았습니다. selector: ${selector}`);
    }
    return this.page.locator(selector);
  }

  /**
   *  Playwright: 요소 찾기
   */
  public findElement(selector: string): Locator {
    return this.page.locator(selector);
  }

  // TODO: waitForSelector()에서 getLocator().waitFor()로 수정
  /**
   *  Playwright: 요소가 보일 때까지 대기
   */
  public async waitForVisible(selector: string, timeout = 5000): Promise<void> {
    await this.getLocator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   *  Playwright: 요소가 사라질 때까지 대기
   */
  public async waitForHidden(selector: string, timeout = 5000): Promise<void> {
    await this.getLocator(selector).waitFor({ state: 'hidden', timeout });
  }

  /**
   * 사람처럼 자연스럽게 마우스를 locator 중심으로 이동시키는 함수
   */
  public async humanLikeMouseMoveToLocator(
    page: Page,
    locator: Locator,
    steps = 20,
    baseDelay = 10,
  ): Promise<void> {
    const box = await locator.boundingBox();
    if (!box) {
      throw new Error('Locator bounding box not found (element may be detached or invisible)');
    }

    const targetX = box.x + box.width / 2;
    const targetY = box.y + box.height / 2;

    let currentX = 0;
    let currentY = 0;

    const xStep = (targetX - currentX) / steps;
    const yStep = (targetY - currentY) / steps;

    for (let i = 0; i < steps; i++) {
      currentX += xStep;
      currentY += yStep;
      await page.mouse.move(currentX, currentY);
      const delay = baseDelay + Math.floor(Math.random() * 20);
      await page.waitForTimeout(delay);
    }

    // 마지막 정확한 위치로 이동
    await page.mouse.move(targetX, targetY);
  }

  /**
   * selector(string) 기반으로 마우스를 사람처럼 자연스럽게 이동시키는 함수
   */
  public async humanLikeMouseMove(selector: string, steps = 20, baseDelay = 10): Promise<void> {
    const locator = this.page.locator(selector);
    await this.humanLikeMouseMoveToLocator(this.page, locator, steps, baseDelay);
  }

  /**
   * 사람처럼 마우스를 이동하고 자연스럽게 클릭까지 수행하는 함수
   */
  public async humanLikeMoveAndClick(selector: string, steps = 20, baseDelay = 10): Promise<void> {
    const locator = this.page.locator(selector);
    const box = await locator.boundingBox();
    if (!box) {
      throw new Error('Locator bounding box not found (element may be detached or invisible)');
    }

    const targetX = box.x + box.width / 2;
    const targetY = box.y + box.height / 2;

    await this.humanLikeMouseMoveToLocator(this.page, locator, steps, baseDelay);
    await this.page.mouse.click(targetX, targetY); // 좌표 지정 필수
  }

  // TODO: findElement에서 getLocator로 수정
  /**
   *  Playwright: 요소 클릭
   */
  public async click(selector: string): Promise<void> {
    const locator = this.getLocator(selector);
    // 부드러운 스크롤 (evaluate로 DOM에 직접 접근)
    await locator.evaluate((el: Element) => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    });
    // 스크롤 애니메이션을 기다릴 시간
    await this.page.waitForTimeout(500);
    // 클릭 실행
    await locator.click();
  }

  /**
   *  Playwright: 요소 더블 클릭
   */
  public async doubleClick(selector: string): Promise<void> {
    await this.getLocator(selector).dblclick();
  }

  /**
   *  Playwright: 텍스트 입력
   */
  public async typeText(selector: string, text: string): Promise<void> {
    await this.getLocator(selector).fill(text);
  }

  /**
   * Playwright: 텍스트 입력 - 한 글자씩 (랜덤 delay)
   */
  public async typeTextSlowly(
    selector: string,
    text: string,
    baseDelayMs = 100,
    randomize = true,
  ): Promise<void> {
    const locator = this.page.locator(selector);

    await locator.click();
    await locator.fill('');

    for (const char of text) {
      await this.page.keyboard.press(char);
      const delay = randomize ? baseDelayMs + Math.floor(Math.random() * 100) : baseDelayMs;
      await this.page.waitForTimeout(delay);
    }
  }

  /**
   *  Playwright: 기존 텍스트 지우고 새 텍스트 입력
   */
  public async clearAndType(selector: string, text: string): Promise<void> {
    const locator = this.getLocator(selector);
    await locator.fill('');
    await locator.type(text);
  }

  /**
   *  Playwright: 텍스트 가져오기
   */
  public async getText(selector: string): Promise<string | undefined> {
    return await this.getLocator(selector).innerText();
  }

  /**
   *  Playwright: 입력 필드 값 가져오기
   */
  public async getInputValue(selector: string): Promise<string | undefined> {
    return await this.getLocator(selector).inputValue();
  }

  /**
   *  Playwright: 요소가 특정 텍스트 포함 여부 확인
   */
  public async containsText(selector: string, expected: string): Promise<boolean> {
    const actualText = await this.getText(selector);
    return actualText?.includes(expected) ?? false;
  }

  /**
   *  Playwright: 텍스트 포함된 요소 찾기
   */
  public async findElementWithText(selector: string, text: string): Promise<Locator> {
    return this.page.locator(selector, { hasText: text });
  }

  /**
   *  Playwright: 요소로 스크롤 이동
   */
  public async scrollTo(selector: string): Promise<void> {
    await this.getLocator(selector).scrollIntoViewIfNeeded();
  }

  /**
   *  Playwright: 요소에 마우스 오버
   */
  public async hover(selector: string): Promise<void> {
    await this.getLocator(selector).hover();
  }

  /**
   *  Playwright: 체크백스 체크 여부
   */
  public async isChecked(selector: string): Promise<boolean> {
    return await this.getLocator(selector).isChecked();
  }

  /**
   *  Playwright: 요소 활성화 여부
   */
  public async isEnabled(selector: string): Promise<boolean> {
    return await this.getLocator(selector).isEnabled();
  }

  /**
   *  Playwright: 요소 편집 가능 여부
   */
  public async isEditable(selector: string): Promise<boolean> {
    return await this.getLocator(selector).isEditable();
  }

  /**
   *  Playwright: 드롬다운 옵션 선택
   */
  public async selectOption(selector: string, value: string): Promise<void> {
    await this.getLocator(selector).selectOption(value);
  }

  /**
   *  Playwright: JavaScript 로 클릭
   */
  public async jsClick(selector: string): Promise<void> {
    await this.getLocator(selector).evaluate((el: HTMLElement) => el.click());
  }

  /**
   *  Playwright: 파일 다운로드 후 파일명 반환
   */
  public async downloadFile(selector: string): Promise<string | undefined> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.getLocator(selector).click(),
    ]);
    return download.suggestedFilename();
  }

  /**
   *  Playwright: alert 수락 (메시지 반환)
   */
  public async acceptAlert(): Promise<string | undefined> {
    return new Promise(resolve => {
      this.page.once('dialog', async dialog => {
        const message = dialog.message();
        await dialog.accept();
        resolve(message);
      });
    });
  }

  /**
   * Playwright: 모든 요소 찾기 (Selenium의 find_elements 대체)
   */
  public async findElements(selector: string): Promise<Locator[]> {
    return await this.getLocator(selector).all();
  }

  /**
   * Playwright: 특정 순서의 요소 찾기 (Selenium의 find_elements()[index] 대체)
   */
  public async findElementByIndex(selector: string, index: number): Promise<Locator | null> {
    const elements = await this.findElements(selector);
    return elements.length > index ? elements[index] : null;
  }

  /**
   * Playwright: 요소 갯수 카운트
   */
  public async getElementCount(selector: string): Promise<number> {
    return await this.getLocator(selector).count();
  }

  /**
   *  Playwright: 요소 존재 여부
   */
  public async isElementVisible(selector: string): Promise<boolean> {
    return await this.getLocator(selector).isVisible();
  }

  /**
   *  Playwright: 요소 존재 여부 (비동기 true/false)
   */
  public async exists(selector: string): Promise<boolean> {
    return (await this.getElementCount(selector)) > 0;
  }

  /**
   * Playwright: 요소가 존재하면 클릭
   */
  public async clickIfExists(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    if (await element.count()) {
      await element.click();
    }
  }

  /**
   * Playwright: 요소를 화면 중앙으로 스크롤
   */
  public async scrollToCenter(selector: string): Promise<void> {
    await this.page.evaluate(sel => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ block: 'center', behavior: 'auto' });
    }, selector);
  }

  /**
   * Playwright: 페이지를 지정된 Y 높이까지 스크롤
   */
  public async scrollToY(height: number): Promise<void> {
    await this.page.evaluate(async targetY => {
      const scrollStep = 50;
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

      while (document.scrollingElement?.scrollTop! < targetY) {
        window.scrollBy(0, scrollStep);
        await delay(100);
      }
    }, height);
  }

  /**
   * Playwright: 요소를 화면 뷰 안으로 스크롤합니다.
   */
  public async scrollElementIntoView(
    target: string | Locator,
    alignToTop: boolean = true,
  ): Promise<void> {
    const locator = typeof target === 'string' ? this.page.locator(target) : target;
    const handle = await locator.elementHandle();

    if (handle) {
      await handle.evaluate((el, align) => {
        el.scrollIntoView(align);
      }, alignToTop);
    }
  }

  /**
   * Playwright: 특정 요소의 텍스트가 지정된 문자열 리스트를 모두 포함하고 있는지 확인
   */
  public async textListInElement(
    parentSelector: string,
    expectedTexts: string[],
  ): Promise<boolean> {
    const locator = this.page.locator(parentSelector);

    try {
      await locator.scrollIntoViewIfNeeded();
      await locator.waitFor({ state: 'visible', timeout: 5000 });

      const text = await locator.innerText();
      return expectedTexts.every(t => text.includes(t));
    } catch {
      return false;
    }
  }

  /**
   * Playwright: 특정 selector로 요소 목록을 수집한 후 랜덤 요소의 속성(JSON 형태)을 파싱하여 반환
   */
  public async getRandomElementByAttribute(
    waitSelector: string,
    hoverSelector: string | null,
    listSelector: string,
    attributeName: string,
  ): Promise<any> {
    await this.waitForVisible(waitSelector);

    if (hoverSelector) {
      await this.hover(hoverSelector);
    }

    const elements = await this.findElements(listSelector);
    const count = elements.length;
    if (count === 0) {
      throw new Error(`요소를 찾을 수 없습니다: ${listSelector}`);
    }

    const randomIndex = Math.floor(Math.random() * count);
    const attr = await elements[randomIndex].getAttribute(attributeName);

    if (!attr) {
      throw new Error(`속성 '${attributeName}'이(가) 존재하지 않습니다.`);
    }
    return JSON.parse(attr);
  }
}
