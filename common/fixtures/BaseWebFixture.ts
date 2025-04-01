import { ALL_POCS } from '@common/constants/PathConstants';
import type { POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import { Page, test as base, expect } from '@playwright/test';

import { BaseFixture } from './BaseFixture';

class BaseWebFixture extends BaseFixture {
  private configMap: Partial<Record<POCType, string>> = {};

  public setBaseURL(poc: POCType, url: string) {
    this.configMap[poc] = url;
  }

  async prepare(poc: POCType, page: Page): Promise<void> {
    const logger = Logger.getLogger(poc);
    const baseURL = this.configMap[poc] || 'https://www.lguplus.com';

    logger.info(`[WebFixture] ${poc} 환경 준비 중...`);
    await page.goto(baseURL);
  }
}

const webFixture = new BaseWebFixture();
const DEFAULT_URL = 'https://www.lguplus.com';

// Playwright test 확장
export const test = base.extend<{
  poc: POCType;
  baseURL: string;
}>({
  poc: [(process.env.POC as POCType) || '', { option: true }],

  baseURL: async ({ poc }, use) => {
    const targetPOCs: Exclude<POCType, ''>[] =
      poc === '' ? ALL_POCS : [poc as Exclude<POCType, ''>];

    for (const target of targetPOCs) {
      const logger = Logger.getLogger(target);
      logger.info(`[Test] Web 테스트 시작 - POC: ${target}`);

      await webFixture.beforeAll(target);

      const baseURL = process.env.BASE_URL || DEFAULT_URL;
      webFixture.setBaseURL(target, baseURL);

      await use(baseURL);

      await webFixture.afterAll(target);
      logger.info(`[Test] Web 테스트 종료 - POC: ${target}`);
    }
  },
});

export { expect };
