/**
 * Description : StealthContext.ts - 📌 Playwright용 자동화 감지 우회 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { Logger } from '@common/logger/customLogger';
import type { StealthContextOptions } from '@common/types/stealth-context';
import { POCEnv } from '@common/utils/env/POCEnv';
import { type Browser, type BrowserContext, chromium } from '@playwright/test';
import type winston from 'winston';

export class StealthContext {
  private readonly poc: string;
  private readonly logger: winston.Logger;

  constructor(private readonly options: StealthContextOptions = {}) {
    this.poc = POCEnv.getType();
    this.logger = Logger.getLogger(this.poc.toUpperCase()) as winston.Logger;
  }

  /**
   * Stealth 메지에 맞게 Chromium 브라우저 실행
   */
  public async launchBrowser(): Promise<Browser> {
    this.logger.info(`[StealthContext][${this.poc}] Chromium 브라우저 실행 (Stealth 모드)`);
    return await chromium.launch({
      headless: this.options.headless ?? false,
      slowMo: 50,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--disable-dev-shm-usage',
        '--no-sandbox',
      ],
    });
  }

  /**
   * Stealth 우회 설정이 적용된 Playwright Context 생성
   */
  public async createContext(browser: Browser): Promise<BrowserContext> {
    this.logger.info(`[StealthContext][${this.poc}] Stealth Context 생성 시작`);

    const platform = this.options.platform;

    let userAgent = this.options.userAgent;
    let viewport = this.options.viewport;
    let isMobile = false;
    let hasTouch = false;
    let deviceScaleFactor = this.options.deviceScaleFactor ?? 1;

    if (!userAgent || !viewport) {
      switch (platform) {
        case 'PC_WEB':
        default:
          userAgent ??=
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
          viewport ??= undefined;
          deviceScaleFactor = 1;
          break;
        case 'MOBILE_WEB':
          userAgent ??=
            'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36';
          viewport ??= { width: 414, height: 896 };
          isMobile = true;
          hasTouch = true;
          deviceScaleFactor = 3;
          break;
        case 'ANDROID_APP':
          userAgent ??=
            'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36';
          viewport ??= { width: 412, height: 915 };
          isMobile = true;
          hasTouch = true;
          deviceScaleFactor = 3;
          break;
        case 'IOS_APP':
          userAgent ??=
            'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile Safari/604.1';
          viewport ??= { width: 390, height: 844 };
          isMobile = true;
          hasTouch = true;
          deviceScaleFactor = 3;
          break;
      }
    }

    const context = await browser.newContext({
      locale: this.options.locale ?? 'ko-KR',
      timezoneId: this.options.timezoneId ?? 'Asia/Seoul',
      userAgent,
      viewport,
      isMobile,
      hasTouch,
      deviceScaleFactor,
      storageState: this.options.storageStatePath ?? undefined,
    });

    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'languages', { get: () => ['ko-KR', 'ko'] });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });

      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => (isMobile ? 4 : 8),
      });
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => (isMobile ? 4 : 8),
      });

      Object.defineProperty(window.screen, 'width', {
        get: () => viewport?.width ?? 1366,
      });
      Object.defineProperty(window.screen, 'height', {
        get: () => viewport?.height ?? 768,
      });

      Object.defineProperty(navigator, 'connection', {
        get: () => ({
          rtt: isMobile ? 100 : 50,
          downlink: isMobile ? 5 : 10,
          effectiveType: '4g',
        }),
      });

      Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });

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

      if (!('chrome' in window)) {
        // @ts-ignore
        window.chrome = { runtime: {} };
      }
    });

    this.logger.info(`[StealthContext][${this.poc}] Stealth Context 생성 완료`);
    return context;
  }
}
