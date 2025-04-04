import { expect, test } from '@playwright/test';

import { speedtestUrls } from '../config/speedtestUrls';
import { RedirectPage } from '../src/pages/RedirectPage';
import { saveResults } from '../src/saveLogs';
import { RedirectSteps } from '../src/steps/RedirectSteps';

test('3사 속도측정', async ({ page }) => {
  const redirectPage = new RedirectPage(page);
  const redirectSteps = new RedirectSteps(redirectPage);

  // 각 통신사별 URL을 배열로 지정
  const carrierUrls = [
    ...Object.values(speedtestUrls.lg),
    ...Object.values(speedtestUrls.skt),
    ...Object.values(speedtestUrls.kt),
  ];

  const performanceResults = [];

  // 리디렉션을 순차적으로 테스트
  await redirectSteps.performRedirect(carrierUrls);

  // 리디렉션 후 페이지에서 측정할 특정 요소가 나타날 때까지 대기
  await redirectSteps.waitForRedirectElement('#expected-element');

  // 요소가 페이지에 존재하는지 확인
  const elementVisible = await page.isVisible('#expected-element');
  expect(elementVisible).toBe(true);

  // 각 URL에 대해 성능 측정 (DCL, LCP, Load Time)
  for (const url of carrierUrls) {
    const dclTime = await redirectPage.measureDCL(url);
    const lcpTime = await redirectPage.measureLCP(url);
    const loadTime = await redirectPage.measureLoadTime(url);

    console.log(`URL: ${url} - DCL: ${dclTime}s, LCP: ${lcpTime}s, Load Time: ${loadTime}s`);
  }
});
