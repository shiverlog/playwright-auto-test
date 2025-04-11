/**
 * Description : NetworkUtils.ts - 📌 네트워크 유틸
 * Author : Shiwoo Min
 * Date : 2024-04-11
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type { BrowserContext, Page, Request, Route } from '@playwright/test';
import type winston from 'winston';

export class NetworkUtils {
  private readonly logger: winston.Logger;
  private readonly poc: string;

  constructor(
    private readonly page: Page,
    private readonly context: BrowserContext,
  ) {
    this.poc = POCEnv.getType() || 'ALL';
    this.logger = Logger.getLogger(this.poc) as winston.Logger;
  }

  /**
   * 특정 요청을 차단
   */
  public async blockRequest(urlPattern: string): Promise<void> {
    this.logger.info(`[${this.poc}] [Network] 요청 차단 설정: ${urlPattern}`);
    await this.page.route(urlPattern, route => route.abort());
  }

  /**
   * 요청을 Mock 응답으로 대체
   */
  public async mockResponse(
    urlPattern: string,
    mockedResponse: object,
    status = 200,
  ): Promise<void> {
    this.logger.info(`[${this.poc}] [Network] Mock 응답 설정: ${urlPattern} (status: ${status})`);
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
      this.logger.info(`[${this.poc}] [Request] ${request.method()} ${request.url()}`);
    });
  }

  /**
   * 응답 로그 출력
   */
  public async logResponses(): Promise<void> {
    this.page.on('response', response => {
      this.logger.info(`[${this.poc}] [Response] ${response.status()} ${response.url()}`);
    });
  }

  /**
   * Chromium에서 모은 느린 네트워크 환경 시뮬레이션
   */
  public async emulateSlowNetwork(): Promise<void> {
    this.logger.warn(`[${this.poc}] [Network] 느린 네트워크 시뮬레이션 시작`);
    const client = await this.page.context().newCDPSession(this.page);

    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 200, // ms
      downloadThroughput: (750 * 1024) / 8, // 750 kbps
      uploadThroughput: (250 * 1024) / 8, // 250 kbps
    });

    this.logger.warn(`[${this.poc}] [Network] 느린 네트워크 설정 완료`);
  }
}
