/**
 * Description : BaseMobileWebFixture.ts - 📌 Mobile Web (기기/에뮬레이터/PC) 테스트를 위한 Fixture 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-06
 */
import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import '@common/initializers/mobileWebTestEnv';
import { Logger } from '@common/logger/customLogger';
import type { POCKey, POCType } from '@common/types/platform-types';
import { createStealthContext, launchStealthBrowser } from '@common/utils/browser/stealthContext';
import { test as base, expect } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';
import type winston from 'winston';

class BaseMobileWebFixture extends BasePocFixture {
  // POC별 baseURL 매핑 저장
  private configMap: Partial<Record<POCType, string>> = {};

  /**
   * baseURL 설정
   */
  public setBaseURL(poc: POCType, url: string) {
    if (poc === 'ALL') return;
    const pocKey = poc as POCKey;
    this.configMap[pocKey] = url;
  }

  /**
   * baseURL 조회 (없으면 기본 모바일 URL 반환)
   */
  public getBaseURL(poc: POCType): string {
    if (poc === 'ALL') return 'https://m.lguplus.com';
    const pocKey = poc as POCKey;
    return this.configMap[pocKey] || 'https://m.lguplus.com';
  }

  /**
   * POC 테스트 시작 전 세팅 (context 초기화, 모바일 환경 준비)
   */
  public async setupForPoc(poc: POCType): Promise<string> {
    if (poc === 'ALL') return 'https://m.lguplus.com';
    const pocKey = poc as POCKey;
    const logger = Logger.getLogger(pocKey) as winston.Logger;

    logger.info(`[MobileWebFixture] ${pocKey} 환경 준비 시작`);
    await this.beforeAll(pocKey);
    // await initializeMobileWebTestEnv(pocKey);

    const baseURL = process.env.BASE_URL || 'https://m.lguplus.com';
    this.setBaseURL(pocKey, baseURL);
    return baseURL;
  }

  /**
   * POC 테스트 종료 후 정리 작업
   */
  public async teardownForPoc(poc: POCType): Promise<void> {
    if (poc === 'ALL') return;
    const pocKey = poc as POCKey;
    const logger = Logger.getLogger(pocKey) as winston.Logger;

    // await cleanupMobileWebTestEnv(pocKey);
    await this.afterAll(pocKey);
    logger.info(`[MobileWebFixture] ${pocKey} 환경 정리 완료`);
  }

  /**
   * 추상 메서드 구현 (현재는 별도 준비 없음)
   */
  protected async prepare(poc: POCType): Promise<void> {}

  /**
   * Playwright용 테스트 fixture 확장 정의
   */
  public getTestExtend() {
    return base.extend<{
      poc: POCType;
      baseURL: string;
      context: BrowserContext;
      page: Page;
    }>({
      // 환경변수 기반 POC 값 설정
      poc: [(process.env.POC as POCType) || '', { option: true }],

      // 브라우저 context 설정
      context: async ({}, use, testInfo) => {
        const poc = (process.env.POC as POCKey) || 'pc-mobile-web';
        const logger = Logger.getLogger(poc) as winston.Logger;
        const browser = await launchStealthBrowser({ headless: false });

        const context = await createStealthContext(browser, {
          viewport: { width: 390, height: 844 },
          userAgent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        });

        // WebDriver 탐지 우회용 스크립트 삽입
        await context.addInitScript(() => {
          Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
          // @ts-ignore
          window.chrome = { runtime: {} };
        });

        logger.info(`[MobileWebFixture] ${poc} context 생성 완료`);
        await use(context);
        await context.close();
      },

      // Page 객체 생성 및 정리
      page: async ({ context }, use) => {
        const page = await context.newPage();
        await use(page);
        await page.close();
      },

      // baseURL 설정 및 환경 정리 연동
      baseURL: async ({ poc }, use) => {
        const pocKey = poc as POCKey;
        const baseURL = await this.setupForPoc(pocKey);
        await use(baseURL);
        await this.teardownForPoc(pocKey);
      },
    });
  }
}

// Mobile Web Fixture 인스턴스 생성 및 테스트 확장
export const mobileWebFixture = new BaseMobileWebFixture();
export const test = mobileWebFixture.getTestExtend();
export { expect };
