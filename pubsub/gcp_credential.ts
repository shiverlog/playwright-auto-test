import type { POCType } from '@common/constants/PathConstants.js';
import { ALL_POCS } from '@common/constants/PathConstants.js';
import { Logger } from '@common/logger/customLogger.js';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { JWT } from 'google-auth-library';
import * as path from 'path';

// .env 파일에서 환경 변수 읽어오기
dotenv.config();

// 기본 서비스 계정 키 파일 경로 (환경 변수 사용)
const DEFAULT_KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS!;
const AUDIENCE = process.env.PUBSUB_AUDIENCE!;
const SCOPES = process.env.SCOPES!;

/**
 * Google Cloud Pub/Sub 서비스 계정 인증 함수
 */
export async function auth(keyPath: string = DEFAULT_KEY_PATH): Promise<JWT | null> {
  try {
    // JSON 키 파일 로드
    const filePath = path.resolve(keyPath);
    if (!fs.existsSync(filePath)) {
      console.error(`오류: 서비스 계정 키 파일을 찾을 수 없습니다. 경로 확인 필요 ${filePath}`);
      return null;
    }

    const serviceAccountInfo = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // JWT 인증 객체 생성
    const credentials = new JWT({
      email: serviceAccountInfo.client_email,
      key: serviceAccountInfo.private_key,
      scopes: SCOPES.split(','), // SCOPES 환경 변수가 있다면 사용
    });

    // audience는 getRequestHeaders에서 설정
    credentials.subject = AUDIENCE;

    return credentials;
  } catch (error) {
    console.error(`오류: 인증 과정에서 예기치 않은 오류 발생 ${error}`);
    return null;
  }
}

/**
 * 모든 POC에 대해 인증을 병렬로 실행하는 함수
 * @returns 인증된 JWT 객체들의 배열
 */
export async function authenticateAllPOCs(parallel: boolean = true): Promise<(JWT | null)[]> {
  try {
    if (parallel) {
      // 병렬 실행
      const authPromises = ALL_POCS.map(async (poc: POCType) => {
        const logger = Logger.getLogger(poc);
        logger.info(`POC: ${poc} - 인증 시작`);
        const credentials = await auth();

        if (credentials) {
          logger.info(`POC: ${poc} - 인증 성공`);
        } else {
          logger.error(`POC: ${poc} - 인증 실패`);
        }

        return credentials;
      });

      const allCredentials = await Promise.all(authPromises);
      return allCredentials;
    } else {
      // 순차 실행
      const allCredentials: (JWT | null)[] = [];
      for (const poc of ALL_POCS) {
        const logger = Logger.getLogger(poc);
        logger.info(`POC: ${poc} - 인증 시작`);
        // 인증 함수 호출
        const credentials = await auth();

        if (credentials) {
          logger.info(`POC: ${poc} - 인증 성공`);
        } else {
          logger.error(`POC: ${poc} - 인증 실패`);
        }

        allCredentials.push(credentials);
      }
      return allCredentials;
    }
  } catch (error) {
    console.error('전체 POC 인증 과정에서 오류 발생 ', error);
    throw error; // 인증 실패시 에러 던지기
  }
}

/**
 * 인증 진행 후 각 POC의 결과를 로거로 출력
 */
async function run() {
  try {
    // 병렬 실행 설정을 true로 두면 병렬 실행, false로 두면 순차 실행
    const credentials = await authenticateAllPOCs(true);

    // 각 인증 결과를 로그로 출력
    credentials.forEach((credential, index) => {
      const poc = ALL_POCS[index];
      const logger = Logger.getLogger(poc);
      if (credential) {
        logger.info(`POC: ${poc} 인증 성공`);
      } else {
        logger.error(`POC: ${poc} 인증 실패`);
      }
    });
  } catch (error) {
    console.error('인증 처리 중 오류 발생 ', error);
  }
}

run();
