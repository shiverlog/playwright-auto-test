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
