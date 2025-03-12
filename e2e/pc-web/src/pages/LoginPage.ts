import { expect, test } from '@playwright/test';
import { Login } from '../components/Login';


test.describe('로그인 페이지 테스트', () => {
  test('올바른 계정으로 로그인', async ({ page }) => {
    const login = new Login(page);
    await login.gotoLoginPage();

    const success = await login.doLogin('test@example.com', 'password123');
    expect(success).toBe(true);
  });

  test('잘못된 계정으로 로그인 실패', async ({ page }) => {
    const login = new Login(page);
    await login.gotoLoginPage();

    const success = await login.doLogin('wrong@example.com', 'wrongpassword');
    expect(success).toBe(false);
  });

  test('로그아웃 테스트', async ({ page }) => {
    const login = new Login(page);
    await login.gotoLoginPage();

    const success = await login.doLogin('test@example.com', 'password123');
    expect(success).toBe(true);

    await login.logout();
    expect(await page.url()).toBe('http://localhost:3000/login');
  });
});
