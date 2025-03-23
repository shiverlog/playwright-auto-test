/**
 * WaitUtils: 정적 대기 유틸리티 클래스
 * (Playwright 또는 Appium 등 환경에 구애받지 않음)
 */
export class WaitUtils {
  /**
   * 특정 시간(ms) 동안 대기
   * @param milliseconds - 대기 시간 (ms)
   */
  public static async wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * 특정 조건이 만족될 때까지 대기
   * @param condition - true를 반환해야 하는 비동기 함수
   * @param timeout - 최대 대기 시간 (기본: 10000ms)
   * @param interval - 확인 주기 (기본: 500ms)
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
   * @param condition - false를 반환해야 하는 비동기 함수
   * @param timeout - 최대 대기 시간 (기본: 10000ms)
   * @param interval - 확인 주기 (기본: 500ms)
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
}
