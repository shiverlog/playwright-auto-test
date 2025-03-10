import { test } from "@playwright/test";
import { SpeedTest } from "./speedTest";
import { saveResults } from "./saveLogs";
import { sendResults } from "./sendResults";

test("웹 페이지 속도 측정", async ({ page }) => {
  const speedTest = new SpeedTest(page);

  const testUrls = [
    { page: "홈", url: "https://m.lguplus.com" },
    { page: "KT", url: "https://m.kt.com/" },
    { page: "SKT", url: "https://m.tworld.co.kr/v6/main" },
  ];

  let results = [];

  for (const { page, url } of testUrls) {
    console.log(`🚀 ${page} 속도 측정 중...`);
    const dcl = await speedTest.measureDCL(url);
    const lcp = await speedTest.measureLCP(url);
    const loadTime = await speedTest.measureLoadTime(url);

    console.log(`✅ ${page} DCL: ${dcl}s, LCP: ${lcp}s, Load: ${loadTime}s`);

    results.push({
      page,
      url,
      dcl,
      lcp,
      loadTime,
      testedAt: new Date().toISOString(),
    });
  }

  // 측정 결과 저장
  saveResults(results);

  // 서버 전송
  await sendResults("https://dcms.uhdcsre.com/dcms/qa");
});
