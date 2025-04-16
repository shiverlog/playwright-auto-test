/**
 * Description : AuthPage.ts - 📌 TC01. LGUPlus 로그인 & 로그아웃 시나리오 정의
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { AppActions } from '@common/actions/AppActions.js';
import { authLocator } from '@common/locators/authLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { ContextUtils } from '@common/utils/context/ContextUtils.js';
import type { Browser } from 'webdriverio';

export class AuthPage extends AppActions {
  protected platform: Platform;
  protected uiType: UIType;

  constructor(driver: Browser) {
    super(driver);
    this.platform = 'ANDROID_APP';
    this.uiType = 'APP';
  }

  /**
   * 앱 첫 화면에서 '로그인하지 않고 입장할게요' 클릭 + WebView 컨텍스트 전환
   */
  async gotoHomePage(): Promise<void> {
    try {
      await ContextUtils.switchToNativeContext(this.driver);
    } catch (e) {
      console.warn('[AuthPage] Native 컨텍스트 전환 실패', e);
    }

    await this.click(authLocator.guestButton[this.uiType]);
    await this.driver.pause(2000);

    try {
      await ContextUtils.forceSwitchToWebviewContext(this.driver);
    } catch (e) {
      console.error('[AuthPage] WebView 컨텍스트 전환 실패', e);
      throw e;
    }
  }

  /**
   * 로그인 버튼 → ID 로그인 페이지 진입 + WebView 컨텍스트 전환
   */
  async gotoLoginPage(): Promise<void> {
    await this.click(authLocator.mainLoginButton[this.uiType]);

    try {
      await ContextUtils.forceSwitchToWebviewContext(this.driver);
    } catch (e) {
      console.error('[AuthPage] WebView 컨텍스트 전환 실패', e);
      throw e;
    }
  }

  /**
   * LG U+ 로그인 시나리오
   */
  async doUplusLogin(id: string, pw: string): Promise<boolean> {
    try {
      await this.gotoHomePage();
      await this.gotoLoginPage();

      await this.click(authLocator.uplusLoginButton);
      await this.type(authLocator.uplusIdInput, id);
      await this.type(authLocator.uplusPwInput, pw);
      await this.driver.pause(1000);

      await this.click(authLocator.uplusLoginSubmitButton);
      await this.driver.pause(1000);

      const success = await this.driver.waitUntil(
        async () => {
          const currentUrl = await this.driver.getUrl();
          return currentUrl.includes(urlLocator.main[this.platform]);
        },
        { timeout: 10000, timeoutMsg: 'Expected URL to change after login' },
      );

      return success;
    } catch (err) {
      console.error('[AuthPage] 로그인 실패', err);
      return false;
    }
  }
}
