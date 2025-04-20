import { expect, test } from '@playwright/test';
import { speedtestUrls } from '@speedtest/config/speedtestUrls';
import { RedirectSteps } from '@speedtest/src/steps/RedirectSteps';

// 리디렉션 후 특정 요소 확인용
const TARGET_SELECTOR = '#expected-element';

const carrierMap = {
  uplus: 'lg',
  kt: 'kt',
  skt: 'skt',
} as const;

test.describe('3사 로그인 및 속도 측정', () => {
  test('로그인 후 리디렉션 및 성능 측정', async ({ page }) => {
    const steps = new RedirectSteps(page);

    // 로그인 및 리디렉션 확인 (순서: U+ → KT → SKT)
    for (const carrier of ['uplus', 'kt', 'skt'] as const) {
      await steps.loginAndCheckRedirect(carrier);
    }

    // 전체 URL 목록 (속도측정용)
    const carrierUrls = [
      ...Object.values(speedtestUrls.lg),
      ...Object.values(speedtestUrls.kt),
      ...Object.values(speedtestUrls.skt),
    ];

    // URL 순차 방문 (리디렉션 유도)
    await steps.performRedirect(carrierUrls);

    // 특정 요소가 나타날 때까지 대기
    await steps.waitForRedirectElement(TARGET_SELECTOR);

    // 해당 요소가 실제로 존재하는지 확인
    const visible = await page.isVisible(TARGET_SELECTOR);
    expect(visible).toBe(true);

    // 각 URL에 대해 성능 측정
    await steps.measurePerformance(carrierUrls);
  });
});
