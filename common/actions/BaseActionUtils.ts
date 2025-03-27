import type { Locator, Page } from '@playwright/test';
import type { Browser, Element } from 'webdriverio';

/**
 * BaseActionUtils: 공통 액션 유틸리티 클래스
 */
export class BaseActionUtils {
  protected page: Page;
  protected driver?: Browser;

  constructor(page: Page, driver?: Browser) {
    this.page = page;
    this.driver = driver;
  }

  // ========== Common ==========

  /**
   *  Common: 현재 페이지 URL 반환
   */
  public getCurrentUrl(): string | undefined {
    return this.page?.url();
  }

  /**
   *  Common: 새 탭 열기
   */
  public async openNewTab(url?: string): Promise<Page | undefined> {
    if (!this.page) return;
    const newPage = await this.page.context().newPage();
    if (url) await newPage.goto(url);
    return newPage;
  }

  /**
   *  Common: 키보드 키 입력
   */
  public async pressKey(key: string): Promise<void> {
    await this.page?.keyboard.press(key);
  }

  /**
   *  Common: 페이지 뒤로가기
   */
  public async goBack(): Promise<void> {
    await this.page?.goBack();
  }

  /**
   *  Common: 페이지 앞으로가기
   */
  public async goForward(): Promise<void> {
    await this.page?.goForward();
  }

  /**
   *  Common: 페이지 새로고침
   */
  public async refresh(): Promise<void> {
    await this.page?.reload();
  }

  /**
   *  Common: 페이지 로딩 대기
   */
  public async waitForLoadState(
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'load',
  ): Promise<void> {
    await this.page?.waitForLoadState(state);
  }

  /**
   *  Common: 네비게이션 대기
   */
  public async waitForNavigation(): Promise<void> {
    await this.page?.waitForNavigation();
  }

  /**
   *  Common: 스크린샷 저장
   */
  public async takeScreenshot(filename: string): Promise<void> {
    await this.page?.screenshot({ path: filename, fullPage: true });
  }

  // ========== Playwright 전용 ==========

  /**
   *  Playwright: 요소 찾기
   */
  public findElement(selector: string): Locator | undefined {
    return this.page?.locator(selector);
  }

  /**
   *  Playwright: 요소가 보일 때까지 대기
   */
  public async waitForVisible(selector: string, timeout = 5000): Promise<void> {
    await this.page?.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   *  Playwright: 요소가 사라질 때까지 대기
   */
  public async waitForHidden(selector: string, timeout = 5000): Promise<void> {
    await this.page?.waitForSelector(selector, { state: 'hidden', timeout });
  }

  /**
   *  Playwright: 요소 클릭
   */
  public async click(selector: string): Promise<void> {
    await this.findElement(selector)?.click();
  }

  /**
   *  Playwright: 요소 더블 클릭
   */
  public async doubleClick(selector: string): Promise<void> {
    await this.findElement(selector)?.dblclick();
  }

  /**
   *  Playwright: 텍스트 입력
   */
  public async typeText(selector: string, text: string): Promise<void> {
    const element = this.findElement(selector);
    await element?.fill(text);
  }

  /**
   *  Playwright: 기존 텍스트 지우고 새 텍스트 입력
   */
  public async clearAndType(selector: string, text: string): Promise<void> {
    const element = this.findElement(selector);
    await element?.fill('');
    await element?.type(text);
  }

  /**
   *  Playwright: 텍스트 가져오기
   */
  public async getText(selector: string): Promise<string | undefined> {
    return await this.findElement(selector)?.innerText();
  }

  /**
   *  Playwright: 입력 필드 값 가져오기
   */
  public async getInputValue(selector: string): Promise<string | undefined> {
    return await this.findElement(selector)?.inputValue();
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
  public async findElementWithText(selector: string, text: string): Promise<Locator | undefined> {
    return this.page?.locator(selector, { hasText: text });
  }

  /**
   *  Playwright: 요소로 스크롤 이동
   */
  public async scrollTo(selector: string): Promise<void> {
    await this.findElement(selector)?.scrollIntoViewIfNeeded();
  }

  /**
   *  Playwright: 요소에 마우스 오버
   */
  public async hover(selector: string): Promise<void> {
    await this.findElement(selector)?.hover();
  }

  /**
   *  Playwright: 체크박스 체크 여부
   */
  public async isChecked(selector: string): Promise<boolean> {
    return (await this.findElement(selector)?.isChecked()) ?? false;
  }

  /**
   *  Playwright: 요소 활성화 여부
   */
  public async isEnabled(selector: string): Promise<boolean> {
    return (await this.findElement(selector)?.isEnabled()) ?? false;
  }

  /**
   *  Playwright: 요소 편집 가능 여부
   */
  public async isEditable(selector: string): Promise<boolean> {
    return (await this.findElement(selector)?.isEditable()) ?? false;
  }

  /**
   *  Playwright: 드롭다운 옵션 선택
   */
  public async selectOption(selector: string, value: string): Promise<void> {
    await this.findElement(selector)?.selectOption(value);
  }

  /**
   *  Playwright: JavaScript 로 클릭
   */
  public async jsClick(selector: string): Promise<void> {
    const element = this.findElement(selector);
    await element?.evaluate((el: HTMLElement) => el.click());
  }

  /**
   *  Playwright: 파일 다운로드 후 파일명 반환
   */
  public async downloadFile(selector: string): Promise<string | undefined> {
    if (!this.page) return;
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.locator(selector).click(),
    ]);
    return download.suggestedFilename();
  }

