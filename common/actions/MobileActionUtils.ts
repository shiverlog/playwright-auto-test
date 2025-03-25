import { BaseActionUtils } from '@common/actions/BaseActionUtils';
import type { Page, Locator } from '@playwright/test';
import type { Browser, Element } from 'webdriverio'; 
import { ActionConstants } from '@common/constants/ActionConstants';

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
   *  현재 플랫폼이 Android인지 확인 
   */
  public isAndroid(): boolean {
    return this.platform === 'android';
  }

  /**
   *  현재 플랫폼이 iOS인지 확인 
   */
  public isIOS(): boolean {
    return this.platform === 'ios';
  }

  /**
   *  Appium: 요소 클릭 
   */
  public async click(selector: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.click();
  }

  /**
   *  Appium: swipe up 동작 
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
   *  Appium: 요소 찾기 
   */
  public async findAppiumElement(selector: string): Promise<Element | undefined> {
    if (!this.driver) return;
    const el = await this.driver.$(selector);
    return el as unknown as Element;
  }

  /**
   *  Appium: 토스트 메시지 존재 여부 
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
   *  Appium: 키보드 숨기기 
   */
  public async hideKeyboard(): Promise<void> {
    try {
      await this.driver?.hideKeyboard();
    } catch (_) {}
  }

  /**
   *  Appium: 화면 터치 
   */
  public async tap(x: number, y: number): Promise<void> {
    await this.driver?.touchAction({ action: 'tap', x, y });
  }

  /**
   *  Appium: 스크롤하여 요소 찾기 
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
   *  Playwright: 웹 요소 탭 (터치) 
   */
  public async tapWebElement(selector: string): Promise<void> {
    await this.page?.locator(selector).tap();
  }

  /**
   *  Playwright: 웹 요소 텍스트 가져오기 
   */
  public async getWebText(selector: string): Promise<string> {
    return (await this.page?.locator(selector).innerText()) ?? '';
  }

  /**
   *  Playwright: 웹 요소로 스크롤 
   */
  public async scrollWebToElement(selector: string): Promise<void> {
    await this.page?.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   *  Playwright: 모바일 뷰포트에서 키보드 입력 
   */
  public async typeWebText(selector: string, text: string): Promise<void> {
    const locator = this.page?.locator(selector);
    await locator?.fill('');
    await locator?.type(text);
  }

  /**
   *  Appium: Native Context로 전환 
   */
  public async switchToNativeContext(): Promise<void> {
    const contexts = await this.driver?.getContexts();
    if (!Array.isArray(contexts)) return;

    const nativeContext = contexts.find(ctx => typeof ctx === 'string' && ctx.includes('NATIVE_APP'));
    if (nativeContext) await this.driver?.switchContext(nativeContext);
  }

  /**
   *  Appium: WebView Context로 전환 
   */
  public async switchToWebviewContext(): Promise<void> {
    const contexts = await this.driver?.getContexts();
    if (!Array.isArray(contexts)) return;

    const webviewContext = contexts.find(ctx => typeof ctx === 'string' && ctx.includes('WEBVIEW'));
    if (webviewContext) await this.driver?.switchContext(webviewContext);
  }

  /**
   *  Appium: 화면 상단으로 스크롤 
   */
  public async scrollToTop(): Promise<void> {
    await this.driver?.execute('mobile: scroll', { direction: 'up' });
  }

  /**
   *  Appium: 아래로 스크롤 
   */
  public async scrollDown(): Promise<void> {
    await this.driver?.execute('mobile: scroll', { direction: 'down' });
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
   * Appium: 요소가 보일 때까지 클릭 시도
   * - 지정한 횟수만큼 스와이프하며 요소를 찾고 클릭
   * - 기본 재시도 횟수는 ActionDefaults.maxScrollAttempts 를 따름
   * 
   * @param selector 클릭할 요소 셀렉터
   * @param retryCount 최대 재시도 횟수 (기본값: ActionDefaults.maxScrollAttempts)
   */
  public async clickUntilVisible(selector: string, retryCount: number = ActionConstants.maxScrollAttempts): Promise<void> {
    for (let i = 0; i < retryCount; i++) {
      const el = await this.findAppiumElement(selector);
      if (el && (await el.isDisplayed())) {
        await el.click();
        return;
      }
      await this.swipeUp();
    }
    throw new Error(`❌ Element not visible after ${retryCount} tries: ${selector}`);
  }

  /**
   *  Appium: 모달 닫기 (있는 경우) 
   */
  public async closeModalIfPresent(selector: string): Promise<void> {
    const modal = await this.findAppiumElement(selector);
    if (modal && (await modal.isDisplayed())) {
      await modal.click();
    }
  }

  /**
   *  Appium: 요소 중심을 터치 (WebView 요소에 사용) 
   */
  public async tapWebviewElementByCenter(selector: string): Promise<void> {
    const el = await this.findAppiumElement(selector);
    if (!el) return;

    const rect = await (el as any).getRect();
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;

    await this.tap(x, y);
  }
}
