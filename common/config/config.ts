/**
 * Description : config.ts - 📌 환경설정 및 경로 관련 기본 세팅을 관리
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { getCurrentTimestamp } from '@common/formatters/formatters';
import dotenv from 'dotenv';
import path from 'path';

// 환경 변수 로드 (.env 파일 지원)
dotenv.config();

// Playwright 브라우저 설정
export const BROWSERS = ['chromium', 'firefox', 'webkit'];
export const HEADLESS = process.env.HEADLESS === 'true';
export const TIMEOUT = 20 * 1000;

// Android & iOS 디바이스 설정
export const ANDROID_DEVICE = process.env.ANDROID_DEVICE || 'Pixel 5';
export const IOS_DEVICE = process.env.IOS_DEVICE || 'iPhone 13';
export const USE_PROXY = process.env.USE_PROXY == 'true';

// 네트워크 설정
export const API_TIMEOUT = 20 * 1000; // API 요청 타임아웃 (20초)
export const RESPONSE_TIMEOUT = 10 * 1000; // 응답 타임아웃 (10초)

// Appium 대기 설정
export const IMPLICIT_WAIT = 10; // 암묵적 대기 시간 (10초)
export const EXPLICIT_WAIT = 20; // 명시적 대기 시간 (20초)

// 환경별 테스트 URL 설정
export const ENV = process.env.ENV || 'staging';
export const BASE_URLS: Record<string, string> = {
  development: 'http://localhost:3000',
  staging: 'https://www.lguplus.com',
  production: 'https://www.lguplus.com',
};
export const BASE_URL = BASE_URLS[ENV];

// 프로젝트 기본 경로 설정
export const BASE_PATH = path.resolve(__dirname, '..');

// Playwright 실행 설정
export const WORKERS = parseInt(process.env.WORKERS || '4', 10);
export const RETRY_COUNT = Math.min(parseInt(process.env.RETRY_COUNT || '2', 10), 3);

// Playwright Launch Options
export const LAUNCH_OPTIONS = {
  slowMo: parseInt(process.env.SLOW_MO || '0', 10),
  devtools: process.env.DEVTOOLS === 'true',
};

// 현재 장치가 모바일인지 확인
export const IS_MOBILE = ['aos', 'ios'].includes(process.env.TEST_PLATFORM || '');

// Playwright 장치 설정 (데스크톱 & 모바일 구분)
export const DEVICE_SETTINGS = IS_MOBILE
  ? {
      userAgent: IS_MOBILE ? 'Mozilla/5.0 (Mobile; rv:40.0) Gecko/40.0 Firefox/40.0' : '',
      viewport: IS_MOBILE ? { width: 375, height: 667 } : { width: 1280, height: 720 },
    }
  : {};

// email 전송 환경 설정
export const emailConfig = {
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || process.env.SMTP_USER || '',
  EMAIL_TO: process.env.EMAIL_TO || '',
};

// slack 전송 환경 설정
export const slackConfig = {
  SLACK_TOKEN: process.env.SLACK_BOT_TOKEN || '',
  SLACK_CHANNEL: process.env.SLACK_CHANNEL_ID || '',
  SLACK_MENTION_ID: process.env.SLACK_MENTION_ID || '',
  SLACK_MENTION_CHANNEL: process.env.SLACK_MENTION_CHANNEL || '',
};

// teams 전송 환경 설정
export const teamsConfig = {
  TEAMS_WEBHOOK_URL: process.env.TEAMS_WEBHOOK_URL || '',
};

// 파일 보관 주기 (일 단위)
export const FILE_RETENTION_DAYS = {
  log: 14,
  testResult: 14,
  allureResult: 14,
  screenshot: 7,
  video: 7,
  trace: 14,
};

// 테스트 계정
export const USERNAME = process.env.UPLUS_ID;
export const PASSWORD = process.env.UPLUS_PW;

// 슬랙 API URL
export const SLACK_FILES_UPLOAD_URL = 'https://lgdigitalcommerce.slack.com/api/files.upload';

// pubsub 정보
export const PUBSUB = {
  PROJECT_ID: 'gcp-dev-uhdc-id',
  TOPIC_ID: 'qa-test',
  PUBLISHER_AUDIENCE: 'https://pubsub.googleapis.com/google.pubsub.v1.Publisher',
};
