import { ElementActions } from '@common/actions/ElementActions';
import { authLocator } from '@common/locators/authLocator';
import { urlLocator } from '@common/locators/urlLocator';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  // 홈페이지로 이동
  async gotoHomePage() {
    await this.page.goto(urlLocator.main.PC);
    await this.page.waitForLoadState('networkidle');
  }

  // 로그인 페이지 클릭
  async gotoLoginPage() {
    await this.page.goto(urlLocator.login_.PC);
    await this.page.waitForLoadState('networkidle');
  }

  async doLogin(id: string, pw: string): Promise<boolean> {
    try {
      await this.gotoLoginPage();

      const action = new ElementActions({ page: this.page });

      await action.setSelector(authLocator.login_btn.PC).click();
      await action.setSelector(authLocator.uplus_clear_btn).click();
      await action.setSelector(authLocator.uplus_id_input).fill(id);

      // tooltip 이 떠 있는 경우 닫기 시도
      for (let i = 0; i < 3; i++) {
        const tooltip = this.page.locator('.c-tooltip');
        if ((await tooltip.count()) === 0) break;
        await action.setSelector('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button').click();
      }

      await action.setSelector(authLocator.uplus_pw_input).fill(pw);
      await action.setSelector(authLocator.uplus_login_btn).click();

      await this.page.waitForLoadState('networkidle');
      await expect(this.page.locator('div#KV')).toBeVisible();

      return true;
    } catch (err) {
      console.error('[Login Failed]', err);
      return false;
    }
  }

  async retryLogin(id: string, pw: string, maxRetry = 3): Promise<boolean> {
    for (let i = 0; i < maxRetry; i++) {
      const success = await this.doLogin(id, pw);
      if (success) return true;
      console.warn(`Retry Login ${i + 1} / ${maxRetry}`);
    }
    return false;
  }

  async logout(): Promise<boolean> {
    try {
      await this.gotoHomePage();

      const action = new ElementActions({ page: this.page });
      await action.setSelector(authLocator.logout_btn).click();

      await this.page.waitForLoadState('networkidle');
      await expect(this.page.locator(authLocator.login_btn.PC)).toHaveText(/로그인/);

      return true;
    } catch (err) {
      console.error('[Logout Failed]', err);
      return false;
    }
  }
}
