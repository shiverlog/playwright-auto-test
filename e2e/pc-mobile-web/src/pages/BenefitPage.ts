/**
 * Description : AuthPage.ts - 📌 TC01. LGUPlus 로그인 & 로그아웃 시나리오 정의
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { WebActions } from '@common/actions/WebActions.js';
import { BaseModal } from '@common/components/BaseModal.js';
import { authLocator } from '@common/locators/authLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class AuthPage extends WebActions {
  protected modal: BaseModal;
  protected platform: Platform;
  protected uiType: UIType;

  constructor(page: Page) {
    super(page);
    this.modal = new BaseModal(page, undefined);
    this.platform = 'MOBILE_WEB';
    this.uiType = 'MOBILE';
  }

  // 홈페이지 이동
  async gotoHomePage() {
    await this.ensurePage().goto(urlLocator.main[this.platform]);
    await this.modal.checkCommonModals();
  }

  // 로그인 페이지로 이동
  async gotoLoginPage() {
    await this.click(uiLocator.hamburger[this.uiType]);
    await this.click(authLocator.mainLoginButton[this.uiType]);
    await this.ensurePage().waitForSelector(authLocator.loginTitle[this.uiType], {
      timeout: 5000,
    });
  }

  // 로그아웃 페이지로 이동
  async gotoLogoutPage() {
    await this.click(authLocator.mainLoginButton[this.uiType]);
    await this.ensureJs().forceClick(authLocator.main_logout_btn);
    await this.ensurePage().waitForLoadState('networkidle');
  }

  // lguplus 로그인 시나리오 실행
  async doUplusLogin(id: string, pw: string): Promise<boolean> {
    try {
      await this.gotoHomePage();
      await this.gotoLoginPage();
      // uplus 로그인 버튼 클릭
      await this.click(authLocator.uplusLoginButton);
      // uplus 타이틀 대기
      await this.ensurePage().waitForSelector(authLocator.uplusLoginTitle[this.uiType], {
        timeout: 5000,
      });
      // uplus 로그인 아이디 클리어 버튼 클릭
      await this.ensureJs().forceClick(authLocator.uplusClearButton);
      // uplus 로그인 아이디 입력
      await this.typeTextSlowly(authLocator.uplusIdInput, id);
      // uplus 로그인 아이디 툴팁 처리
      if (await this.ensurePage().locator(authLocator.idTooltip).isVisible()) {
        // 툴팁이 보일 경우, uplus 로그인 저장 버튼 클릭
        await this.ensurePage().click(authLocator.uplusSaveButton);
      }
      // uplus 로그인 비밀번호 입력
      await this.typeTextSlowly(authLocator.uplusPwInput, pw);
      // 강제 대기 2초
      await this.ensurePage().waitForTimeout(2000);
      // uplus 로그인 submit 버튼 클릭
      //await this.humanLikeMoveAndClick(authLocator.uplusLoginSubmitButton);
      await this.click(authLocator.uplusLoginSubmitButton);
      try {
        await this.ensurePage().waitForURL(urlLocator.main[this.platform], { timeout: 10000 });
        await expect(this.ensurePage()).toHaveURL(urlLocator.main[this.platform]);
      } catch (urlError) {
        console.warn('[Login Error] URL 변경 감지 실패', urlError);
        return false;
      }
      await this.ensurePage().waitForTimeout(2000);
      return true;
    } catch (err) {
      console.error('[Login Failed]', err);
      return false;
    }
  }
}
