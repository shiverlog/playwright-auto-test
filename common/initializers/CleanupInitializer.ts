/**
 * Description : CleanupInitializer.ts - 📌 오래된 결과 파일을 정리하는 초기화 전용 유틸 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */
import { FILE_RETENTION_DAYS } from '@common/config/baseConfig';
import { POC_RESULT_PATHS } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import fs from 'fs';
import path from 'path';
import type winston from 'winston';

export class CleanupInitializer {
  private readonly pocList = POCEnv.getList();
  private readonly loggerMap = new Map<string, winston.Logger>();

  private get loggert(): Record<string, winston.Logger> {
    const loggerObj: Record<string, winston.Logger> = {};
    for (const poc of this.pocList) {
      if (!this.loggerMap.has(poc)) {
        this.loggerMap.set(poc, Logger.getLogger(poc as any) as winston.Logger);
      }
      loggerObj[poc] = this.loggerMap.get(poc)!;
    }
    return loggerObj;
  }

  public async run(): Promise<void> {
    for (const poc of this.pocList) {
      const logger = this.loggert[poc];
      const now = Date.now();
      const resultPaths = POC_RESULT_PATHS(poc as any);

      for (const [key, dirs] of Object.entries(resultPaths)) {
        const dirList = Array.isArray(dirs) ? dirs : [dirs];
        const maxAgeMs =
          (FILE_RETENTION_DAYS[key as keyof typeof FILE_RETENTION_DAYS] || 14) * 86400000;

        for (const dirPath of dirList) {
          if (!fs.existsSync(dirPath)) {
            this.loggert[poc].warn(`정리할 폴더가 없음: ${dirPath}`);
            continue;
          }

          try {
            const files = fs.readdirSync(dirPath);
            for (const file of files) {
              const filePath = path.join(dirPath, file);
              const stats = fs.statSync(filePath);
              if (now - stats.mtimeMs > maxAgeMs) {
                await fs.promises.unlink(filePath);
                this.loggert[poc].info(`오래된 파일 삭제됨: ${filePath}`);
              }
            }
          } catch (err) {
            this.loggert[poc].error(`폴더 처리 중 오류 발생: ${dirPath}, 오류: ${err}`);
          }
        }
      }
    }
  }
}
