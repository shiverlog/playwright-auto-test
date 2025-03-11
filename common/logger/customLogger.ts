import fs from 'fs';
import path from 'path';
import winston from 'winston';
import 'winston-daily-rotate-file';

import { POCType, getLogFile } from '../config/config';

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
  { level: 'error', priority: 0 }, // 에러
  { level: 'warn', priority: 1 }, // 경고
  { level: 'info', priority: 2 }, // 정보
  { level: 'http', priority: 3 }, // HTTP 요청
  { level: 'verbose', priority: 4 }, // 자세한 디버깅 정보
  { level: 'debug', priority: 5 }, // 디버깅 로그
  { level: 'silly', priority: 6 }, // 가장 상세한 로그
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
  private static instance: winston.Logger | null = null;

  private constructor(poc: POCType) {
    const logFile = getLogFile(poc);
    ensureDirectoryExists(logFile);

    Logger.instance = winston.createLogger({
      level: LOG_LEVEL,
      levels: Object.fromEntries(LOG_LEVELS.map(({ level, priority }) => [level, priority])),
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
          ({ level, message, timestamp }) => `${timestamp} - ${level.toUpperCase()}: ${message}`,
        ),
      ),
      transports: ENABLE_LOGS
        ? [
            new winston.transports.Console({
              format: winston.format.combine(winston.format.colorize(), coloredFormatter),
            }),
            new winston.transports.File({
              filename: logFile,
              format: winston.format.combine(winston.format.timestamp(), jsonFormatter),
            }),
          ]
        : [],
    });
  }

  // 싱글턴 인스턴스 반환
  public static getLogger(poc: POCType = 'default' as POCType): winston.Logger {
    if (!Logger.instance) {
      new Logger(poc); // 최초 생성
    }
    return Logger.instance!;
  }
}

export const logger = Logger.getLogger();
