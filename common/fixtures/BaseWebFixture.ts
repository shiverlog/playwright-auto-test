/**
 * Description : BaseWebFixture.ts - 📌 Web 테스트를 위한 Fixture 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-04
 */
import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import { Logger } from '@common/logger/customLogger';
import type { POCKey, POCType } from '@common/types/platform-types';
import { ALL_POCS } from '@common/types/platform-types';
import { test as base, expect } from '@playwright/test';
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

  // 추상 클래스에서 요구하는 필수 구현 메서드
  // Web에서는 별도 준비 작업이 필요 없으므로 비워둠
  protected async prepare(poc: POCType): Promise<void> {}
}

// WebFixture 인스턴스 생성
const webFixture = new BaseWebFixture();

// Playwright 테스트 확장 정의
export const test = base.extend<{
  poc: POCType;
  baseURL: string;
}>({
  // 외부에서 입력된 POC
  poc: [(process.env.POC as POCType) || '', { option: true }],

  // baseURL 설정 및 POC 실행 흐름 구성
  baseURL: async ({ poc }, use) => {
    // POC가 없으면 전체 실행, 있으면 단일 POC 실행
    const targetPOCs: POCKey[] = poc === 'ALL' ? ALL_POCS : [poc as POCKey];

    for (const pocKey of targetPOCs) {
      const logger = Logger.getLogger(pocKey) as winston.Logger;
      logger.info(`[Test] Web 테스트 시작 - POC: ${pocKey}`);

      // Web 테스트용 baseURL 준비 및 주입
      const baseURL = await webFixture.setupForPoc(pocKey);
      await use(baseURL);

      // 후처리
      await webFixture.teardownForPoc(pocKey);
      logger.info(`[Test] Web 테스트 종료 - POC: ${pocKey}`);
    }
  },
});

// expect는 그대로 export
export { expect };
