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

  async gotoLoginPage() {
    await this.page.goto(urlLocator.login_.PC);
    await this.page.waitForLoadState('networkidle');
  }

  async gotoHomePage() {
    await this.page.goto(urlLocator.main.PC);
    await this.page.waitForLoadState('networkidle');
  }

  async doLogin(id: string, pw: string): Promise<boolean> {
    try {
      await this.gotoLoginPage();
      await new ElementActions({ page: this.page }).setSelector(authLocator.login_btn.PC).click();

      await new ElementActions({ page: this.page })
        .setSelector(authLocator.uplus_clear_btn)
        .click();

      await new ElementActions({ page: this.page })
        .setSelector(authLocator.uplus_id_input)
        .fill(id);

      await new ElementActions({ page: this.page })
        .setSelector(authLocator.uplus_pw_input)
        .fill(pw);

      await new ElementActions({ page: this.page })
        .setSelector(authLocator.uplus_login_btn)
        .click();

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
      if (await this.doLogin(id, pw)) return true;
      console.warn(`Retry Login ${i + 1} / ${maxRetry}`);
    }
    return false;
  }

  async logout(): Promise<boolean> {
    try {
      await this.gotoHomePage();
      await new ElementActions({ page: this.page }).setSelector(authLocator.logout_btn).click();

      await this.page.waitForLoadState('networkidle');
      await expect(this.page.locator(authLocator.login_btn.PC)).toHaveText(/로그인/);
      return true;
    } catch (err) {
      console.error('[Logout Failed]', err);
      return false;
    }
  }
}
