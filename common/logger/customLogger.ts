/**
 * Description : customLogger.ts - 📌 공통 Logger 적용
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import {
  ALL_POCS,
  POCType,
  POC_RESULT_PATHS,
  TEST_RESULT_FILE_NAME,
} from '@common/constants/PathConstants';
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
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 로거 클래스 정의 (POC별 로거 인스턴스를 싱글턴으로 관리)
class Logger {
  private static instances: Map<POCType, winston.Logger> = new Map();

  private constructor() {}

  public static getLogger(poc: POCType = ''): winston.Logger {
    if (poc === '') {
      throw new Error(
        'POCType가 지정되지 않았습니다. 전체 실행에서는 각 POC별로 getLogger를 호출하세요.',
      );
    }

    if (!Logger.instances.has(poc)) {
      const basePath = path.resolve(process.cwd());
      const resultPaths = POC_RESULT_PATHS(basePath);
      const resultFiles = TEST_RESULT_FILE_NAME(basePath, poc);
      // 로그 디렉토리 존재 확인 및 생성
      Object.values(resultPaths).forEach(ensureDirectoryExists);

      // winston 로거 인스턴스 생성
      const loggerInstance = winston.createLogger({
        level: LOG_LEVEL,
        levels: Object.fromEntries(LOG_LEVELS.map(({ level, priority }) => [level, priority])),
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          jsonFormatter,
        ),
        transports: ENABLE_LOGS
          ? [
              new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(), coloredFormatter),
              }),
              // 파일 출력 설정 (POC별 로그 파일)
              ...Object.entries(resultFiles).map(
                ([_, filePath]) =>
                  new winston.transports.File({
                    filename: filePath,
                    format: winston.format.combine(
                      winston.format.timestamp(),
                      winston.format.json(),
                    ),
                  }),
              ),
            ]
          : [],
      });
      // 생성된 로거 저장
      Logger.instances.set(poc, loggerInstance);
    }
    return Logger.instances.get(poc)!;
  }
  // 전체 POC에 대해 로거 미리 초기화 (getLogger를 호출)
  public static initAllLoggers(): void {
    for (const poc of ALL_POCS) {
      Logger.getLogger(poc);
    }
  }
}
export { Logger };
