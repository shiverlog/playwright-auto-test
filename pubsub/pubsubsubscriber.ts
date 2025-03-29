import {
  ALL_POCS,
  POCType,
  POC_PATH,
  TEST_RESULT_FILE_NAME,
} from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import { runBatchScript } from '@common/utils/scriptRunner';
import { Message, PubSub } from '@google-cloud/pubsub';
import * as subprocess from 'child_process';
// scriptRunner.ts에서 실행 함수 가져오기

import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

// Google Cloud Pub/Sub 설정
const PROJECT_ID = process.env.PROJECT_ID || 'gc-automation-test';
const SUBSCRIPTION_ID = process.env.SUBSCRIPTION_ID || 'default-subscription-id';
const NUM_MESSAGES = parseInt(process.env.NUM_MESSAGES || '3', 10);
const TIMEOUT = parseInt(process.env.TIMEOUT || '0', 10); // TIMEOUT 환경 변수 추가

const pubsub = new PubSub({ projectId: PROJECT_ID });
const subscription = pubsub.subscription(SUBSCRIPTION_ID);

/**
 * 특정 POC에 대해 테스트를 실행하는 함수
 * @param poc 실행할 POC
 */
async function runTest(poc: POCType) {
  const logger = Logger.getLogger(poc);
  logger.info(`POC: ${poc} - 테스트 실행 중`);

  // 스크립트 실행
  try {
    await runBatchScript(poc); // `scriptRunner.ts`의 `runBatchScript` 사용
    logger.info(`${poc} POC 실행 완료`);
  } catch (error) {
    logger.error(`${poc} POC 실행 중 오류 발생:`, error);
  }
}

/**
 * 메시지를 수신하면 실행할 콜백 함수
 * @param message Pub/Sub 메시지 객체
 */
const messageHandler = async (message: Message): Promise<void> => {
  const msg = message.data.toString().trim();
  const osType = message.attributes?.os || 'unknown';

  console.log(`메시지 수신: ${msg} (OS: ${osType})`);
  message.ack();

  if (msg === '') {
    // 모든 POC에 대해 병렬로 실행
    await Promise.all(ALL_POCS.map(poc => runTest(poc)));
    console.log(`모든 POC 실행 완료`);
  } else if (ALL_POCS.includes(msg as Exclude<POCType, ''>)) {
    await runTest(msg as POCType);
    console.log(`${msg} 실행 완료`);
  } else {
    console.log(`유효하지 않은 메시지: ${msg}`);
  }
};

// 메시지 수신 시작
console.log(`Listening for messages on '${SUBSCRIPTION_ID}'...\n`);
subscription.on('message', messageHandler);

/**
 * 오류 처리
 */
subscription.on('error', error => {
  console.error(`Subscription error: ${error}`);
});

/**
 * 특정 시간 후 구독 종료 (TIMEOUT이 0이면 계속 실행)
 */
if (TIMEOUT > 0) {
  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log('Subscription closed.');
  }, TIMEOUT * 1000);
} else {
  console.log('Subscription will continue running indefinitely.');
}
