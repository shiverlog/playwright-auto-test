/**
 * Description : pubsubPull.ts - 📌 Pub/Sub Pull 방식 테스트 실행 소비자
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

// Pub/Sub 설정: 프로젝트 ID 및 구독 ID는 환경 변수에서 불러옴
const PROJECT_ID = process.env.PROJECT_ID || 'default-project-id';
const SUBSCRIPTION_ID = process.env.SUBSCRIPTION_ID || 'default-subscription-id';
const NUM_MESSAGES = parseInt(process.env.NUM_MESSAGES || '3', 10);

// Google Cloud Pub/Sub 클라이언트 생성 및 구독 객체 생성
const pubsub = new PubSub({ projectId: PROJECT_ID });
const subscription = pubsub.subscription(SUBSCRIPTION_ID);

// POC별 테스트 스크립트 경로 매핑
const scriptPaths: Record<POCKey, string> = {} as Record<POCKey, string>;
ALL_POCS.forEach((poc: POCKey) => {
  const testPath = FOLDER_PATHS(poc).tests;
  scriptPaths[poc] = Array.isArray(testPath)
    ? path.resolve(...testPath, 'testSuite.spec.ts')
    : path.resolve(testPath, 'testSuite.spec.ts');
});

// POC → Playwright 여부 판단
const isPlaywrightPOC = (poc: POCType): boolean => poc === 'PC' || poc === 'MW';

/**
 * 테스트 스크립트 실행 함수
 * @param scriptPath 실행할 스크립트 경로
 * @param isPlaywright Playwright 기반 여부
 * @param poc 현재 실행 중인 POC
 */
async function runTestScript(
  scriptPath: string,
  isPlaywright: boolean,
  poc: POCType,
): Promise<void> {
  const command = isPlaywright ? `npx playwright test ${scriptPath}` : `node ${scriptPath}`;
  const logger = Logger.getLogger(poc) as winston.Logger;

  logger.info(`[Runner] 실행 명령어: ${command} (${poc})`);

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error(`[Runner] 오류 발생: ${error.message} (${poc})`);
        return reject(error);
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
 * Pub/Sub 메시지 수신 핸들러
 * @param message Google Cloud Pub/Sub 메시지
 */
const messageHandler = async (message: Message): Promise<void> => {
  const msg = message.data.toString().trim();
  const logger = Logger.getLogger('ALL') as winston.Logger;

  logger.info(`[PubSub] 수신된 메시지: ${msg}`);

  try {
    if (msg === '') {
      // 빈 메시지: 설정된 개수만큼 POC 병렬 실행
      await Promise.all(
        ALL_POCS.slice(0, NUM_MESSAGES).map((poc: POCKey) =>
          runTestScript(scriptPaths[poc], isPlaywrightPOC(poc), poc),
        ),
      );
      message.ack();
      logger.info(`[PubSub] ${NUM_MESSAGES}개 POC 테스트 실행 완료`);
    } else if (ALL_POCS.includes(msg as POCKey)) {
      // 특정 POC만 실행
      const poc = msg as POCKey;
      await runTestScript(scriptPaths[poc], isPlaywrightPOC(poc), poc);
      message.ack();
      logger.info(`[PubSub] ${poc} 테스트 실행 완료`);
    } else {
      logger.warn(`[PubSub] 알 수 없는 메시지 유형: ${msg}`);
      message.nack();
    }
  } catch (error) {
    logger.error(`[PubSub] 테스트 실행 중 예외 발생: ${error}`);
    message.nack();
  }
};

// Pub/Sub 구독 시작
Logger.initAllLoggers();
(Logger.getLogger('ALL') as winston.Logger).info(`[PubSub] Listening on '${SUBSCRIPTION_ID}'...\n`);
subscription.on('message', messageHandler);
subscription.on('error', error =>
  (Logger.getLogger('ALL') as winston.Logger).error(`[PubSub] Subscription error: ${error}`),
);
