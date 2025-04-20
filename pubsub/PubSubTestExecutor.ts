/**
 * Description : PubSubTestExecutor.ts - 📌 Google Cloud Pub/Sub 기반 테스트 실행 통합 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-18
 */
import { FOLDER_PATHS, POC_PATH, TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants.js';
import { Logger } from '@common/logger/customLogger.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import { Message, PubSub, Subscription } from '@google-cloud/pubsub';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import * as path from 'path';
import type winston from 'winston';

dotenv.config();

export class PubSubTestExecutor {
  // 환경 설정값
  private readonly projectId: string;
  private readonly subscriptionId: string;
  private readonly timeout: number;

  // Pub/Sub 클라이언트 및 구독 객체
  private readonly pubsub: PubSub;
  private readonly subscription: Subscription;

  // 공통 로거 및 스크립트 경로
  private readonly logger: winston.Logger;
  private readonly scriptPaths: Record<string, string>;

  constructor(timeout = 0) {
    this.projectId = process.env.PROJECT_ID || 'gc-automation-test';
    this.subscriptionId = process.env.SUBSCRIPTION_ID || 'default-subscription-id';
    this.timeout = timeout;
    this.pubsub = new PubSub({ projectId: this.projectId });
    this.subscription = this.pubsub.subscription(this.subscriptionId);
    Logger.initAllLoggers();
    this.logger = Logger.getLogger('ALL') as winston.Logger;
    this.scriptPaths = {} as Record<string, string>;

    // POC별 테스트 스크립트 경로 설정
    const pocList = POCEnv.getPOCKeyList();
    pocList.forEach((poc: string) => {
      const testPath = FOLDER_PATHS(poc).tests;
      this.scriptPaths[poc] = Array.isArray(testPath)
        ? path.resolve(...testPath, 'testSuite.spec.ts')
        : path.resolve(testPath, 'testSuite.spec.ts');
    });
  }

  /**
   * Pub/Sub 구독 시작
   */
  public start(): void {
    this.logger.info(`[PubSub] Listening on '${this.subscriptionId}'...`);
    this.subscription.on('message', this.handleMessage.bind(this));
    this.subscription.on('error', this.handleError.bind(this));

    // TIMEOUT 설정 시 일정 시간 후 구독 종료
    if (this.timeout > 0) {
      setTimeout(() => {
        this.subscription.removeListener('message', this.handleMessage.bind(this));
        this.logger.info(`[PubSub] TIMEOUT(${this.timeout}s) 도달, 구독 종료됨.`);
      }, this.timeout * 1000);
    } else {
      this.logger.info(`[PubSub] 무한 실행 모드로 대기 중...`);
    }
  }

  /**
   * Pub/Sub 메시지 핸들러
   */
  private async handleMessage(message: Message): Promise<void> {
    const msg = message.data.toString().trim();
    const osType = message.attributes?.os || 'unknown';
    this.logger.info(`[PubSub] 수신된 메시지: '${msg}' (OS: ${osType})`);
    message.ack();

    try {
      const pocList = POCEnv.getPOCKeyList();
      // 전체 실행
      if (msg === '' || msg.toUpperCase() === 'ALL') {
        await Promise.all(pocList.map(poc => this.executeScript(poc)));
        this.logger.info(`[Runner] 전체 POC 실행 완료`);
      }
      // 단일 POC 실행
      else if (pocList.includes(msg)) {
        await this.executeScript(msg);
        this.logger.info(`[Runner] ${msg} 실행 완료`);
      }
      // 유효하지 않은 메시지
      else {
        this.logger.warn(`[Runner] 유효하지 않은 POC 메시지: ${msg}`);
      }
    } catch (error) {
      this.logger.error(`[Runner] 실행 중 예외 발생:`, error);
    }
  }

  /**
   * 개별 테스트 스크립트 실행 함수
   */
  private async executeScript(poc: string): Promise<void> {
    const logger = Logger.getLogger(poc) as winston.Logger;
    const basePath = POC_PATH(poc);
    const basePathString = Array.isArray(basePath) ? basePath[0] : basePath;
    const resultFiles = TEST_RESULT_FILE_NAME(poc);
    const scriptPath = path.resolve(basePathString, resultFiles.playwrightReport[0]);

    const isPlaywright = poc === 'PC' || poc === 'MW';
    const command = isPlaywright ? `npx playwright test ${scriptPath}` : `node ${scriptPath}`;

    this.logger.info(`[Runner] 실행 명령어: ${command}`);
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          this.logger.error(`[Runner] ${poc} 실행 오류: ${error.message}`);
          return reject(error);
        }
        if (stderr) {
          this.logger.warn(`[Runner] ${poc} 경고 출력: ${stderr}`);
        }
        this.logger.info(`[Runner] ${poc} 실행 완료:\n${stdout}`);
        resolve();
      });
    });
  }

  /**
   * Pub/Sub 에러 핸들러
   */
  private handleError(error: Error): void {
    this.logger.error(`[PubSub] Subscription Error:`, error);
  }
}

// 실행부
if (process.env.NODE_ENV !== 'test') {
  const timeout = parseInt(process.env.TIMEOUT || '0', 10);
  new PubSubTestExecutor(timeout).start();
}
