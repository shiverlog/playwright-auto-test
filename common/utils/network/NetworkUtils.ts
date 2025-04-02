import { Logger } from '@common/logger/customLogger';
import { BrowserContext, Page, Request, Route } from '@playwright/test';

export class NetworkUtils {
  constructor(
    private page: Page,
    private context: BrowserContext,
  ) {}

  /**
   * 특정 요청을 차단
   */
  public async blockRequest(urlPattern: string): Promise<void> {
    await this.page.route(urlPattern, route => route.abort());
  }

  /**
   * 특정 요청을 mock 응답으로 대체
   */
  public async mockResponse(
    urlPattern: string,
    mockedResponse: object,
    status = 200,
  ): Promise<void> {
    await this.page.route(urlPattern, async (route: Route) => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(mockedResponse),
      });
    });
  }

  /**
   * 요청 로그 출력
   */
  public async logRequests(): Promise<void> {
    this.page.on('request', (request: Request) => {
      console.log(`[Request] ${request.method()} ${request.url()}`);
    });
  }

  /**
   * 응답 로그 출력
   */
  public async logResponses(): Promise<void> {
    this.page.on('response', response => {
      console.log(`[Response] ${response.status()} ${response.url()}`);
    });
  }

  /**
   * Playwright: 느린 네트워크 시뮬레이션 (Chromium 전용)
   */
  public async emulateSlowNetwork(page: Page): Promise<void> {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 200,
      downloadThroughput: (750 * 1024) / 8,
      uploadThroughput: (250 * 1024) / 8,
    });
  }
}
