/**
 * Description : auth.spec.ts - 📌 TC01. LGUPlus 로그인 & 로그아웃 시나리오 테스트 실행 부분
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { test } from '@common/fixtures/BaseAppFixture.js';
import { AuthSteps } from '@e2e/aos/src/steps/AuthSteps.js';

test.describe('인증 테스트', () => {
  test('로그인 & 로그아웃 시나리오', async ({ appDriver }) => {
    const auth = new AuthSteps(appDriver);
    const id = process.env.UPLUS_ID!;
    const pw = process.env.UPLUS_PW!;
    await auth.loginWithValidCredentials(id, pw);
    // await auth.logout();
  });
});
