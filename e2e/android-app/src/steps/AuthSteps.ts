import { AuthPage } from '@e2e/aos/src/pages/AuthPage.js';
import type { Page } from '@playwright/test';
import type { Browser } from 'webdriverio';

export class AuthSteps {
  private readonly authPage: AuthPage;

  constructor(page: Page | undefined, driver: Browser, port: number) {
    this.authPage = new AuthPage(page, driver, port);
  }

  /**
   * LG U+ 로그인
   */
  async loginWithValidCredentials(id: string, pw: string): Promise<void> {
    if (!id || !pw) {
      throw new Error(
        `[AuthSteps] 유효하지 않은 ID 또는 PW (id: ${id}, pw: ${pw ? '***' : 'empty'})`,
      );
    }

    const success = await this.authPage.doUplusLogin(id, pw);

    if (!success) {
      throw new Error('[AuthSteps] 로그인 실패 - URL 전환 확인 불가');
    }
  }
}
