import { expect, Page } from '@playwright/test';
import { speedtestUrls } from '@speedtest/config/speedtestUrls';
import { AuthPage } from '@speedtest/src/pages/AuthPage.js';
import { RedirectPage } from '@speedtest/src/pages/RedirectPage.js';

const CARRIER_CREDENTIALS = {
  uplus: { id: process.env.UPLUS_ID!, pw: process.env.UPLUS_PW! },
  kt: { id: process.env.KT_ID!, pw: process.env.KT_PW! },
  skt: { id: process.env.SKT_ID!, pw: process.env.SKT_PW! },
};

const carrierMap = {
  uplus: 'lg',
  kt: 'kt',
  skt: 'skt',
} as const;

type CarrierType = keyof typeof CARRIER_CREDENTIALS;

export class RedirectSteps {
  private authPage: AuthPage;
  private redirectPage: RedirectPage;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.authPage = new AuthPage(page);
    this.redirectPage = new RedirectPage(page);
  }

  async loginAndCheckRedirect(carrier: CarrierType): Promise<void> {
    const { id, pw } = CARRIER_CREDENTIALS[carrier];
    const loggedIn = await this.authPage.loginByCarrier(carrier, id, pw);
    expect(loggedIn).toBeTruthy();

    const redirectedUrl = await this.redirectPage.getRedirectedUrl();
    expect(redirectedUrl).toContain(new URL(speedtestUrls[carrierMap[carrier]].main).host);

    console.log(`${carrier.toUpperCase()} 최종 URL:`, redirectedUrl);
  }

  async performRedirect(urls: string[]): Promise<void> {
    for (const url of urls) {
      await this.redirectPage.navigateTo(url);
    }
  }

  async waitForRedirectElement(selector: string): Promise<void> {
    await this.page.waitForSelector(selector, { timeout: 10000 });
  }

  async measurePerformance(urls: string[]): Promise<void> {
    for (const url of urls) {
      const dclTime = await this.redirectPage.measureDCL(url);
      const lcpTime = await this.redirectPage.measureLCP(url);
      const loadTime = await this.redirectPage.measureLoadTime(url);

      console.log(`${url} => DCL: ${dclTime}s | LCP: ${lcpTime}s | Load: ${loadTime}s`);
    }
  }
}
