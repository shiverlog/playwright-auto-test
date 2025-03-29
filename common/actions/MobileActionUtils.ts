import { BaseActionUtils } from '@common/actions/BaseActionUtils';
import { ActionConstants } from '@common/constants/ActionConstants';
import type { Locator, Page } from '@playwright/test';
import type { Browser, Element } from 'webdriverio';

type MobilePlatform = 'android' | 'ios';

/**
 * Appium: 모바일 전용 액션 유틸리티 클래스
 */
export class MobileActionUtils extends BaseActionUtils {
  private platform: MobilePlatform;

  constructor(page: Page, driver: Browser) {
    super(page, driver);

    const platformName = driver.capabilities?.platformName?.toString().toLowerCase();
    if (platformName?.includes('android')) {
      this.platform = 'android';
    } else if (platformName?.includes('ios')) {
      this.platform = 'ios';
    } else {
      throw new Error(`지원하지 않는 플랫폼: ${platformName}`);
    }
  }

  /**
   * 현재 플랫폼이 Android인지 확인
   */
  public isAndroid(): boolean {
    return this.platform === 'android';
  }

  /**
   * 현재 플랫폼이 iOS인지 확인
   */
  public isIOS(): boolean {
    return this.platform === 'ios';
  }

  // ========== Playwright 전용 ==========
  /**
   * Playwright: 웹 요소 탭 (터치)
   */
  public async tapWebElement(selector: string): Promise<void> {
    await this.page?.locator(selector).tap();
  }

  /**
   * Playwright: 웹 요소 텍스트 가져오기
   */
  public async getWebText(selector: string): Promise<string> {
    return (await this.page?.locator(selector).innerText()) ?? '';
  }

