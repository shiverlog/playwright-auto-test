/**
 * Description : AuthSteps.ts - 📌 TC01. LGUPlus 로그인 & 로그아웃 시나리오 스탭
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { AuthPage } from '@e2e/aos/src/pages/AuthPage.js';
import type { Browser } from 'webdriverio';

export class AuthSteps {
  private readonly authPage: AuthPage;

  constructor(driver: Browser) {
    this.authPage = new AuthPage(driver);
  }

  /**
   * LG U+ 로그인
   */
  async loginWithValidCredentials(id: string, pw: string): Promise<void> {
    const success = await this.authPage.doUplusLogin(id, pw);
    if (!success) {
      throw new Error('로그인 실패');
    }
  }
}
