import { authLocator } from '@common/locators/authLocator';
import { LoginPage } from '@e2e/pc/src/pages/LoginPage';
import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

let login: LoginPage;

const VALID_ID = process.env.UPLUS_ID!;
const VALID_PW = process.env.UPLUS_PW!;
const INVALID_ID = 'wrong@example.com';
const INVALID_PW = 'wrongpassword';

test.describe('로그인 기능', () => {
  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
  });

  test('올바른 계정으로 로그인', async ({ page }) => {
    await test.step('ID/PW 입력 및 로그인 시도', async () => {
      const success = await login.retryLogin(VALID_ID, VALID_PW);
      expect(success).toBe(true);
    });

    await test.step('로그인 성공 후 KV 영역 확인', async () => {
      await expect(page.locator('div#KV')).toBeVisible();
    });
  });

  test('잘못된 계정으로 로그인 실패', async () => {
    const success = await login.retryLogin(INVALID_ID, INVALID_PW);
    expect(success).toBe(false);
  });

  test('로그아웃 시 로그인 버튼 확인', async ({ page }) => {
    const loggedIn = await login.retryLogin(VALID_ID, VALID_PW);
    expect(loggedIn).toBe(true);

    const loggedOut = await login.logout();
    expect(loggedOut).toBe(true);

    await expect(page.locator(authLocator.login_btn.PC)).toHaveText(/로그인/);
  });
});
