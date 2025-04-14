/**
 * Description : MobileActions.ts - 📌 Appium + Playwright: 모바일 전용 액션 유틸리티 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-08
 * - Playwright와 Appium을 기반으로 다양한 모바일 테스트 액션을 제공하며, 플랫폼(Android/iOS)에 따라 서로 다른 로직을 처리
 */
import { BaseActionUtils } from '@common/actions/BaseActionUtils.js';
import { ActionConstants } from '@common/constants/ActionConstants.js';
import type { Platform } from '@common/types/platform-types.js';
import { ContextUtils } from '@common/utils/context/ContextUtils.js';
import { POCEnv } from '@common/utils/env/POCEnv';
import { chromium, type Page } from '@playwright/test';
import { execSync } from 'child_process';
import type { CDPSession } from 'playwright-core';
import type { Browser } from 'webdriverio';

const DEFAULT_RETRY = 5;

export class MobileActionUtils extends BaseActionUtils<Browser> {
  protected driver: Browser;
  protected platform: Platform;
  private readonly poc: string = POCEnv.getType() ?? 'GLOBAL';

  // Android/iOS 공통처리
  // page - webview / driver - native
  constructor(driver: Browser, page?: Page | undefined) {
    // page는 WebView 연결 이후에만 세팅
    super();
    this.driver = driver;

    const platformName = driver.capabilities?.platformName?.toString().toLowerCase();
    if (platformName?.includes('android')) this.platform = 'ANDROID_APP';
    else if (platformName?.includes('ios')) this.platform = 'IOS_APP';
    else throw new Error(`Unsupported platform: ${platformName}`);
  }

  /**
   * Page 세팅
   */
  public setPage(page: Page): void {
    this.page = page;
  }

  /**
   * WebView 연결 후 ContextUtils에서 page 주입
   */
  public setPageFromContext(page: Page): void {
    if (!page) {
      throw new Error(
        `[MobileActionUtils] WebView Page가 전달되지 않았습니다. (POC: ${this.poc})`,
      );
    }
    this.setPage(page); // BaseActionUtils의 setPage 사용
  }

  /**
   * WebView가 연결됐는지 여부
   */
  public hasWebView(): boolean {
    return !!this.page;
  }

  /**
   * WebView page가 설정돼 있지 않으면 예외 발생
   */
  private getPageOrThrow(): Page {
    if (!this.page) {
      throw new Error(
        '[MobileActionUtils] WebView가 연결되지 않았습니다. page가 설정되지 않았습니다.',
      );
    }
    return this.page;
  }

  /**
   * WebView에서만 동작해야 하는 예시 메서드
   */
  public async clickInWebView(selector: string): Promise<void> {
    const page = this.getPageOrThrow();
    await page.locator(selector).click();
  }

  public async fillInWebView(selector: string, value: string): Promise<void> {
    const page = this.getPageOrThrow();
    await page.locator(selector).fill(value);
  }

  public async getTextInWebView(selector: string): Promise<string> {
    const page = this.getPageOrThrow();
    return await page.locator(selector).innerText();
  }

  /**
   * 현재 플랫폼이 Android인지 확인
   */
  public isAndroid(): boolean {
    return this.platform === 'ANDROID_APP';
  }

  /**
   * 현재 플랫폼이 iOS인지 확인
   */
  public isIOS(): boolean {
    return this.platform === 'IOS_APP';
  }

  /**
   * 현재 플랫폼 확인
   */
  public getMobileOsType(): 'android' | 'ios' {
    return this.platform === 'ANDROID_APP' ? 'android' : 'ios';
  }

  // ========== Playwright 전용 ==========
  /**
   * Playwright: 웹 요소 탭 (터치)
   */
  public async tapWebElement(selector: string): Promise<void> {
    await this.ensurePage().locator(selector).tap();
  }

  /**
   * Playwright: 웹 요소 텍스트 가져오기
   */
  public async getWebText(selector: string): Promise<string> {
    return (await this.ensurePage().locator(selector).innerText()) ?? '';
  }