  /**
   * Playwright: 웹 요소로 스크롤
   */
  public async scrollWebToElement(selector: string): Promise<void> {
    await this.page?.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Playwright: 모바일 뷰포트에서 키보드 입력
   */
  public async typeWebText(selector: string, text: string): Promise<void> {
    const locator = this.page?.locator(selector);
    await locator?.fill('');
    await locator?.type(text);
  }

  /** Playwright: 웹 요소가 보일 때까지 대기 */
  public async waitForVisibleWeb(selector: string, timeout = 5000): Promise<void> {
    await this.page?.locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   *  Playwright: 웹 요소가 사라질 때까지 대기
   */
  public async waitForHiddenWeb(selector: string, timeout = 5000): Promise<void> {
    await this.page?.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  /**
   *  Playwright: 웹 요소의 속성값 가져오기
   */
  public async getAttributeWeb(selector: string, attr: string): Promise<string | null> {
    return (await this.page?.locator(selector).getAttribute(attr)) ?? null;
  }

  /**
   *  Playwright: 웹 요소 존재 여부 확인
   */
  public async isElementPresentWeb(selector: string): Promise<boolean> {
    const count = await this.page?.locator(selector).count();
    return (count ?? 0) > 0;
  }

  /**
   *  Playwright: 웹 요소를 JS로 강제 클릭
   */
  public async forceClickWeb(selector: string): Promise<void> {
    await this.page?.evaluate(sel => {
      const el = document.querySelector(sel) as HTMLElement;
      if (el) el.click();
    }, selector);
  }

  /**
   *  Playwright: 뷰포트 스크롤 (Y 오프셋 기준)
   */
  public async scrollWebByOffset(y: number): Promise<void> {
    await this.page?.evaluate(offsetY => {
      window.scrollBy(0, offsetY);
    }, y);
  }

  // ========== Appium 전용 ==========
  /**
   * Appium: 요소 찾기
   */
  public async findAppiumElement(selector: string): Promise<Element | undefined> {
    if (!this.driver) return;
    const el = await this.driver.$(selector);
    return el as unknown as Element;
  }

  /**
   * Appium: 요소 클릭
   */
  public async click(selector: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.click();
  }

  /**
   * Appium: 더블 클릭
   */
  public async doubleClick(selector: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.click();
    await this.driver?.pause(100);
    await element?.click();
  }

  /**
   * Appium: 텍스트 입력
   */
  public async type(selector: string, text: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.setValue(text);
  }

  /**
   * Appium: 텍스트 초기화 후 입력
   */
  public async clearAndType(selector: string, text: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.clearValue();
    await element?.setValue(text);
  }

  /**
   * Appium: 텍스트 가져오기
   */
  public async getText(selector: string): Promise<string | undefined> {
    const element = await this.findAppiumElement(selector);
    return await element?.getText();
  }

  /**
   *  Appium: 입력값 가져오기
   */
  public async getValue(selector: string): Promise<string | undefined> {
    const element = await this.findAppiumElement(selector);
    return await element?.getValue();
  }

  /**
   * Appium: 활성화 여부
   */
  public async isEnabled(selector: string): Promise<boolean> {
    const element = await this.findAppiumElement(selector);
    return (await element?.isEnabled()) ?? false;
  }

  /**
   * Appium: 표시 여부
   */
  public async isDisplayed(selector: string): Promise<boolean> {
    const element = await this.findAppiumElement(selector);
    return (await element?.isDisplayed()) ?? false;
  }

  /**
   * Appium: 토스트 존재 여부
   */
  public async isToastVisible(text: string): Promise<boolean> {
    if (this.isAndroid()) {
      const el = await this.driver?.$(`//android.widget.Toast[@text='${text}']`);
      return (await el?.isDisplayed()) ?? false;
    } else {
      const el = await this.findAppiumElement(`//*[@name='${text}']`);
      return (await el?.isDisplayed()) ?? false;
    }
  }

  /**
   * Appium: 키보드 숨기기
   */
  public async hideKeyboard(): Promise<void> {
    try {
      await this.driver?.hideKeyboard();
    } catch (_) {}
  }

  /**
   * Appium: 탭
   */
  public async tap(x: number, y: number): Promise<void> {
    await this.driver?.touchAction({ action: 'tap', x, y });
  }

  /**
   * Appium: 스크롤 후 요소 찾기
   */
  public async scrollAndFind(selector: string, maxScroll = 5): Promise<Element | undefined> {
    for (let i = 0; i < maxScroll; i++) {
      const el = await this.findAppiumElement(selector);
      if (el && (await el.isDisplayed())) return el;
      await this.swipeUp();
    }
    return undefined;
  }

  /**
   * Appium: swipe up 동작
   */
  public async swipeUp(): Promise<void> {
    const x = 300;
    const startY = this.isAndroid() ? 800 : 600;
    const endY = this.isAndroid() ? 300 : 200;

    await this.driver?.touchAction([
      { action: 'press', x, y: startY },
      { action: 'wait', ms: 200 },
      { action: 'moveTo', x, y: endY },
      'release',
    ]);
  }

  /**
   * Appium: swipe down 동작
   */
  public async swipeDown(): Promise<void> {
    const x = 300;
    const startY = this.isAndroid() ? 300 : 200;
    const endY = this.isAndroid() ? 800 : 600;

    await this.driver?.touchAction([
      { action: 'press', x, y: startY },
      { action: 'wait', ms: 200 },
      { action: 'moveTo', x, y: endY },
      'release',
    ]);
  }

  /**
   * Appium: Y 오프셋만큼 스크롤
   * - 중앙 X좌표 기준으로 터치 후 Y 방향으로 이동
   * - 기본 좌표값은 ActionConstants에서 가져옴
   */
  public async scrollByOffset(yOffset: number): Promise<void> {
    const windowSize = await this.driver?.getWindowSize();

    // X는 화면 중앙 (없을 경우 기본값)
    const x = windowSize ? windowSize.width / 2 : ActionConstants.touchTapX;

    // 시작 Y좌표: 화면 중앙 (없을 경우 기본값)
    const startY = windowSize ? windowSize.height / 2 : ActionConstants.touchStartY[this.platform];

    // 종료 Y좌표: 시작점에서 yOffset만큼 위로 이동
    const endY = startY - yOffset;

    // 실제 스크롤 액션 실행
    await this.driver?.touchAction([
      { action: 'press', x, y: startY },
      { action: 'wait', ms: ActionConstants.swipeWaitMs },
      { action: 'moveTo', x, y: endY },
      'release',
    ]);
  }

  /**
   * Appium: WebView Context로 전환
   */
  public async switchToWebviewContext(): Promise<void> {
    const contexts = await this.driver?.getContexts();
    if (!Array.isArray(contexts)) return;

    const webviewContext = contexts.find(ctx => typeof ctx === 'string' && ctx.includes('WEBVIEW'));
    if (webviewContext) await this.driver?.switchContext(webviewContext);
  }

  /**
   * Appium: 요소 중심 터치
   */

  /**
   * Appium: select 옵션
   */
  public async selectOption(selector: string, text: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.selectByVisibleText(text);
  }

  /**
   * Appium: Native Context로 전환
   */
  public async switchToNativeContext(): Promise<void> {
    const contexts = await this.driver?.getContexts();
    const nativeContext = contexts?.find(
      ctx => typeof ctx === 'string' && ctx.includes('NATIVE_APP'),
    );
    if (nativeContext) await this.driver?.switchContext(nativeContext);
  }

  /**
   * Appium: 상단으로 스크롤
   */
  public async scrollToTop(): Promise<void> {
    await this.driver?.execute('mobile: scroll', { direction: 'up' });
  }

  /**
   * Appium: 하단으로 스크롤
   */
  public async scrollDown(): Promise<void> {
    await this.driver?.execute('mobile: scroll', { direction: 'down' });
  }

  /**
   * Appium: 보일 때까지 클릭 시도
   */
  public async clickUntilVisible(
    selector: string,
    retryCount: number = ActionConstants.maxScrollAttempts,
  ): Promise<void> {
    for (let i = 0; i < retryCount; i++) {
      const el = await this.findAppiumElement(selector);
      if (el && (await el.isDisplayed())) {
        await el.click();
        return;
      }
      await this.swipeUp();
    }
    throw new Error(`Element not visible after ${retryCount} tries: ${selector}`);
  }

  /**
   * Appium: 모달 닫기 (있는 경우)
   */
  public async closeModalIfPresent(selector: string): Promise<void> {
    const modal = await this.findAppiumElement(selector);
    if (modal && (await modal.isDisplayed())) {
      await modal.click();
    }
  }

  /**
   * Appium: 요소 중심 터치
   */
  public async tapWebviewElementByCenter(selector: string): Promise<void> {
    const el = await this.findAppiumElement(selector);
    if (!el) return;

    const rect = await (el as any).getRect();
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;

    await this.tap(x, y);
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
   * Appium: 기존 텍스트 지우고 새 텍스트 입력
   */
  public async clearAndTypeAppium(selector: string, text: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.clearValue();
    await element?.setValue(text);
  }

  /**
   * Appium: 텍스트 가져오기
   */
  public async getTextAppium(selector: string): Promise<string | undefined> {
    const element = await this.findAppiumElement(selector);
    return await element?.getText();
  }

  /**
   * Appium: 입력값 가져오기
   */
  public async getValueAppium(selector: string): Promise<string | undefined> {
    const element = await this.findAppiumElement(selector);
    return await element?.getValue();
  }

  /**
   * Appium: 요소 활성화 여부
   */
  public async isEnabledAppium(selector: string): Promise<boolean> {
    const element = await this.findAppiumElement(selector);
    return (await element?.isEnabled()) ?? false;
  }

  /**
   * Appium: 요소 표시 여부
   */
  public async isDisplayedAppium(selector: string): Promise<boolean> {
    const element = await this.findAppiumElement(selector);
    return (await element?.isDisplayed()) ?? false;
  }

  /**
   * Appium: 요소로 스크롤 이동
   */
  public async scrollToAppium(selector: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    if (element) {
      await this.driver?.execute('mobile: scroll', { element: element.elementId, toVisible: true });
    }
  }

  /**
   * Appium: 드롭다운 옵션 선택
   */
  public async selectAppiumOption(selector: string, text: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.selectByVisibleText(text);
  }

  /**
   * Appium: 키 입력
   */
  public async pressKeyAppium(key: string): Promise<void> {
    await this.driver?.keys(key);
  }
}
