/**
 * Description : config.ts - 📌 환경설정 및 경로 관련 기본 세팅을 관리
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { ANDROID_DEVICES, IOS_DEVICES } from '@common/config/BaseDeviceConfig';
import { getCurrentTimestamp } from '@common/formatters/formatters';
import type { DeviceConfig } from '@common/types/device-config';
import chromedriver from 'chromedriver';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { dirname } from 'path';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 환경 변수 로드 (.env 파일 지원)
dotenv.config();

/**
 * 테스트 환경 구분
 */
export const ENV = process.env.ENV || 'staging';

/**
 * Playwright 브라우저 설정
 */
// ['chromium', 'firefox', 'webkit']
export const BROWSERS = ['chromium'];
export const HEADLESS = process.env.HEADLESS === 'true';
export const TIMEOUT = 20 * 1000;

/**
 * Appium 디바이스 설정
 */
// 공통 타입 정의
interface DeviceItem<T> {
  name: string;
  platform: 'android' | 'ios';
  config: T;
}

// Android 기기 배열
export const ALL_ANDROID_DEVICES: DeviceItem<DeviceConfig>[] = Object.entries(ANDROID_DEVICES).map(
  ([name, config]) => ({
    name,
    platform: 'android',
    config,
  }),
);

// iOS 기기 배열
export const ALL_IOS_DEVICES: DeviceItem<DeviceConfig>[] = Object.entries(IOS_DEVICES).map(
  ([name, config]) => ({
    name,
    platform: 'ios',
    config,
  }),
);

// 전체 기기 배열
export const ALL_DEVICES = [...ALL_ANDROID_DEVICES, ...ALL_IOS_DEVICES];

// Chromedriver Path (npm chromedriver 자동 관리)
export const CHROMEDRIVER_PATH = chromedriver;

/**
 * e2e 전용 기기
 */
export const ANDROID_DEVICE = process.env.ANDROID_DEVICE || 'Galaxy Note20 Ultra';
export const IOS_DEVICE = process.env.IOS_DEVICE || 'iPhone 15 Plus';

// android 기기 셋팅
export const CURRENT_ANDROID_CONFIG: DeviceConfig =
  ANDROID_DEVICES[ANDROID_DEVICE] || ANDROID_DEVICES['Galaxy Note20 Ultra'];
// ios 기기 셋팅
export const CURRENT_IOS_CONFIG: DeviceConfig =
  IOS_DEVICES[IOS_DEVICE] || IOS_DEVICES['iPhone 15 Plus'];
// MAX 기기 테스트 연결 갯수 셋팅
export const MAX_REAL_DEVICES = parseInt(process.env.MAX_REAL_DEVICES || '2', 10);

/**
 * Playwright 환경 설정
 */
export const WORKERS = parseInt(process.env.WORKERS || '4', 10);
export const RETRY_COUNT = Math.min(parseInt(process.env.RETRY_COUNT || '2', 10), 3);
export const LAUNCH_OPTIONS = {
  slowMo: parseInt(process.env.SLOW_MO || '0', 10),
  devtools: process.env.DEVTOOLS === 'true',
};

/**
 * 네트워크 설정
 */
export const API_TIMEOUT = 20 * 1000; // API 요청 타임아웃 (20초)
export const RESPONSE_TIMEOUT = 10 * 1000; // 응답 타임아웃 (10초)

/**
 * Appium 명시적/암묵적 대기 시간
 */
export const IMPLICIT_WAIT = 10; // 암묵적 대기 시간 (10초)
export const EXPLICIT_WAIT = 20; // 명시적 대기 시간 (20초)

/**
 * 환경별 기본 URL
 */
export const BASE_URLS: Record<string, string> = {
  development: 'http://localhost:3000',
  staging: 'https://www.lguplus.com',
  production: 'https://www.lguplus.com',
};
export const BASE_URL = BASE_URLS[ENV];

/**
 * 경로 설정
 */
export const BASE_PATH = path.resolve(__dirname, '..');

/**
 * 파일 보존 주기(dd)
 */
export const FILE_RETENTION_DAYS = {
  log: 14,
  testResult: 14,
  allureResult: 14,
  screenshot: 7,
  video: 7,
  trace: 14,
};

/**
 * 테스트 계정 정보
 */
export const USERNAME = process.env.UPLUS_ID;
export const PASSWORD = process.env.UPLUS_PW;

/**
 * 장치 구분
 */
export const IS_MOBILE = ['aos', 'ios'].includes(process.env.TEST_PLATFORM || '');

/**
 * Playwright 뷰포트 및 유저에이전트 설정
 */
export const DEVICE_SETTINGS = IS_MOBILE
  ? {
      userAgent: IS_MOBILE ? 'Mozilla/5.0 (Mobile; rv:40.0) Gecko/40.0 Firefox/40.0' : '',
      viewport: IS_MOBILE ? { width: 375, height: 667 } : { width: 1280, height: 720 },
    }
  : {};

/**
 * Slack 설정
 */
export const slackConfig = {
  SLACK_TOKEN: process.env.SLACK_BOT_TOKEN || '',
  SLACK_CHANNEL: process.env.SLACK_CHANNEL_ID || '',
  SLACK_MENTION_ID: process.env.SLACK_MENTION_ID || '',
  SLACK_MENTION_CHANNEL: process.env.SLACK_MENTION_CHANNEL || '',
};

/**
 * Slack Webhook URL (옵션)
 */
export const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';
export const SLACK_FILES_UPLOAD_URL = 'https://lgdigitalcommerce.slack.com/api/files.upload';

/**
 * Teams 전송 환경 설정
 */
export const teamsConfig = {
  TEAMS_WEBHOOK_URL: process.env.TEAMS_WEBHOOK_URL || '',
};

/**
 * Email 전송 환경 설정
 */
export const emailConfig = {
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || process.env.SMTP_USER || '',
  EMAIL_TO: process.env.EMAIL_TO || '',
};

/**
 * PubSub 설정
 */
export const PUBSUB = {
  PROJECT_ID: 'gcp-dev-uhdc-id',
  TOPIC_ID: 'qa-test',
  PUBLISHER_AUDIENCE: 'https://pubsub.googleapis.com/google.pubsub.v1.Publisher',
};

/**
 * 유틸: 현재 환경 확인
 */
export const isStaging = ENV === 'staging';
export const isProduction = ENV === 'production';
export const isMobilePlatform = (): boolean => IS_MOBILE;

/**
 * 유틸: 현재 타임스탬프 접미사
 */
export const TIMESTAMP_SUFFIX = getCurrentTimestamp();
