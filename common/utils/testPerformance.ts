import { ALL_POCS, POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import type { Page } from '@playwright/test';

export class TestPerformance {
  private logger;

  constructor(private poc: Exclude<POCType, ''>) {
    this.logger = Logger.getLogger(poc);
  }

  /**
   * 공통 진입점: 단일 또는 전체 POC 실행
   */
  public static async runAll(
    poc: POCType,
    pageFactory: (poc: Exclude<POCType, ''>) => Promise<Page>,
  ) {
    const pocList = poc === '' ? ALL_POCS : [poc];

    await Promise.all(
      pocList.map(async pocItem => {
        const page = await pageFactory(pocItem);
        const perf = new TestPerformance(pocItem);
        await perf.runAllMeasurements(page);
      }),
    );
  }

  /**
   * 개별 POC 성능 측정 실행
   */
  public async runAllMeasurements(page: Page): Promise<void> {
    await this.detectConsoleErrors(page);
    await this.measureNetworkRequests(page);
    await this.measurePageLoadTime(page);
    await this.measureFullLoadTime(page);
    await this.getPerformanceMetrics(page);
    await this.measureLCP(page);
  }

  /**
   * 페이지 로드 시간 측정
   */
  public async measurePageLoadTime(page: Page): Promise<number> {
    const startTime = Date.now();
    await page.waitForLoadState('load');
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    this.logger.info(`페이지 로드 시간: ${loadTime} ms`);
    return loadTime;
  }

  /**
   * 특정 요소 로드 시간 측정
   */
  public async measureElementLoadTime(page: Page, selector: string): Promise<number> {
    const startTime = Date.now();
    await page.waitForSelector(selector, { state: 'visible' });
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    this.logger.info(`요소 (${selector}) 로드 시간: ${loadTime} ms`);
    return loadTime;
  }

  /**
   * 네트워크 요청/응답 로그 출력
   */
  public async measureNetworkRequests(page: Page) {
    page.on('request', request => {
      this.logger.info(`요청: ${request.method()} - ${request.url()}`);
    });

    page.on('response', async response => {
      this.logger.info(`응답 (${response.status()}): ${response.url()}`);
    });
  }

  /**
   * CPU / 메모리 사용량 측정
   */
  public async getPerformanceMetrics(page: Page) {
    const client = await page.context().newCDPSession(page);
    const metrics = await client.send('Performance.getMetrics');

    const cpuUsage = metrics.metrics.find(m => m.name === 'TaskDuration')?.value || 0;
    const jsHeapUsed = metrics.metrics.find(m => m.name === 'JSHeapUsedSize')?.value || 0;
    const jsHeapTotal = metrics.metrics.find(m => m.name === 'JSHeapTotalSize')?.value || 0;

    this.logger.info(`CPU 사용량: ${cpuUsage.toFixed(2)} ms`);
    this.logger.info(
      `메모리 사용량: ${(jsHeapUsed / 1024 / 1024).toFixed(2)} MB / ${(jsHeapTotal / 1024 / 1024).toFixed(2)} MB`,
    );
  }

  /**
   * 콘솔 에러/경고 감지
   */
  public async detectConsoleErrors(page: Page) {
    page.on('console', message => {
      if (message.type() === 'error') {
        this.logger.error(`콘솔 에러: ${message.text()}`);
      } else if (message.type() === 'warning') {
        this.logger.warn(`콘솔 경고: ${message.text()}`);
      }
    });
  }

  /**
   * LCP(Largest Contentful Paint) 측정
   */
  public async measureLCP(page: Page): Promise<number> {
    await page.waitForLoadState('load');

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
    const lcpTime = (await page.evaluate(script)) as number;
    this.logger.info(`LCP 시간: ${lcpTime} ms`);
    return lcpTime;
  }

  /**
   * 전체 페이지 로딩 시간 (Navigation Timing API)
   */
  public async measureFullLoadTime(page: Page): Promise<number> {
    await page.waitForLoadState('load');

    const fullLoadTime = await page.evaluate(() => {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navEntry ? navEntry.loadEventEnd - navEntry.startTime : 0;
    });

    this.logger.info(`전체 페이지 로드 시간: ${fullLoadTime / 1000} 초`);
    return fullLoadTime;
  }

  /**
   * 커스텀 성능 이벤트 평가
   */
  public async waitForPerformanceEvent(page: Page, script: string): Promise<number> {
    const result = (await page.evaluate(script)) as number;
    return result;
  }
}
