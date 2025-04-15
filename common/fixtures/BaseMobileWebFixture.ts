/**
 * Description : BaseMobileWebFixture.ts - 📌 Mobile Web (기기/에미루래이터/PC) 테스트를 위한 Fixture 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import { StealthContext } from '@common/utils/browser/StealthContext';
import { test as base, expect } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';

class BaseMobileWebFixture extends BasePocFixture {
  private configMap: Partial<Record<string, string>> = {};

  // baseURL 설정
  public setBaseURL(poc: string, url: string) {
    if (poc === 'all') return;
    this.configMap[poc] = url;
  }

  // baseURL 확인
  public getBaseURL(poc: string): string {
    if (poc === 'all') return 'https://m.lguplus.com';
    return this.configMap[poc] || 'https://m.lguplus.com';
  }

  /**
   * POC 테스트 시작 전 조건 설정
   */
  public async setupForPoc(poc: string): Promise<string> {
    if (poc === 'all') return 'https://m.lguplus.com';
    this.getLogger(poc).info(`[MobileWebFixture] ${poc} 환경 준비 시작`);
    await this.beforeAll(poc);

    const baseURL = process.env.BASE_URL || 'https://m.lguplus.com';
    this.setBaseURL(poc, baseURL);
    return baseURL;
  }

  /**
   * POC 테스트 종료 후 조건 삭제
   */
  public async teardownForPoc(poc: string): Promise<void> {
    if (poc === 'all') return;
    await this.afterAll(poc);
    this.getLogger(poc).info(`[MobileWebFixture] ${poc} 환경 정리 완료`);
  }

  /**
   * 실행 환경별 커스텀 준비 (하위 클래스에서 오버라이딩)
   */
  protected async prepare(poc: string): Promise<void> {
    // 기본 동작 없음 (필요 시 override)
  }

  /**
   * Playwright 테스트 fixture 확장
   */
  public getTestExtend() {
    return base.extend<{
      poc: string;
      baseURL: string;
      context: BrowserContext;
      page: Page;
    }>({
      poc: [(process.env.POC as string) || '', { option: true }],

      context: async ({ poc }, use) => {
        const stealth = new StealthContext({
          platform: 'MOBILE_WEB',
          userAgent:
            'Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
          viewport: { width: 412, height: 915 },
          isMobile: true,
          hasTouch: true,
          deviceScaleFactor: 3.5,
        });

        const browser = await stealth.launchBrowser();
        const context = await stealth.createContext(browser);

        await context.addInitScript(() => {
          Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
          // @ts-ignore
          window.chrome = { runtime: {} };
        });

        this.getLogger(poc).info(`[MobileWebFixture] ${poc} context 생성 완료`);
        await use(context);
        await context.close();
        await browser.close();
      },

      page: async ({ context }, use) => {
        const page = await context.newPage();
        await use(page);
        await page.close();
      },

      baseURL: async ({ poc }, use) => {
        this.getLogger(poc).info(`[Test] MobileWeb 테스트 시작 - POC: ${poc}`);
        const baseURL = await this.setupForPoc(poc);
        await use(baseURL);
        await this.teardownForPoc(poc);
        this.getLogger(poc).info(`[Test] MobileWeb 테스트 종료 - POC: ${poc}`);
      },
    });
  }
}

export const mobileWebFixture = new BaseMobileWebFixture();
export const test = mobileWebFixture.getTestExtend();
export { expect };
