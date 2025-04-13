import { appFixture, expect, test } from '@common/fixtures/BaseAppFixture.js';
import { AuthSteps } from '@e2e/aos/src/steps/AuthSteps.js';

test('로그인 & 로그아웃 시나리오', async ({ appDriver, page }) => {
  console.log('[TEST] 로그인 시나리오 진입');

  const id = process.env.UPLUS_ID;
  const pw = process.env.UPLUS_PW;

  if (!id || !pw) {
    throw new Error('[TEST] 환경변수 UPLUS_ID 또는 UPLUS_PW가 설정되지 않았습니다.');
  }

  const poc = process.env.POC || 'aos';
  const port = appFixture.getPortForPOC(poc);
  if (!port) {
    throw new Error(`[TEST] '${poc}'에 대한 Appium 포트 정보를 찾을 수 없습니다.`);
  }

  const auth = new AuthSteps(page, appDriver, port);

  await appDriver.pause(1000); // 앱 초기 로딩 안정성 확보

  try {
    await auth.loginWithValidCredentials(id, pw);
    console.log('[TEST] 로그인 성공');
  } catch (err) {
    console.error('[TEST] 로그인 중 예외 발생:', err);
    throw err;
  }

  console.log('[TEST] 시나리오 완료');
});
