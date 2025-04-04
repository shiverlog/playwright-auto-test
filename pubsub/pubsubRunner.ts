/**
 * Description : pubsubRunner.ts - 📌 Google Pub/Sub 기반 테스트 실행 스크립트 (단일 또는 전체 실행)
 * Author : Shiwoo Min
 * Date : 2025-04-04
 */
import { FOLDER_PATHS, POC_PATH, TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants.js';
import { Logger } from '@common/logger/customLogger.js';
import type { POCKey, POCType } from '@common/types/platform-types.js';
import { ALL_POCS } from '@common/types/platform-types.js';
import { Message, PubSub } from '@google-cloud/pubsub';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import * as path from 'path';
import type winston from 'winston';

dotenv.config();

// Google Cloud Pub/Sub 설정
const PROJECT_ID = process.env.PROJECT_ID || 'gc-automation-test';
const SUBSCRIPTION_ID = process.env.SUBSCRIPTION_ID || 'default-subscription-id';

const pubsub = new PubSub({ projectId: PROJECT_ID });
const subscription = pubsub.subscription(SUBSCRIPTION_ID);

/**
 * 테스트 스크립트 실행 함수
 * @param poc 실행할 POC 키 (빈 문자열 또는 'ALL'은 전체 병렬 실행)
 */
async function runTestScript(poc: POCType): Promise<void> {
  const logger = Logger.getLogger(poc) as winston.Logger;

  if (poc === 'ALL') {
    logger.info(`[Runner] 'ALL' 요청 수신 - 모든 POC 병렬 실행 시작`);

    await Promise.all(
      ALL_POCS.map(async (key: POCKey) => {
        const innerLogger = Logger.getLogger(key) as winston.Logger;
        const basePath = POC_PATH(key);
        const basePathString = Array.isArray(basePath) ? basePath[0] : basePath;
        const resultFiles = TEST_RESULT_FILE_NAME(key);
        const reportPath = Array.isArray(resultFiles.playwrightReport)
          ? resultFiles.playwrightReport[0]
          : resultFiles.playwrightReport;
        const scriptPath = path.resolve(basePathString, reportPath);
        const command = `node ${scriptPath}`;

        innerLogger.info(`[Runner] 실행 명령어: ${command}`);
        return new Promise<void>((resolve, reject) => {
          exec(command, (error, stdout, stderr) => {
            if (error) {
              innerLogger.error(`[Runner] 오류 발생: ${error.message} (${key})`);
              reject(error);
              return;
            }
            if (stderr) {
              innerLogger.warn(`[Runner] 경고 출력: ${stderr} (${key})`);
            }
            innerLogger.info(`[Runner] 실행 완료:\n${stdout} (${key})`);
            resolve();
          });
        });
      }),
    );

    return;
  }

  if (!ALL_POCS.includes(poc as POCKey)) {
    logger.error(`[Runner] 유효하지 않은 POC: ${poc}`);
    return;
  }

  const pocKey = poc as POCKey;
  const basePath = POC_PATH(pocKey);
  const basePathString = Array.isArray(basePath) ? basePath[0] : basePath;
  const resultFiles = TEST_RESULT_FILE_NAME(pocKey);
  const reportPath = Array.isArray(resultFiles.playwrightReport)
    ? resultFiles.playwrightReport[0]
    : resultFiles.playwrightReport;
  const scriptPath = path.resolve(basePathString, reportPath);
  const command = `node ${scriptPath}`;

  logger.info(`[Runner] 실행 명령어: ${command}`);
  return new Promise<void>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error(`[Runner] 오류 발생: ${error.message} (${poc})`);
        reject(error);
        return;
      }
      if (stderr) {
        logger.warn(`[Runner] 경고 출력: ${stderr} (${poc})`);
      }
      logger.info(`[Runner] 실행 완료:\n${stdout} (${poc})`);
      resolve();
    });
  });
}

/**
 * Pub/Sub 메시지 처리 함수
 */
const messageHandler = async (message: Message): Promise<void> => {
  const msg = message.data.toString().trim();
  const osType = message.attributes?.os || 'unknown';
  const logger = Logger.getLogger('ALL') as winston.Logger;

  logger.info(`[PubSub] 수신된 메시지: ${msg} (OS: ${osType})`);
  message.ack();

  try {
    const poc = (msg === '' ? 'ALL' : msg) as POCType;
    await runTestScript(poc);
  } catch (error) {
    logger.error(`[PubSub] 실행 중 오류 발생: ${error}`);
  }
};

// Pub/Sub 구독 시작
Logger.initAllLoggers();
(Logger.getLogger('ALL') as winston.Logger).info(`[PubSub] Listening on '${SUBSCRIPTION_ID}'...\n`);
subscription.on('message', messageHandler);
subscription.on('error', error =>
  (Logger.getLogger('ALL') as winston.Logger).error(`[PubSub] Subscription error: ${error}`),
);
