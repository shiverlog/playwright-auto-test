import { expect, test } from '@common/fixtures/BaseAppFixture.js';
import { AuthSteps } from '@e2e/aos/src/steps/AuthSteps.js';

test.describe('인증 테스트', () => {
  test('로그인 & 로그아웃 시나리오', async ({ page, appDriver }) => {
    const auth = new AuthSteps(page, appDriver);
    const id = process.env.UPLUS_ID!;
    const pw = process.env.UPLUS_PW!;

    await auth.loginWithValidCredentials(id, pw);
  });
});
