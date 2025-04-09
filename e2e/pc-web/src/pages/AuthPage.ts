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
    await this.ensurePage().goto(urlLocator.main[this.platform]);
    await this.modal.checkCommonModals();
  }

  // 로그인 페이지로 이동
  async gotoLoginPage() {
    await this.ensureJs().forceFocus(authLocator.myInfoIcon[this.uiType]);
    await this.click(authLocator.mainLoginButton[this.uiType]);
    await this.ensurePage().waitForSelector(authLocator.loginTitle[this.uiType], {
      timeout: 5000,
    });
  }

  // 로그아웃 페이지로 이동
  async gotoLogoutPage() {
    await this.click(authLocator.myInfoIcon[this.uiType]);
    await this.ensureJs().forceFocus(authLocator.main_logout_btn);
    await this.ensurePage().waitForLoadState('networkidle');
  }

  /**
   * LG U+ 로그인 시나리오 실행
   */
  async doUplusLogin(id: string, pw: string): Promise<boolean> {
    try {
      await this.gotoHomePage();
      await this.gotoLoginPage();
      await this.click(authLocator.uplusLoginButton);

      await this.ensurePage().waitForSelector(authLocator.uplusLoginTitle[this.uiType], {
        timeout: 5000,
      });

      await this.ensureJs().forceClick(authLocator.uplusClearButton);
      await this.typeTextSlowly(authLocator.uplusIdInput, id);

      if (await this.ensurePage().locator(authLocator.idTooltip).isVisible()) {
        await this.click(authLocator.uplusSaveButton);
      }

      await this.typeTextSlowly(authLocator.uplusPwInput, pw);
      await this.ensurePage().waitForTimeout(2000);
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
