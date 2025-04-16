/**
 * Description : baseConfig.ts - 환경설정 및 Playwright/Appium 기본 환경 정의
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { ANDROID_DEVICES, IOS_DEVICES } from '@common/config/deviceConfig.js';
import { getCurrentTimestamp } from '@common/formatters/formatters.js';
import type { DeviceConfig } from '@common/types/device-config.js';
import chromedriver from 'chromedriver';
import dotenv from 'dotenv';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

/**
 * 현재 환경 (ENV: development, staging, production)
 */
export const ENV = process.env.ENV || 'staging';

/**
 * Playwright 브라우저 설정
 */
export const BROWSERS = ['chromium'];
export const HEADLESS = process.env.HEADLESS === 'true';
export const TIMEOUT = 20 * 1000; // 20초

/**
 * DeviceItem 형식 정의 (generic)
 */
export interface DeviceItem<T = DeviceConfig> {
  name: string;
  platform: 'android' | 'ios' | 'pc';
  config: T;
}

/**
 * Appium 기기 정보 (DeviceItem<DeviceConfig>)
 */
export const ALL_ANDROID_DEVICES: DeviceItem[] = Object.entries(ANDROID_DEVICES).map(
  ([name, config]) => ({ name, platform: 'android', config }),
);

export const ALL_IOS_DEVICES: DeviceItem[] = Object.entries(IOS_DEVICES).map(([name, config]) => ({
  name,
  platform: 'ios',
  config,
}));

export const ALL_DEVICES: DeviceItem[] = [...ALL_ANDROID_DEVICES, ...ALL_IOS_DEVICES];

/**
 * PC 기기 정의 (13인치 / 15인치)
 */
export const PC_DEVICES: Record<string, DeviceItem> = {
  '13-inch': {
    name: 'Desktop 13-inch',
    platform: 'pc',
    config: {
      platformName: 'PC',
      deviceName: 'Desktop 13-inch',
      browserName: 'chromium',
      ['appium:options']: undefined,
      udid: '',
      platformVersion: '',
      app: '',
    },
  },
  '15-inch': {
    name: 'Desktop 15-inch',
    platform: 'pc',
    config: {
      platformName: 'PC',
      deviceName: 'Desktop 15-inch',
      browserName: 'chromium',
      ['appium:options']: undefined,
      udid: '',
      platformVersion: '',
      app: '',
    },
  },
};

/**
 * 초기에 이동하는 직접 파일 경로
 */
export const BASE_PATH = path.resolve(__dirname, '..');

/**
 * Chromedriver 경로
 */
export const CHROMEDRIVER_PATH = chromedriver;

/**
 * Playwright 보조 환경
 */
export const WORKERS = parseInt(process.env.WORKERS || '4', 10);
export const RETRY_COUNT = Math.min(parseInt(process.env.RETRY_COUNT || '2', 10), 3);
export const LAUNCH_OPTIONS = {
  slowMo: parseInt(process.env.SLOW_MO || '0', 10),
  devtools: process.env.DEVTOOLS === 'true',
};

/**
 * API & 네트워크 타임아웃
 */
export const API_TIMEOUT = 20 * 1000;
export const RESPONSE_TIMEOUT = 10 * 1000;

/**
 * Appium 대기 설정
 */
export const IMPLICIT_WAIT = 10; // sec
export const EXPLICIT_WAIT = 20; // sec

/**
 * ENV 변수 기본 URL
 */
export const BASE_URLS: Record<string, string> = {
  development: 'http://localhost:3000',
  staging: 'https://www.lguplus.com',
  production: 'https://www.lguplus.com',
};
export const BASE_URL = BASE_URLS[ENV];

/**
 * 파일 보조 기간 (days)
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
 * 호출 플랫폼 구분
 */
export const TEST_PLATFORM = (process.env.TEST_PLATFORM || '').toLowerCase();
export const IS_MOBILE = ['aos', 'ios'].includes(TEST_PLATFORM);

/**
 * 뷰포트/유저애이전 값 설정
 */
export const DEVICE_SETTINGS = IS_MOBILE
  ? {
      userAgent: 'Mozilla/5.0 (Mobile; rv:40.0) Gecko/40.0 Firefox/40.0',
      viewport: { width: 375, height: 667 },
    }
  : {
      viewport: { width: 1280, height: 720 },
    };

/**
 * 현재 환경 인증 유형
 */
export const isStaging = ENV === 'staging';
export const isProduction = ENV === 'production';
export const isMobilePlatform = (): boolean => IS_MOBILE;

/**
 * 현재 타임스텝 접발자
 */
export const TIMESTAMP_SUFFIX = getCurrentTimestamp();

/**
 * 환경 검증 유형
 */
export function validateBaseConfig(): void {
  if (!USERNAME || !PASSWORD) {
    console.warn('[baseConfig] 계정 정보(그리고 .env) 변수가 누락되었습니다.');
  }
  if (!BASE_URL) {
    throw new Error('[baseConfig] BASE_URL 설정이 잘못되어 있습니다.');
  }
}

/**
 * 유형: 시뮬레이터/엔드로이드 검증 기능
 */
export function isEmulator(deviceName: string): boolean {
  return /emulator|simulator/i.test(deviceName);
}
