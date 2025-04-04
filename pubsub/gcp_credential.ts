/**
 * Description : gcp_credential.ts - 📌 Google 인증 기반 Pub/Sub 연동 유틸리티
 * Author : Shiwoo Min
 * Date : 2025-04-04
 */
import { Logger } from '@common/logger/customLogger.js';
import type { POCKey, POCType } from '@common/types/platform-types.js';
import { ALL_POCS } from '@common/types/platform-types.js';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { JWT } from 'google-auth-library';
import * as path from 'path';
import type winston from 'winston';

dotenv.config();

// 환경 변수 설정
const DEFAULT_KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS!;
const AUDIENCE = process.env.PUBSUB_AUDIENCE!;
const SCOPES = process.env.SCOPES!;

/**
 * 서비스 계정 키 파일을 기반으로 JWT 인증 객체 생성
 */
export async function auth(keyPath: string = DEFAULT_KEY_PATH): Promise<JWT | null> {
  try {
    const filePath = path.resolve(keyPath);
    if (!fs.existsSync(filePath)) {
      console.error(`[AUTH] 키 파일 경로가 존재하지 않습니다: ${filePath}`);
      return null;
    }

    const serviceAccountInfo = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const credentials = new JWT({
      email: serviceAccountInfo.client_email,
      key: serviceAccountInfo.private_key,
      scopes: SCOPES.split(','),
    });

    credentials.subject = AUDIENCE;
    return credentials;
  } catch (error) {
    console.error('[AUTH] 인증 실패:', error);
    return null;
  }
}

/**
 * 전체 POC에 대해 JWT 인증을 병렬 또는 순차적으로 수행
 * @param parallel true면 병렬 실행, false면 순차 실행
 */
export async function authenticateAllPOCs(parallel: boolean = true): Promise<(JWT | null)[]> {
  if (parallel) {
    return await Promise.all(
      ALL_POCS.map(async (poc: POCKey) => {
        const logger = Logger.getLogger(poc) as winston.Logger;
        logger.info(`[AUTH] ${poc} 인증 시작`);

        const credentials = await auth();
        if (credentials) {
          logger.info(`[AUTH] ${poc} 인증 성공`);
        } else {
          logger.error(`[AUTH] ${poc} 인증 실패`);
        }

        return credentials;
      }),
    );
  }

  const results: (JWT | null)[] = [];
  for (const poc of ALL_POCS) {
    const pocType: POCType = poc; // 명시적으로 POCType 할당
    const logger = Logger.getLogger(pocType) as winston.Logger;
    logger.info(`[AUTH] ${pocType} 인증 시작`);

    const credentials = await auth();
    if (credentials) {
      logger.info(`[AUTH] ${pocType} 인증 성공`);
    } else {
      logger.error(`[AUTH] ${pocType} 인증 실패`);
    }

    results.push(credentials);
  }

  return results;
}

/**
 * 직접 실행 시 전체 POC 인증 후 결과 로깅
 */
async function run(): Promise<void> {
  try {
    const credentials = await authenticateAllPOCs(true);

    credentials.forEach((credential, index) => {
      const poc: POCType = ALL_POCS[index];
      const logger = Logger.getLogger(poc) as winston.Logger;

      if (credential) {
        logger.info(`[AUTH] ${poc} 인증 성공`);
      } else {
        logger.error(`[AUTH] ${poc} 인증 실패`);
      }
    });
  } catch (error) {
    console.error('[AUTH] 인증 처리 중 예외 발생:', error);
  }
}

run();
