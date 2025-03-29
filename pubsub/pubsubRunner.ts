import {
  ALL_POCS,
  FOLDER_PATHS,
  POCType,
  POC_PATH,
  TEST_RESULT_FILE_NAME,
} from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import { Message, PubSub } from '@google-cloud/pubsub';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

// Google Cloud Pub/Sub 설정
const PROJECT_ID = process.env.PROJECT_ID || 'gc-automation-test';
const SUBSCRIPTION_ID = process.env.SUBSCRIPTION_ID || 'default-subscription-id';
const NUM_MESSAGES = parseInt(process.env.NUM_MESSAGES || '3', 10);
const pubsub = new PubSub({ projectId: PROJECT_ID });
const subscription = pubsub.subscription(SUBSCRIPTION_ID);

/**
 * 특정 스크립트 실행 함수 (비동기 처리)
 */
async function runTestScript(poc: POCType | ''): Promise<void> {
  const logger = Logger.getLogger(poc);

  // POC가 유효하지 않으면 반환
  if (poc !== '' && !ALL_POCS.includes(poc)) {
    logger.error(`유효하지 않은 POC: ${poc}`);
    return;
  }

  const basePath = POC_PATH(poc);
  const basePathString = Array.isArray(basePath) ? basePath[0] : basePath;
  const resultPaths = FOLDER_PATHS(basePathString);
  const logFilePath = resultPaths.locators;

  // TEST_RESULT_FILE_NAME에서 반환되는 경로 객체 중 하나를 선택하여 사용
  const resultFiles = TEST_RESULT_FILE_NAME(basePathString, poc);
  const scriptPath = path.resolve(basePathString, resultFiles.playwrightReport);
  const command = `node ${scriptPath}`;

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
const messageHandler = async (message: Message): Promise<void> => {
  const msg = message.data.toString().trim();
  const osType = message.attributes?.os || 'unknown';

  const logger = Logger.getLogger('');
  logger.info(`수신된 메시지: ${msg} (OS: ${osType})`);
  message.ack();

  try {
    // msg가 빈 문자열이라면 모든 POC 병렬 실행
    if (msg === '') {
      // 모든 POC를 병렬로 실행
      await Promise.all(
        ALL_POCS.map(async (poc: POCType) => {
          await runTestScript(poc);
        }),
      );
      logger.info(`모든 POC 실행 완료`);
    } else if (ALL_POCS.includes(msg as Exclude<POCType, ''>)) {
      // msg가 POCType에 포함되는 값이라면 해당 POC만 실행
      const poc = msg as Exclude<POCType, ''>; // 빈 문자열 제외하고 POCType으로 캐스팅
      await runTestScript(poc);
      logger.info(`${poc} 실행 완료`);
    } else {
      // msg가 POCType에 포함되지 않으면 경고
      logger.warn(`유효하지 않은 POC: ${msg}`);
    }
  } catch (error) {
    logger.error(`오류 발생: ${error}`);
  }
};

// Pub/Sub 구독 시작
Logger.getLogger().info(`Pub/Sub Listening on '${SUBSCRIPTION_ID}'...\n`);
subscription.on('message', messageHandler);
subscription.on('error', error => Logger.getLogger().error(`Subscription error: ${error}`));
