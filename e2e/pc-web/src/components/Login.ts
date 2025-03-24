import type { Page } from '@playwright/test';

export class Login {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoLoginPage() {
    await this.page.goto('http://localhost:3000/login');
  }

  async doLogin(email: string, password: string): Promise<boolean> {
    await this.page.fill("input[type='email']", email);
    await this.page.fill("input[type='password']", password);
    await this.page.click("button[type='submit']");

    // 로그인 성공 여부 확인
    const success = await this.page
      .waitForURL('http://localhost:3000/home', { timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    return success;
  }

  async logout() {
    await this.page.click('#logout-btn');
    await this.page.waitForURL('http://localhost:3000/login');
  }
}
