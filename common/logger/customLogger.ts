/**
 * Description : customLogger.ts - 📌 공통 Logger 적용
 * Author : Shiwoo Min
 * Date : 2025-04-04
 */
import { POC_RESULT_PATHS, TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import type { POCKey, POCType } from '@common/types/platform-types';
import { ALL_POCS } from '@common/types/platform-types';
import fs from 'fs';
import path from 'path';
import winston from 'winston';
import 'winston-daily-rotate-file';

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

// 환경변수를 통한 로그 설정
const ENABLE_LOGS = process.env.ENABLE_LOGS === 'true';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// 콘솔 출력용 색상 포매터 정의
const colorizer = winston.format.colorize();
const coloredFormatter = winston.format.printf(({ level, message, timestamp }) => {
  return colorizer.colorize(level, `${timestamp} - ${level.toUpperCase()}: ${message}`);
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
    // 이미 생성된 로거가 있으면 반환
    if (Logger.instances.has(validPOC)) {
      return Logger.instances.get(validPOC)!;
    }
    // POC_RESULT_PATHS와 TEST_RESULT_FILE_NAME 내부적으로 basePath를 처리
    // const basePath = process.cwd();
    const resultPaths = POC_RESULT_PATHS(validPOC);
    const resultFiles = TEST_RESULT_FILE_NAME(validPOC);

    // 로그 디렉토리 생성
    const allDirs = Object.values(resultPaths).flat();
    allDirs.forEach(dirPath => ensureDirectoryExists(dirPath));
    // 파일 출력용 transport 구성
    const fileTransports: winston.transport[] = [];

    Object.values(resultFiles).forEach(filePath => {
      if (typeof filePath === 'string') {
        fileTransports.push(
          new winston.transports.File({
            filename: filePath,
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
          }),
        );
      } else {
        filePath.forEach(fp => {
          fileTransports.push(
            new winston.transports.File({
              filename: fp,
              format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            }),
          );
        });
      }
    });
    // 전체 transports 구성 (콘솔 + 파일)
    const transports: winston.transport[] =
      ENABLE_LOGS || process.env.NODE_ENV === 'development'
        ? [
            new winston.transports.Console({
              format: winston.format.combine(winston.format.colorize(), coloredFormatter),
            }),
            ...fileTransports,
          ]
        : [
            new winston.transports.Console({
              format: winston.format.simple(),
            }),
          ];
    // 로거 생성 및 설정
    const logger = winston.createLogger({
      level: LOG_LEVEL,
      levels: Object.fromEntries(LOG_LEVELS.map(({ level, priority }) => [level, priority])),
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        jsonFormatter,
      ),
      transports,
    });

    Logger.instances.set(validPOC, logger);
    return logger;
  }
  // 전체 POC별 로거 초기화
  public static initAllLoggers(): void {
    ALL_POCS.forEach(poc => {
      Logger.getLogger(poc);
    });
  }
}

export { Logger };
