import type { Page } from '@playwright/test';
import { AuthPage } from '@e2e/pc/src/pages/AuthPage';

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
  // 로그아웃
  async logout(): Promise<void> {
    const success = await this.authPage.logout();
    if (!success) throw new Error('로그아웃 실패');
  }
}