/**
 * Description : BaseWebFixture.ts - 📌 Web 테스트를 위한 Fixture 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import { ALL_POCS } from '@common/constants/PathConstants';
import type { POCType } from '@common/constants/PathConstants';
import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import { Logger } from '@common/logger/customLogger';
import { test as base, expect } from '@playwright/test';

class BaseWebFixture extends BasePocFixture {
  // POC별 baseURL 매핑 저장
  private configMap: Partial<Record<POCType, string>> = {};

  // baseURL 저장
  public setBaseURL(poc: POCType, url: string) {
    this.configMap[poc] = url;
  }

  // baseURL 조회 (기본값 제공)
  public getBaseURL(poc: POCType): string {
    return this.configMap[poc] || 'https://www.lguplus.com';
  }

  // 각 POC에 대한 테스트 사전 준비
  public async setupForPoc(poc: POCType): Promise<string> {
    const logger = Logger.getLogger(poc);
    logger.info(`[WebFixture] ${poc} 환경 준비 시작`);

    // 공통 디렉토리 생성 등 처리
    await this.beforeAll(poc);

    // BASE_URL 환경변수 또는 기본값 설정
    const baseURL = process.env.BASE_URL || 'https://www.lguplus.com';
    this.setBaseURL(poc, baseURL);

    return baseURL;
  }

  // 각 POC에 대한 테스트 후처리
  public async teardownForPoc(poc: POCType): Promise<void> {
    const logger = Logger.getLogger(poc);
    await this.afterAll(poc);
    logger.info(`[WebFixture] ${poc} 환경 정리 완료`);
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
  poc: [(process.env.POC as POCType) || '', { option: true }],

  // baseURL 설정 및 POC 실행 흐름 구성
  baseURL: async ({ poc }, use) => {
    // POC가 없으면 전체 실행, 있으면 단일 POC 실행
    const targetPOCs: Exclude<POCType, ''>[] =
      poc === '' ? ALL_POCS : [poc as Exclude<POCType, ''>];

    for (const target of targetPOCs) {
      const logger = Logger.getLogger(target);
      logger.info(`[Test] Web 테스트 시작 - POC: ${target}`);

      // Web 테스트용 baseURL 준비 및 주입
      const baseURL = await webFixture.setupForPoc(target);
      await use(baseURL);

      // 후처리
      await webFixture.teardownForPoc(target);

      logger.info(`[Test] Web 테스트 종료 - POC: ${target}`);
    }
  },
});

// expect는 그대로 export
export { expect };
