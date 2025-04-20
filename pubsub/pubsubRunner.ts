/**
 * Description : pubsubRunner.ts - 📌 Google Pub/Sub 기반 테스트 실행 스크립트 (단일 또는 전체 실행)
 * Author : Shiwoo Min
 * Date : 2025-04-18
 */
import { POC_PATH, TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants.js';
import { Logger } from '@common/logger/customLogger.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import { Message, PubSub, Subscription } from '@google-cloud/pubsub';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import * as path from 'path';
import type winston from 'winston';

dotenv.config();

export class PubSubRunner {
  private readonly projectId: string;
  private readonly subscriptionId: string;
  private readonly pubsub: PubSub;
  private readonly subscription: Subscription;
  private readonly logger: winston.Logger;

  constructor() {
    // 환경 변수 초기화 및 PubSub 설정
    this.projectId = process.env.PROJECT_ID || 'gc-automation-test';
    this.subscriptionId = process.env.SUBSCRIPTION_ID || 'default-subscription-id';
    this.pubsub = new PubSub({ projectId: this.projectId });
    this.subscription = this.pubsub.subscription(this.subscriptionId);

    // 로거 초기화
    Logger.initAllLoggers();
    this.logger = Logger.getLogger('ALL') as winston.Logger;
  }

  /**
   * Pub/Sub 구독 시작
   */
  public start(): void {
    this.logger.info(`[PubSub] Listening on '${this.subscriptionId}'...\n`);
    this.subscription.on('message', this.handleMessage.bind(this));
    this.subscription.on('error', this.handleError.bind(this));
  }

  /**
   * Pub/Sub 메시지 처리 함수
   */
  private async handleMessage(message: Message): Promise<void> {
    const poc = message.data.toString().trim();
    const osType = message.attributes?.os || 'unknown';

    this.logger.info(`[PubSub] 수신된 메시지: ${poc} (OS: ${osType})`);
    message.ack();

    try {
      await this.runTestScript(poc);
    } catch (error) {
      this.logger.error(`[PubSub] 실행 중 오류 발생: ${error}`);
    }
  }

  /**
   * Pub/Sub 에러 처리 함수
   */
  private handleError(error: Error): void {
    this.logger.error(`[PubSub] Subscription error: ${error}`);
  }

  /**
   * 테스트 스크립트 실행 함수
   */
  private async runTestScript(poc: string): Promise<void> {
    const upperPoc = poc.toUpperCase();

    // 전체 실행인 경우
    if (upperPoc === 'ALL') {
      this.logger.info(`[Runner] 모든 POC 병렬 실행 시작`);
      const pocKeys = POCEnv.getPOCKeyList();
      // promise.all 사용하여 병렬처리
      await Promise.all(pocKeys.map(key => this.runSingleScript(key)));
    } else {
      // 단일 POC 실행
      await this.runSingleScript(upperPoc);
    }
  }

  /**
   * 개별 스크립트 실행 함수
   */
  private runSingleScript(poc: string): Promise<void> {
    const basePath = POC_PATH(poc);
    const basePathString = Array.isArray(basePath) ? basePath[0] : basePath;
    const resultFiles = TEST_RESULT_FILE_NAME(poc);
    const reportPath = Array.isArray(resultFiles.playwrightReport)
      ? resultFiles.playwrightReport[0]
      : resultFiles.playwrightReport;
    const scriptPath = path.resolve(basePathString, reportPath);
    const command = `node ${scriptPath}`;

    this.logger.info(`[Runner] 실행 명령어: ${command}`);
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          this.logger.error(`[Runner] 오류 발생: ${error.message} (${poc})`);
          reject(error);
          return;
        }
        if (stderr) {
          this.logger.warn(`[Runner] 경고 출력: ${stderr} (${poc})`);
        }
        this.logger.info(`[Runner] 실행 완료:\n${stdout} (${poc})`);
        resolve();
      });
    });
  }
}

// 실행부
const runner = new PubSubRunner();
runner.start();
