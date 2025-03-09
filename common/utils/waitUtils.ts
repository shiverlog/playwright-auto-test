import { Page } from "@playwright/test";

export class WaitUtils {
  /**
   * 특정 요소가 나타날 때까지 대기
   * @param page - Playwright Page 객체
   * @param selector - 대기할 요소 선택자
   * @param timeout - 최대 대기 시간 (기본값: 5000ms)
   */
  public static async waitForElement(page: Page, selector: string, timeout: number = 5000) {
    await page.waitForSelector(selector, { timeout });
  }

  /**
   * 특정 시간 동안 대기 (Sleep)
   * @param milliseconds - 대기할 시간 (ms)
   */
  public static async wait(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  /**
   * 특정 조건이 만족될 때까지 대기
   * @param condition - 만족해야 하는 함수 (true 반환 시 종료)
   * @param timeout - 최대 대기 시간 (기본값: 10000ms)
   * @param interval - 확인 주기 (기본값: 500ms)
   */
  public static async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 10000,
    interval: number = 500
  ) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await condition()) return;
      await this.wait(interval);
    }
    throw new Error("Condition timeout exceeded");
  }
}
