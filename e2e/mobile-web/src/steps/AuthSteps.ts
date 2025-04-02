import { AuthPage } from '@e2e/pc/src/pages/AuthPage';
import type { Page } from '@playwright/test';

export class AuthSteps {
  private authPage: AuthPage;

  constructor(page: Page) {
    this.authPage = new AuthPage(page);
  }
  // 로그인
  async loginWithValidCredentials(id: string, pw: string): Promise<void> {
    const success = await this.authPage.doUplusLogin(id, pw);
    if (!success) throw new Error('로그인 실패');
  }
}
