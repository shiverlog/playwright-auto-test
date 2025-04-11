/**
 * Description : BaseWebFixture.ts - 📌 Web 테스트를 위한 Fixture 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */
import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import { StealthContext } from '@common/utils/browser/StealthContext';
import { test as base, expect } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';
import { spawn } from 'child_process';

class BaseWebFixture extends BasePocFixture {
  private configMap: Partial<Record<string, string>> = {};

  /** 테스트 baseURL 세팅 */
  public setBaseURL(poc: string, url: string) {
    this.configMap[poc] = url;
  }

  /** baseURL 조회 */
  public getBaseURL(poc: string): string {
    return this.configMap[poc] || 'https://www.lguplus.com';
  }

  /** 테스트 환경 구성 */
  public async setupForPoc(poc: string): Promise<string> {
    this.loggerPerPoc[poc].info(`[WebFixture] ${poc} 상황 준비 시작`);
    await this.beforeAll(poc);

    const baseURL = process.env.BASE_URL || 'https://www.lguplus.com';
    this.setBaseURL(poc, baseURL);
    return baseURL;
  }

  /** 테스트 종료 후 정리 */
  public async teardownForPoc(poc: string): Promise<void> {
    await this.afterAll(poc);
    this.loggerPerPoc[poc].info(`[WebFixture] ${poc} 상황 정리 완료`);
  }

  /** 실행 환경별 커스텀 준비 (하위 클래스에서 오버라이딩 가능) */
  protected async prepare(poc: string): Promise<void> {}

  /** Chromium 브라우저 최대화 (CDP 기반) */
  private async maximizeWindowIfChromium(page: Page): Promise<void> {
    try {
      const browserName = page.context().browser()?.browserType().name();
      if (browserName === 'chromium') {
        const session = await page.context().newCDPSession(page);
        const { windowId } = await session.send('Browser.getWindowForTarget');
        await session.send('Browser.setWindowBounds', {
          windowId,
          bounds: { windowState: 'maximized' },
        });
        this.logger.info('[CDP] 브라우저 최대화 완료');
      } else {
        this.logger.info(`[CDP] 최대화 생략 - browser=${browserName}`);
      }
    } catch (err) {
      this.logger.warn('[CDP] 최대화 실패:', err);
    }
  }

  /** 전체 POC 병렬 실행 */
  public async runAllPOCsInParallel(): Promise<void> {
    this.logger.info('[WebFixture] POC=ALL -> 전체 병렬 실행 시작');

    const processes = this.pocList.map(poc => {
      return new Promise<void>((resolve, reject) => {
        const child = spawn('npx', ['playwright', 'test', `--project=${poc}`], {
          stdio: 'inherit',
          env: { ...process.env, POC: poc },
          shell: true,
        });

        child.on('close', code => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`[${poc}] 테스트 실패 (exit code: ${code})`));
          }
        });
      });
    });

    await Promise.all(processes);
    this.logger.info('[WebFixture] 전체 POC 병렬 실행 완료');
  }

  /** test.extend 정의 */
  public getTestExtend() {
    return base.extend<{
      poc: string;
      baseURL: string;
      context: BrowserContext;
      page: Page;
    }>({
      poc: [(process.env.POC as string) || '', { option: true }],

      context: async ({}, use) => {
        const stealth = new StealthContext();
        const browser = await stealth.launchBrowser();
        const context = await stealth.createContext(browser);
        await use(context);
        await context.close();
      },

      page: async ({ context }, use) => {
        const page = await context.newPage();
        await this.maximizeWindowIfChromium(page);
        await use(page);
        await page.close();
      },

      baseURL: async ({ poc }, use) => {
        this.loggerPerPoc[poc].info(`[Test] Web 테스트 시작 - POC: ${poc}`);
        const baseURL = await this.setupForPoc(poc);
        await use(baseURL);
        await this.teardownForPoc(poc);
        this.loggerPerPoc[poc].info(`[Test] Web 테스트 종료 - POC: ${poc}`);
      },
    });
  }
}

export const webFixture = new BaseWebFixture();
export const test = webFixture.getTestExtend();
export { expect };