  /**
   *  Playwright: alert 수락 (메시지 반환)
   */
  public async acceptAlert(): Promise<string | undefined> {
    if (!this.page) return;
    return new Promise(resolve => {
      this.page!.once('dialog', async dialog => {
        const message = dialog.message();
        await dialog.accept();
        resolve(message);
      });
    });
  }

  // // Playwright: 요소 모두를 찾기
  // async findElements(selector: string): Promise<Locator[]> {
  //   return (await this.page?.locator(selector).all() ?? ;
  // }

  // /**
  //  * 특정 순서의 요소 찾기
  //  */
  // public async findElementByIndex(selector: string, index: number): Promise<Locator | null> {
  //   const count = await this.page?.locator(selector).count();
  //   return (await index < count ? this.page?.locator(selector).nth(index)) ?? null;
  // }

  /**
   * Playwright: 요소 갯수 카운트
   */
  public async getElementCount(selector: string): Promise<number> {
    return (await this.page?.locator(selector).count()) ?? 0;
  }

  /**
   *  Playwright: 요소 존재 여부
   */
  public async isElementVisible(selector: string): Promise<boolean> {
    return (await this.page?.locator(selector).isVisible()) ?? false;
  }

  /**
   *  Playwright: 요소 존재 여부 (비동기 true/false)
   */
  public async exists(selector: string): Promise<boolean> {
    const count = await this.page?.locator(selector).count();
    return (count ?? 0) > 0;
  }

  // ========== Appium 전용 ==========

  /**
   *  Appium: 요소 찾기
   */
  public async findAppiumElement(selector: string): Promise<Element | undefined> {
    if (!this.driver) return;
    const el = await this.driver.$(selector);
    return el as unknown as Element;
  }

  /**
   *  Appium: 요소 클릭
   */
  public async clickAppium(selector: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.click();
  }

  /**
   *  Appium: 요소 더블 클릭 (딜레이 후 두 번 클릭)
   */
  public async doubleClickAppium(selector: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.click();
    await this.driver?.pause(100);
    await element?.click();
  }

  /**
   *  Appium: 텍스트 입력
   */
  public async typeAppium(selector: string, text: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.setValue(text);
  }

  /**
   *  Appium: 기존 텍스트 지우고 새 텍스트 입력
   */
  public async clearAndTypeAppium(selector: string, text: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.clearValue();
    await element?.setValue(text);
  }

  /**
   *  Appium: 텍스트 가져오기
   */
  public async getTextAppium(selector: string): Promise<string | undefined> {
    const element = await this.findAppiumElement(selector);
    return await element?.getText();
  }

  /**
   *  Appium: 입력값 가져오기
   */
  public async getValueAppium(selector: string): Promise<string | undefined> {
    const element = await this.findAppiumElement(selector);
    return await element?.getValue();
  }

  /**
   *  Appium: 요소 활성화 여부
   */
  public async isEnabledAppium(selector: string): Promise<boolean> {
    const element = await this.findAppiumElement(selector);
    return (await element?.isEnabled()) ?? false;
  }

  /**
   *  Appium: 요소 표시 여부
   */
  public async isDisplayedAppium(selector: string): Promise<boolean> {
    const element = await this.findAppiumElement(selector);
    return (await element?.isDisplayed()) ?? false;
  }

  /**
   *  Appium: 요소로 스크롤 이동
   */
  public async scrollToAppium(selector: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    if (element) {
      await this.driver?.execute('mobile: scroll', { element: element.elementId, toVisible: true });
    }
  }

  /**
   *  Appium: 드롭다운 옵션 선택
   */
  public async selectAppiumOption(selector: string, text: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.selectByVisibleText(text);
  }

  /**
   *  Appium: swipe up 액션
   */
  public async swipeUp(): Promise<void> {
    await this.driver?.touchAction([
      { action: 'press', x: 300, y: 800 },
      { action: 'wait', ms: 200 },
      { action: 'moveTo', x: 300, y: 300 },
      'release',
    ]);
  }

  /**
   *  Appium: swipe down 액션
   */
  public async swipeDown(): Promise<void> {
    await this.driver?.touchAction([
      { action: 'press', x: 300, y: 300 },
      { action: 'wait', ms: 200 },
      { action: 'moveTo', x: 300, y: 800 },
      'release',
    ]);
  }

  /**
   *  Appium: 키 입력
   */
  public async pressKeyAppium(key: string): Promise<void> {
    await this.driver?.keys(key);
  }

  // ========== 자바스크립트 강제 액션(headless 등의 문제해결을 위함) ==========

  /**
   * JavaScript로 요소 클릭
   */
  public async forceClickJS(selector: string): Promise<void> {
    await this.page?.evaluate(sel => {
      const el = document.querySelector(sel);
      if (el) (el as HTMLElement).click();
    }, selector);
  }

  /**
   * JavaScript로 텍스트 입력
   */
  public async forceTypeJS(selector: string, value: string): Promise<void> {
    await this.page?.evaluate(
      ([sel, val]) => {
        const el = document.querySelector(sel) as HTMLInputElement | null;
        if (el) el.value = val;
      },
      [selector, value],
    );
  }

  /**
   * JavaScript로 input 값 초기화
   */
  public async clearInputJS(selector: string): Promise<void> {
    await this.page?.evaluate(sel => {
      const el = document.querySelector(sel) as HTMLInputElement | null;
      if (el) el.value = '';
    }, selector);
  }

  /**
   * JavaScript로 요소에 focus() 주기
   */
  public async focusJS(selector: string): Promise<void> {
    await this.page?.evaluate(sel => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) el.focus();
    }, selector);
  }
}
