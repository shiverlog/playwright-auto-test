import { POC_PATH, TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants.js';
import { Logger } from '@common/logger/customLogger.js';
import type { POCKey, POCType } from '@common/types/platform-types.js';
import { ALL_POCS } from '@common/types/platform-types.js';
import { Message, PubSub } from '@google-cloud/pubsub';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import * as path from 'path';
import type winston from 'winston';

dotenv.config();

const PROJECT_ID = process.env.PROJECT_ID || 'gc-automation-test';
const SUBSCRIPTION_ID = process.env.SUBSCRIPTION_ID || 'default-subscription-id';
const TIMEOUT = parseInt(process.env.TIMEOUT || '0', 10);

const pubsub = new PubSub({ projectId: PROJECT_ID });
const subscription = pubsub.subscription(SUBSCRIPTION_ID);

/**
 * 개별 POC 스크립트 실행
 */
async function executeScript(poc: POCKey): Promise<void> {
  const logger = Logger.getLogger(poc) as winston.Logger;

  const basePath = POC_PATH(poc);
  const basePathString = Array.isArray(basePath) ? basePath[0] : basePath;
  const resultFiles = TEST_RESULT_FILE_NAME(poc); // 여기서 poc은 POCKey
  const scriptPath = path.resolve(basePathString, resultFiles.playwrightReport[0]);
  const command = `node ${scriptPath}`;

  logger.info(`[Runner] 실행 명령어: ${command}`);

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error(`[Runner] ${poc} 실행 중 오류 발생: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        logger.warn(`[Runner] ${poc} 경고 출력: ${stderr}`);
      }
      logger.info(`[Runner] ${poc} 실행 완료:\n${stdout}`);
      resolve();
    });
  });
}

/**
 * Pub/Sub 메시지 수신 핸들러
 */
const messageHandler = async (message: Message): Promise<void> => {
  const msg = message.data.toString().trim();
  const osType = message.attributes?.os || 'unknown';
  const logger = Logger.getLogger('ALL') as winston.Logger;

  logger.info(`[PubSub] 수신 메시지: '${msg}' (OS: ${osType})`);
  message.ack();

  try {
    if (msg === '' || msg === 'ALL') {
      logger.info(`[Runner] 전체 병렬 실행 시작`);
      await Promise.all(ALL_POCS.map((poc: POCKey) => executeScript(poc)));
      logger.info(`[Runner] 전체 POC 실행 완료`);
    } else if (ALL_POCS.includes(msg as POCKey)) {
      await executeScript(msg as POCKey);
    } else {
      logger.warn(`[Runner] 유효하지 않은 POC 메시지: ${msg}`);
    }
  } catch (error) {
    logger.error(`[Runner] 실행 중 예외 발생:`, error);
  }
};

// 구독 실행
Logger.initAllLoggers();
(Logger.getLogger('ALL') as winston.Logger).info(`[PubSub] Listening on '${SUBSCRIPTION_ID}'...\n`);
subscription.on('message', messageHandler);
subscription.on('error', error =>
  (Logger.getLogger('ALL') as winston.Logger).error(`[PubSub] Subscription error`, error),
);

// 종료 타이머 설정
if (TIMEOUT > 0) {
  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    (Logger.getLogger('ALL') as winston.Logger).info(
      `[PubSub] TIMEOUT(${TIMEOUT}s) 도달, 구독 종료됨.`,
    );
  }, TIMEOUT * 1000);
} else {
  (Logger.getLogger('ALL') as winston.Logger).info(`[PubSub] 무한 실행 모드로 대기 중...`);
}
