import { expect, test } from '@playwright/test';

import { Login } from '../components/login';

test.describe('로그인 기능', () => {
  let login: Login;

  test.beforeEach(async ({ page }) => {
    login = new Login(page);
    await login.gotoLoginPage();
  });

  test('올바른 계정으로 로그인', async ({ page }) => {
    await test.step('사용자가 로그인 페이지에서 이메일과 비밀번호 입력', async () => {
      const success = await login.doLogin('test@example.com', 'password123');
      expect(success).toBe(true);
    });

    await test.step('로그인이 성공하면 홈 페이지로 이동', async () => {
      expect(await page.url()).toBe('http://localhost:3000/home');
    });
  });

  test('잘못된 계정으로 로그인 실패', async ({ page }) => {
    await test.step('잘못된 이메일과 비밀번호를 입력', async () => {
      const success = await login.doLogin('wrong@example.com', 'wrongpassword');
      expect(success).toBe(false);
    });

    await test.step('로그인 실패 시 에러 메시지 표시', async () => {
      const errorMessage = await page.textContent('.error-message');
      expect(errorMessage).toContain('로그인 실패');
    });
  });

  test('로그아웃', async ({ page }) => {
    await test.step('사용자가 로그인한 후 로그아웃 버튼 클릭', async () => {
      const success = await login.doLogin('test@example.com', 'password123');
      expect(success).toBe(true);
      await login.logout();
    });

    await test.step('로그아웃 후 로그인 페이지로 이동', async () => {
      expect(await page.url()).toBe('http://localhost:3000/login');
    });
  });
});
