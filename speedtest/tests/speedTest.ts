import type { Page } from '@playwright/test';

export class SpeedTest {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async measureDCL(url: string): Promise<number> {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');

    const dclTime = await this.page.evaluate(() => {
      return performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    });

    return dclTime / 1000; // 초 단위 변환
  }

  async measureLCP(url: string): Promise<number> {
    await this.page.goto(url);
    await this.page.waitForLoadState('load');

    const lcpTime = await this.page.evaluate(() => {
      return new Promise<number>(resolve => {
        const observer = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries() as PerformanceEntry[];
          if (entries.length > 0) {
            resolve(entries[0].startTime / 1000);
          }
        });

        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        setTimeout(() => resolve(-1), 10000); // 타임아웃 설정 (10초 후 -1 반환)
      });
    });

    return lcpTime;
  }

  async measureLoadTime(url: string): Promise<number> {
    await this.page.goto(url);
    await this.page.waitForLoadState('load');

    const loadTime = await this.page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });

    return loadTime / 1000;
  }
}
