/**
 * Description : BaseMobileWebFixture.ts - 📌 Mobile Web (기기/에미루래이터/PC) 테스트를 위한 Fixture 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import '@common/initializers/MobileWebTestEnv';
import { StealthContext } from '@common/utils/browser/StealthContext';
import { test as base, expect } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';

class BaseMobileWebFixture extends BasePocFixture {
  private configMap: Partial<Record<string, string>> = {};

  /** baseURL 설정 */
  public setBaseURL(poc: string, url: string) {
    if (poc === 'ALL') return;
    this.configMap[poc] = url;
  }

  /** baseURL 확인 */
  public getBaseURL(poc: string): string {
    if (poc === 'ALL') return 'https://m.lguplus.com';
    return this.configMap[poc] || 'https://m.lguplus.com';
  }

  /** POC 테스트 시작 전 조건 설정 */
  public async setupForPoc(poc: string): Promise<string> {
    if (poc === 'ALL') return 'https://m.lguplus.com';
    this.loggerPerPoc[poc].info(`[MobileWebFixture] ${poc} 환경 준비 시작`);
    await this.beforeAll(poc);

    const baseURL = process.env.BASE_URL || 'https://m.lguplus.com';
    this.setBaseURL(poc, baseURL);
    return baseURL;
  }

  /** POC 테스트 종료 후 조건 삭제 */
  public async teardownForPoc(poc: string): Promise<void> {
    if (poc === 'ALL') return;
    await this.afterAll(poc);
    this.loggerPerPoc[poc].info(`[MobileWebFixture] ${poc} 환경 정리 완료`);
  }

  /** 첫 번째 prepare - 현재는 바로 실행 필요 없음 */
  protected async prepare(poc: string): Promise<void> {}

  /** Playwright 테스트 fixture 확장 */
  public getTestExtend() {
    return base.extend<{
      poc: string;
      baseURL: string;
      context: BrowserContext;
      page: Page;
    }>({
      poc: [(process.env.POC as string) || '', { option: true }],

      context: async ({}, use) => {
        const poc = (process.env.POC as string) || 'MW';
        const stealth = new StealthContext();
        const browser = await stealth.launchBrowser();
        const context = await stealth.createContext(browser);

        await context.addInitScript(() => {
          Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
          // @ts-ignore
          window.chrome = { runtime: {} };
        });

        this.loggerPerPoc[poc].info(`[MobileWebFixture] ${poc} context 생성 완료`);
        await use(context);
        await context.close();
      },

      page: async ({ context }, use) => {
        const page = await context.newPage();
        await use(page);
        await page.close();
      },

      baseURL: async ({ poc }, use) => {
        this.loggerPerPoc[poc].info(`[Test] MobileWeb 테스트 시작 - POC: ${poc}`);
        const baseURL = await this.setupForPoc(poc);
        await use(baseURL);
        await this.teardownForPoc(poc);
        this.loggerPerPoc[poc].info(`[Test] MobileWeb 테스트 종료 - POC: ${poc}`);
      },
    });
  }
}

export const mobileWebFixture = new BaseMobileWebFixture();
export const test = mobileWebFixture.getTestExtend();
export { expect };
