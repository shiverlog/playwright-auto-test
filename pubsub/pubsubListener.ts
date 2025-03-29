import { ALL_POCS, FOLDER_PATHS, POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import { Message, PubSub } from '@google-cloud/pubsub';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

// Google Cloud Pub/Sub 설정
const PROJECT_ID = process.env.PROJECT_ID;
const SUBSCRIPTION_ID = process.env.SUBSCRIPTION_ID || 'default-subscription-id';
const pubsub = new PubSub({ projectId: PROJECT_ID });
const subscription = pubsub.subscription(SUBSCRIPTION_ID);

// 각 POCType에 대해 경로를 설정
const scriptPaths: Record<Exclude<POCType, ''>, string> = {} as Record<
  Exclude<POCType, ''>,
  string
>;

// ALL_POCS 배열을 사용하여 각 POC에 대해 경로 설정
ALL_POCS.forEach(poc => {
  scriptPaths[poc] = path.resolve(FOLDER_PATHS(poc).tests, 'testSuite.spec.ts');
});

// POC 유형에 따라 Playwright 또는 Appium 여부를 결정하는 함수
const isPlaywright = (poc: POCType): boolean => {
  return poc === 'pc' || poc === 'mw'; // Playwright가 실행되는 POC
};

/**
 * 특정 스크립트 비동기 처리
 */
async function runTestScript(scriptPath: string, poc: POCType): Promise<void> {
  const command = isPlaywright(poc) ? `npx playwright test ${scriptPath}` : `node ${scriptPath}`;
  const logger = Logger.getLogger(poc);

  logger.info(`실행 중: ${command} (${poc})`);

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error(`오류 발생: ${error.message} (${poc})`);
        reject(error);
        return;
      }
      if (stderr) {
        logger.warn(`경고: ${stderr} (${poc})`);
      }
      logger.info(`실행 완료:\n${stdout} (${poc})`);
      resolve();
    });
  });
}

/**
 * Pub/Sub 메시지 처리 함수
 */
const messageHandler = (message: Message): void => {
  const msg = message.data.toString().trim();
  const logger = Logger.getLogger(''); // 전체 실행에서의 로그 기록

  logger.info(`수신된 메시지: ${msg}`);

  // 메시지에 따라 Playwright 또는 Appium 테스트 실행
  if (msg === '') {
    // 빈 문자열이면 모든 POC에 대해 병렬 실행
    Promise.all(ALL_POCS.map(poc => runTestScript(scriptPaths[poc], poc)))
      .then(() => {
        message.ack();
        logger.info(`모든 POC 테스트 실행 완료`);
      })
      .catch(error => {
        message.nack();
        logger.error(`오류 발생: ${error}`);
      });
  } else if (msg !== '' && ALL_POCS.includes(msg as Exclude<POCType, ''>)) {
    const poc = msg as Exclude<POCType, ''>;

    // 해당 POC에 대해 실행
    runTestScript(scriptPaths[poc], poc)
      .then(() => {
        message.ack();
        logger.info(`${poc} 테스트 실행 완료`);
      })
      .catch(error => {
        message.nack();
        logger.error(`오류 발생: ${error}`);
      });
  } else {
    logger.warn(`실행할 테스트 없음: ${msg}`);
    message.nack();
  }
};

// Pub/Sub 구독 시작
Logger.initAllLoggers();
Logger.getLogger().info(`Pub/Sub Listening on '${SUBSCRIPTION_ID}'...\n`);
subscription.on('message', messageHandler);
subscription.on('error', error => Logger.getLogger().error(`Subscription error: ${error}`));
