import { WebActionUtils } from '@common/actions/WebActionUtils.js';
import { BaseModal } from '@common/components/BaseModal.js';
import { authLocator } from '@common/locators/authLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class AuthPage extends WebActionUtils {
  protected modal: BaseModal;
  protected platform: Platform;
  protected uiType: UIType;

  constructor(page: Page) {
    super(page);
    this.modal = new BaseModal(page, undefined);
    this.platform = 'PC_WEB';
    this.uiType = 'PC';
  }

  // 홈페이지 이동
  async gotoHomePage() {
    await this.page.goto(urlLocator.main[this.platform]);
    await this.modal.checkCommonModals();
  }

  // 로그인 페이지로 이동
  async gotoLoginPage() {
    await this.js.forceFocus(authLocator.myInfoIcon[this.uiType]);
    await this.click(authLocator.mainLoginButton[this.uiType]);
    await this.page.waitForSelector(authLocator.loginTitle[this.uiType], {
      timeout: 5000,
    });
  }

  // 로그아웃 페이지로 이동
  async gotoLogoutPage() {
    await this.click(authLocator.myInfoIcon[this.uiType]);
    await this.js.forceFocus(authLocator.main_logout_btn);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * LG U+ 로그인 시나리오 실행
   */
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

  // async doUplusLoginWithRetry(id: string, pw: string, maxRetry = 3): Promise<boolean> {
  //   for (let attempt = 1; attempt <= maxRetry; attempt++) {
  //     console.log(`[Login Attempt] ${attempt}회차 로그인 시도`);
  //     const success = await this.doUplusLogin(id, pw);

  //     if (success) {
  //       console.log(`[Login Success] ${attempt}회차에 로그인 성공`);
  //       return true;
  //     }

  //     // 실패한 경우
  //     console.warn(`[Login Failed] ${attempt}회차 로그인 실패`);
  //     if (attempt < maxRetry) {
  //       const waitTime = 1000 + Math.floor(Math.random() * 2000); // 1~3초 랜덤 대기
  //       console.log(`[Retry Wait] ${waitTime}ms 후 재시도`);
  //       await this.doUplusLogin(id, pw);
  //       await this.page.waitForTimeout(waitTime);
  //     }
  //   }

  //   console.error(`[Login Error] ${maxRetry}회 로그인 모두 실패`);
  //   return false;
  // }

  // 로그아웃 시나리오 실행 (선택적으로 사용)
  // async logout(): Promise<boolean> {
  //   try {
  //     await this.gotoHomePage();
  //     await this.gotoLogoutPage();
  //     await this.page.goto(urlLocator.main[this.platform]);
  //     await this.click(authLocator.logout_btn);
  //     await this.page.waitForLoadState('networkidle');
  //     await expect(this.page.locator(authLocator.login_btn[this.uiType])).toHaveText(/로그인/);
  //     return true;
  //   } catch (err) {
  //     console.error('[Logout Failed]', err);
  //     return false;
  //   }
  // }
}
