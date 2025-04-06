/**
 * Description : stealthContext.ts - Playwright용 자동화 감지 우회 유틸리티
 * Author : 자동화 탐지 회피용 유틸
 * Date : 2025-04-05
 */
import { type Browser, type BrowserContext, chromium, type LaunchOptions } from '@playwright/test';

interface StealthContextOptions {
  headless?: boolean;
  locale?: string;
  timezoneId?: string;
  userAgent?: string;
  viewport?: { width: number; height: number };
  storageStatePath?: string;
}

export async function launchStealthBrowser(options: StealthContextOptions = {}): Promise<Browser> {
  const browser = await chromium.launch({
    headless: options.headless ?? false,
    slowMo: 50, // 사람 같은 속도
  });
  return browser;
}

export async function createStealthContext(
  browser: Browser,
  options: StealthContextOptions = {},
): Promise<BrowserContext> {
  const context = await browser.newContext({
    locale: options.locale ?? 'ko-KR',
    timezoneId: options.timezoneId ?? 'Asia/Seoul',
    userAgent:
      options.userAgent ??
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    viewport: options.viewport ?? { width: 1366, height: 768 },
    storageState: options.storageStatePath ? options.storageStatePath : undefined,
  });

  // Stealth 우회 스크립트 삽입
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'languages', { get: () => ['ko-KR', 'ko'] });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
    Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });

    if (!('chrome' in window)) {
      // @ts-ignore
      window.chrome = { runtime: {} };
    }

    Object.defineProperty(navigator, 'connection', {
      get: () => ({
        rtt: 50,
        downlink: 10,
        effectiveType: '4g',
      }),
    });

    Object.defineProperty(window.screen, 'width', { get: () => 1366 });
    Object.defineProperty(window.screen, 'height', { get: () => 768 });

    Object.defineProperty(document, 'visibilityState', {
      get: () => 'visible',
    });

    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = parameters => {
      if (parameters.name === 'notifications') {
        const permission = Notification.permission;
        const mappedState = permission === 'default' ? 'prompt' : permission;

        return Promise.resolve({
          state: mappedState,
          name: 'notifications',
          onchange: null,
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent() {
            return false;
          },
        } as PermissionStatus);
      }
      return originalQuery(parameters);
    };
  });

  return context;
}
