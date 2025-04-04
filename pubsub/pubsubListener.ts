/**
 * Description : pubsubTestRunner.ts - 📌 Google Pub/Sub 기반 테스트 실행 소비자
 * Author : Shiwoo Min
 * Date : 2025-04-04
 */
import { FOLDER_PATHS } from '@common/constants/PathConstants.js';
import { Logger } from '@common/logger/customLogger.js';
import type { POCKey, POCType } from '@common/types/platform-types.js';
import { ALL_POCS } from '@common/types/platform-types.js';
import { Message, PubSub } from '@google-cloud/pubsub';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import * as path from 'path';
import type winston from 'winston';





dotenv.config();

// Google Cloud Pub/Sub 환경 설정
const PROJECT_ID = process.env.PROJECT_ID;
const SUBSCRIPTION_ID = process.env.SUBSCRIPTION_ID || 'default-subscription-id';

// Pub/Sub 클라이언트 및 구독 객체 초기화
const pubsub = new PubSub({ projectId: PROJECT_ID });
const subscription = pubsub.subscription(SUBSCRIPTION_ID);

// 각 POC에 대한 테스트 스크립트 경로 설정
const scriptPaths: Record<POCKey, string> = {} as Record<POCKey, string>;
ALL_POCS.forEach((poc: POCKey) => {
  const testPath = FOLDER_PATHS(poc).tests;
  scriptPaths[poc] = Array.isArray(testPath)
    ? path.resolve(...testPath, 'testSuite.spec.ts')
    : path.resolve(testPath, 'testSuite.spec.ts');
});

// POC 유형에 따라 실행 도구 결정 (Playwright 또는 Node)
const isPlaywright = (poc: POCType): boolean => {
  // pc, mw는 Playwright 기반
  return poc === 'PC' || poc === 'MW';
};

/**
 * 개별 테스트 스크립트 실행
 */
async function runTestScript(scriptPath: string, poc: POCType): Promise<void> {
  const command = isPlaywright(poc) ? `npx playwright test ${scriptPath}` : `node ${scriptPath}`;
  const logger = Logger.getLogger(poc) as winston.Logger;

  logger.info(`[TestRunner] 실행 명령어: ${command}`);

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error(`[TestRunner] 오류 발생: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        logger.warn(`[TestRunner] 경고 출력: ${stderr}`);
      }
      logger.info(`[TestRunner] 실행 결과:\n${stdout}`);
      resolve();
    });
  });
}

/**
 * Pub/Sub 메시지 수신 시 실행되는 핸들러
 */
const messageHandler = (message: Message): void => {
  const msg = message.data.toString().trim();
  const logger = Logger.getLogger('ALL') as winston.Logger;

  logger.info(`[PubSub] 수신된 메시지: ${msg}`);

  // 빈 메시지 → 전체 병렬 실행
  if (msg === '') {
    Promise.all(ALL_POCS.map(poc => runTestScript(scriptPaths[poc], poc)))
      .then(() => {
        message.ack();
        logger.info(`[PubSub] 모든 POC 테스트 실행 완료`);
      })
      .catch(error => {
        message.nack();
        logger.error(`[PubSub] 전체 실행 중 오류 발생: ${error}`);
      });
  }

  // 특정 POC만 실행
  else if (ALL_POCS.includes(msg as POCKey)) {
    const poc = msg as POCKey;

    runTestScript(scriptPaths[poc], poc)
      .then(() => {
        message.ack();
        logger.info(`[PubSub] ${poc} 테스트 실행 완료`);
      })
      .catch(error => {
        message.nack();
        logger.error(`[PubSub] ${poc} 실행 중 오류 발생: ${error}`);
      });
  }

  // 유효하지 않은 메시지
  else {
    logger.warn(`[PubSub] 알 수 없는 메시지 유형: ${msg}`);
    message.nack();
  }
};

// Pub/Sub 구독 시작
Logger.initAllLoggers();
(Logger.getLogger('ALL') as winston.Logger).info(`[PubSub] Listening on '${SUBSCRIPTION_ID}'...\n`);
subscription.on('message', messageHandler);
subscription.on('error', error =>
  (Logger.getLogger('ALL') as winston.Logger).error(`[PubSub] Subscription Error: ${error}`),
);
