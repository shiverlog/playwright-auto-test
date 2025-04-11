/**
 * Description : CleanupInitializer.ts - 📌 오래된 결과 파일을 정리하는 초기화 전용 유틸 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { FILE_RETENTION_DAYS } from '@common/config/baseConfig';
import { POC_RESULT_PATHS } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import fs from 'fs';
import path from 'path';
import type winston from 'winston';

export class CleanupInitializer {
  // 현재 실행 대상 POC 리스트
  private readonly pocList = POCEnv.getPOCList();

  // POC별 로거 캐싱 맵
  private readonly loggerMap = new Map<string, winston.Logger>();

  constructor() {
    for (const poc of this.pocList) {
      this.loggerMap.set(poc, Logger.getLogger(poc) as winston.Logger);
    }
  }

  /**
   * 개별 POC 로거 반환
   */
  private getLogger(poc: string): winston.Logger {
    return this.loggerMap.get(poc)!;
  }

  /**
   * 오래된 테스트 결과 정리 실행
   */
  public async run(): Promise<void> {
    for (const poc of this.pocList) {
      const logger = this.getLogger(poc);
      const now = Date.now();
      const resultPaths = POC_RESULT_PATHS(poc);

      for (const [key, dirs] of Object.entries(resultPaths)) {
        const dirList = Array.isArray(dirs) ? dirs : [dirs];

        // 유지 기간 설정 (기본값: 14일)
        const maxAgeMs =
          (FILE_RETENTION_DAYS[key as keyof typeof FILE_RETENTION_DAYS] || 14) * 86400000;

        for (const dirPath of dirList) {
          if (!fs.existsSync(dirPath)) {
            logger.warn(`정리할 폴더가 없음: ${dirPath}`);
            continue;
          }

          try {
            const files = fs.readdirSync(dirPath);

            for (const file of files) {
              const filePath = path.join(dirPath, file);
              const stats = fs.statSync(filePath);

              if (now - stats.mtimeMs > maxAgeMs) {
                await fs.promises.unlink(filePath);
                logger.info(`오래된 파일 삭제됨: ${filePath}`);
              }
            }
          } catch (err) {
            logger.error(`폴더 처리 중 오류 발생: ${dirPath}, 오류: ${err}`);
          }
        }
      }
    }
  }
}
