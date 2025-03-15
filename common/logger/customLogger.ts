/**
 * Description : customLogger.ts - 📌 공통 Logger 적용
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import {
  ALLURE_RESULT_FILE_NAME,
  ALLURE_RESULT_PATH,
  LOG_FILE_NAME,
  LOG_PATH,
  POCType,
  SCREENSHOT_FILE_NAME,
  SCREENSHOT_PATH,
  TEST_RESULT_FILE_NAME,
  TEST_RESULT_PATH,
  TRACE_FILE_NAME,
  TRACE_PATH,
  VIDEO_FILE_NAME,
  VIDEO_PATH,
} from '@common/constants/PathConstants';
import fs from 'fs';
import path from 'path';
import winston from 'winston';
import 'winston-daily-rotate-file';

// ANSI 컬러 코드 정의
const LOG_COLORS: { [key: string]: string } = {
  error: '\x1b[31m', // 빨간색
  warn: '\x1b[33m', // 노란색
  info: '\x1b[34m', // 파란색
  http: '\x1b[36m', // 청록색
  verbose: '\x1b[35m', // 보라색
  debug: '\x1b[32m', // 초록색
  silly: '\x1b[37m', // 회색
  reset: '\x1b[0m', // 색상 초기화
};

// 로그 레벨 (Winston)
export const LOG_LEVELS: { level: string; priority: number }[] = [
  // 에러
  { level: 'error', priority: 0 },
  // 경고
  { level: 'warn', priority: 1 },
  // 정보
  { level: 'info', priority: 2 },
  // HTTP 요청
  { level: 'http', priority: 3 },
  // 자세한 디버깅 정보
  { level: 'verbose', priority: 4 },
  // 디버깅 로그
  { level: 'debug', priority: 5 },
  // 가장 상세한 로그
  { level: 'silly', priority: 6 },
];

// Map으로 변환
export const LOG_LEVELS_MAP = new Map(LOG_LEVELS.map(({ level, priority }) => [level, priority]));

// 환경 설정
const ENABLE_LOGS = process.env.ENABLE_LOGS === 'true';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// 로그 디렉토리 생성 함수
const ensureDirectoryExists = (filePath: string) => {
  const logDir = path.dirname(filePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

// JSON 포맷터
const jsonFormatter = winston.format.printf(({ level, message, timestamp }) => {
  return JSON.stringify({ timestamp, level, message });
});

// 컬러 포맷터
const colorizer = winston.format.colorize();
const coloredFormatter = winston.format.printf(({ level, message, timestamp }) => {
  return colorizer.colorize(level, `${timestamp} - ${level.toUpperCase()}: ${message}`);
});

// Winston 로거 싱글턴 클래스
class Logger {
  private static instances: Map<POCType, winston.Logger> = new Map();

  private constructor() {}

  public static getLogger(poc: POCType = 'default' as POCType): winston.Logger {
    if (!Logger.instances.has(poc)) {
      ensureDirectoryExists(LOG_PATH);
      ensureDirectoryExists(TEST_RESULT_PATH);
      ensureDirectoryExists(ALLURE_RESULT_PATH);
      ensureDirectoryExists(SCREENSHOT_PATH);
      ensureDirectoryExists(TRACE_PATH);
      ensureDirectoryExists(VIDEO_PATH);

      const logFile = path.join(LOG_PATH, LOG_FILE_NAME(poc));
      const testResultFile = path.join(TEST_RESULT_PATH, TEST_RESULT_FILE_NAME(poc));
      const allureResultFile = path.join(ALLURE_RESULT_PATH, ALLURE_RESULT_FILE_NAME(poc));
      const screenshotFile = path.join(SCREENSHOT_PATH, SCREENSHOT_FILE_NAME(poc));
      const traceFile = path.join(TRACE_PATH, TRACE_FILE_NAME(poc));
      const videoFile = path.join(VIDEO_PATH, VIDEO_FILE_NAME(poc));

      const loggerInstance = winston.createLogger({
        level: LOG_LEVEL,
        levels: Object.fromEntries(LOG_LEVELS.map(({ level, priority }) => [level, priority])),
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          jsonFormatter,
        ),
        transports: ENABLE_LOGS
          ? [
              // 콘솔에 컬러 출력 (실시간 로그 확인 용도)
              new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(), coloredFormatter),
              }),
              // 일반 로그 파일 (모든 로그 저장)
              new winston.transports.File({
                filename: logFile,
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
              }),
              // 테스트 결과를 저장하는 로그 파일
              new winston.transports.File({
                filename: testResultFile,
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
              }),
              // Allure 테스트 리포트 관련 로그 파일
              new winston.transports.File({
                filename: allureResultFile,
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
              }),
              // 스크린샷 관련 정보를 저장하는 로그 파일
              new winston.transports.File({
                filename: screenshotFile,
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
              }),
              // Trace 파일을 저장하는 로그 파일 (테스트 실행 흐름 추적)
              new winston.transports.File({
                filename: traceFile,
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
              }),
              // 테스트 실행 중 녹화된 비디오 파일 정보를 저장하는 로그 파일
              new winston.transports.File({
                filename: videoFile,
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
              }),
            ]
          : [],
      });

      Logger.instances.set(poc, loggerInstance);
    }
    return Logger.instances.get(poc)!;
  }
}

export const logger = Logger.getLogger();
