/**
 * Description : WaitUtils.ts - 📌 정적 대기 유틸리티 클래스
 * Author : Shiwoo Min
 * Date : 2024-04-11
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type { Locator, Page } from '@playwright/test';
import type winston from 'winston';

export class WaitUtils {
  // 현재 POC 타입 (없으면 'ALL')
  private static readonly poc: string = POCEnv.getType() || 'ALL';
  // 해당 테스트의 로거
  private static readonly logger: winston.Logger = Logger.getLogger(this.poc) as winston.Logger;

  /**
   * 특정 시간(ms) 동안 대기
   */
  public static async wait(milliseconds: number): Promise<void> {
    if (process.env.DEBUG_WAIT === 'true') {
      this.logger.debug(`[WaitUtils][${this.poc}] ${milliseconds}ms 동안 대기`);
    }
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
      if (await condition()) {
        if (process.env.DEBUG_WAIT === 'true') {
          this.logger.debug(`[WaitUtils][${this.poc}] 조건이 만족됨`);
        }
        return;
      }

      if (process.env.DEBUG_WAIT === 'true') {
        this.logger.debug(`[WaitUtils][${this.poc}] 조건 미충족, ${interval}ms 후 재시도`);
      }

      await this.wait(interval);
    }

    throw new Error(`[WaitUtils][${this.poc}] Timeout: 조건이 ${timeout}ms 내에 만족되지 않음`);
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
      if (!(await condition())) {
        if (process.env.DEBUG_WAIT === 'true') {
          this.logger.debug(`[WaitUtils][${this.poc}] 조건이 해제됨`);
        }
        return;
      }

      if (process.env.DEBUG_WAIT === 'true') {
        this.logger.debug(`[WaitUtils][${this.poc}] 조건 유지 중, ${interval}ms 후 재시도`);
      }

      await this.wait(interval);
    }

    throw new Error(`[WaitUtils][${this.poc}] Timeout: 조건이 ${timeout}ms 동안 계속 true`);
  }

  /**
   * 특정 부모 아래 지정된 태그들의 innerText가 모두 정상 출력될 때까지 대기
   * - 공백, 빈 문자열은 실패로 간주
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

      if (allValid.every(Boolean)) {
        if (process.env.DEBUG_WAIT === 'true') {
          this.logger.debug(
            `[WaitUtils][${this.poc}] 모든 태그(${tagNames.join(', ')}) 렌더링 완료`,
          );
        }
        return true;
      }

      if (process.env.DEBUG_WAIT === 'true') {
        this.logger.debug(`[WaitUtils][${this.poc}] 렌더링 대기 중...`);
      }

      await this.wait(interval);
    }

    if (throwOnTimeout) {
      throw new Error(
        `[WaitUtils][${this.poc}] Timeout: 태그(${tagNames.join(', ')})의 innerText가 ${timeout}ms 내에 렌더링되지 않음`,
      );
    }

    return false;
  }
}
