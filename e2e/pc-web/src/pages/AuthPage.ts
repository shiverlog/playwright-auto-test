import { WebActionUtils } from '@common/actions/WebActionUtils';
import { authLocator } from '@common/locators/authLocator';
import { urlLocator } from '@common/locators/urlLocator';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class AuthPage extends WebActionUtils {
  constructor(page: Page) {
    super(page);
  }

  // 홈페이지 이동
  async gotoHomePage() {
    await this.page.goto(urlLocator.main.PC);
    await this.page.waitForLoadState('networkidle');
  }

  // 로그인 페이지로 이동
  async gotoLoginPage() {
    // GNB 유저 아이콘 클릭
    await this.click(authLocator.myinfo_icon.PC);
    // 메인 로그인 버튼 클릭
    await this.click(authLocator.main_login_btn.PC);
    await this.page.waitForLoadState('networkidle');
  }

  // 로그인 시나리오 실행
  async doUplusLogin(id: string, pw: string): Promise<boolean> {
    try {
      // 홈페이지 이동
      await this.gotoHomePage();
      // 로그인 페이지로 이동
      await this.gotoLoginPage();
      // U+ 로그인 버튼 클릭
      await this.click(authLocator.uplus_login_btn);
      await this.page.waitForLoadState('networkidle');
      // U+ ID 입력 전 초기화 버튼 클릭
      await this.click(authLocator.uplus_clear_btn);
      // U+ ID 입력
      await this.typeText(authLocator.uplus_id_input, id);
      // 툴팁 닫기
      for (let i = 0; i < 3; i++) {
        const tooltip = this.page.locator('.c-tooltip');
        if ((await tooltip.count()) === 0) break;
        await this.click('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button');
      }
      // U+ PW 입력
      await this.typeText(authLocator.uplus_pw_input, pw);
      // 로그인 전송 버튼 클릭
      await this.click(authLocator.uplus_login_btn);
      await this.page.waitForLoadState('networkidle');
      await expect(this.page.locator('div#KV')).toBeVisible();

      return true;
    } catch (err) {
      console.error('[Login Failed]', err);
      return false;
    }
  }

  // 로그아웃 시나리오 실행
  async logout(): Promise<boolean> {
    try {
      await this.page.goto(urlLocator.main.PC);
      await this.click(authLocator.logout_btn);
      await this.page.waitForLoadState('networkidle');
      await expect(this.page.locator(authLocator.login_btn.PC)).toHaveText(/로그인/);
      return true;
    } catch (err) {
      console.error('[Logout Failed]', err);
      return false;
    }
  }
}
