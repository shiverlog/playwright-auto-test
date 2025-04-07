/**
 * Description : AssertUtils.ts - 📌 테스트 검증 로직을 모듈화한 유틸리티 클래스
 * Author : Shiwoo Min
 * Date : 2024-04-07
 */
import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

/**
 * Playwright: Assertion 유틸리티 클래스 (인스턴스 기반)
 */
export class AssertUtils {
  constructor(private softAssert: boolean = false) {}

  /**
   *  Playwright: 에러 핸들링
   */
  private handleError(error: unknown) {
    if (!this.softAssert) throw new Error(error instanceof Error ? error.message : String(error));
  }

  /**
   *  Playwright: 조건이 true 인지 확인
   */
  public async assertTrue(condition: boolean, description: string) {
    await test.step(`${description} 가 true 인지 확인`, async () => {
      try {
        expect(condition).toBeTruthy();
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: 조건이 false 인지 확인
   */
  public async assertFalse(condition: boolean, description: string) {
    await test.step(`${description} 이(가) false 인지 확인`, async () => {
      try {
        expect(condition).toBeFalsy();
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: 두 값이 같은지 확인
   */
  public async assertEquals(actual: any, expected: any, description: string) {
    await test.step(`${description} 이(가) '${expected}' 와 동일한지 확인`, async () => {
      try {
        expect(actual).toEqual(expected);
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   * Playwright: 두 값이 다른지 확인
   */
  public async assertNotEquals(actual: any, expected: any, description: string) {
    await test.step(`${description} 이(가) '${expected}' 와 다름을 확인`, async () => {
      try {
        expect(actual).not.toEqual(expected);
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: 문자열 포함 여부 확인
   */
  public async assertContains(value1: string, value2: string, description: string) {
    await test.step(`${description} 에 '${value2}' 포함 여부 확인`, async () => {
      try {
        expect(value1).toContain(value2);
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: 문자열 포함 여부 확인 (대소문자 무시)
   */
  public async assertContainsIgnoreCase(value1: string, value2: string, description: string) {
    await test.step(`${description} 에 '${value2}' 포함 여부 확인 (대소문자 무시)`, async () => {
      try {
        expect(value1.toLowerCase()).toContain(value2.toLowerCase());
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: 문자열 동일 여부 확인 (대소문자 무시)
   */
  public async assertEqualsIgnoreCase(actual: string, expected: string, description: string) {
    await test.step(`${description} 이(가) '${expected}' 와 같은지 확인 (대소문자 무시)`, async () => {
      try {
        expect(actual.toLowerCase()).toEqual(expected.toLowerCase());
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: 문자열이 포함되지 않았는지 확인
   */
  public async assertNotContains(actual: string, expected: string, description: string) {
    await test.step(`${description} 에 '${expected}' 가 포함되지 않았는지 확인`, async () => {
      try {
        expect(actual).not.toContain(expected);
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: 값이 null 인지 확인
   */
  public async assertNull(value: any, description: string) {
    await test.step(`${description} 이(가) null 인지 확인`, async () => {
      try {
        expect(value).toBeNull();
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: 값이 null 이 아닌지 확인
   */
  public async assertNotNull(value: any, description: string) {
    await test.step(`${description} 이(가) null 이 아님을 확인`, async () => {
      try {
        expect(value).not.toBeNull();
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: 값이 undefined 인지 확인
   */
  public async assertUndefined(value: any, description: string) {
    await test.step(`${description} 이(가) undefined 인지 확인`, async () => {
      try {
        expect(value).toBeUndefined();
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: 값이 빈 문자열인지 확인
   */
  public async assertToBeEmpty(value: any, description: string) {
    await test.step(`${description} 이(가) 비어있는지 확인`, async () => {
      try {
        expect(value).toEqual('');
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: Locator가 화면에 보여야 하는지 확인
   */
  public async assertVisible(locator: Locator, description: string) {
    await test.step(`${description} 이(가) 화면에 보여야 함`, async () => {
      try {
        await expect(locator).toBeVisible();
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: Locator가 활성화되어야 하는지 확인
   */
  public async assertEnabled(locator: Locator, description: string) {
    await test.step(`${description} 이(가) 활성화되어야 함`, async () => {
      try {
        await expect(locator).toBeEnabled();
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: Locator의 텍스트가 예상값과 일치하는지 확인
   */
  public async assertText(locator: Locator, expectedText: string, description: string) {
    await test.step(`${description} 의 텍스트가 '${expectedText}' 이어야 함`, async () => {
      try {
        await expect(locator).toHaveText(expectedText);
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: Locator의 속성 값 확인
   */
  public async assertAttribute(
    locator: Locator,
    attr: string,
    expected: string,
    description: string,
  ) {
    await test.step(`${description} 의 속성 '${attr}' 값이 '${expected}' 이어야 함`, async () => {
      try {
        await expect(locator).toHaveAttribute(attr, expected);
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: Locator의 요소 개수 확인
   */
  public async assertCount(locator: Locator, expectedCount: number, description: string) {
    await test.step(`${description} 의 요소 개수가 ${expectedCount} 이어야 함`, async () => {
      try {
        await expect(locator).toHaveCount(expectedCount);
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: 현재 페이지 URL이 예상 URL을 포함하는지 확인
   */
  public async assertUrl(page: Page, expectedUrl: string, description: string) {
    await test.step(`${description} 에서 URL 이 '${expectedUrl}' 인지 확인`, async () => {
      try {
        expect(page.url()).toContain(expectedUrl);
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   *  Playwright: 현재 페이지의 제목이 예상과 일치하는지 확인
   */
  public async assertTitle(page: Page, expectedTitle: string, description: string) {
    await test.step(`${description} 에서 제목이 '${expectedTitle}' 인지 확인`, async () => {
      try {
        expect(await page.title()).toContain(expectedTitle);
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   * 다크모드 등 UI 설정 차이에 따른 텍스트 검증
   * @param locator 요소 Locator
   * @param expectedTextList 기대 텍스트 목록
   */
  public async assertTextAmong(locator: Locator, expectedTextList: string[]): Promise<void> {
    const text = await locator.innerText();
    if (!expectedTextList.some(expected => text.includes(expected))) {
      throw new Error(
        `텍스트 '${text}'가 기대값 ${expectedTextList.join(', ')} 중 어떤 것도 포함하지 않음`,
      );
    }
  }
}
