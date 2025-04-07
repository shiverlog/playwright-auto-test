import { AuthPage } from '@e2e/aos/src/pages/AuthPage.js';
import type { Page } from '@playwright/test';
import type { Browser } from 'webdriverio';

export class AuthSteps {
  private authPage: AuthPage;

  constructor(page: Page, driver: Browser) {
    this.authPage = new AuthPage(page, driver);
  }
  // 로그인
  async loginWithValidCredentials(id: string, pw: string): Promise<void> {
    const success = await this.authPage.doUplusLogin(id, pw);
    if (!success) throw new Error('로그인 실패');
  }
}
