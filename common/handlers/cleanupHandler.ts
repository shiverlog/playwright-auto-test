/**
 * Description : errorHandler.ts - 📌 공통 로그 초기화 핸들러
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { FILE_RETENTION_DAYS } from '@common/config/CommonConfig';
import { POCType, POC_PATH, POC_RESULT_PATHS } from '@common/constants/PathConstants';
import { logger } from '@common/logger/customLogger';
import fs from 'fs';
import path from 'path';

/**
 * 특정 POC 타입에 대해 오래된 파일을 정리하는 함수
 * @param {POCType} poc - POC 타입
 */
export async function cleanupOldFiles(poc: POCType): Promise<void> {
  try {
    const now = Date.now();
    const basePath = POC_PATH(poc);
    const basePaths = typeof basePath === 'string' ? [basePath] : basePath;

    for (const basePath of basePaths) {
      const resultPaths = POC_RESULT_PATHS(basePath);

      for (const [key, dirPath] of Object.entries(resultPaths)) {
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
  } catch (error) {
    logger.error(`파일 정리 중 예기치 않은 오류 발생: ${error}`);
  }
}
