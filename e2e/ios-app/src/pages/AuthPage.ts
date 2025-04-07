import { MobileActionUtils } from '@common/actions/MobileActionUtils.js';
import { BaseModal } from '@common/components/BaseModal.js';
import { authLocator } from '@common/locators/authLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { Browser } from 'webdriverio';

export class AuthPage extends MobileActionUtils {
  protected modal: BaseModal;
  protected platform: Platform;
  protected uiType: UIType;

  constructor(page: Page, driver: Browser) {
    super(page, driver);
    this.modal = new BaseModal(page, undefined);
    this.platform = 'IOS_APP';
    this.uiType = 'APP';
  }

  // 홈페이지 이동
  async gotoHomePage() {
    await this.page.goto(urlLocator.main[this.platform]);
    await this.modal.checkCommonModals();
  }

  // 로그인 페이지로 이동
  async gotoLoginPage() {
    await this.click(uiLocator.hamburger[this.uiType]);
    await this.click(authLocator.mainLoginButton[this.uiType]);
    await this.page.waitForSelector(authLocator.loginTitle[this.uiType], {
      timeout: 5000,
    });
  }

  // 로그아웃 페이지로 이동
  async gotoLogoutPage() {
    await this.page.click(authLocator.mainLoginButton[this.uiType]);
    await this.js.forceClick(authLocator.main_logout_btn);
    await this.page.waitForLoadState('networkidle');
  }

  // lguplus 로그인 시나리오 실행
  async doUplusLogin(id: string, pw: string): Promise<boolean> {
    try {
      await this.gotoHomePage();
      await this.gotoLoginPage();
      // uplus 로그인 버튼 클릭
      await this.click(authLocator.uplusLoginButton);
      // uplus 타이틀 대기
      await this.page.waitForSelector(authLocator.uplusLoginTitle[this.uiType], {
        timeout: 5000,
      });
      // uplus 로그인 아이디 클리어 버튼 클릭
      await this.js.forceClick(authLocator.uplusClearButton);
      // uplus 로그인 아이디 입력
      await this.typeTextSlowly(authLocator.uplusIdInput, id);
      // uplus 로그인 아이디 툴팁 처리
      if (await this.page.locator(authLocator.idTooltip).isVisible()) {
        // 툴팁이 보일 경우, uplus 로그인 저장 버튼 클릭
        await this.page.click(authLocator.uplusSaveButton);
      }
      // uplus 로그인 비밀번호 입력
      await this.typeTextSlowly(authLocator.uplusPwInput, pw);
      // 강제 대기 2초
      await this.page.waitForTimeout(2000);
      // uplus 로그인 submit 버튼 클릭
      //await this.humanLikeMoveAndClick(authLocator.uplusLoginSubmitButton);
      await this.click(authLocator.uplusLoginSubmitButton);
      try {
        await this.page.waitForURL(urlLocator.main[this.platform], { timeout: 10000 });
        await expect(this.page).toHaveURL(urlLocator.main[this.platform]);
      } catch (urlError) {
        console.warn('[Login Error] URL 변경 감지 실패', urlError);
        return false;
      }
      await this.page.waitForTimeout(2000);
      return true;
    } catch (err) {
      console.error('[Login Failed]', err);
      return false;
    }
  }
}
