/**
 * Description : cleanupInitializer.ts - 📌 특정 POC 타입 또는 전체 POC에 대해 오래된 파일을 정리하는 함수
 * Author : Shiwoo Min
 * Date : 2025-03-30
 */
import { FILE_RETENTION_DAYS } from '@common/config/baseConfig';
import { POC_RESULT_PATHS } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import type { POCKey, POCType } from '@common/types/platform-types';
import { ALL_POCS } from '@common/types/platform-types';
import fs from 'fs';
import path from 'path';
import type winston from 'winston';

/**
 * 지정된 POC 또는 전체 POC에 대해 오래된 결과 파일 삭제
 */
export async function cleanupOldFiles(poc: POCType): Promise<void> {
  const pocList: POCKey[] = poc === 'ALL' ? ALL_POCS : [poc as POCKey];

  for (const singlePOC of pocList) {
    const logger = Logger.getLogger(singlePOC) as winston.Logger;

    const now = Date.now();
    const resultPaths = POC_RESULT_PATHS(singlePOC);

    for (const [key, dirOrDirs] of Object.entries(resultPaths)) {
      const dirList = Array.isArray(dirOrDirs) ? dirOrDirs : [dirOrDirs];

      for (const dirPath of dirList) {
        const maxAgeMs =
          (FILE_RETENTION_DAYS[key as keyof typeof FILE_RETENTION_DAYS] || 14) *
          24 *
          60 *
          60 *
          1000;

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
        } catch (error) {
          logger.error(`폴더 처리 중 오류 발생: ${dirPath}, 오류: ${error}`);
        }
      }
    }
  }
}
