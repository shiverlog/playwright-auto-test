/**
 * Description : TestPerformance.ts - 📌 Playwright 테스트의 성능 체크와 복잡한 이야기 등 구현
 * Author : Shiwoo Min
 * Date : 2024-04-11
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type { Page } from '@playwright/test';
import type winston from 'winston';

export class TestPerformance {
  // 현재 POC 타입
  private readonly poc = POCEnv.getType() || 'ALL';
  // 해당 테스트의 로거
  private readonly logger = Logger.getLogger(this.poc) as winston.Logger;

  /**
   * 공통 진입점: 단일 또는 전체 POC 실행
   */
  public static async runAll(pageFactory: (poc: string) => Promise<Page>): Promise<void> {
    const pocList = POCEnv.getPOCList();
    await Promise.all(
      pocList.map(async poc => {
        const page = await pageFactory(poc);
        const perf = new TestPerformance();
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
    await this.measureFCP(page);
    await this.measureLCP(page);
    await this.measureCLS(page);
  }

  /**
   * 페이지 로드 시간 측정
   */
  public async measurePageLoadTime(page: Page): Promise<number> {
    const startTime = Date.now();
    await page.waitForLoadState('load');
    const loadTime = Date.now() - startTime;
    this.logger.info(`[Performance] 사이트 로드시간: ${loadTime} ms`);
    return loadTime;
  }

  /**
   * 특정 요소 로드 시간 측정
   */
  public async measureElementLoadTime(page: Page, selector: string): Promise<number> {
    const startTime = Date.now();
    await page.waitForSelector(selector, { state: 'visible' });
    const loadTime = Date.now() - startTime;
    this.logger.info(`[Performance] 요소 (${selector}) 로드시간: ${loadTime} ms`);
    return loadTime;
  }

  /**
   * 네트워크 요청/응답 로그 출력
   */
  public async measureNetworkRequests(page: Page) {
    page.on('request', request => {
      this.logger.info(`[Network][Request] ${request.method()} - ${request.url()}`);
    });

    page.on('response', response => {
      this.logger.info(`[Network][Response] ${response.status()} - ${response.url()}`);
    });
  }

  /**
   * CPU / 메모리 사용량 측정 (CDP 기반)
   */
  public async getPerformanceMetrics(page: Page) {
    const client = await page.context().newCDPSession(page);
    const metrics = await client.send('Performance.getMetrics');

    const cpuUsage = Number(metrics.metrics.find(m => m.name === 'TaskDuration')?.value ?? 0);
    const jsHeapUsed = Number(metrics.metrics.find(m => m.name === 'JSHeapUsedSize')?.value ?? 0);
    const jsHeapTotal = Number(metrics.metrics.find(m => m.name === 'JSHeapTotalSize')?.value ?? 0);

    this.logger.info(`[Performance] CPU 사용량: ${cpuUsage.toFixed(2)} ms`);
    this.logger.info(
      `[Performance] 메모리: ${(jsHeapUsed / 1024 / 1024).toFixed(2)} MB / ${(jsHeapTotal / 1024 / 1024).toFixed(2)} MB`,
    );
  }

  /**
   * 콘솔 에러/경고 감지
   */
  public async detectConsoleErrors(page: Page) {
    page.on('console', message => {
      if (message.type() === 'error') {
        this.logger.error(`[Console][Error] ${message.text()}`);
      } else if (message.type() === 'warning') {
        this.logger.warn(`[Console][Warn] ${message.text()}`);
      }
    });
  }

  /**
   * LCP(Largest Contentful Paint) 측정
   */
  public async measureLCP(page: Page): Promise<number> {
    await page.waitForLoadState('load');
    const script = `
      new Promise(resolve => {
        const observer = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          resolve(entries[entries.length - 1]?.startTime || 0);
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      });
    `;
    const lcp = Number(await page.evaluate(script));
    this.logger.info(`[Performance] LCP: ${lcp} ms`);
    return lcp;
  }

  /**
   * FCP(First Contentful Paint) 측정
   */
  public async measureFCP(page: Page): Promise<number> {
    const fcp = Number(
      await page.evaluate(() => {
        return new Promise(resolve => {
          new PerformanceObserver(entryList => {
            const fcpEntry = entryList.getEntries().find(e => e.name === 'first-contentful-paint');
            resolve(fcpEntry?.startTime || 0);
          }).observe({ type: 'paint', buffered: true });
        });
      }),
    );
    this.logger.info(`[Performance] FCP: ${fcp} ms`);
    return fcp;
  }

  /**
   * CLS(Cumulative Layout Shift) 측정
   */
  public async measureCLS(page: Page): Promise<number> {
    const cls = Number(
      await page.evaluate(() => {
        return new Promise(resolve => {
          let clsValue = 0;
          new PerformanceObserver(entryList => {
            for (const entry of entryList.getEntries()) {
              // @ts-ignore
              if (!entry.hadRecentInput) clsValue += entry.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
          setTimeout(() => resolve(clsValue), 500);
        });
      }),
    );
    this.logger.info(`[Performance] CLS: ${cls.toFixed(3)}`);
    return cls;
  }

  /**
   * 전체 페이지 로딩 시간 (Navigation Timing API)
   */
  public async measureFullLoadTime(page: Page): Promise<number> {
    await page.waitForLoadState('load');
    const fullLoadTime = Number(
      await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return nav.loadEventEnd - nav.startTime;
      }),
    );
    this.logger.info(`[Performance] 전체 로드 시간: ${(fullLoadTime / 1000).toFixed(2)} 초`);
    return fullLoadTime;
  }

  /**
   * 사용자 정의 성능 측정 스크립트 실행
   */
  public async waitForPerformanceEvent(page: Page, script: string): Promise<number> {
    const result = Number(await page.evaluate(script));
    return result;
  }
}
