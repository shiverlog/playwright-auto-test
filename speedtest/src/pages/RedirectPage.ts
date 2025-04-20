/**
 * Description : RedirectPage.ts - 📌 리다이렉션 속도측정 페이지
 * Author : Shiwoo Min
 * Date : 2025-04-18
 */
import type { Page } from '@playwright/test';

export class RedirectPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // 리디렉션 테스트를 위한 페이지로 이동
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  // 페이지가 리디렉션된 후의 URL 확인
  async getRedirectedUrl(): Promise<string> {
    return this.page.url(); // 현재 페이지의 URL을 반환
  }

  // 특정 요소가 페이지에 나타날 때까지 대기
  async waitForElement(selector: string): Promise<void> {
    await this.page.waitForSelector(selector);
  }

  // DCL 측정 (DOMContentLoaded)
  async measureDCL(url: string): Promise<number> {
    await this.navigateTo(url);
    // DCL 이벤트까지 대기
    await this.page.waitForLoadState('domcontentloaded');

    const dclTime = await this.page.evaluate(() => {
      const [navigationEntry] = performance.getEntriesByType(
        'navigation',
      ) as PerformanceNavigationTiming[];
      // DCL 시간 계산
      return navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime;
    });

    return dclTime / 1000;
  }

  // LCP 측정 (Largest Contentful Paint)
  async measureLCP(url: string): Promise<number | -1> {
    await this.navigateTo(url);
    await this.page.waitForLoadState('load');

    const lcpTime = await this.page.evaluate(() => {
      return new Promise<number | -1>(resolve => {
        const observer = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries() as PerformanceEntry[];
          if (entries.length > 0) {
            // LCP 측정값 반환
            resolve(entries[0].startTime / 1000);
            // LCP 측정 후 observer 종료
            observer.disconnect();
          }
        });

        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        setTimeout(() => {
          // LCP 측정 실패 시 -1 반환
          resolve(-1);
          // 타임아웃 처리
          observer.disconnect();
        }, 10000);
      });
    });

    return lcpTime;
  }

  // Load Time 측정 (Load Event)
  async measureLoadTime(url: string): Promise<number> {
    await this.navigateTo(url);
    // 페이지 로드 완료까지 대기
    await this.page.waitForLoadState('load');

    const loadTime = await this.page.evaluate(() => {
      const [navigationEntry] = performance.getEntriesByType(
        'navigation',
      ) as PerformanceNavigationTiming[];
      // 로드 시간 계산
      return navigationEntry.loadEventEnd - navigationEntry.startTime;
    });

    return loadTime / 1000;
  }
}
