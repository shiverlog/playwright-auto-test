import type { JsForceActions } from '@common/actions/JsForceActions.js';
import { WebActionUtils } from '@common/actions/WebActionUtils.js';
import { BaseModal } from '@common/components/BaseModal.js';
import { authLocator } from '@common/locators/authLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class AuthPage extends WebActionUtils {
  declare protected page: Page;
  declare protected js: JsForceActions;
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
    await this.page.waitForLoadState('networkidle');
    await this.modal.checkCommonModals();
  }

  // 로그인 페이지로 이동
  async gotoLoginPage() {
    await this.js.forceClick(authLocator.myInfoIcon[this.uiType]);
    await this.js.forceClick(authLocator.mainLoginButton[this.uiType]);
    await this.page.waitForLoadState('networkidle');
  }

  // 로그아웃 페이지로 이동
  async gotoLogoutPage() {
    await this.page.click(authLocator.myInfoIcon[this.uiType]);
    await this.js.forceClick(authLocator.main_logout_btn);
    await this.page.waitForLoadState('networkidle');
  }

  // 로그인 시나리오 실행
  async doUplusLogin(id: string, pw: string): Promise<boolean> {
    try {
      await this.gotoHomePage();
      await this.gotoLoginPage();
      await this.js.forceClick(authLocator.uplusLoginButton);
      await this.page.waitForLoadState('networkidle');
      await this.js.forceClick(authLocator.uplusClearButton);
      await this.js.forceType(authLocator.uplusIdInput, id);

      for (let i = 0; i < 3; i++) {
        const tooltip = this.page.locator('.c-tooltip');
        if ((await tooltip.count()) === 0) break;
        await this.page.click('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button');
      }

      await this.js.forceType(authLocator.uplusPwInput, pw);
      await this.js.forceClick(authLocator.uplusLoginSubmitButton);
      await this.page.waitForLoadState('networkidle');

      return true;
    } catch (err) {
      console.error('[Login Failed]', err);
      return false;
    }
  }

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
