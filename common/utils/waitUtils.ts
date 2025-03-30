import { Locator, Page } from '@playwright/test';

/**
 * WaitUtils: 정적 대기 유틸리티 클래스
 * (Playwright 또는 Appium 등 환경에 구애받지 않음)
 */
export class WaitUtils {
  /**
   * 특정 시간(ms) 동안 대기
   */
  public static async wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * 특정 조건이 만족될 때까지 대기
   */
  public static async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 10000,
    interval: number = 500,
  ): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await condition()) return;
      await this.wait(interval);
    }
    throw new Error('Timeout: condition was not met within the given time.');
  }

  /**
   * 조건이 만족되지 않는 동안 대기
   */
  public static async waitWhile(
    condition: () => Promise<boolean>,
    timeout: number = 10000,
    interval: number = 500,
  ): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (!(await condition())) return;
      await this.wait(interval);
    }
    throw new Error('Timeout: condition still true after given time.');
  }

  /**
   * 특정 부모 아래 지정된 태그들의 innerText가 모두 정상 출력될 때까지 대기
   * - 공백, 빈 문자열은 실패로 간주
   * @param page - Playwright Page 객체
   * @param parentSelector - 부모 요소 셀렉터
   * @param tagNames - 자식 태그 이름 목록 (예: ['.item', 'span'])
   * @param timeout - 최대 대기 시간
   * @param interval - 확인 주기
   */
  public static async waitForDataRendered(
    page: Page,
    parentSelector: string,
    tagNames: string[],
    timeout = 10000,
    interval = 500,
    throwOnTimeout = true,
  ): Promise<boolean> {
    const endTime = Date.now() + timeout;

    const isElementValid = async (el: Locator): Promise<boolean> => {
      const text = (await el.innerText()).trim();
      return text.length > 0;
    };

    while (Date.now() < endTime) {
      const allValid = await Promise.all(
        tagNames.map(async tag => {
          const elements = await page.locator(`${parentSelector} ${tag}`).all();
          if (elements.length === 0) return false;

          const validity = await Promise.all(elements.map(isElementValid));
          return validity.every(Boolean);
        }),
      );

      if (allValid.every(Boolean)) return true;

      await this.wait(interval);
    }

    if (throwOnTimeout) {
      throw new Error(
        `Timeout: 태그(${tagNames.join(', ')})들의 innerText가 ${timeout}ms 내에 정상 출력되지 않았습니다.`,
      );
    }

    return false;
  }
}
