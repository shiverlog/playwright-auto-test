/**
 * Description : customLogger.ts - 📌 공통 Logger 적용/winston 방식
 * Author : Shiwoo Min
 * Date : 2025-04-10
 * - 04/10 병렬 실행 안전성 확보
 */
import { POC_RESULT_PATHS, TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import type { POCKey, POCType } from '@common/types/platform-types';
import { ALL_POCS } from '@common/types/platform-types';
import fs from 'fs';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// 로그 레벨 정의
export const LOG_LEVELS: { level: string; priority: number }[] = [
  { level: 'error', priority: 0 },
  { level: 'warn', priority: 1 },
  { level: 'info', priority: 2 },
  { level: 'http', priority: 3 },
  { level: 'verbose', priority: 4 },
  { level: 'debug', priority: 5 },
  { level: 'silly', priority: 6 },
];

// 로그 레벨을 Map 형태로 변환
export const LOG_LEVELS_MAP = new Map(LOG_LEVELS.map(({ level, priority }) => [level, priority]));

// 유효한 로그 레벨 검사
const VALID_LOG_LEVELS = new Set(LOG_LEVELS.map(l => l.level));
const LOG_LEVEL = VALID_LOG_LEVELS.has(process.env.LOG_LEVEL ?? '')
  ? process.env.LOG_LEVEL!
  : 'info';
const ENABLE_LOGS = process.env.ENABLE_LOGS === 'true';

// 콘솔 출력용 색상 포매터 정의
// const colorizer = winston.format.colorize();
// const coloredFormatter = winston.format.printf(({ level, message, timestamp }) => {
//   return colorizer.colorize(level, `${timestamp} - ${level.toUpperCase()}: ${message}`);
// });

// 색상 없이 콘솔 출력용 포맷터
const simpleFormatter = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} - ${level.toUpperCase()}: ${message}`;
});

const createSimpleFormatter = (poc: POCKey): winston.Logform.Format =>
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${poc.toUpperCase()}] ${level.toUpperCase()}: ${message}`;
  });

// 파일 출력용 JSON 포맷 정의
const jsonFormatter = winston.format.printf(({ level, message, timestamp }) => {
  return JSON.stringify({ timestamp, level, message });
});

// 지정한 파일 경로의 디렉토리가 없으면 생성
const ensureDirectoryExists = (filePath: string) => {
  const dir = path.dirname(filePath);
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (error) {
    console.error(`로그 디렉토리 생성 실패: ${dir}`, error);
    throw new Error(`로그 디렉토리 생성 실패: ${dir}`);
  }
};

// 로거 클래스 정의 (POC별 로거 인스턴스를 싱글턴으로 관리)
class Logger {
  // 각 POC별 Logger 인스턴스
  private static instances: Map<POCKey, winston.Logger> = new Map();

  private constructor() {}

  // POC별 로거 인스턴스 반환
  public static getLogger(poc: POCType | POCKey): winston.Logger | Record<POCKey, winston.Logger> {
    if (!poc) {
      throw new Error(`[Logger] poc 값이 누락되었습니다.`);
    }

    // ALL일 경우 전체 POC 로거 인스턴스를 반환
    if (poc === 'ALL') {
      const allLoggers: Record<POCKey, winston.Logger> = {} as Record<POCKey, winston.Logger>;
      for (const key of ALL_POCS) {
        allLoggers[key] = Logger.getLogger(key) as winston.Logger;
      }
      return allLoggers;
    }

    const validPOC = poc as POCKey;
    if (Logger.instances.has(validPOC)) {
      return Logger.instances.get(validPOC)!;
    }
    // 로거 경로 설정
    const resultPaths = POC_RESULT_PATHS(validPOC);
    const resultFiles = TEST_RESULT_FILE_NAME(validPOC);

    // 로그 파일 경로만 가져와서 파일 이용 조합
    const logDir = resultPaths.log?.find(dir => dir.includes('logs'));
    const logFile = resultFiles.log?.find(file => file.endsWith('.json'));

    if (!logDir || !logFile) {
      throw new Error(`[Logger] 각 POC에 대한 log 경로 또는 파일이 제대로 설정되지 않았습니다.`);
    }
    ensureDirectoryExists(logFile);

    const allLogFiles = Object.values(resultFiles).flat();
    const fileTransports: winston.transport[] = allLogFiles.map(
      fp =>
        new winston.transports.File({
          filename: fp,
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
    );

    const rotateTransport = new DailyRotateFile({
      filename: path.join(logDir, '%DATE%.json'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '7d',
      zippedArchive: true,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    });

    const transports: winston.transport[] = [
      new winston.transports.Console({
        format:
          ENABLE_LOGS || process.env.NODE_ENV === 'development'
            ? winston.format.combine(winston.format.timestamp(), createSimpleFormatter(validPOC))
            : winston.format.simple(),
      }),
      ...fileTransports,
      rotateTransport,
    ];

    const logger = winston.createLogger({
      level: LOG_LEVEL,
      levels: Object.fromEntries(LOG_LEVELS.map(({ level, priority }) => [level, priority])),
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        jsonFormatter,
      ),
      transports,
      defaultMeta: { poc: validPOC },
    });

    Logger.instances.set(validPOC, logger);
    return logger;
  }

  public static initAllLoggers(): void {
    ALL_POCS.forEach(poc => {
      Logger.getLogger(poc);
    });
  }

  public static clear(): void {
    Logger.instances.clear();
  }
}

export { Logger };
