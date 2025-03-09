import { Page } from "@playwright/test";

export class TestPerformance {
  /**
   * 페이지 로드 시간 측정
   * @param page - Playwright Page 객체
   * @returns 로드 완료까지 걸린 시간 (ms)
   */
  public static async measurePageLoadTime(page: Page): Promise<number> {
    const startTime = Date.now();
    await page.waitForLoadState("load");
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    console.log(`⏳ 페이지 로드 시간: ${loadTime} ms`);
    return loadTime;
  }

  /**
   * 특정 요소가 로드될 때까지 걸린 시간 (LCP 측정 가능)
   * @param page - Playwright Page 객체
   * @param selector - LCP (Largest Contentful Paint) 요소 선택자
   * @returns LCP 로딩 완료 시간 (ms)
   */
  public static async measureElementLoadTime(page: Page, selector: string): Promise<number> {
    const startTime = Date.now();
    await page.waitForSelector(selector, { state: "visible" });
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    console.log(`📸 요소 (${selector}) 로드 시간: ${loadTime} ms`);
    return loadTime;
  }

  /**
   * 네트워크 요청 및 응답 시간 측정
   * @param page - Playwright Page 객체
   */
  public static async measureNetworkRequests(page: Page) {
    page.on("request", (request) => {
      console.log(`📡 요청: ${request.url()} - ${request.method()}`);
    });

    page.on("response", async (response) => {
      const status = response.status();
      const url = response.url();
      console.log(`✅ 응답 (${status}): ${url}`);
    });
  }

  /**
   * CPU & 메모리 사용량 측정 (Chrome DevTools Protocol 사용)
   * @param page - Playwright Page 객체
   */
  public static async getPerformanceMetrics(page: Page) {
    const client = await page.context().newCDPSession(page);
    const metrics = await client.send("Performance.getMetrics");

    const cpuUsage = metrics.metrics.find((m) => m.name === "TaskDuration")?.value || 0;
    const jsHeapUsed = metrics.metrics.find((m) => m.name === "JSHeapUsedSize")?.value || 0;
    const jsHeapTotal = metrics.metrics.find((m) => m.name === "JSHeapTotalSize")?.value || 0;

    console.log(`🖥 CPU 사용량: ${cpuUsage.toFixed(2)} ms`);
    console.log(`📊 메모리 사용량: ${(jsHeapUsed / 1024 / 1024).toFixed(2)} MB / ${(jsHeapTotal / 1024 / 1024).toFixed(2)} MB`);
  }

  /**
   * 콘솔 에러 및 경고 감지
   * @param page - Playwright Page 객체
   */
  public static async detectConsoleErrors(page: Page) {
    page.on("console", (message) => {
      if (message.type() === "error") {
        console.error(`❌ 콘솔 에러: ${message.text()}`);
      } else if (message.type() === "warning") {
        console.warn(`⚠ 콘솔 경고: ${message.text()}`);
      }
    });
  }

  /**
   * LCP (Largest Contentful Paint) 직접 측정
   * @param page - Playwright Page 객체
   * @returns LCP 시간 (ms)
   */
  public static async measureLCP(page: Page): Promise<number> {
    await page.waitForLoadState("load");

    const script = `
      new Promise((resolve) => {
        const observer = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            resolve(entries[entries.length - 1].startTime);
          }
        });
        observer.observe({ type: "largest-contentful-paint", buffered: true });
      });
    `;

    const lcpTime = await page.evaluate(script) as number;
    console.log(`📊 LCP 시간: ${lcpTime} ms`);
    return lcpTime;
  }

  /**
   * 전체 페이지 로드 시간 측정 (Performance API 활용)
   */
  public static async measureFullLoadTime(page: Page): Promise<number> {
    await page.waitForLoadState("load");

    const fullLoadTime = await page.evaluate(() => {
      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      return navEntry ? navEntry.loadEventEnd - navEntry.startTime : 0;
    });

    console.log(`🚀 전체 페이지 로드 시간: ${fullLoadTime / 1000} 초`);
    return fullLoadTime;
  }

  /**
   * 특정 이벤트 발생까지 대기
   */
  public static async waitForPerformanceEvent(page: Page, script: string): Promise<number> {
    const result = await page.evaluate(script) as number;
    return result;
  }
}
