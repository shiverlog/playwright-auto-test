import type { Page } from '@playwright/test';

export class SpeedTest {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async measureDCL(url: string): Promise<number> {
    await this.navigateTo(url);
    await this.page.waitForLoadState('domcontentloaded');

    const dclTime = await this.page.evaluate(() => {
      const [navigationEntry] = performance.getEntriesByType(
        'navigation',
      ) as PerformanceNavigationTiming[];
      return navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime;
    });

    return dclTime / 1000; // 초 단위 변환
  }

  async measureLCP(url: string): Promise<number | -1> {
    await this.navigateTo(url);
    await this.page.waitForLoadState('load');

    const lcpTime = await this.page.evaluate(() => {
      return new Promise<number | -1>(resolve => {
        const observer = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries() as PerformanceEntry[];
          if (entries.length > 0) {
            resolve(entries[0].startTime / 1000);
            // LCP가 측정되면 observer를 disconnect하여 성능 저하를 방지
            observer.disconnect();
          }
        });

        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        setTimeout(() => {
          resolve(-1);
          // 타임아웃 시 observer를 disconnect
          observer.disconnect();
        }, 10000);
      });
    });

    return lcpTime;
  }

  async measureLoadTime(url: string): Promise<number> {
    await this.navigateTo(url);
    await this.page.waitForLoadState('load');

    const loadTime = await this.page.evaluate(() => {
      const [navigationEntry] = performance.getEntriesByType(
        'navigation',
      ) as PerformanceNavigationTiming[];
      return navigationEntry.loadEventEnd - navigationEntry.startTime;
    });

    return loadTime / 1000;
  }
}
