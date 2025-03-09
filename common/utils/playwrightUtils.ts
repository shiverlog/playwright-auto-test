import { Page, Locator, Browser, BrowserContext } from "playwright";
import { test, expect } from "@playwright/test";

/**
 * Playwright - 현재 화면 크기 가져오기
 */
export async function getScreenSize(page: Page): Promise<{ width: number; height: number }> {
  const viewport = page.viewportSize();
  if (!viewport) {
    throw new Error("📏 화면 크기를 가져올 수 없습니다.");
  }
  return { width: viewport.width, height: viewport.height };
}

/**
 * Playwright - 현재 스크롤 위치 가져오기
 */
export async function getCurrentScrollTop(page: Page): Promise<number> {
  return await page.evaluate(() => document.documentElement.scrollTop);
}

/**
 * Playwright - 브라우저 시작 및 페이지 열기 (공통 유틸)
 */
export async function launchBrowser(headless: boolean = true): Promise<{ browser: Browser; context: BrowserContext; page: Page }> {
  const browser = await require("playwright").chromium.launch({ headless });
  const context = await browser.newContext();
  const page = await context.newPage();
  return { browser, context, page };
}

/**
 * 특정 요소를 중앙 좌표 기준으로 클릭 (Playwright)
 * @param page Playwright Page 객체
 * @param locator 클릭할 요소의 Locator
 */
export async function reClick(page: Page, locator: Locator): Promise<void> {
  const boundingBox = await locator.boundingBox();
  if (!boundingBox) {
    throw new Error("🔍 요소의 위치 정보를 가져올 수 없습니다.");
  }

  const x = boundingBox.x + boundingBox.width / 2;
  const y = boundingBox.y + boundingBox.height / 2;

  console.log(`📌 Click at X: ${x}, Y: ${y}`);
  await page.mouse.click(x, y);
}

/**
 * 특정 요소를 중앙 좌표 기준으로 더블 클릭 (Playwright)
 * @param page Playwright Page 객체
 * @param locator 더블 클릭할 요소의 Locator
 */
export async function reDoubleClick(page: Page, locator: Locator): Promise<void> {
  const boundingBox = await locator.boundingBox();
  if (!boundingBox) {
    throw new Error("🔍 요소의 위치 정보를 가져올 수 없습니다.");
  }

  const x = boundingBox.x + boundingBox.width / 2;
  const y = boundingBox.y + boundingBox.height / 2;

  console.log(`📌 Double Click at X: ${x}, Y: ${y}`);
  await page.mouse.click(x, y, { clickCount: 2 });
}

/**
 * Playwright - 특정 요소가 화면에 나타날 때까지 대기
 * @param page Playwright Page 객체
 * @param selector 확인할 요소의 CSS 또는 XPath 선택자
 */
export async function waitForElementVisible(page: Page, selector: string): Promise<void> {
  await page.waitForSelector(selector, { state: "visible" });
}

/**
 * 특정 요소를 스크롤하여 중앙으로 정렬
 * @param page Playwright Page 객체
 * @param selector 스크롤할 요소의 CSS 선택자
 */
export async function scrollToElement(page: Page, selector: string): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * 요소가 특정 텍스트를 포함하는지 확인
 * @param page Playwright Page 객체
 * @param selector 요소의 CSS 선택자
 * @param text 포함되어야 하는 텍스트
 */
export async function verifyTextInElement(page: Page, selector: string, text: string): Promise<boolean> {
  const elementText = await page.locator(selector).innerText();
  return elementText.includes(text);
}

/**
 * 새 탭을 열고 특정 URL로 이동
 * @param context Playwright BrowserContext 객체
 * @param url 이동할 URL
 */
export async function openNewTab(context: BrowserContext, url: string): Promise<Page> {
  const newPage = await context.newPage();
  await newPage.goto(url);
  return newPage;
}

/**
 * 특정 키보드 입력을 실행
 * @param page Playwright Page 객체
 * @param key 입력할 키 (예: "Enter", "Escape", "ArrowDown" 등)
 */
export async function pressKey(page: Page, key: string): Promise<void> {
  await page.keyboard.press(key);
}
