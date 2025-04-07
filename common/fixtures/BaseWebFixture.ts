/**
 * Description : BaseWebFixture.ts - 📌 Web 테스트를 위한 Fixture 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-06
 */
import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import { Logger } from '@common/logger/customLogger';
import type { POCKey, POCType } from '@common/types/platform-types';
import { ALL_POCS } from '@common/types/platform-types';
import { createStealthContext, launchStealthBrowser } from '@common/utils/browser/stealthContext';
import { test as base, expect } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';
import { spawn } from 'child_process';
import type winston from 'winston';

class BaseWebFixture extends BasePocFixture {
  // POC별 baseURL 매핑 저장
  private configMap: Partial<Record<POCType, string>> = {};

  // baseURL 저장
  public setBaseURL(poc: POCType, url: string) {
    if (poc === 'ALL') return;
    const pocKey = poc as POCKey;
    this.configMap[pocKey] = url;
  }

  // baseURL 조회 (기본값 제공)
  public getBaseURL(poc: POCType): string {
    if (poc === 'ALL') return 'https://www.lguplus.com';
    const pocKey = poc as POCKey;
    return this.configMap[pocKey] || 'https://www.lguplus.com';
  }

  // 각 POC에 대한 테스트 사전 준비
  public async setupForPoc(poc: POCType): Promise<string> {
    if (poc === 'ALL') return 'https://www.lguplus.com';
    const pocKey = poc as POCKey;
    const logger = Logger.getLogger(pocKey) as winston.Logger;

    logger.info(`[WebFixture] ${pocKey} 환경 준비 시작`);
    await this.beforeAll(pocKey);

    const baseURL = process.env.BASE_URL || 'https://www.lguplus.com';
    this.setBaseURL(pocKey, baseURL);
    return baseURL;
  }

  // 각 POC에 대한 테스트 후처리
  public async teardownForPoc(poc: POCType): Promise<void> {
    if (poc === 'ALL') return;
    const pocKey = poc as POCKey;
    const logger = Logger.getLogger(pocKey) as winston.Logger;

    await this.afterAll(pocKey);
    logger.info(`[WebFixture] ${pocKey} 환경 정리 완료`);
  }

  // 추상클래스에서 요구하는 필수 구현 메서드
  // Web에서는 별도 준비 작업이 필요 없으므로 빈 메서드로 구현
  protected async prepare(poc: POCType): Promise<void> {}

  // CDP 기반 최대화 유틸 함수 - 굳이 사용하지 않아도 될 듯
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
        console.log('[CDP] 브라우저 최대화 완료');
      } else {
        console.log(`[CDP] 최대화 생략 - browser=${browserName}`);
      }
    } catch (err) {
      console.warn('[CDP] 최대화 실패:', err);
    }
  }

  /**
   * POC=ALL일 때 병렬 실행 유틸
   */
  public async runAllPOCsInParallel(): Promise<void> {
    console.log('[WebFixture] POC=ALL -> 전체 병렬 실행 시작');

    const processes = ALL_POCS.map(pocKey => {
      return new Promise<void>((resolve, reject) => {
        const child = spawn('npx', ['playwright', 'test', `--project=${pocKey}`], {
          stdio: 'inherit',
          env: { ...process.env, POC: pocKey },
          shell: true,
        });

        child.on('close', code => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`[${pocKey}] 테스트 실패 (exit code: ${code})`));
          }
        });
      });
    });

    await Promise.all(processes);
    console.log('[WebFixture] 전체 POC 병렬 실행 완료');
  }
  /**
   * Playwright 테스트 확장 정의
   */
  public getTestExtend() {
    return base.extend<{
      poc: POCType;
      baseURL: string;
      context: BrowserContext;
      page: Page;
    }>({
      poc: [(process.env.POC as POCType) || '', { option: true }],

      context: async ({}, use) => {
        const browser = await launchStealthBrowser({ headless: false });
        const context = await createStealthContext(browser);
        await use(context);
        await context.close();
      },

      page: async ({ context }, use) => {
        const page = await context.newPage();
        // 브라우저 최대화
        await this.maximizeWindowIfChromium(page);
        await use(page);
        await page.close();
      },

      baseURL: async ({ poc }, use) => {
        if (poc === 'ALL') {
          throw new Error(
            '[baseURL Fixture] POC가 ALL로 설정된 경우, 전체 POC 병렬 실행은 pubsubRunner.ts 에서 처리합니다.',
          );
        }

        const pocKey = poc as POCKey;
        const logger = Logger.getLogger(pocKey) as winston.Logger;

        logger.info(`[Test] Web 테스트 시작 - POC: ${pocKey}`);
        const baseURL = await this.setupForPoc(pocKey);
        await use(baseURL);
        await this.teardownForPoc(pocKey);
        logger.info(`[Test] Web 테스트 종료 - POC: ${pocKey}`);
      },
    });
  }
}
// WebFixture 인스턴스 생성
export const webFixture = new BaseWebFixture();
// Playwright 테스트 확장 정의
export const test = webFixture.getTestExtend();

export { expect };
