/**
 * Description : StealthContext.ts - 📌 Playwright용 자동화 감지 우회 유틸리티 (클래스 기반)
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { Logger } from '@common/logger/customLogger';
import type { StealthContextOptions } from '@common/types/stealth-context';
import { POCEnv } from '@common/utils/env/POCEnv';
import { type Browser, type BrowserContext, chromium } from '@playwright/test';
import type winston from 'winston';

export class StealthContext {
  /** 옵션 정보 */
  constructor(private readonly options: StealthContextOptions = {}) {}

  /** 현재 POC 동적 추출 */
  private get poc(): string {
    return POCEnv.getType() || 'ALL';
  }

  /** 로깅 인스턴스 */
  private get logger(): winston.Logger {
    return Logger.getLogger(this.poc) as winston.Logger;
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

    const context = await browser.newContext({
      locale: this.options.locale ?? 'ko-KR',
      timezoneId: this.options.timezoneId ?? 'Asia/Seoul',
      userAgent:
        this.options.userAgent ??
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      viewport: this.options.viewport ?? { width: 1366, height: 768 },
      storageState: this.options.storageStatePath ?? undefined,
    });

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
        get: () => ({ rtt: 50, downlink: 10, effectiveType: '4g' }),
      });

      Object.defineProperty(window.screen, 'width', { get: () => 1366 });
      Object.defineProperty(window.screen, 'height', { get: () => 768 });
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
    });

    this.logger.info(`[StealthContext][${this.poc}] Stealth Context 생성 완료`);
    return context;
  }
}