  /**
   * Playwright: 웹 요소로 스크롤
   */
  public async scrollWebToElement(selector: string): Promise<void> {
    await this.ensurePage().locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Playwright: 모바일 뷰포트에서 키보드 입력
   */
  public async typeWebText(selector: string, text: string): Promise<void> {
    const locator = this.ensurePage().locator(selector);
    await locator?.fill('');
    await locator?.type(text);
  }

  /**
   * Playwright: 웹 요소가 보일 때까지 대기
   */
  public async waitForVisibleWeb(selector: string, timeout = 5000): Promise<void> {
    await this.ensurePage().locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Playwright: 웹 요소가 사라질 때까지 대기
   */
  public async waitForHiddenWeb(selector: string, timeout = 5000): Promise<void> {
    await this.ensurePage().locator(selector).waitFor({ state: 'hidden', timeout });
  }

  /**
   * Playwright: 웹 요소의 속성값 가져오기
   */
  public async getAttributeWeb(selector: string, attr: string): Promise<string | null> {
    return (await this.ensurePage().locator(selector).getAttribute(attr)) ?? null;
  }

  /**
   * Playwright: 웹 요소 존재 여부 확인
   */
  public async isElementPresentWeb(selector: string): Promise<boolean> {
    const count = await this.ensurePage().locator(selector).count();
    return (count ?? 0) > 0;
  }

  /**
   * Playwright: 웹 요소를 JS로 강제 클릭
   */
  public async forceClickWeb(selector: string): Promise<void> {
    await this.ensurePage().evaluate(sel => {
      const el = document.querySelector(sel) as HTMLElement;
      if (el) el.click();
    }, selector);
  }

  /**
   * Playwright: 뷰포트 스크롤 (Y 오프셋 기준)
   */
  public async scrollWebByOffset(y: number): Promise<void> {
    await this.ensurePage().evaluate(offsetY => {
      window.scrollBy(0, offsetY);
    }, y);
  }

  // ========== Appium 전용 ==========

  /**
   * Appium: 요소 찾기
   */
  public async findAppiumElement(selector: string) {
    try {
      const el = await this.driver?.$(selector);
      if (!el) {
        console.warn(`[findAppiumElement] 요소가 null입니다: ${selector}`);
      }
      return el;
    } catch (e) {
      console.error(`[findAppiumElement] 요소 탐색 중 오류 발생: ${selector}`, e);
      return undefined;
    }
  }

  /**
   * Appium: 요소 재정의 (StaleElement 대응)
   */
  public async redefineElement(original: any) {
    try {
      if (!original) return undefined;
      const tag = await original.getTagName();
      const id = await original.getAttribute('id');
      const candidates: string[] = [];
      if (id) candidates.push(`${tag}#${id}`);
      for (const selector of candidates) {
        const found = await this.driver?.$$(selector);
        if (Array.isArray(found) && found.length === 1) return found[0];
      }
      return await this.driver?.execute('return arguments[0];', original);
    } catch {
      return undefined;
    }
  }

  /**
   * Appium: 탭
   */
  public async tap(x: number, y: number): Promise<void> {
    await this.driver?.touchAction({ action: 'tap', x, y });
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
    const x = windowSize ? windowSize.width / 2 : ActionConstants.touchTapX;

    // 플랫폼에 따라 startY 계산
    let startY: number;
    switch (this.platform) {
      case 'ANDROID_APP':
        startY = windowSize ? windowSize.height / 2 : ActionConstants.touchStartY.android;
        break;
      case 'IOS_APP':
        startY = windowSize ? windowSize.height / 2 : ActionConstants.touchStartY.ios;
        break;
      default:
        throw new Error(`Unsupported platform for scrollByOffset: ${this.platform}`);
    }

    const endY = startY - yOffset;

    await this.driver?.touchAction([
      { action: 'press', x, y: startY },
      { action: 'wait', ms: ActionConstants.swipeWaitMs },
      { action: 'moveTo', x, y: endY },
      'release',
    ]);
  }

  /**
   * Appium: 주어진 컨텍스트 이름을 기준으로 여러 번 재시도 후 컨텍스트 전환
   */
  public async switchToContextSafe(contextName: string, retry = DEFAULT_RETRY): Promise<void> {
    for (let i = 0; i < retry; i++) {
      const contexts = await this.driver?.getContexts();
      const found = contexts?.find(ctx => ctx === contextName);
      if (found) {
        await this.driver?.switchContext(found);
        return;
      }
      await this.driver?.pause(1000);
    }
    throw new Error(`Context '${contextName}' not found after ${retry} retries.`);
  }

  /**
   * Appium: 기본 WebView 컨텍스트 반환
   */
  public async getDefaultWebView(): Promise<string | null> {
    const contexts = (await this.driver?.getContexts()) as string[];
    return contexts?.find(ctx => ctx.includes('WEBVIEW')) ?? null;
  }

  /**
   * Appium: WebView Context로 전환
   */
  public async switchToWebviewContext(): Promise<void> {
    const webview = await this.getDefaultWebView();
    if (webview) await this.switchToContextSafe(webview);
  }

  /**
   * Appium: Native Context로 전환
   */
  public async switchToNativeContext(): Promise<void> {
    await this.switchToContextSafe('NATIVE_APP');
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
   *  Appium: 요소 클릭
   */
  public async click(selector: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    if (!element) {
      throw new Error(`[click] 요소를 찾을 수 없습니다: ${selector}`);
    }
    await element.click();
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
   *  Appium: 요소 더블 클릭 (딜레이 후 두 번 클릭)
   */
  public async doubleClickAppium(selector: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.click();
    await this.driver?.pause(100);
    await element?.click();
  }

  /**
   * Appium: 요소 클릭 후 페이지 변경 대기
   */
  public async clickUntilPageChange(element: WebdriverIO.Element): Promise<void> {
    const oldUrl = await this.driver.getUrl();
    await element.click();
    await this.driver.pause(1000);
    const newUrl = await this.driver.getUrl();

    if (newUrl !== oldUrl) return;
    throw new Error('Page did not change after clicking element.');
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
   * Appium: 상태바 높이 가져오기
   */
  public async getStatusBarHeight(): Promise<number | undefined> {
    try {
      if (this.isIOS()) {
        await this.switchToNativeContext();
        const statusBar = await this.driver?.$('**/XCUIElementTypeStatusBar');
        const heightAttr = await statusBar?.getAttribute('height');
        const height = parseInt(heightAttr ?? '0');
        await this.switchToWebviewContext();
        return height;
      } else if (this.isAndroid()) {
        const windowSize = await this.driver?.getWindowSize();
        const screenHeight = await this.driver?.execute(() => screen.height);
        if (windowSize && screenHeight) {
          const height = Math.abs(screenHeight - windowSize.height);
          return height > 0 ? height : undefined;
        }
      }
    } catch (e) {
      console.warn('getStatusBarHeight() error:', e);
    }
    return undefined;
  }

  /**
   * Appium: 요소가 사라질 때 클릭 시도
   */
  public async clickUntilVisible(
    selector: string,
    retryCount = ActionConstants.maxScrollAttempts,
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

  // 아마 필요 없을 듯...
  public async clickUntilInvisible(selector: string): Promise<void> {
    const el = await this.findAppiumElement(selector);
    if (!el || !(await el.isDisplayed())) return;

    await el.click();
    await this.driver?.pause(1000);

    const isVisible = await el.isDisplayed().catch(() => false);
    if (isVisible) {
      console.warn(`Element still visible after click: ${selector}`);
    }
  }

  /**
   * Appium: 스크롤 후 요소 찾기
   */
  public async scrollAndFind(selector: string, maxScroll = 5) {
    for (let i = 0; i < maxScroll; i++) {
      const el = await this.findAppiumElement(selector);
      if (el && (await el.isDisplayed())) return el;
      await this.swipeUp();
    }
    return undefined;
  }

  /**
   * Appium: 요소 위치로 스크롤 이동
   */
  public async scrollToVisibleElement(selector: string): Promise<void> {
    try {
      for (let i = 0; i < 5; i++) {
        const el = await this.findAppiumElement(selector);
        if (el && (await el.isDisplayed())) return;
        await this.driver?.execute('mobile: swipe', { direction: 'down' });
      }
    } catch (e) {
      console.warn('scrollToVisibleElement() error:', e);
    }
  }

  /**
   * Appium: 요소까지 슬라이드
   */
  public async slideToElement(el: any): Promise<void> {
    const location = await el.getLocation();
    const x = location.x;
    const y = location.y;

    const width = await this.driver.execute(() => window.innerWidth);
    const startX = x + width * 0.1;
    const endX = x - width * 0.15;

    if (this.platform === 'ANDROID_APP') {
      await this.driver.touchAction([
        { action: 'press', x: startX, y },
        { action: 'wait', ms: 100 },
        { action: 'moveTo', x: endX, y },
        { action: 'release' },
      ]);
    } else if (this.platform === 'IOS_APP') {
      await this.driver.performActions([
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: startX, y },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 100 },
            { type: 'pointerMove', duration: 500, x: endX, y },
            { type: 'pointerUp', button: 0 },
          ],
        },
      ]);
      await this.driver.releaseActions();
    }
  }

  /**
   *  Appium: 권한 허용 팝업 처리
   */
  public async handlePermissions(commonEl: Record<string, string>): Promise<void> {
    const { driver } = this;
    const clickSequence = [
      '다음버튼',
      '앱_사용중에만_허용',
      '허용_버튼',
      '허용_버튼',
      '허용_버튼',
      '모두허용_버튼',
      '동의_버튼',
      '로그인하지_않고_입장할게요',
      '로그인없이_입장하기',
    ];

    for (const key of clickSequence) {
      const resourceId = commonEl[key];
      if (!resourceId) continue;
      try {
        const target = await driver?.$(`id=${resourceId}`);
        if (target && (await target.isDisplayed())) await target.click();
      } catch {}
    }
  }

  /**
   * Appium: 앱 실행 후 초기 설정 및 홈 이동 처리
   */
  public async initAppSession(commonEl: Record<string, string>, baseUrl: string): Promise<void> {
    await this.driver?.pause(1500);

    const contexts = await this.driver?.getContexts();
    if (contexts && contexts.length > 1) {
      await this.driver?.switchContext(contexts[1]);
    }
    await this.handlePermissions(commonEl);
    await this.navigateToUrl('/', baseUrl);
  }

  /**
   *  Appium: URL 이동
   */
  public async navigateToUrl(url: string, baseUrl: string): Promise<void> {
    const goto = url.startsWith('https')
      ? url
      : url.startsWith('/')
        ? `${baseUrl}${url}`
        : `${baseUrl}/${url}`;
    await this.driver?.url(goto);
    await this.driver?.pause(1000);
  }

  /**
   * Appium: 키 입력
   */
  public async pressKeyAppium(key: string): Promise<void> {
    await this.driver?.keys(key);
  }

  /**
   * Appium: 드롭다운 옵션 선택
   */
  public async selectAppiumOption(selector: string, text: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.selectByVisibleText(text);
  }

  /**
   * Appium: 초기 앱 실행 전 사전 준비 스크립트
   */
  public async preScript(): Promise<void> {
    try {
      const windowSize = await this.driver?.getWindowSize();
      const windowRect = await this.driver?.getWindowRect?.();
      const contexts = await this.driver?.getContexts();

      console.log('get_window_size =>', windowSize);
      console.log('get_window_rect =>', windowRect);
      console.log('contexts =>', contexts);

      await this.driver?.pause(1500);

      console.log('----------------------------------------------------');
      console.log('APP 로그인 페이지 진입');
      console.log('현재 컨텍스트 =>', await this.driver?.getContext());

      if (contexts && contexts.length > 1) {
        await this.driver?.switchContext(contexts[1]);
        console.log('전환된 컨텍스트 =>', await this.driver?.getContext());
      }
      console.log('----------------------------------------------------');

      if (typeof (this as any).gotoHome === 'function') {
        await (this as any).gotoHome();
      }
    } catch (e) {
      console.warn('preScript() error:', e);
    }
  }

  // 이것도 필요 없을 듯 나중에 정리
  public async scrollElementToCenter(selector: string): Promise<void> {
    try {
      const el = await this.findAppiumElement(selector);
      if (!el) return;
      await this.driver?.execute('arguments[0].scrollIntoViewIfNeeded()', el);
    } catch (e) {
      console.warn('scrollElementToCenter() error:', e);
    }
  }

  /**
   * Appium: 전체 페이지 스크롤 (상 → 하 → 상)
   */
  public async scrollFullPage(): Promise<void> {
    try {
      console.log('scrollFullPage()');
      await this.driver?.execute('mobile: swipe', { direction: 'up', velocity: 10000 });
      await this.driver?.execute('mobile: swipe', { direction: 'down', velocity: 10000 });
    } catch (e) {
      console.warn('scrollFullPage() error:', e);
    }
  }

  /**
   * Appium: 좌표 기반 스와이프 실행
   */
  public async swipeWithVelocity(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    startPress = 0.1,
    endPress = 0.1,
    speed = 445,
  ): Promise<void> {
    try {
      const data = {
        fromX,
        fromY,
        toX,
        toY,
        pressDuration: startPress,
        holdDuration: endPress,
        velocity: speed,
      };
      await this.driver?.execute('mobile: dragFromToWithVelocity', data);
    } catch (e) {
      console.warn('swipeWithVelocity() error:', e);
    }
  }

  /**
   * Appium: Native 요소 재정의
   */
  public async redefineElementByAttributes(original: any): Promise<any | undefined> {
    try {
      if (!original) throw new Error('Element is undefined');

      const tagName = await original.getTagName();
      const id = await original.getAttribute('id');
      const title = await original.getAttribute('title');
      const role = await original.getAttribute('role');
      const className = await original.getAttribute('class');

      const attributeSelectors = [
        { attr: 'id', value: id },
        { attr: 'title', value: title },
        { attr: 'role', value: role },
      ];

      const candidates: string[] = attributeSelectors
        .filter(({ value }) => value)
        .map(({ attr, value }) => `${tagName}[${attr}="${value}"]`);

      if (id) candidates.unshift(`${tagName}#${id}`);
      if (className) candidates.push(`${tagName}.${className.trim().replace(/\s+/g, '.')}`);

      for (const selector of candidates) {
        const found = await this.driver?.$$(selector);
        if (Array.isArray(found) && found.length === 1) return found[0];
      }

      return await this.driver?.execute('return arguments[0];', original);
    } catch (e) {
      console.warn('redefineElementByAttributes error:', e);
      return undefined;
    }
  }

  /**
   * Appium: Native 요소 로딩 Chain
   */
  public async waitForNativeElement(
    selector: string,
    strategy: 'id' | 'ios_chain',
    maxRetry: number = DEFAULT_RETRY,
  ): Promise<any | undefined> {
    const locatorPrefix = strategy === 'id' ? 'id=' : '-ios class chain:';
    const locator = `${locatorPrefix}${selector}`;

    let attempt = 0;
    while (attempt < maxRetry) {
      try {
        const el = await this.driver?.$(locator);
        if (el && (await el.isDisplayed())) return el;
      } catch (error) {
        console.error('Error while waiting for native element:', error);
      }
      await this.driver?.pause(1000);
      attempt++;
    }

    return undefined;
  }

  /**
   * Appium: Native 드래그 동작
   */
  public async dragAndDropX(el: any, offsetX: number = -200): Promise<void> {
    await this.driver?.touchAction([
      { action: 'press', element: el },
      { action: 'wait', ms: 200 },
      { action: 'moveTo', x: offsetX, y: 0 },
      'release',
    ]);
  }

  /**
   * Appium: 모달이 있으면 닫기
   */
  public async closeModalIfPresent(selector: string): Promise<void> {
    const modal = await this.findAppiumElement(selector);
    if (modal && (await modal.isDisplayed())) {
      await modal.click();
    }
  }

  /**
   * Appium: 요소 중심을 터치 (WebView 요소)
   */
  public async tapWebviewElementByCenter(selector: string): Promise<void> {
    const el = await this.findAppiumElement(selector);
    if (!el) return;

    const elementId = await el.elementId;
    const rect = await this.driver.getElementRect(elementId);

    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;

    await this.tap(x, y);
  }

  /**
   * Appium: 요소로 스크롤 이동 (native 방식)
   */
  public async scrollToAppium(selector: string): Promise<void> {
    const el = await this.findAppiumElement(selector);
    if (el) {
      await this.driver?.execute('mobile: scroll', { element: el.elementId, toVisible: true });
    }
  }

  /**
   * Appium: select 드롭다운 옵션 선택 (WebView일 수도 있음)
   */
  public async selectOption(selector: string, text: string): Promise<void> {
    const el = await this.findAppiumElement(selector);
    await el?.selectByVisibleText(text);
  }

  /**
   * Appium: 컨텍스트 전환
   */
  public async switchView(context: string = 'default', maxRetry = DEFAULT_RETRY): Promise<void> {
    let targetContext = context;
    if (context === 'default') {
      targetContext = (await this.getDefaultWebView()) ?? 'NATIVE_APP';
    }
    await this.switchToContextSafe(targetContext, maxRetry);
  }

  /**
   *  Appium: Chrome 초기화
   */
  public clearChromeData(version: string = 'stable'): void {
    const packageName = version === 'beta' ? 'com.chrome.beta' : 'com.android.chrome';
    const udid = (this.driver?.capabilities as any).udid;
    if (!udid) throw new Error('UDID not found in driver capabilities.');

    const cmd = `adb -s ${udid} shell pm clear ${packageName}`;
    try {
      const result = execSync(cmd, { encoding: 'utf-8' });
      if (!result.includes('Success')) throw new Error(`Chrome clear failed: ${result}`);
    } catch (e) {
      throw new Error(`clearChromeData failed: ${(e as Error).message}`);
    }
  }

  /**
   * Appium: 컨텍스트 전환
   */
  public async switchToContext(contextName: string): Promise<void> {
    const contexts = (await this.driver?.getContexts()) as string[];
    if (contexts?.includes(contextName)) {
      await this.driver?.switchContext(contextName);
      return;
    }
    await this.driver?.pause(500);
  }

  /**
   * Appium: Native 요소 스크롤 후 재정의
   */
  public async scrollToElementAndRedefine(
    selector: string,
  ): Promise<WebdriverIO.Element | undefined> {
    try {
      const chainableElement = this.driver?.$(selector);
      if (!chainableElement) return undefined;

      const element = (await chainableElement) as unknown as WebdriverIO.Element;

      await this.driver?.execute('arguments[0].scrollIntoView(true);', element);
      return await this.redefineElement(element);
    } catch {
      return undefined;
    }
  }

  /**
   * Appium: 임의 위치 스와이프
   */
  public async swipe(fromX: number, fromY: number, toX: number, toY: number): Promise<void> {
    await this.driver?.touchAction([
      { action: 'press', x: fromX, y: fromY },
      { action: 'wait', ms: 300 },
      { action: 'moveTo', x: toX, y: toY },
      'release',
    ]);
  }

  /**
   *  Appium: 입력값 가져오기
   */
  public async getValue(selector: string): Promise<string | undefined> {
    const element = await this.findAppiumElement(selector);
    return await element?.getValue();
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
   * Appium: 위/아래로 지정 횟수 스크롤
   */
  public async scrollByDirection(direction: 'up' | 'down', count = 3): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.driver?.execute('mobile: swipe', { direction });
      await this.driver?.pause(500);
    }
  }
}
