import { Logger } from '@common/logger/customLogger';
import { Locator, Page, expect } from '@playwright/test';

/**
 * Appium 및 Playwright 공통 유틸리티 클래스
 */
export class AppiumUtils {
  private page: Page;
  private driver: WebdriverIO.Browser;

  constructor(page: Page, driver: WebdriverIO.Browser) {
    this.page = page;
    this.driver = driver;
  }

  /**
   * Playwright: 요소 찾기
   */
  async findElement(selector: string): Promise<Locator> {
    return this.page.locator(selector);
  }

  /**
   * Playwright: 보이는 요소 찾기
   */
  async findVisibleElement(selector: string): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    return element;
  }

  /**
   * Playwright: 클릭 가능한 요소 찾기
   */
  async findClickableElement(selector: string): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    return element;
  }

  /**
   * Playwright: 요소 클릭
   */
  async click(selector: string): Promise<void> {
    const element = await this.findClickableElement(selector);
    await element.click();
  }

  /**
   * Playwright: 요소에 텍스트 입력
   */
  async enterText(selector: string, text: string): Promise<void> {
    const element = await this.findElement(selector);
    await element.fill(text);
  }

  /**
   * Appium: 요소 찾기 (네이티브 앱)
   */
  async findAppiumElement(selector: string): Promise<WebdriverIO.Element> {
    return (await this.driver.$(selector)) as unknown as WebdriverIO.Element;
  }

  /**
   * Appium: 요소 클릭
   */
  async clickAppiumElement(selector: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element.click();
  }

  /**
   * Appium: 요소에 텍스트 입력
   */
  async enterTextAppium(selector: string, text: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element.setValue(text);
  }

  /**
   * Appium: 요소의 텍스트 가져오기
   */
  async getTextAppium(selector: string): Promise<string> {
    const element = await this.findAppiumElement(selector);
    return await element.getText();
  }

  /**
   * Appium: 특정 요소까지 스크롤
   */
  async scrollToAppiumElement(selector: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element.scrollIntoView();
  }

  /**
   * Playwright: 특정 요소까지 스크롤
   */
  async scrollToElement(selector: string): Promise<void> {
    const element = await this.findElement(selector);
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Playwright: 특정 요소가 나타날 때까지 대기
   */
  async waitForElementToAppear(selector: string, timeout = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Playwright: 특정 요소가 사라질 때까지 대기
   */
  async waitForElementToDisappear(selector: string, timeout = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  /**
   * Playwright: 새 창(탭)으로 전환
   */
  async switchToNewWindow(): Promise<void> {
    const pages = this.page.context().pages();
    const newPage = pages[pages.length - 1];
    await newPage.bringToFront();
  }

  /**
   * Playwright: 요소가 활성화 상태인지 확인
   */
  async isElementEnabled(selector: string): Promise<boolean> {
    return this.page.locator(selector).isEnabled();
  }

  /**
   * Appium: 네이티브 앱 요소 활성화 여부 확인
   */
  async isAppiumElementEnabled(selector: string): Promise<boolean> {
    const element = await this.findAppiumElement(selector);
    return await element.isEnabled();
  }

  /**
   * Playwright: 요소가 선택 상태인지 확인
   */
  async isElementSelected(selector: string): Promise<boolean> {
    return this.page.locator(selector).isChecked();
  }

  /**
   * Appium: 드롭다운에서 옵션 선택
   */
  async selectAppiumOption(selector: string, value: string): Promise<void> {
    const dropdown = await this.findAppiumElement(selector);
    await dropdown.selectByVisibleText(value);
  }

  /**
   * Playwright: 드롭다운에서 옵션 선택
   */
  async selectOption(selector: string, value: string): Promise<void> {
    const dropdown = await this.findElement(selector);
    await dropdown.selectOption(value);
  }

  /**
   * Playwright Test의 Expect API로 요소 검증
   */
  async expectToBeVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async expectToHaveText(selector: string, expectedText: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(expectedText);
  }

  async expectToBeChecked(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeChecked();
  }

  async expectToBeEnabled(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeEnabled();
  }
}
