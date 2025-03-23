import { authLocator } from '@common/locators/authLocator';
import { LoginPage } from '@e2e/pc/src/pages/LoginPage';
import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

let login: LoginPage;

// .env 기반 테스트 계정 정보
const VALID_ID = process.env.UPLUS_ID!;
const VALID_PW = process.env.UPLUS_PW!;
const INVALID_ID = 'wrong@example.com';
const INVALID_PW = 'wrongpassword';

// 로그인 시나리오 테스트

test.describe('로그인 기능', () => {
  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.gotoLoginPage();
  });

  test('올바른 계정으로 로그인', async ({ page }) => {
    await test.step('사용자가 로그인 페이지에서 ID/PW 입력', async () => {
      const success = await login.doLogin(VALID_ID, VALID_PW);
      expect(success).toBe(true);
    });

    await test.step('로그인 성공 후 메인 KV 영역 확인', async () => {
      await expect(page.locator('div#KV')).toBeVisible();
    });
  });

  test('잘못된 계정으로 로그인 실패', async () => {
    await test.step('오류 계정으로 로그인 시도', async () => {
      const success = await login.doLogin(INVALID_ID, INVALID_PW);
      expect(success).toBe(false);
    });
  });

  test('로그아웃', async ({ page }) => {
    await test.step('로그인 후 로그아웃 시도', async () => {
      const loggedIn = await login.doLogin(VALID_ID, VALID_PW);
      expect(loggedIn).toBe(true);

      const loggedOut = await login.logout();
      expect(loggedOut).toBe(true);
    });

    await test.step('로그아웃 후 로그인 버튼 존재 확인', async () => {
      await expect(page.locator(authLocator.login_btn.PC)).toHaveText(/로그인/);
    });
  });
});
