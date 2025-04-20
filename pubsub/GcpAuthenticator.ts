/**
 * Description : GcpAuthenticator.ts - 📌 Google Cloud Pub/Sub 인증을 위한 JWT 생성 및 관리 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-18
 */
import { Logger } from '@common/logger/customLogger.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { JWT } from 'google-auth-library';
import * as path from 'path';
import type winston from 'winston';

dotenv.config();

export class GcpAuthenticator {
  // 단일 실행 POC 타입
  private readonly poc: string;
  // 병렬 실행 여부
  private readonly parallel: boolean;
  // 대상 POC 목록
  private readonly pocKeys: string[];
  // 전역 로거 인스턴스
  private readonly logger: winston.Logger;

  constructor(parallel = true) {
    this.poc = POCEnv.getType();
    this.parallel = parallel;
    this.pocKeys = POCEnv.getPOCKeyList();
    this.logger = Logger.getLogger(this.poc.toUpperCase()) as winston.Logger;
  }

  /**
   * 서비스 계정 키 파일을 기반으로 JWT 객체 생성
   */
  private async createCredential(keyPath: string): Promise<JWT | null> {
    try {
      const filePath = path.resolve(keyPath);

      if (!fs.existsSync(filePath)) {
        this.logger.error(`[AUTH] 키 파일 경로가 존재하지 않습니다: ${filePath}`);
        return null;
      }

      // 서비스 계정 키 파일 파싱
      const serviceAccountInfo = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // 환경변수 기반 설정
      const scopes = process.env.SCOPES!;
      const audience = process.env.PUBSUB_AUDIENCE!;

      // JWT 인증 객체 생성
      const credentials = new JWT({
        email: serviceAccountInfo.client_email,
        key: serviceAccountInfo.private_key,
        scopes: scopes.split(','),
      });

      credentials.subject = audience;

      return credentials;
    } catch (error) {
      this.logger.error('[AUTH] 인증 실패:', error);
      return null;
    }
  }

  /**
   * 현재 POC 환경값 기준으로 인증 실행
   */
  public async authenticate(): Promise<(JWT | null)[]> {
    const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS!;
    const results: (JWT | null)[] = [];

    if (this.parallel) {
      return await Promise.all(
        this.pocKeys.map(async poc => {
          this.logger.info(`[AUTH] ${poc} 인증 시작`);

          const credentials = await this.createCredential(keyPath);

          if (credentials) {
            this.logger.info(`[AUTH] ${poc} 인증 성공`);
          } else {
            this.logger.error(`[AUTH] ${poc} 인증 실패`);
          }

          return credentials;
        }),
      );
    }

    for (const poc of this.pocKeys) {
      this.logger.info(`[AUTH] ${poc} 인증 시작`);

      const credentials = await this.createCredential(keyPath);

      if (credentials) {
        this.logger.info(`[AUTH] ${poc} 인증 성공`);
      } else {
        this.logger.error(`[AUTH] ${poc} 인증 실패`);
      }

      results.push(credentials);
    }

    return results;
  }

  /**
   * 인증 성공/실패 결과를 각 POC별로 로깅
   */
  public async run(): Promise<void> {
    try {
      const credentials = await this.authenticate();

      credentials.forEach((credential, index) => {
        const poc = this.pocKeys[index];

        if (credential) {
          this.logger.info(`[AUTH] ${poc} 인증 최종 성공`);
        } else {
          this.logger.error(`[AUTH] ${poc} 인증 최종 실패`);
        }
      });
    } catch (error) {
      this.logger.error('[AUTH] 인증 처리 중 예외 발생:', error);
    }
  }
}

// 직접 실행 시 run() 수행
if (process.env.NODE_ENV !== 'test') {
  // 병렬 실행
  new GcpAuthenticator(true).run();
}
