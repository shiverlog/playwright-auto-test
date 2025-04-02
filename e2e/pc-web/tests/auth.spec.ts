import { AuthSteps } from '@e2e/pc/src/steps/AuthStep.js';
import { test } from '@playwright/test';

test.describe('로그인 테스트', () => {
  test('로그인 & 로그아웃 시나리오', async ({ page }) => {
    const auth = new AuthSteps(page);

    await auth.loginWithValidCredentials('test-id', 'test-password');
    // await auth.logout();
  });
});
